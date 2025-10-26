import { GoalType } from "app/types/goals";
import {
  DiscountClass,
  OrderDiscountSelectionStrategy,
  CartInput,
  CartLinesDiscountsGenerateRunResult,
  OrderDiscountCandidate,
} from "../generated/api";
import {
  AddConditionBlockChoices,
  AddRewardBlockChoices,
} from "app/enums/addBlock";
import { Product } from "node_modules/@shopify/app-bridge-react/build/types/cjs/index.cjs";

function generateDiscountOperation(
  goal: GoalType,
  cartProductIdSet: string[],
  cartLineIdSet: string[],
): OrderDiscountCandidate | undefined {
  // Check for product condition
  const checkHasProductCondition = (): boolean => {
    const goalProducts: Product[] = goal.products ?? [];
    const productsCondition = goal.productsCondition;

    if (productsCondition === "any") {
      return goalProducts.some((product) =>
        cartProductIdSet.includes(product.id),
      );
    }
    if (productsCondition === "all") {
      return goalProducts.every((product) =>
        cartProductIdSet.includes(product.id),
      );
    }
    return false;
  };

  // console.log("\ncartLineIdSet", JSON.stringify(cartLineIdSet), "\v");
  // console.log("\ncartProductIdSet", JSON.stringify(cartProductIdSet), "\v");
  // console.log(
  //   "\n goals and checkproductcondition",
  //   JSON.stringify(goal),
  //   checkHasProductCondition(),
  // );

  // Generate discount candidate based on condition type
  switch (goal.condition) {
    case AddConditionBlockChoices.CART_VALUE:
      return {
        message: goal.title,
        conditions: [
          {
            orderMinimumSubtotal: {
              excludedCartLineIds: [],
              minimumAmount: goal.price,
            },
          },
        ],
        targets: [
          {
            orderSubtotal: { excludedCartLineIds: [] },
          },
        ],
        value: { percentage: { value: goal.cartDiscount } },
      };

    case AddConditionBlockChoices.CART_HAS_PRODUCTS:
      if (checkHasProductCondition()) {
        return {
          message: goal.title,
          targets: [
            {
              orderSubtotal: {
                excludedCartLineIds: [],
              },
            },
          ],
          value: {
            percentage: {
              value: goal.cartDiscount,
            },
          },
        };
      }
      return undefined;

    case AddConditionBlockChoices.CART_QUANTITY:
      return {
        message: goal.title,
        conditions: [
          {
            cartLineMinimumQuantity: {
              ids: Array.from(cartLineIdSet),
              minimumQuantity: Number(goal.cartQuantity) + 1,
            },
          },
        ],
        targets: [
          {
            orderSubtotal: { excludedCartLineIds: [] },
          },
        ],
        value: { percentage: { value: goal.cartDiscount } },
      };

    default:
      return undefined;
  }
}

export function cartLinesDiscountsGenerateRun(
  input: CartInput,
): CartLinesDiscountsGenerateRunResult {
  if (!input.cart.lines.length) {
    throw new Error("No cart lines found");
  }

  const hasOrderDiscountClass = input.discount.discountClasses.includes(
    DiscountClass.Order,
  );
  const hasProductDiscountClass = input.discount.discountClasses.includes(
    DiscountClass.Product,
  );

  const { shop, cart } = input;
  // Map line IDs once
  const cartProductIdSet = cart.lines.map(
    (line) => line.merchandise?.product.id,
  );
  const cartLineIdSet = cart.lines.map((line) => line.id);
  const canApplyThresholdDiscount = input.cart.attribute?.value;
  console.log(input.cart.attribute?.value, "cart attribute value");

  // Safely parse and filter active goals with order discounts
  const goals: GoalType[] = shop.goals?.value
    ? JSON.parse(shop.goals.value).filter(
        (goal: GoalType) =>
          goal.isActive === true &&
          goal.offer === AddRewardBlockChoices.ORDER_DISCOUNT,
      )
    : [];

  if (!hasOrderDiscountClass && !hasProductDiscountClass) {
    return { operations: [] };
  }

  // console.log("cartlines", JSON.stringify(cart.lines));
  // console.log("goals", JSON.stringify(goals));

  // Generate discount candidates from goals
  const discountCandidates: OrderDiscountCandidate[] = goals
    .map((goal) =>
      generateDiscountOperation(goal, cartProductIdSet, cartLineIdSet),
    )
    .filter(Boolean) as OrderDiscountCandidate[];

  if (!discountCandidates.length) {
    return { operations: [] };
  }

  const operations = [];

  if (canApplyThresholdDiscount === "Yes") {
    operations.push({
      orderDiscountsAdd: {
        candidates: [
          {
            message: "Threshold Discount",
            targets: [
              {
                orderSubtotal: { excludedCartLineIds: [] },
              },
            ],
            value: { percentage: { value: 50 } },
          },
        ],
        selectionStrategy: OrderDiscountSelectionStrategy.Maximum,
      },
    });
    return { operations };
  }

  if (hasOrderDiscountClass) {
    operations.push({
      orderDiscountsAdd: {
        candidates: discountCandidates,
        selectionStrategy: OrderDiscountSelectionStrategy.Maximum,
      },
    });
  }

  return { operations };
}
