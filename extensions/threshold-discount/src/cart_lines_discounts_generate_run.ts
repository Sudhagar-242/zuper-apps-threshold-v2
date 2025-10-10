import { GoalType } from "app/types/goals";
import {
  DiscountClass,
  OrderDiscountSelectionStrategy,
  ProductDiscountSelectionStrategy,
  CartInput,
  CartLinesDiscountsGenerateRunResult,
  OrderDiscountCandidate,
  Product,
} from "../generated/api";
import {
  AddConditionBlockChoices,
  AddRewardBlockChoices,
} from "app/enums/addBlock";

function generateDiscountOperation(
  goal: GoalType,
  cart: {
    __typename?: "Cart" | undefined;
    lines: {
      __typename?: "CartLine" | undefined;
      id: string;
      cost: {
        __typename?: "CartLineCost" | undefined;
        subtotalAmount: {
          __typename?: "MoneyV2" | undefined;
          amount: any;
        };
      };
    }[];
  },
): OrderDiscountCandidate | undefined {
  const cartProductIdSet = cart.lines.map((line) => line.id);

  function checkHasProductCondition(): boolean {
    const goalProducts: Product[] = JSON.parse(goal.Products ?? "") ?? [];
    console.log(goalProducts, "goalproducts", goal.Products);
    const productsCondition = goal.productsCondition;

    if (productsCondition === "any") {
      return goalProducts.some((product) => cartProductIdSet.has(product.id));
    } else if (productsCondition === "all") {
      return goalProducts.every((product) => cartProductIdSet.has(product.id));
    }

    return false;
  }

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
              ids: cartProductIdSet,
              minimumQuantity: Number(goal.cartQuantity),
            },
          },
        ],
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

  const goals = JSON.parse(shop.goals?.value).filter(
    (goal) =>
      goal.isActive === "true" &&
      goal.offer === AddRewardBlockChoices.ORDER_DISCOUNT,
  );

  if (!hasOrderDiscountClass && !hasProductDiscountClass) {
    return { operations: [] };
  }

  const maxCartLine = input.cart.lines.reduce((maxLine, line) => {
    if (line.cost.subtotalAmount.amount > maxLine.cost.subtotalAmount.amount) {
      return line;
    }
    return maxLine;
  }, input.cart.lines[0]);

  const operations: CartLinesDiscountsGenerateRunResult["operations"] = [];

  const discountCandidates: OrderDiscountCandidate[] = goals
    ? (goals
        .map((goal) => generateDiscountOperation(goal, cart))
        .filter(Boolean) as OrderDiscountCandidate[])
    : [
        {
          message: "10% OFF ORDER",
          conditions: [
            {
              cartLineMinimumQuantity: {
                ids: [...input.cart.lines.map((line) => line.id)],
                minimumQuantity: 1,
              },
            },
          ],
          targets: [
            {
              orderSubtotal: {
                excludedCartLineIds: [],
              },
            },
          ],
          value: {
            percentage: {
              value: 10,
            },
          },
        },
      ];

  console.log(JSON.stringify(discountCandidates));

  if (hasOrderDiscountClass) {
    operations.push({
      orderDiscountsAdd: {
        candidates: [...discountCandidates],
        selectionStrategy: OrderDiscountSelectionStrategy.First,
      },
    });
  }

  if (hasProductDiscountClass) {
    operations.push({
      productDiscountsAdd: {
        candidates: [
          {
            message: "20% OFF PRODUCT",
            targets: [
              {
                cartLine: {
                  id: maxCartLine.id,
                },
              },
            ],
            value: {
              percentage: {
                value: 20,
              },
            },
          },
        ],
        selectionStrategy: ProductDiscountSelectionStrategy.First,
      },
    });
  }

  return {
    operations,
  };
}
