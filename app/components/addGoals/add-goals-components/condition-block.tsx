// import { AddConditionBlockChoices } from "app/enums/addBlock";
// import { useEffect, useState } from "react";
// import { ArrowPlacer } from "../goal-add-block";
// import { Product } from "extensions/threshold-discount/generated/api";

// interface ConditionBlockType {
//   isActive: boolean;
//   selectedProducts: Partial<Product>[];
//   idx: number;
//   selectedChoice: AddConditionBlockChoices;
//   price: string;
//   selectedQuantity: string;
//   selectedProductCondition: "any" | "all";
//   onChange?: () => void;
// }

// const choiceLabels: {
//   label: string;
//   value: string;
// }[] = [
//   {
//     value: AddConditionBlockChoices.CART_VALUE,
//     label: "Cart value greater than",
//   },
//   {
//     value: AddConditionBlockChoices.CART_HAS_PRODUCTS,
//     label: "Cart has product(s)",
//   },
//   {
//     value: AddConditionBlockChoices.CART_QUANTITY,
//     label: "Cart quantity greater than",
//   },
// ];

// const ConditionBlock = ({
//   isActive,
//   selectedProducts,
//   idx,
//   selectedChoice = AddConditionBlockChoices.CART_VALUE,
//   price,
//   selectedQuantity,
//   selectedProductCondition,
//   onChange = () => {},
// }: ConditionBlockType) => {
//   const [selected, setSelected] = useState(selectedChoice);
//   const [amount, setAmount] = useState(price);
//   const [quantity, setQuantity] = useState<string>(selectedQuantity);
//   const [onModalSelectedProducts, setOnModalSelectedProducts] =
//     useState(selectedProducts);
//   const [productsConditionValue, setProductsConditionValue] = useState(
//     selectedProductCondition,
//   );
//   const [errors, setErrors] = useState<{
//     price?: string;
//     quantity?: string;
//     products?: string;
//   }>({});

//   useEffect(() => {
//     if (Number(amount) <= 0) {
//       setErrors((prev) => ({ ...prev, price: "Price must be greater than 0" }));
//     } else if (Number(quantity) <= 0) {
//       setErrors((prev) => ({
//         ...prev,
//         quantity: "Quantity must be greater than 0",
//       }));
//     } else if (onModalSelectedProducts?.length < 0) {
//       setErrors((prev) => ({ ...prev, products: "Select atleast 1 Product" }));
//     } else {
//       console.log("");
//     }
//   }, [amount, quantity, onModalSelectedProducts]);

//   const selectedProductsIds =
//     onModalSelectedProducts?.length > 0
//       ? onModalSelectedProducts.map((product) => ({ id: product?.id ?? "" }))
//       : [];

//   return (
//     <>
//       <s-section padding="base">
//         <s-heading>Conditions</s-heading>
//         <s-box
//           border="base strong dashed"
//           padding="base"
//           display="auto"
//           background="subdued"
//         >
//           <s-text>
//             Select what condition you want to use to trigger the reward
//           </s-text>
//           <s-stack justifyContent="space-between" gap="base">
//             <s-stack direction="inline" gap="base">
//               <s-stack>
//                 <s-choice-list
//                   label="Condition Choice List"
//                   labelAccessibilityVisibility="exclusive"
//                   name={`goals[${idx}][condition]`}
//                   values={[selected]}
//                   onChange={(e) => {
//                     setSelected(
//                       e.currentTarget.values[0] as AddConditionBlockChoices,
//                     );
//                     console.log(e.currentTarget.values[0]);
//                   }}
//                 >
//                   {choiceLabels.map((choice) => (
//                     <s-choice
//                       key={choice.label}
//                       value={choice.value}
//                       disabled={!isActive}
//                       selected={selected === choice.value}
//                     >
//                       {choice.label}
//                     </s-choice>
//                   ))}
//                 </s-choice-list>
//               </s-stack>

//               {/**Choice Labels Options Selection  */}

//               {selected === AddConditionBlockChoices.CART_VALUE ? (
//                 <>
//                   <s-stack direction="inline" gap="base">
//                     <ArrowPlacer place="start" />
//                     <s-box
//                       border="base strong dashed"
//                       padding="small base"
//                       display="auto"
//                     >
//                       <s-stack alignContent="space-between" gap="small">
//                         <s-stack direction="inline" gap="base">
//                           <s-money-field
//                             label="Price"
//                             name={`goals[${idx}][price]`}
//                             labelAccessibilityVisibility="exclusive"
//                             placeholder="0.00"
//                             value={amount !== "0" ? amount : "100"}
//                             onChange={(e) => setAmount(e.currentTarget.value)}
//                             readOnly={!isActive}
//                             error={errors.price}
//                             min={1}
//                           ></s-money-field>
//                         </s-stack>
//                         <p style={{ maxWidth: "240px" }}>
//                           <b>Notice:</b> All other currencies that are not set,
//                           will be <b>converted</b> to be equal to <b>100 USD</b>
//                           .
//                         </p>
//                       </s-stack>
//                     </s-box>
//                   </s-stack>
//                 </>
//               ) : selected === AddConditionBlockChoices.CART_HAS_PRODUCTS ? (
//                 <>
//                   <s-stack direction="inline" gap="base" alignItems="center">
//                     <ArrowPlacer place="center" />
//                     <s-box>
//                       <s-select
//                         label="Selection"
//                         labelAccessibilityVisibility="exclusive"
//                         name={`goals[${idx}][productsCondition]`}
//                         value={productsConditionValue}
//                         onChange={(e) =>
//                           setProductsConditionValue(
//                             e.currentTarget?.value as "any" | "all",
//                           )
//                         }
//                         error={errors.products}
//                       >
//                         <s-option
//                           value="any"
//                           disabled={!isActive}
//                           selected={productsConditionValue === "all"}
//                         >
//                           Any of
//                         </s-option>
//                         <s-option
//                           value="all"
//                           disabled={!isActive}
//                           selected={productsConditionValue === "any"}
//                         >
//                           All of
//                         </s-option>
//                       </s-select>
//                     </s-box>
//                     <ArrowPlacer place="center" />
//                     <s-button
//                       variant="primary"
//                       onClick={async () => {
//                         const selected = await shopify.resourcePicker({
//                           type: "product",
//                           multiple: true,
//                           selectionIds: selectedProductsIds,
//                         });
//                         if (selected) {
//                           onChange();
//                           setOnModalSelectedProducts(selected);
//                         }
//                         console.log(selected);
//                       }}
//                       disabled={!isActive}
//                     >
//                       Select Product(s)
//                     </s-button>
//                     <input
//                       hidden
//                       name={`goals[${idx}][Products]`}
//                       value={JSON.stringify(selectedProducts)}
//                       onChange={() => console.log("Hello There...")}
//                     />
//                   </s-stack>
//                 </>
//               ) : (
//                 <>
//                   <s-stack direction="inline" gap="base" alignItems="end">
//                     <ArrowPlacer place="end" />
//                     <s-box>
//                       <s-number-field
//                         label="cartQuantity"
//                         labelAccessibilityVisibility="exclusive"
//                         name={`goals[${idx}][cartQuantity]`}
//                         defaultValue="2"
//                         readOnly={!isActive}
//                         value={quantity}
//                         onChange={(e) => setQuantity(e.currentTarget.value)}
//                         error={errors.quantity}
//                         min={1}
//                       />
//                     </s-box>
//                   </s-stack>
//                 </>
//               )}
//             </s-stack>

//             {selected === AddConditionBlockChoices.CART_HAS_PRODUCTS &&
//               onModalSelectedProducts?.length > 0 && (
//                 <>
//                   <s-divider />
//                   {/** Shows Selected Products */}
//                   <s-box border="base strong solid" padding="small base">
//                     <s-table>
//                       <s-table-header-row>
//                         <s-table-header listSlot="primary">
//                           Product
//                         </s-table-header>
//                         <s-table-header listSlot="secondary">
//                           price
//                         </s-table-header>
//                         <s-table-header>Remove</s-table-header>
//                       </s-table-header-row>
//                       <s-table-body>
//                         {onModalSelectedProducts.map((product) => (
//                           <s-table-row key={product.id}>
//                             <s-table-cell>{product.title}</s-table-cell>
//                             <s-table-cell>
//                               {product?.variants[0].price}
//                             </s-table-cell>
//                             <s-table-cell>
//                               <s-link
//                                 target="_blank"
//                                 onClick={() => {
//                                   const filteredProducts =
//                                     onModalSelectedProducts.filter(
//                                       (removable) =>
//                                         removable.id !== product.id,
//                                     );
//                                   setOnModalSelectedProducts(filteredProducts);
//                                 }}
//                               >
//                                 Remove
//                               </s-link>
//                             </s-table-cell>
//                           </s-table-row>
//                         ))}
//                       </s-table-body>
//                     </s-table>
//                   </s-box>{" "}
//                 </>
//               )}
//           </s-stack>
//         </s-box>
//       </s-section>
//     </>
//   );
// };

// export default ConditionBlock;

import { AddConditionBlockChoices } from "app/enums/addBlock";
import React, { useEffect, useState } from "react";
import { ArrowPlacer } from "../goal-add-block";
import type { Product } from "extensions/threshold-discount/generated/api";
import { CallbackEvent } from "@shopify/polaris-types";
import { useFormSaveBarStatus } from "app/context/form-save-bar-status";

interface ConditionBlockType {
  isActive: boolean;
  selectedProducts: Partial<Product>[];
  setSelectedProducts?: React.Dispatch<
    React.SetStateAction<Partial<Product>[]>
  >;
  idx: number;
  selectedChoice: AddConditionBlockChoices;
  price: string;
  selectedQuantity: string;
  selectedProductCondition: "any" | "all";
  onChange?: () => void;
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

const ConditionBlock: React.FC<ConditionBlockType> = ({
  isActive,
  selectedProducts,
  // setSelectedProducts,
  idx,
  selectedChoice,
  price,
  selectedQuantity,
  selectedProductCondition,
  onChange = () => {},
}) => {
  const [selected, setSelected] =
    useState<AddConditionBlockChoices>(selectedChoice);
  const [amount, setAmount] = useState(price);
  const [quantity, setQuantity] = useState(selectedQuantity);
  const [onModalSelectedProducts, setOnModalSelectedProducts] =
    useState<Partial<Product>[]>(selectedProducts);
  const [productsConditionValue, setProductsConditionValue] = useState(
    selectedProductCondition,
  );
  const [errors, setErrors] = useState<{
    price?: string;
    quantity?: string;
    products?: string;
  }>({});

  const savedOrDiscarded = useFormSaveBarStatus();
  console.log("For check", savedOrDiscarded);
  console.log("selected from props", onModalSelectedProducts, selectedProducts);

  useEffect(() => {
    if (!savedOrDiscarded && onModalSelectedProducts != selectedProducts) {
      console.log("discarding products");
      setOnModalSelectedProducts(selectedProducts);
    }
  }, [savedOrDiscarded.savedOrNot]);

  useEffect(() => {
    const newErrors: typeof errors = {};

    if (
      selected === AddConditionBlockChoices.CART_VALUE &&
      Number(amount) <= 0
    ) {
      newErrors.price = "Price must be greater than 0";
    }
    if (
      selected === AddConditionBlockChoices.CART_QUANTITY &&
      Number(quantity) <= 0
    ) {
      newErrors.quantity = "Quantity must be greater than 0";
    }
    if (
      selected === AddConditionBlockChoices.CART_HAS_PRODUCTS &&
      (!onModalSelectedProducts || onModalSelectedProducts.length === 0)
    ) {
      newErrors.products = "Select at least 1 product";
    }

    setErrors(newErrors);
  }, [amount, quantity, onModalSelectedProducts, selected]);

  // Helper for getting selected product IDs for product picker
  const selectedProductsIds =
    onModalSelectedProducts?.length > 0
      ? onModalSelectedProducts.map((product) => ({ id: product?.id ?? "" }))
      : [];

  const handleProductSelect = async () => {
    if (!isActive) return;
    // Assuming `shopify.resourcePicker` is globally available or imported
    const selected: Partial<Product>[] = await window.shopify?.resourcePicker({
      type: "product",
      multiple: true,
      selectionIds: selectedProductsIds,
    });
    if (selected) {
      setOnModalSelectedProducts(selected);
      onChange();
    }
  };

  const handleRemoveSelectedProduct = (id: string) => {
    setOnModalSelectedProducts((prev) => prev.filter((p) => p.id !== id));
    onChange();
  };

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
                  onChange={(e: CallbackEvent<"s-choice-list">) => {
                    setSelected(
                      e.currentTarget.values[0] as AddConditionBlockChoices,
                    );
                  }}
                >
                  {choiceLabels.map((choice) => (
                    <s-choice
                      key={choice.value}
                      value={choice.value}
                      disabled={!isActive}
                      defaultSelected={selectedChoice === choice.value}
                    >
                      {choice.label}
                    </s-choice>
                  ))}
                </s-choice-list>
              </s-stack>

              {selected === AddConditionBlockChoices.CART_VALUE && (
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
                          error={errors.price}
                          min={1}
                          max={100}
                          required
                          error-message={errors.price}
                        />
                      </s-stack>
                      <p style={{ maxWidth: "240px" }}>
                        <b>Notice:</b> All other currencies that are not set,
                        will be <b>converted</b> to be equal to <b>100 USD</b>.
                      </p>
                    </s-stack>
                  </s-box>
                </s-stack>
              )}

              {selected === AddConditionBlockChoices.CART_HAS_PRODUCTS && (
                <s-stack direction="inline" gap="base" alignItems="center">
                  <ArrowPlacer place="center" />
                  <s-box>
                    <s-select
                      label="Selection"
                      labelAccessibilityVisibility="exclusive"
                      name={`goals[${idx}][productsCondition]`}
                      value={productsConditionValue}
                      onChange={(e) =>
                        setProductsConditionValue(
                          e.currentTarget.value as "any" | "all",
                        )
                      }
                      error={errors.products}
                      required
                    >
                      <s-option
                        value="any"
                        disabled={!isActive}
                        defaultSelected={productsConditionValue === "any"}
                      >
                        Any of
                      </s-option>
                      <s-option
                        value="all"
                        disabled={!isActive}
                        defaultSelected={productsConditionValue === "all"}
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
                  <input
                    hidden
                    name={`goals[${idx}][Products]`}
                    value={JSON.stringify(onModalSelectedProducts)}
                    readOnly
                  />
                </s-stack>
              )}

              {selected === AddConditionBlockChoices.CART_QUANTITY && (
                <s-stack direction="inline" gap="base" alignItems="end">
                  <ArrowPlacer place="end" />
                  <s-box>
                    <s-number-field
                      label="Cart Quantity"
                      labelAccessibilityVisibility="exclusive"
                      name={`goals[${idx}][cartQuantity]`}
                      value={quantity}
                      readOnly={!isActive}
                      onChange={(e) => setQuantity(e.currentTarget.value)}
                      error={errors.quantity}
                      min={1}
                      required
                    />
                  </s-box>
                </s-stack>
              )}
            </s-stack>

            {selected === AddConditionBlockChoices.CART_HAS_PRODUCTS &&
              onModalSelectedProducts?.length > 0 && (
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
                        {onModalSelectedProducts.map((product) => (
                          <s-table-row key={product.id}>
                            <s-table-cell>{product.title}</s-table-cell>
                            <s-table-cell>
                              {product?.variants?.[0]?.price ?? "-"}
                            </s-table-cell>
                            <s-table-cell>
                              <s-link
                                target="_blank"
                                onClick={() =>
                                  handleRemoveSelectedProduct(product.id ?? "")
                                }
                              >
                                Remove
                              </s-link>
                            </s-table-cell>
                          </s-table-row>
                        ))}
                      </s-table-body>
                    </s-table>
                  </s-box>
                </>
              )}
          </s-stack>
        </s-box>
      </s-section>
    </>
  );
};

export default ConditionBlock;
