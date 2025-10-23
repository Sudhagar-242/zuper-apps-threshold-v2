import {
  DeliveryDiscountSelectionStrategy,
  DiscountClass,
  DeliveryInput,
  CartDeliveryOptionsDiscountsGenerateRunResult,
} from "../generated/api";

export function cartDeliveryOptionsDiscountsGenerateRun(
  input: DeliveryInput,
): CartDeliveryOptionsDiscountsGenerateRunResult {
  const firstDeliveryGroup = input.cart.deliveryGroups[0];
  if (!firstDeliveryGroup) {
    throw new Error("No delivery groups found");
  }

  const hasShippingDiscountClass = input.discount.discountClasses.includes(
    DiscountClass.Shipping,
  );

  if (!hasShippingDiscountClass) {
    return { operations: [] };
  }

  return {
    operations: [
      {
        deliveryDiscountsAdd: {
          candidates: [
            {
              message: "FREE DELIVERY",
              targets: [
                {
                  deliveryGroup: {
                    id: firstDeliveryGroup.id,
                  },
                },
              ],
              value: {
                percentage: {
                  value: 100,
                },
              },
            },
          ],
          selectionStrategy: DeliveryDiscountSelectionStrategy.All,
        },
      },
    ],
  };
}

// import {
//   DeliveryDiscountSelectionStrategy,
//   DiscountClass,
//   DeliveryInput,
//   CartDeliveryOptionsDiscountsGenerateRunResult,
// } from "../generated/api";

// import { GoalType } from "app/types/goals";

/**
 * Checks if any goal qualifies for free shipping based on cart contents.
 */
// function isFreeShippingApplicable(
//   goals: GoalType[],
//   cart: DeliveryInput["cart"],
// ): boolean {
//   return goals.some((goal) => {
//     if (goal.offer !== "free_shipping") return false;

//     switch (goal.condition) {
//       case "cart_value": {
//         return cart.cost.subtotalAmount.amount >= Number(goal.price);
//       }

//       case "has_product": {
//         if (!Array.isArray(goal.products) || goal.products.length === 0)
//           return false;

//         const cartProductIds = cart.lines
//           .map((line) => {
//             if (line.merchandise.__typename === "ProductVariant") {
//               return line.merchandise.product.id;
//             } else if (line.merchandise.__typename === "CustomProduct") {
//               return null;
//             }
//             return null;
//           })
//           .filter((id: string | null): id is string => id !== null);

//         if (goal.productsCondition === "any") {
//           return goal.products.some((p) => cartProductIds.includes(p.id));
//         }

//         if (goal.productsCondition === "all") {
//           return goal.products.every((p) => cartProductIds.includes(p.id));
//         }

//         return false;
//       }

//       case "cart_quantity": {
//         const totalQuantity = cart.lin;
//         return totalQuantity >= Number(goal.cartQuantity);
//       }

//       default:
//         return false;
//     }
//   });
// }

/**
 * Main function for Shopify delivery discount run.
 */
// export function cartDeliveryOptionsDiscountsGenerateRun(
//   input: DeliveryInput,
//   goals: GoalType[],
// ): CartDeliveryOptionsDiscountsGenerateRunResult {
//   const firstDeliveryGroup = input.cart.deliveryGroups[0];
//   if (!firstDeliveryGroup) {
//     throw new Error("No delivery groups found");
//   }

//   const hasShippingDiscountClass = input.discount.discountClasses.includes(
//     DiscountClass.Shipping,
//   );

//   if (!hasShippingDiscountClass) {
//     return { operations: [] };
//   }

//   const freeShippingEligible = isFreeShippingApplicable(goals, input.cart);

//   if (!freeShippingEligible) {
//     return { operations: [] };
//   }

//   return {
//     operations: [
//       {
//         deliveryDiscountsAdd: {
//           candidates: [
//             {
//               message: "FREE DELIVERY",
//               targets: [
//                 {
//                   deliveryGroup: {
//                     id: firstDeliveryGroup.id,
//                   },
//                 },
//               ],
//               value: {
//                 percentage: {
//                   value: 100,
//                 },
//               },
//             },
//           ],
//           selectionStrategy: DeliveryDiscountSelectionStrategy.All,
//         },
//       },
//     ],
//   };
// }

// function generateDiscountOperation(
//   goal: GoalType,
//   cart: {
//     lines: {
//       id: string;
//       cost: {
//         subtotalAmount: {
//           amount: any;
//         };
//       };
//       merchandise: {
//         product: {
//           id: string;
//         };
//       };
//     }[];
//   },
// ): DeliveryDiscountCandidate | undefined {
//   // Map line IDs once
//   const cartProductIdSet = new Set(
//     cart.lines.map((line) => line.merchandise.product.id),
//   );
//   const cartLineIdSet = new Set(cart.lines.map((line) => line.id));

//   // Check for product condition
//   const checkHasProductCondition = (): boolean => {
//     const goalProducts: Product[] = JSON.parse(goal.Products ?? "[]");
//     const productsCondition = goal.productsCondition;

//     if (productsCondition === "any") {
//       return goalProducts.some((product) => cartProductIdSet.has(product.id));
//     }
//     if (productsCondition === "all") {
//       return goalProducts.every((product) => cartProductIdSet.has(product.id));
//     }
//     return false;
//   };

//   // Generate discount candidate based on condition type
//   switch (goal.condition) {
//     case AddConditionBlockChoices.CART_VALUE:
//       return {
//         message: goal.title,
//         conditions: [
//           {
//             orderMinimumSubtotal: {
//               excludedCartLineIds: [],
//               minimumAmount: goal.price,
//             },
//           },
//         ],
//         targets: [
//           {
//             orderSubtotal: { excludedCartLineIds: [] },
//           },
//         ],
//         value: { percentage: { value: goal.cartDiscount } },
//       };

//     case AddConditionBlockChoices.CART_HAS_PRODUCTS:
//       if (checkHasProductCondition()) {
//         return {
//           message: goal.title,
//           targets: [
//             {
//               orderSubtotal: {
//                 excludedCartLineIds: [],
//               },
//             },
//           ],
//           value: {
//             percentage: {
//               value: goal.cartDiscount,
//             },
//           },
//         };
//       }
//       return undefined;

//     case AddConditionBlockChoices.CART_QUANTITY:
//       return {
//         message: goal.title,
//         conditions: [
//           {
//             cartLineMinimumQuantity: {
//               ids: Array.from(cartLineIdSet),
//               minimumQuantity: Number(goal.cartQuantity) + 1,
//             },
//           },
//         ],
//         targets: [
//           {
//             orderSubtotal: { excludedCartLineIds: [] },
//           },
//         ],
//         value: { percentage: { value: goal.cartDiscount } },
//       };

//     default:
//       return undefined;
//   }
// }
