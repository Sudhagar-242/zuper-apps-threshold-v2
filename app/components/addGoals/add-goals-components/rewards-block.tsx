import { AddRewardBlockChoices } from "app/enums/addBlock";
import { useState } from "react";
import { ArrowPlacer } from "../goal-add-block";

interface RewardsBlockType {
  isActive: boolean;
  selectedGifts: any[];
  setSelectedGifts: any;
  idx: number;
  selectedRewardChoice: AddRewardBlockChoices;
  selectedOfferPercentage: string;
}

const RewardBlocK = ({
  isActive,
  selectedGifts,
  setSelectedGifts,
  idx,
  selectedOfferPercentage = "10",
  selectedRewardChoice = AddRewardBlockChoices.FREE_SHIPPING,
}: RewardsBlockType) => {
  const [selected, setSelected] = useState(selectedRewardChoice);
  const [offerPercentage, setOfferPercentage] = useState(
    selectedOfferPercentage,
  );

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
          <s-stack justifyContent="space-between" gap="base">
            <s-stack direction="inline" gap="base">
              {/**Block strack For Choice Labels */}
              <s-stack>
                <s-select
                  label="Material"
                  labelAccessibilityVisibility="exclusive"
                  name={`goals[${idx}][offer]`}
                  onChange={(e) =>
                    setSelected(e.currentTarget.value as AddRewardBlockChoices)
                  }
                >
                  <s-option
                    value={AddRewardBlockChoices.FREE_SHIPPING}
                    selected
                    disabled={!isActive}
                  >
                    Free Shipping
                  </s-option>
                  <s-option
                    value={AddRewardBlockChoices.ORDER_DISCOUNT}
                    disabled={!isActive}
                  >
                    Order Discount
                  </s-option>
                  <s-option
                    value={AddRewardBlockChoices.FREE_GIFT}
                    disabled={!isActive}
                  >
                    Free Gift
                  </s-option>
                </s-select>
              </s-stack>

              {/**Choice Labels Options Selection  */}

              {selected === AddRewardBlockChoices.FREE_SHIPPING ? (
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
              ) : selected === AddRewardBlockChoices.FREE_GIFT ? (
                <>
                  <s-stack direction="inline" gap="base" alignItems="center">
                    <ArrowPlacer place="center" />
                    <s-button
                      variant="primary"
                      onClick={async () => {
                        const selected = await shopify.resourcePicker({
                          type: "product",
                          multiple: true,
                        });
                        setSelectedGifts(selected);
                        console.log(selected);
                      }}
                      disabled={!isActive}
                    >
                      Select Gift(s)
                    </s-button>
                    <input
                      hidden
                      name={`goals[${idx}][freeGifts]`}
                      value={JSON.stringify(selectedGifts)}
                      onChange={() => console.log("Hello There...")}
                    />
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
                        name={`goals[${idx}][cartDiscount]`}
                        step={1}
                        defaultValue="2"
                        suffix="%"
                        value={offerPercentage}
                        onChange={(e) =>
                          setOfferPercentage(e.currentTarget.value)
                        }
                        readOnly={!isActive}
                      ></s-number-field>
                    </s-box>
                  </s-stack>
                </>
              )}
            </s-stack>

            {selected === AddRewardBlockChoices.FREE_GIFT &&
              selectedGifts?.length > 0 && (
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
                        {selectedGifts.map((gift) => (
                          <s-table-row key={gift.id}>
                            <s-table-cell>{gift.title}</s-table-cell>
                            <s-table-cell>
                              {gift.variants[0].price}
                            </s-table-cell>
                            <s-table-cell>
                              <s-link
                                target="_blank"
                                onClick={() => {
                                  const filteredProducts = selectedGifts.filter(
                                    (removable) => removable.id !== gift.id,
                                  );
                                  setSelectedGifts(filteredProducts);
                                }}
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
                        <strong>Info:</strong> When only one (1) gift is
                        selected, it will be auto added to the cart once the
                        goal is reached. If the product has more than 1 variant
                        selected, it will appear in the card where the customer
                        will be able to choose the variant.
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