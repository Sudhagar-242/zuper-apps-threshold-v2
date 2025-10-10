import { SetStateAction, useState } from "react";
import {
  AddConditionBlockChoices,
  AddRewardBlockChoices,
} from "../../enums/addBlock";

import type { GoalType } from "app/types/goals";
import ConditionBlock from "./add-goals-components/condition-block";
import GoalTextBlock from "./add-goals-components/goal-text-block";
import OtherOptionsBlock from "./add-goals-components/other-options-block";
import RewardBlocK from "./add-goals-components/rewards-block";

export const ArrowPlacer = ({
  place,
}: {
  place: "start" | "center" | "end";
}) => (
  <s-stack paddingBlock="small-200 small-400" justifyContent={place}>
    <s-text>➜ </s-text>
  </s-stack>
);

type AddGoalBlockProps = {
  idx: number;
  id: string;
  onRemove: (id: string) => void;
  goal: GoalType;
  isActiveGoal: boolean;
  onChange: (id: string, updatedGoal: GoalType) => void;
};

const AddGoalBlock = ({
  idx,
  id,
  onRemove,
  onChange,
  goal,
  isActiveGoal = true,
}: AddGoalBlockProps) => {
  const [isActive, setIsActive] = useState<boolean>(
    typeof isActiveGoal === "string" ? JSON.parse(isActiveGoal) : isActiveGoal,
  );
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState(
    (typeof goal.Products === "string"
      ? JSON.parse(goal.Products)
      : goal.Products) ?? null,
  );
  const [selectedGifts, setSelectedGifts] = useState(
    (typeof goal.freeGifts === "string"
      ? JSON.parse(goal.freeGifts)
      : goal.freeGifts) ?? null,
  );

  console.log(selectedGifts, selectedProducts);

  return (
    <>
      <s-section accessibilityLabel="Goal Block">
        <s-stack gap={isExpanded ? "base base" : undefined}>
          <s-stack direction="inline" justifyContent="space-between">
            <s-stack
              direction="inline"
              alignItems="center"
              alignContent="start"
              gap="large"
            >
              <input
                hidden
                name={`goals[${idx}][isActive]`}
                value={isActive ? "true" : "false"}
                onChange={() => console.log("Hello There...")}
              />
              <s-switch
                checked={isActive}
                onChange={(e) => {
                  setIsActive(e.currentTarget.checked);
                  console.log("switch", e.currentTarget.checked);
                }}
                accessibilityLabel="isActive"
                defaultChecked={isActive}
              ></s-switch>
              <s-stack alignContent="start">
                <input
                  hidden
                  type="text"
                  name={`goals[${idx}][title]`}
                  value={`Goal ${idx + 1}`}
                  placeholder="Enter goal title"
                  onChange={(e) => console.log(e.currentTarget.value)}
                />
                <s-heading>Goal {idx + 1}</s-heading>
                <s-paragraph>Hello There...</s-paragraph>
              </s-stack>
            </s-stack>
            <s-button
              icon={isExpanded ? "caret-up" : "caret-down"}
              variant="tertiary"
              accessibilityLabel="Expands"
              onClick={() => {
                setIsExpanded((prev) => !prev);
                console.log("Expands", isExpanded);
              }}
            />
          </s-stack>
          {
            <>
              <s-stack
                accessibilityVisibility={isExpanded ? "visible" : "exclusive"}
                gap="base"
              >
                <s-divider color="base" />
                <ConditionBlock
                  isActive={isActive}
                  selectedProducts={selectedProducts}
                  setSelectedProducts={setSelectedProducts}
                  idx={idx}
                  selectedChoice={goal.condition as AddConditionBlockChoices}
                  selectedProductCondition={goal.productsCondition ?? "any"}
                  slectedQuantity={goal.cartQuantity ?? "2"}
                  price={goal.price ?? "100"}
                />
                <s-divider />
                <RewardBlocK
                  isActive={isActive}
                  selectedGifts={selectedGifts}
                  setSelectedGifts={setSelectedGifts}
                  idx={idx}
                  selectedOfferPercentage={goal.cartDiscount ?? "10"}
                  selectedRewardChoice={
                    (goal.offer as AddRewardBlockChoices) ??
                    AddRewardBlockChoices.FREE_SHIPPING
                  }
                />
                <s-divider />
                <GoalTextBlock
                  isActive={isActive}
                  idx={idx}
                  selectedHeadline={goal.headline}
                  selectedTopBarHeadlineIcons={goal.topBarHeadlineIcons}
                  selectedTopBarHeadlineSimple={goal.topBarHeadlineSimple}
                  selectedConfirmationMessage={goal.confirmationMessage}
                  selectedRemainingTargetMessage={goal.remainingTargetMessage}
                  selectedDiscountAppliedMessage={goal.discountAppliedMessage}
                />

                <s-divider />
                <OtherOptionsBlock
                  isActive={isActive}
                  idx={idx}
                  isCombined={
                    typeof goal.compined === "string"
                      ? JSON.parse(goal.compined)
                      : goal.compined
                  }
                />
                <s-divider />
                <s-box>
                  <s-section>
                    <s-stack direction="inline" justifyContent="space-between">
                      <s-link
                        target="_blank"
                        tone="neutral"
                        onClick={() => setIsExpanded(false)}
                      >
                        Close
                      </s-link>
                      <s-link
                        target="_blank"
                        tone="critical"
                        onClick={() => onRemove(id)}
                      >
                        Remove
                      </s-link>
                    </s-stack>
                  </s-section>
                </s-box>
              </s-stack>
            </>
          }
        </s-stack>
      </s-section>
    </>
  );
};

export default AddGoalBlock;
