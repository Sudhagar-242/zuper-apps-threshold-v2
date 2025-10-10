import { AddConditionBlockChoices } from "app/enums/addBlock";
import { Dispatch, useState } from "react";
import { ArrowPlacer } from "../goal-add-block";
import { Product } from "extensions/threshold-discount/generated/api";

interface ConditionBlockType {
  isActive: boolean;
  selectedProducts: Partial<Product>[];
  setSelectedProducts: Dispatch<any>;
  idx: number;
  selectedChoice: AddConditionBlockChoices;
  price: string;
  slectedQuantity: string;
  selectedProductCondition: "any" | "all";
  triggerUnsavedChange?: React.Dispatch<React.SetStateAction<boolean>>;
}

const choiceLabels: {
  label: string;
  value: string;
}[] = [
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

const ConditionBlock = ({
  isActive,
  selectedProducts,
  setSelectedProducts,
  idx,
  selectedChoice = AddConditionBlockChoices.CART_VALUE,
  price = "0.99",
  slectedQuantity = "2",
  selectedProductCondition = "any",
}: ConditionBlockType) => {
  const [selected, setSelected] = useState(selectedChoice);
  const [amount, setAmount] = useState(price);
  const [quantity, setQuantity] = useState<string>(selectedQuantity);
  const [productsConditionValue, setProductsConditionValue] = useState(
    selectedProductCondition,
  );
  const [errors, setErrors] = useState<{ price?: string; quantity?: string }>(
    {},
  );

  return (
    <>
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
          <s-stack justifyContent="space-between" gap="base">
            <s-stack direction="inline" gap="base">
              <s-stack>
                <s-choice-list
                  label="Condition Choice List"
                  labelAccessibilityVisibility="exclusive"
                  name={`goals[${idx}][condition]`}
                  values={[selected]}
                  onChange={(e) => {
                    setSelected(
                      e.currentTarget.values[0] as AddConditionBlockChoices,
                    );
                    console.log(e.currentTarget.values[0]);
                  }}
                >
                  {choiceLabels.map((choice) => (
                    <s-choice
                      key={choice.label}
                      value={choice.value}
                      disabled={!isActive}
                      selected={selected === choice.value}
                    >
                      {choice.label}
                    </s-choice>
                  ))}
                </s-choice-list>
              </s-stack>

              {/**Choice Labels Options Selection  */}

              {selected === AddConditionBlockChoices.CART_VALUE ? (
                <>
                  <s-stack direction="inline" gap="base">
                    <ArrowPlacer place="start" />
                    <s-box
                      border="base strong dashed"
                      padding="small base"
                      display="auto"
                    >
                      <s-stack alignContent="space-between" gap="small">
                        <s-stack direction="inline" gap="base">
                          <s-money-field
                            label="Price"
                            name={`goals[${idx}][price]`}
                            labelAccessibilityVisibility="exclusive"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.currentTarget.value)}
                            readOnly={!isActive}
                          ></s-money-field>
                        </s-stack>
                        <p style={{ maxWidth: "240px" }}>
                          <b>Notice:</b> All other currencies that are not set,
                          will be <b>converted</b> to be equal to <b>100 USD</b>
                          .
                        </p>
                      </s-stack>
                    </s-box>
                  </s-stack>
                </>
              ) : selected === AddConditionBlockChoices.CART_HAS_PRODUCTS ? (
                <>
                  <s-stack direction="inline" gap="base" alignItems="center">
                    <ArrowPlacer place="center" />
                    <s-box>
                      <s-select
                        label="Selection"
                        labelAccessibilityVisibility="exclusive"
                        name={`goals[${idx}][productsCondition]`}
                        value={productsConditionValue}
                        onChange={(e) =>
                          setProductsConditionValue(e.currentTarget.value)
                        }
                      >
                        <s-option value="any" disabled={!isActive}>
                          Any of
                        </s-option>
                        <s-option value="all" disabled={!isActive}>
                          All of
                        </s-option>
                      </s-select>
                    </s-box>
                    <ArrowPlacer place="center" />
                    <s-button
                      variant="primary"
                      onClick={async () => {
                        const selected = await shopify.resourcePicker({
                          type: "product",
                          multiple: true,
                        });
                        setSelectedProducts(selected);
                        console.log(selected);
                      }}
                      disabled={!isActive}
                    >
                      Select Product(s)
                    </s-button>
                    <input
                      hidden
                      name={`goals[${idx}][Products]`}
                      value={JSON.stringify(selectedProducts)}
                      onChange={() => console.log("Hello There...")}
                    />
                  </s-stack>
                </>
              ) : (
                <>
                  <s-stack direction="inline" gap="base" alignItems="end">
                    <ArrowPlacer place="end" />
                    <s-box>
                      <s-number-field
                        label="cartQuantity"
                        labelAccessibilityVisibility="exclusive"
                        name={`goals[${idx}][cartQuantity]`}
                        defaultValue="2"
                        readOnly={!isActive}
                        value={quantity}
                        onChange={(e) => setQuantity(e.currentTarget.value)}
                      />
                    </s-box>
                  </s-stack>
                </>
              )}
            </s-stack>

            {selected === AddConditionBlockChoices.CART_HAS_PRODUCTS &&
              selectedProducts?.length > 0 && (
                <>
                  <s-divider />
                  {/** Shows Selected Products */}
                  <s-box border="base strong solid" padding="small base">
                    <s-table>
                      <s-table-header-row listSlot="primary">
                        <s-table-header>Product</s-table-header>
                        <s-table-header>price</s-table-header>
                        <s-table-header>Remove</s-table-header>
                      </s-table-header-row>
                      <s-table-body>
                        {selectedProducts.map((product) => (
                          <s-table-row key={product.id}>
                            <s-table-cell>{product.title}</s-table-cell>
                            <s-table-cell>
                              {product.variants[0].price}
                            </s-table-cell>
                            <s-table-cell>
                              <s-link
                                target="_blank"
                                onClick={() => {
                                  const filteredProducts =
                                    selectedProducts.filter(
                                      (removable) =>
                                        removable.id !== product.id,
                                    );
                                  setSelectedProducts(filteredProducts);
                                }}
                              >
                                Remove
                              </s-link>
                            </s-table-cell>
                          </s-table-row>
                        ))}
                      </s-table-body>
                    </s-table>
                  </s-box>{" "}
                </>
              )}
          </s-stack>
        </s-box>
      </s-section>
    </>
  );
};

export default ConditionBlock;
