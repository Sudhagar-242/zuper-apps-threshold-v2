// import { AddRewardBlockChoices } from "app/enums/addBlock";
// import { useEffect, useState } from "react";
// import { ArrowPlacer } from "../goal-add-block";
// import { Product } from "@shopify/app-bridge-react";

// interface RewardsBlockType {
//   isActive: boolean;
//   selectedGifts: Product[];
//   idx: number;
//   selectedRewardChoice: AddRewardBlockChoices;
//   selectedOfferPercentage: string;
//   onChange: () => void;
// }

// const RewardBlocK = ({
//   isActive,
//   selectedGifts,
//   idx,
//   selectedOfferPercentage,
//   selectedRewardChoice,
// }: RewardsBlockType) => {
//   const [selected, setSelected] = useState(selectedRewardChoice);
//   const [offerPercentage, setOfferPercentage] = useState(
//     selectedOfferPercentage,
//   );

//   const [onModalSelectedGifts, setOnModalSelectedGifts] =
//     useState(selectedGifts);
//   const selectedGiftsIds =
//     onModalSelectedGifts?.length > 0
//       ? onModalSelectedGifts.map((gift) => ({ id: gift?.id ?? "" }))
//       : [];

//   const [errors, setErrors] = useState<{ offers: string; gifts: string }>({
//     offers: "",
//     gifts: "",
//   });

//   useEffect(() => {
//     const newError = { offers: "", gifts: "" };

//     if (
//       (selected === AddRewardBlockChoices.ORDER_DISCOUNT &&
//         (Number(offerPercentage) < 1 || Number(offerPercentage) > 100)) ||
//       offerPercentage.length <= 0
//     ) {
//       newError.offers = "Must be between 1 and 100";
//     }

//     if (
//       (selected === AddRewardBlockChoices.FREE_GIFT &&
//         onModalSelectedGifts?.length === 0) ||
//       selectedGiftsIds.length === 0
//     ) {
//       newError.gifts = "Select at least one product.";
//     }

//     setErrors(newError);
//   }, [offerPercentage, selected, selectedGiftsIds.length]);

//   return (
//     <>
//       <s-section padding="base">
//         <s-heading>Rewards</s-heading>
//         <s-box
//           border="base strong dashed"
//           padding="base"
//           display="auto"
//           background="subdued"
//         >
//           <s-text>
//             Select what reward you want to give when the Condition is met
//           </s-text>
//           <s-stack justifyContent="space-between" gap="base">
//             <s-stack direction="inline" gap="base">
//               {/**Block strack For Choice Labels */}
//               <s-stack>
//                 <s-select
//                   label="Material"
//                   labelAccessibilityVisibility="exclusive"
//                   name={`goals[${idx}][offer]`}
//                   onChange={(e) =>
//                     setSelected(e.currentTarget.value as AddRewardBlockChoices)
//                   }
//                   required
//                   error={
//                     selected === AddRewardBlockChoices.FREE_GIFT
//                       ? errors.gifts
//                       : undefined
//                   }
//                 >
//                   <s-option
//                     value={AddRewardBlockChoices.FREE_SHIPPING}
//                     disabled={!isActive}
//                     defaultSelected={
//                       selected === AddRewardBlockChoices.FREE_SHIPPING
//                     }
//                   >
//                     Free Shipping
//                   </s-option>
//                   <s-option
//                     value={AddRewardBlockChoices.ORDER_DISCOUNT}
//                     disabled={!isActive}
//                     defaultSelected={
//                       selected === AddRewardBlockChoices.ORDER_DISCOUNT
//                     }
//                   >
//                     Order Discount
//                   </s-option>
//                   <s-option
//                     value={AddRewardBlockChoices.FREE_GIFT}
//                     disabled={!isActive}
//                     defaultSelected={
//                       selected === AddRewardBlockChoices.FREE_GIFT
//                     }
//                   >
//                     Free Gift
//                   </s-option>
//                 </s-select>
//               </s-stack>

//               {/**Choice Labels Options Selection  */}

//               {selected === AddRewardBlockChoices.FREE_SHIPPING ? (
//                 <>
//                   <s-box padding="large none base">
//                     <p>
//                       <strong>Notice:</strong> All of your shipping options will
//                       be free of charge when the goal is reached.
//                     </p>
//                     <p>
//                       <strong>Info:</strong> If you want to make free only a
//                       specific shipping option, you need to use your own
//                       shipping options instead - <s-link>Contact us</s-link> for
//                       more information.
//                     </p>
//                   </s-box>
//                 </>
//               ) : selected === AddRewardBlockChoices.FREE_GIFT ? (
//                 <>
//                   <s-stack direction="inline" gap="base" alignItems="center">
//                     <ArrowPlacer place="center" />
//                     <s-button
//                       variant="primary"
//                       onClick={async () => {
//                         const selected = await shopify.resourcePicker({
//                           type: "product",
//                           multiple: true,
//                           selectionIds: selectedGiftsIds,
//                         });
//                         if (selected) {
//                           setOnModalSelectedGifts(selected as Product[]);
//                         }
//                       }}
//                       disabled={!isActive}
//                     >
//                       Select Gift(s)
//                     </s-button>
//                     <input
//                       hidden
//                       name={`goals[${idx}][freeGifts]`}
//                       value={JSON.stringify(onModalSelectedGifts)}
//                       onChange={() => {}}
//                     />
//                     {errors.gifts.length > 0 && (
//                       <input hidden name="prevent_save" required />
//                     )}
//                   </s-stack>
//                 </>
//               ) : (
//                 <>
//                   <s-stack direction="inline" gap="base" alignItems="center">
//                     <s-text>of</s-text>
//                     <s-box>
//                       <s-number-field
//                         label="Orger Discount"
//                         labelAccessibilityVisibility="exclusive"
//                         name={`goals[${idx}][cartDiscount]`}
//                         min={1}
//                         max={100}
//                         step={1}
//                         defaultValue="2"
//                         suffix="%"
//                         value={offerPercentage}
//                         error={errors.offers}
//                         onChange={(e) =>
//                           setOfferPercentage(e.currentTarget.value)
//                         }
//                         readOnly={!isActive}
//                         required
//                       ></s-number-field>
//                       {errors.offers.length > 0 && (
//                         <input hidden name="prevent_save" required />
//                       )}
//                     </s-box>
//                   </s-stack>
//                 </>
//               )}
//             </s-stack>

//             {selected === AddRewardBlockChoices.FREE_GIFT &&
//               onModalSelectedGifts?.length > 0 && (
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
//                         <s-table-header listSlot="inline">
//                           Remove
//                         </s-table-header>
//                       </s-table-header-row>
//                       <s-table-body>
//                         {onModalSelectedGifts.map((gift) => (
//                           <s-table-row key={gift.id}>
//                             <s-table-cell>{gift.title}</s-table-cell>
//                             <s-table-cell>
//                               {gift.variants[0].price}
//                             </s-table-cell>
//                             <s-table-cell>
//                               <s-link
//                                 target="_blank"
//                                 onClick={() => {
//                                   const filteredProducts =
//                                     onModalSelectedGifts.filter(
//                                       (removable) => removable.id !== gift.id,
//                                     );
//                                   setOnModalSelectedGifts(filteredProducts);
//                                 }}
//                               >
//                                 Remove
//                               </s-link>
//                             </s-table-cell>
//                           </s-table-row>
//                         ))}
//                       </s-table-body>
//                     </s-table>
//                     <s-stack alignItems="center">
//                       <s-text tone="info">
//                         Gift products will be auto discounted to be free from
//                         our app.
//                       </s-text>
//                     </s-stack>

//                     <s-box paddingBlockStart="small">
//                       <p>
//                         <strong>Info:</strong> When only one (1) gift is
//                         selected, it will be auto added to the cart once the
//                         goal is reached. If the product has more than 1 variant
//                         selected, it will appear in the card where the customer
//                         will be able to choose the variant.
//                       </p>
//                     </s-box>
//                   </s-box>{" "}
//                 </>
//               )}
//           </s-stack>
//         </s-box>
//       </s-section>
//     </>
//   );
// };

// export default RewardBlocK;

import { AddRewardBlockChoices } from "app/enums/addBlock";
import { useEffect, useState } from "react";
import { ArrowPlacer } from "../goal-add-block";
import { GoalType } from "app/types/goals";
import { CallbackEvent } from "@shopify/polaris-types";

interface RewardsBlockType {
  goal: GoalType;
  isActive: boolean;
  errors: {
    discount?: string;
    gifts?: string;
  };
  onChange: (field: keyof GoalType, value: unknown) => void;
}

const RewardBlocK = ({
  isActive,
  goal,
  errors,
  onChange,
}: RewardsBlockType) => {
  const [isErrors, setIsErrors] = useState<typeof errors>(errors);

  useEffect(() => {
    const newError = { offers: "", gifts: "" };

    if (
      (goal.offer === AddRewardBlockChoices.ORDER_DISCOUNT &&
        (Number(goal.cartDiscount) < 1 || Number(goal.cartDiscount) > 100)) ||
      goal.cartDiscount?.length <= 0
    ) {
      newError.offers = "Must be between 1 and 100";
    }

    if (
      goal.offer === AddRewardBlockChoices.FREE_GIFT &&
      goal.freeGifts?.length === 0
    ) {
      newError.gifts = "Select at least one product.";
    }

    setIsErrors(newError);
  }, [goal, goal.cartDiscount, goal.offer, goal.freeGifts, isActive]);

  const handleProductSelect = async () => {
    if (!isActive) return;
    // Assuming `shopify.resourcePicker` is globally available or imported
    const selected = await window.shopify?.resourcePicker({
      type: "product",
      multiple: true,
      selectionIds:
        typeof goal.freeGifts === "string"
          ? JSON.parse(goal?.freeGifts)
          : goal.freeGifts,
    });
    if (selected) {
      onChange("freeGifts", selected);
    }
  };

  const handleRemoveProducts = (productId: string) => {
    const removedProucts = goal.freeGifts?.filter(
      (product) => product.id !== productId,
    );
    onChange("freeGifts", removedProucts);
    if (goal.products?.length === 0) {
      setIsErrors((prev) => ({
        ...prev,
        products: "Select at least 1 product",
      }));
    }
  };
  const handleRemoveVariantsProducts = (variantId: string) => {
    const removedProuctVariants = goal.freeGifts?.map((product) => {
      product.variants.filter((variant) => variant.id !== variantId);
    });
    onChange("freeGifts", removedProuctVariants);
    if (goal.products?.length === 0) {
      setIsErrors((prev) => ({
        ...prev,
        products: "Select at least 1 product",
      }));
    }
  };

  const handleDiscountPercentChange = (e: CallbackEvent<"s-number-field">) => {
    if (!e || !e.currentTarget) return;

    const value = Number(e?.currentTarget.value);

    if (value <= 0 && value <= 100) {
      onChange("cartDiscount", e?.currentTarget.value);
      setIsErrors((prev) => ({
        ...prev,
        quantity: "Discount must be 0 to 100",
      }));
    } else {
      setIsErrors((prev) => ({ ...prev, quantity: "" }));
      onChange("cartDiscount", e.currentTarget.value);
    }
  };

  return (
    <>
      <s-section padding="base">
        <s-heading>Rewards</s-heading>
        <s-box
          border="base strong dashed"
          padding="base"
          display="auto"
          background="subdued"
        >
          <s-text>
            Select what reward you want to give when the Condition is met
          </s-text>
          <div
            style={{
              padding: "0.5rem",
            }}
          />
          <s-stack justifyContent="space-between" gap="base">
            <s-stack direction="inline" gap="base">
              <s-stack>
                <s-select
                  label="Material"
                  labelAccessibilityVisibility="exclusive"
                  name={`goals[offer]`}
                  onChange={(e) => onChange("offer", e.currentTarget.value)}
                  required
                  disabled={!isActive}
                  error={errors.gifts ? errors.gifts : isErrors.gifts}
                >
                  <s-option
                    value={AddRewardBlockChoices.FREE_SHIPPING}
                    defaultSelected={
                      goal.offer === AddRewardBlockChoices.FREE_SHIPPING
                    }
                  >
                    Free Shipping
                  </s-option>
                  <s-option
                    value={AddRewardBlockChoices.ORDER_DISCOUNT}
                    defaultSelected={
                      goal.offer === AddRewardBlockChoices.ORDER_DISCOUNT
                    }
                  >
                    Order Discount
                  </s-option>
                  <s-option
                    value={AddRewardBlockChoices.FREE_GIFT}
                    defaultSelected={
                      goal.offer === AddRewardBlockChoices.FREE_GIFT
                    }
                  >
                    Free Gift
                  </s-option>
                </s-select>
              </s-stack>

              {/**Choice Labels Options Selection  */}

              {goal.offer === AddRewardBlockChoices.FREE_SHIPPING ? (
                <>
                  <s-box padding="large none base">
                    <p>
                      <strong>Notice:</strong> All of your shipping options will
                      be free of charge when the goal is reached.
                    </p>
                    <p>
                      <strong>Info:</strong> If you want to make free only a
                      specific shipping option, you need to use your own
                      shipping options instead - <s-link>Contact us</s-link> for
                      more information.
                    </p>
                  </s-box>
                </>
              ) : goal.offer === AddRewardBlockChoices.FREE_GIFT ? (
                <>
                  <s-stack direction="inline" gap="base" alignItems="center">
                    <ArrowPlacer place="center" />
                    <s-button
                      variant="primary"
                      onClick={handleProductSelect}
                      disabled={!isActive}
                    >
                      Select Gift(s)
                    </s-button>
                  </s-stack>
                </>
              ) : (
                <>
                  <s-stack direction="inline" gap="base" alignItems="center">
                    <s-text>of</s-text>
                    <s-box>
                      <s-number-field
                        label="Orger Discount"
                        labelAccessibilityVisibility="exclusive"
                        name={`goals[cartDiscount]`}
                        min={1}
                        max={100}
                        step={1}
                        defaultValue={"2"}
                        suffix="%"
                        value={goal.cartDiscount}
                        error={
                          errors.discount ? errors.discount : isErrors.discount
                        }
                        onChange={handleDiscountPercentChange}
                        readOnly={!isActive}
                        required
                      ></s-number-field>
                    </s-box>
                  </s-stack>
                </>
              )}
            </s-stack>

            {goal.offer === AddRewardBlockChoices.FREE_GIFT &&
              goal.freeGifts?.length > 0 && (
                <>
                  <s-divider />
                  {/** Shows Selected Products */}
                  <s-box border="base strong solid" padding="small base">
                    <s-table>
                      <s-table-header-row>
                        <s-table-header listSlot="primary">
                          Product
                        </s-table-header>
                        <s-table-header listSlot="secondary">
                          price
                        </s-table-header>
                        <s-table-header listSlot="inline">
                          Remove
                        </s-table-header>
                      </s-table-header-row>
                      <s-table-body>
                        {goal.freeGifts.map((gift) => (
                          <s-table-row key={gift.id}>
                            <s-table-cell>{gift.title}</s-table-cell>
                            <s-table-cell>
                              {gift.variants[0]?.price}
                            </s-table-cell>
                            <s-table-cell>
                              <s-link
                                target="_blank"
                                onClick={() => handleRemoveProducts(gift.id)}
                              >
                                Remove
                              </s-link>
                            </s-table-cell>
                          </s-table-row>
                        ))}
                      </s-table-body>
                    </s-table>
                    <s-stack alignItems="center">
                      <s-text tone="info">
                        Gift products will be auto discounted to be free from
                        our app.
                      </s-text>
                    </s-stack>

                    <s-box paddingBlockStart="small">
                      <p>
                        <strong>Info:</strong> When only one (
                        {goal.freeGifts.length}) gift is selected, it will be
                        auto added to the cart once the goal is reached. If the
                        product has more than 1 variant selected, it will appear
                        in the card where the customer will be able to choose
                        the variant.
                      </p>
                    </s-box>
                  </s-box>{" "}
                </>
              )}
          </s-stack>
        </s-box>
      </s-section>
    </>
  );
};

export default RewardBlocK;
