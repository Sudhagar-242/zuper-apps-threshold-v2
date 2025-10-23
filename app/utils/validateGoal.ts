import type { GoalType } from "app/types/goals";
import { AddConditionBlockChoices } from "app/enums/addBlock";
import { Validation as ConfigValidation } from "app/constants/configurationAddGoals";
import type { Product } from "node_modules/@shopify/app-bridge-react/build/types/cjs/index.cjs";

export type ValidationResult = {
  hasError: boolean;
  errors: { [key: string]: string | undefined } & {
    price?: string;
    discount?: string;
    gifts?: string;
    products?: string;
    quantity?: string;
    cartDiscount?: string;
    general?: string;
  };
};

export function validateGoal(goal: GoalType, allGoals: GoalType[]): ValidationResult {
  const errors: ValidationResult["errors"] = {} as ValidationResult["errors"];
  let hasError = false;

  const currentId = goal.id;

  const isSameProductSet = (a: Product[], b: Product[]) => {
    if (a?.length !== b?.length) return false;
    const idsA = a.map((p) => p.id).sort();
    const idsB = b.map((p) => p.id).sort();
    return idsA.every((id, idx) => id === idsB[idx]);
  };

  // Check for identical duplicate goals
  const isExactDuplicate = allGoals.some((g) => {
    if (g.id === currentId) return false;

    const sameCondition = g.condition === goal.condition;
    const sameOffer = g.offer === goal.offer;
    const samePrice = Number(g.price ?? 0) === Number(goal.price ?? 0);
    const sameQuantity = Number(g.cartQuantity ?? 0) === Number(goal.cartQuantity ?? 0);
    const sameDiscount = Number(g.cartDiscount ?? 0) === Number(goal.cartDiscount ?? 0);
    const sameProducts = isSameProductSet(g.products ?? [], goal.products ?? []);

    switch (goal.condition) {
      case "cart_value":
        return sameCondition && samePrice && sameOffer && sameDiscount;
      case "cart_quantity":
        return sameCondition && sameQuantity && sameOffer && sameDiscount;
      case "has_product":
        return sameCondition && sameProducts && sameOffer && sameDiscount;
      default:
        return false;
    }
  });

  if (isExactDuplicate) {
    errors.general = "A goal with the same condition and reward already exists.";
    try {
      shopify.toast.show(errors.general, { duration: 1000, isError: true });
    } catch (e) {
      // shopify might be undefined in some environments; swallow errors
    }
    hasError = true;
  }

  // Check string fields
  const stringFieldsToCheck = [
    "headline",
    "topBarHeadlineIcons",
    "topBarHeadlineSimple",
    "confirmationMessage",
    "remainingTargetMessage",
    "discountAppliedMessage",
  ] as const;

  stringFieldsToCheck.forEach((field) => {
    if (!goal[field] || (goal[field] as string).trim() === "") {
      errors[field] = ConfigValidation.cannotBeEmpty;
      hasError = true;
    }
  });

  // Condition-specific checks
  switch (goal.condition) {
    case "cart_value": {
      const currentPrice = Number(goal.price ?? 0);

      if (goal.price === "" || goal.price === null || typeof goal.price === "undefined") {
        errors.price = ConfigValidation.cannotBeEmpty;
        hasError = true;
        break;
      }

      const isDuplicate = allGoals.some((g) => g !== goal && Number(g.price) === currentPrice);

      if (!currentPrice || currentPrice <= 0) {
        errors.price = ConfigValidation.priceGreaterThanZero;
        hasError = true;
      }

      const idx = allGoals.indexOf(goal);
      let prevIdx = idx - 1;
      while (prevIdx >= 0 && typeof allGoals[prevIdx].price === "undefined") {
        prevIdx--;
      }

      if (
        idx > 0 &&
        prevIdx >= 0 &&
        typeof allGoals[prevIdx].price !== "undefined" &&
        typeof goal.price !== "undefined" &&
        Number(allGoals[prevIdx].price) > currentPrice
      ) {
        errors.price = ConfigValidation.priceGreaterThanZero;
        hasError = true;
      }

      if (isDuplicate) {
        errors.price = "Price must be unique across all goals.";
        hasError = true;
      }
      break;
    }

    case "has_product": {
      if (!goal.products || goal.products?.length === 0) {
        errors.products = ConfigValidation.selectAtLeastOneProduct;
        hasError = true;
      } else {
        const alreadyExisted = goal.products.filter((p) =>
          allGoals.some(
            (g) =>
              g.id !== goal.id &&
              Array.isArray(g.products) &&
              g.products.some((gp) => gp.id === p.id),
          ),
        );

        if (alreadyExisted.length > 0) {
          // Optionally the caller can handle duplicates
        }
      }
      break;
    }

    case "cart_quantity": {
      const hasDuplicate = allGoals.some(
        (g) =>
          g.id !== goal.id &&
          g.condition === AddConditionBlockChoices.CART_QUANTITY &&
          g.offer === goal.offer &&
          g.cartQuantity === goal.cartQuantity,
      );

      if (Number(goal.cartQuantity) <= 0) {
        errors.quantity = ConfigValidation.quantityGreaterThanZero;
        hasError = true;
      }
      if (hasDuplicate) {
        errors.quantity = `A goal with quantity ${goal.cartQuantity} and offer type "${goal.offer}" already exists.`;
        hasError = true;
      }
      break;
    }

    default:
      break;
  }

  // Offer-specific checks
  switch (goal.offer) {
    case "free_shipping":
      break;

    case "order_discount": {
      const currentDiscount = Number(goal.cartDiscount ?? 0);

      if (!currentDiscount || currentDiscount <= 0 || currentDiscount > 100) {
        errors.cartDiscount = ConfigValidation.discountRangeDetail;
        hasError = true;
      }

      const currentIndex = allGoals.findIndex((g) => g.id === goal.id);
      const previousOrderDiscounts = allGoals
        .slice(0, currentIndex)
        .filter((g) => g.offer === "order_discount");

      for (const prevGoal of previousOrderDiscounts) {
        const prevDiscount = Number(prevGoal.cartDiscount ?? 0);

        if (currentDiscount <= prevDiscount) {
          errors.cartDiscount = `This discount (${currentDiscount}%) must be greater than the previous discount (${prevDiscount}%).`;
          hasError = true;
          break;
        }
      }

      break;
    }

    case "free_gift": {
      if (!goal.freeGifts || goal.freeGifts?.length === 0) {
        errors.gifts = ConfigValidation.selectAtLeastOneProduct;
        hasError = true;
      }
      break;
    }

    default:
      break;
  }

  return { hasError, errors };
}
