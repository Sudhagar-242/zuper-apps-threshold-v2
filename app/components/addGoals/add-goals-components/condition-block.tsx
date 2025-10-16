import React, { useEffect, useState } from "react";
import { AddConditionBlockChoices } from "app/enums/addBlock";
import { ArrowPlacer } from "../goal-add-block";
import { CallbackEvent } from "@shopify/polaris-types";
import { GoalType } from "app/types/goals";

interface ConditionBlockProps {
  goal: GoalType;
  isActive: boolean;
  errors: {
    price?: string;
    quantity?: string;
    products?: string;
  };
  onChange: (field: keyof GoalType, value: unknown) => void;
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
}) => {
  const [isErrors, setIsErrors] = useState<typeof errors>(errors);

  useEffect(() => {
    const newErrors: typeof errors = {};

    if (
      goal.condition === AddConditionBlockChoices.CART_VALUE &&
      Number(goal.price) <= 0 &&
      isActive
    ) {
      newErrors.price = "Price must be greater than 0";
    }
    if (
      goal.condition === AddConditionBlockChoices.CART_QUANTITY &&
      Number(goal.cartQuantity) <= 0 &&
      isActive
    ) {
      newErrors.quantity = "Quantity must be greater than 0";
    }
    if (
      goal.condition === AddConditionBlockChoices.CART_HAS_PRODUCTS &&
      (!goal.products || goal.products?.length === 0) &&
      isActive
    ) {
      newErrors.products = "Select at least 1 product";
    }

    setIsErrors(newErrors);
  }, [goal.condition, goal.products, isActive]);

  const handleProductSelect = async () => {
    if (!isActive) return;
    // Assuming `shopify.resourcePicker` is globally available or imported
    const selected = await window.shopify?.resourcePicker({
      type: "product",
      multiple: true,
      selectionIds:
        typeof goal.products === "string"
          ? JSON.parse(goal?.products)
          : goal.products,
    });
    if (selected) {
      onChange("products", selected);
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
        products: "Select at least 1 product",
      }));
    }
  };
  const handleRemoveVariantsProducts = (variantId: string) => {
    const removedProuctVariants = goal.products?.map((product) => {
      product.variants.filter((variant) => variant.id !== variantId);
    });
    onChange("products", removedProuctVariants);
    if (goal.products?.length === 0) {
      setIsErrors((prev) => ({
        ...prev,
        products: "Select at least 1 product",
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
        price: "MoneyField must be greater than 0",
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
        quantity: "Quantity must be greater than 0",
      }));
    } else {
      setIsErrors((prev) => ({ ...prev, quantity: "" }));
      onChange("cartQuantity", e.currentTarget.value);
    }
  };

  return (
    <s-section padding="base">
      <s-heading>Conditions</s-heading>
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
                    max={100}
                    required
                    error-message={isErrors.price}
                  />
                  <p style={{ maxWidth: "240px" }}>
                    <b>Notice:</b> All other currencies not set will be{" "}
                    <b>converted</b> to <b>100 USD</b>.
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
                            ? "select atleast one Product"
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
                <s-box border="base strong solid" padding="small base">
                  <s-table>
                    <s-table-header-row>
                      <s-table-header listSlot="primary">
                        Product
                      </s-table-header>
                      <s-table-header listSlot="secondary">
                        Price
                      </s-table-header>
                      <s-table-header>Remove</s-table-header>
                    </s-table-header-row>
                    <s-table-body>
                      {goal.products.map((product) => (
                        <React.Fragment key={product.id}>
                          <s-table-row>
                            <s-table-cell>{product.title}</s-table-cell>
                            <s-table-cell>
                              {product.variants?.length === 1
                                ? product.variants[0].price
                                : ""}
                            </s-table-cell>
                            <s-table-cell>
                              <s-link
                                onClick={() => handleRemoveProducts(product.id)}
                              >
                                Remove
                              </s-link>
                            </s-table-cell>
                          </s-table-row>
                        </React.Fragment>
                      ))}
                    </s-table-body>
                  </s-table>
                </s-box>
              </>
            )}
        </s-stack>
      </s-box>
    </s-section>
  );
};

export default ConditionBlock;
