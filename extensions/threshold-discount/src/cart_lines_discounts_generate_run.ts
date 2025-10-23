// import { GoalType } from "app/types/goals";
// import {
//   DiscountClass,
//   OrderDiscountSelectionStrategy,
//   CartInput,
//   CartLinesDiscountsGenerateRunResult,
//   OrderDiscountCandidate,
//   Product,
// } from "../generated/api";
// import {
//   AddConditionBlockChoices,
//   AddRewardBlockChoices,
// } from "app/enums/addBlock";

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
//       merchandise:
//         | { __typename?: "CustomProduct" }
//         | { __typename?: "ProductVariant"; product: { id: string } };
//     }[];
//   },
// ): OrderDiscountCandidate | undefined {
//   function isProductVariant(line: {
//     merchandise:
//       | { __typename?: "CustomProduct" }
//       | { __typename?: "ProductVariant"; product: { id: string } };
//   }): line is {
//     merchandise: { __typename?: "ProductVariant"; product: { id: string } };
//   } {
//     return line.merchandise.__typename === "ProductVariant";
//   }

//   // Map line IDs once
//   const productLines = cart.lines.filter(isProductVariant);

//   // ✅ Now it’s safe to access `line.merchandise.product.id`
//   const cartProductIdSet = new Set(
//     productLines.map((line) => line.merchandise.product.id),
//   );
//   const cartLineIdSet = new Set(cart.lines.map((line) => line.id));

//   // Check for product condition
//   const checkHasProductCondition = (): boolean => {
//     const goalProducts: Product[] = goal.products ?? [];
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

// export function cartLinesDiscountsGenerateRun(
//   input: CartInput,
// ): CartLinesDiscountsGenerateRunResult {
//   if (!input.cart.lines.length) {
//     throw new Error("No cart lines found");
//   }

//   const hasOrderDiscountClass = input.discount.discountClasses.includes(
//     DiscountClass.Order,
//   );
//   const hasProductDiscountClass = input.discount.discountClasses.includes(
//     DiscountClass.Product,
//   );

//   const { shop, cart } = input;

//   // Safely parse and filter active goals with order discounts
//   const goals: GoalType[] = shop.goals?.value
//     ? JSON.parse(shop.goals.value).filter(
//         (goal: GoalType) =>
//           goal.isActive === true &&
//           goal.offer === AddRewardBlockChoices.ORDER_DISCOUNT,
//       )
//     : [];

//   if (!hasOrderDiscountClass && !hasProductDiscountClass) {
//     return { operations: [] };
//   }

//   console.log(JSON.stringify(cart.lines));

//   // Generate discount candidates from goals
//   const discountCandidates: OrderDiscountCandidate[] = goals
//     .map((goal) => generateDiscountOperation(goal, cart))
//     .filter(Boolean) as OrderDiscountCandidate[];

//   if (!discountCandidates.length) {
//     return { operations: [] };
//   }

//   const operations = [];

//   if (hasOrderDiscountClass) {
//     operations.push({
//       orderDiscountsAdd: {
//         candidates: discountCandidates,
//         selectionStrategy: OrderDiscountSelectionStrategy.Maximum,
//       },
//     });
//   }

//   return { operations };
// }

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

  console.log("\ncartLineIdSet", JSON.stringify(cartLineIdSet), "\v");
  console.log("\ncartProductIdSet", JSON.stringify(cartProductIdSet), "\v");
  console.log(
    "\n goals and checkproductcondition",
    JSON.stringify(goal),
    checkHasProductCondition(),
  );

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

  console.log("cartlines", JSON.stringify(cart.lines));
  console.log("goals", JSON.stringify(goals));

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
