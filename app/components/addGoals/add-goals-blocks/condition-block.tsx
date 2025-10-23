import React, { useEffect, useState } from "react";
import { AddConditionBlockChoices } from "app/enums/addBlock";
import { ArrowPlacer } from "../goal-add-block";
import {
  Labels as ConfigLabels,
  Validation as ConfigValidation,
} from "app/constants/configurationAddGoals";
import { CallbackEvent } from "@shopify/polaris-types";
import { GoalType } from "app/types/goals";
import { useShop } from "app/context/shop-provider-ctx";
import { loaderResponse } from "app/routes/app.configuration-add-goals";
import { Product } from "node_modules/@shopify/app-bridge-react/build/types/cjs/index.cjs";
import ProductTable from "../products-table";

interface ConditionBlockProps {
  goal: GoalType;
  isActive: boolean;
  errors: {
    price?: string;
    quantity?: string;
    products?: string;
  };
  onChange: (field: keyof GoalType, value: unknown) => void;
  alredyExistedProducts: Partial<Product>[];
}

const choiceLabels = [
  {
    value: AddConditionBlockChoices.CART_VALUE,
    label: "Cart value greater than",
  },
  {
    value: AddConditionBlockChoices.CART_HAS_PRODUCTS,
    label: "Cart has product(s)",
  },
  {
    value: AddConditionBlockChoices.CART_QUANTITY,
    label: "Cart quantity greater than",
  },
];

const ConditionBlock: React.FC<ConditionBlockProps> = ({
  goal,
  isActive,
  errors,
  onChange,
  alredyExistedProducts,
}) => {
  const [isErrors, setIsErrors] = useState<typeof errors>(errors);

  const Shop = useShop<loaderResponse["shop"]>();

  useEffect(() => {
    const newErrors: typeof errors = {};

    if (
      goal.condition === AddConditionBlockChoices.CART_VALUE &&
      Number(goal.price) <= 0 &&
      isActive
    ) {
      newErrors.price = ConfigValidation.priceGreaterThanZero;
    }
    if (
      goal.condition === AddConditionBlockChoices.CART_QUANTITY &&
      Number(goal.cartQuantity) <= 0 &&
      isActive
    ) {
      newErrors.quantity = ConfigValidation.quantityGreaterThanZero;
    }
    if (
      goal.condition === AddConditionBlockChoices.CART_HAS_PRODUCTS &&
      (!goal.products || goal.products?.length === 0) &&
      isActive
    ) {
      newErrors.products = ConfigValidation.selectAtLeastOneProduct;
    }

    setIsErrors(newErrors);
  }, [goal.cartQuantity, goal.condition, goal.price, goal.products, isActive]);

  const handleProductSelect = async () => {
    const selectedProductsIds = goal.products?.map((product) => ({
      id: product.id,
    }));

    if (!isActive) return;

    const selected = await window.shopify?.resourcePicker({
      type: "product",
      multiple: true,
      selectionIds: selectedProductsIds,
      filter: {
        query: alredyExistedProducts
          .filter((p) => !goal.products?.some((gp) => gp.id === p.id))
          .map((p) => `-id:${p.id?.split("/").pop()}`)
          .join(" AND "),
      },
    });
    if (selected) {
      onChange(
        "products",
        selected.map((product) => ({ id: product.id, title: product.title })),
      );
    }
  };

  const handleRemoveProducts = (productId: string) => {
    const removedProucts = goal.products?.filter(
      (product) => product.id !== productId,
    );
    onChange("products", removedProucts);
    if (goal.products?.length === 0) {
      setIsErrors((prev) => ({
        ...prev,
        products: ConfigValidation.selectAtLeastOneProduct,
      }));
    }
  };

  const handlePriceChange = (e: CallbackEvent<"s-money-field">) => {
    if (!e || !e.currentTarget) return;

    const value = Number(e?.currentTarget.value);

    if (value <= 0) {
      onChange("price", e?.currentTarget.value);
      setIsErrors((prev) => ({
        ...prev,
        price: ConfigValidation.priceGreaterThanZero,
      }));
    } else {
      setIsErrors((prev) => ({ ...prev, price: "" }));
      onChange("price", e.currentTarget.value);
    }

    if (goal.products?.length === 0) {
      setIsErrors((prev) => ({
        ...prev,
        products: "Select at least 1 product",
      }));
    }
  };

  const handleQuantityChange = (e: CallbackEvent<"s-number-field">) => {
    if (!e || !e.currentTarget) return;

    const value = Number(e?.currentTarget.value);

    if (value <= 0) {
      onChange("cartQuantity", e?.currentTarget.value);
      setIsErrors((prev) => ({
        ...prev,
        quantity: ConfigValidation.quantityGreaterThanZero,
      }));
    } else {
      setIsErrors((prev) => ({ ...prev, quantity: "" }));
      onChange("cartQuantity", e.currentTarget.value);
    }
  };

  return (
    <s-section padding="base">
      <s-heading>{ConfigLabels.conditionsHeading}</s-heading>
      <s-box
        border="base strong dashed"
        padding="base"
        display="auto"
        background="subdued"
      >
        <s-text>
          Select what condition you want to use to trigger the reward
        </s-text>
        <div
          style={{
            padding: "0.5rem",
          }}
        />
        <s-stack justifyContent="space-between" gap="base">
          <s-stack direction="inline" gap="base">
            <s-choice-list
              label="Condition Choice List"
              labelAccessibilityVisibility="exclusive"
              name={`goals[condition]`}
              values={[goal.condition]}
              onChange={(e) => onChange("condition", e.currentTarget.values[0])}
              disabled={!isActive}
            >
              {choiceLabels.map((choice) => (
                <s-choice
                  key={choice.value}
                  value={choice.value}
                  disabled={!isActive}
                >
                  {choice.label}
                </s-choice>
              ))}
            </s-choice-list>
            {goal.condition === AddConditionBlockChoices.CART_VALUE && (
              <s-stack direction="inline" gap="base">
                <ArrowPlacer place="start" />
                <s-box border="base strong dashed" padding="small base">
                  <s-money-field
                    label="Price"
                    labelAccessibilityVisibility="exclusive"
                    name={`goals[price]`}
                    placeholder="0.00"
                    value={goal.price ?? 100}
                    onChange={handlePriceChange}
                    disabled={!isActive}
                    error={errors.price ? errors.price : isErrors.price}
                    min={1}
                    required
                    error-message={isErrors.price}
                  />
                  <p style={{ maxWidth: "240px" }}>
                    <b>Notice: </b>All goal values are based on your store’s
                    default currency <b>({Shop.currencyCode}).</b>
                  </p>
                </s-box>
              </s-stack>
            )}

            {goal.condition === AddConditionBlockChoices.CART_HAS_PRODUCTS && (
              <s-stack direction="inline" gap="base" alignItems="center">
                <ArrowPlacer place="center" />
                <s-box>
                  <s-select
                    label="Selection"
                    labelAccessibilityVisibility="exclusive"
                    name={`goals[productsCondition]`}
                    value={goal.productsCondition ?? "any"}
                    onChange={(e) => {
                      onChange("productsCondition", e.currentTarget.value);
                    }}
                    error={
                      errors.products
                        ? errors.products
                        : isErrors.products
                          ? isErrors.products
                          : goal.products?.length === 0
                            ? ConfigValidation.selectAtLeastOneProduct
                            : undefined
                    }
                    required
                    disabled={!isActive}
                  >
                    <s-option
                      value="any"
                      defaultSelected={goal.productsCondition === "any"}
                    >
                      Any of
                    </s-option>
                    <s-option
                      value="all"
                      defaultSelected={goal.productsCondition === "all"}
                    >
                      All of
                    </s-option>
                  </s-select>
                </s-box>
                <ArrowPlacer place="center" />
                <s-button
                  variant="primary"
                  onClick={handleProductSelect}
                  disabled={!isActive}
                >
                  Select Product(s)
                </s-button>
              </s-stack>
            )}

            {goal.condition === AddConditionBlockChoices.CART_QUANTITY && (
              <s-stack direction="inline" gap="base" alignItems="end">
                <ArrowPlacer place="end" />
                <s-box>
                  <s-number-field
                    label="Cart Quantity"
                    labelAccessibilityVisibility="exclusive"
                    name={`goals[cartQuantity]`}
                    value={goal.cartQuantity ?? "2"}
                    disabled={!isActive}
                    onChange={handleQuantityChange}
                    error={
                      errors.quantity ? errors.quantity : isErrors.quantity
                    }
                    min={1}
                    required
                  />
                </s-box>
              </s-stack>
            )}
          </s-stack>

          {goal.condition === AddConditionBlockChoices.CART_HAS_PRODUCTS &&
            goal.products &&
            goal.products?.length > 0 && (
              <>
                <s-divider />
                <s-box>
                  <s-heading>Notice:</s-heading>
                  <s-unordered-list>
                    <s-list-item>
                      You can’t select the same product for more than one goal.
                    </s-list-item>
                    <s-list-item>
                      If you select variants, they will still be considered part
                      of the same product.
                    </s-list-item>
                    {/* <s-list-item>
                      All goal values are based on your store’s default currency
                      <b>({Shop.currencyCode})</b>.
                    </s-list-item> */}
                  </s-unordered-list>
                </s-box>

                <s-divider />
                <s-box border="base strong solid" padding="small base">
                  <ProductTable
                    products={goal.products}
                    handleRemoveProducts={handleRemoveProducts}
                  />
                </s-box>
              </>
            )}
        </s-stack>
      </s-box>
    </s-section>
  );
};

export default ConditionBlock;
