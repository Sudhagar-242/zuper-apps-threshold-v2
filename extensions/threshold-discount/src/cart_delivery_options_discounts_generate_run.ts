import {
  DeliveryDiscountSelectionStrategy,
  DiscountClass,
  DeliveryInput,
  CartDeliveryOptionsDiscountsGenerateRunResult,
} from "../generated/api";
import { GoalType } from "app/types/goals";

function isGoalMet(goal: GoalType, cart: DeliveryInput["cart"]): boolean {
  switch (goal.condition) {
    case "cart_value": {
      const subtotal = Number(cart.cost.subtotalAmount.amount);
      return subtotal >= Number(goal.price);
    }

    case "has_product": {
      if (!Array.isArray(goal.products) || goal.products.length === 0)
        return false;

      const cartProductIds = cart.lines
        .map((line) => {
          if (line.merchandise.__typename === "ProductVariant") {
            return line.merchandise.product.id;
          }
          return null;
        })
        .filter((id): id is string => id !== null);

      if (goal.productsCondition === "any") {
        return goal.products.some((p) => cartProductIds.includes(p.id));
      }

      if (goal.productsCondition === "all") {
        return goal.products.every((p) => cartProductIds.includes(p.id));
      }

      return false;
    }

    case "cart_quantity": {
      const totalQty = cart.lines.reduce((sum, line) => sum + line.quantity, 0);
      return totalQty >= Number(goal.cartQuantity);
    }

    default:
      return false;
  }
}

export function cartDeliveryOptionsDiscountsGenerateRun(
  input: DeliveryInput,
): CartDeliveryOptionsDiscountsGenerateRunResult {
  const firstDeliveryGroup = input.cart.deliveryGroups?.[0];
  if (!firstDeliveryGroup) {
    return { operations: [] };
  }

  const hasShippingDiscountClass = input.discount.discountClasses.includes(
    DiscountClass.Shipping,
  );

  if (!hasShippingDiscountClass) {
    return { operations: [] };
  }

  // Parse and filter active free_shipping goals
  let goals: GoalType[] = [];
  try {
    goals = input.shop?.goals?.value
      ? JSON.parse(input.shop.goals.value).filter(
          (goal: GoalType) => goal.isActive && goal.offer === "free_shipping",
        )
      : [];
  } catch {
    goals = [];
  }

  if (goals.length === 0) {
    return { operations: [] };
  }

  // Check if any goal condition is met
  const matchedGoal = goals.find((goal) => isGoalMet(goal, input.cart));

  if (!matchedGoal) {
    return { operations: [] };
  }

  // ✅ Return Free Shipping Discount
  return {
    operations: [
      {
        deliveryDiscountsAdd: {
          candidates: [
            {
              message: matchedGoal.title || "FREE DELIVERY",
              targets: [
                {
                  deliveryGroup: { id: firstDeliveryGroup.id },
                },
              ],
              value: {
                percentage: { value: 100 },
              },
            },
          ],
          selectionStrategy: DeliveryDiscountSelectionStrategy.All,
        },
      },
    ],
  };
}
