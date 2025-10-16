import { SetStateAction, useEffect, useRef, useState } from "react";
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
  onChange?: () => void;
};

const AddGoalBlock = ({
  idx,
  id,
  onRemove,
  goal,
  isActiveGoal = true,
  onChange = () => {},
}: AddGoalBlockProps) => {
  const [isActive, setIsActive] = useState<boolean>(
    typeof isActiveGoal === "string" ? JSON.parse(isActiveGoal) : isActiveGoal,
  );
  const [isExpanded, setIsExpanded] = useState(true);
  const [goalName, setGoalName] = useState<string>(goal.goalName ?? "");

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

  const [_, setAnyChanges] = useState(false);

  const handleOnChange = () => {
    setAnyChanges((prev) => !prev);
    setSelectedProducts(
      (typeof goal.Products === "string"
        ? JSON.parse(goal.Products)
        : goal.Products) ?? null,
    );
    setSelectedGifts(
      (typeof goal.freeGifts === "string"
        ? JSON.parse(goal.freeGifts)
        : goal.freeGifts) ?? null,
    );
    console.log("handle on change");
    onChange();
  };
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
                onChange={() => {}}
              />
              <s-switch
                checked={isActive}
                onChange={(e) => {
                  setIsActive(e.currentTarget.checked);
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
                  onChange={() => {}}
                />
                <s-heading>Goal {idx + 1}</s-heading>
                <InlineEditableText
                  index={idx}
                  value={goalName}
                  onSave={setGoalName}
                />
              </s-stack>
            </s-stack>
            <s-button
              icon={isExpanded ? "caret-up" : "caret-down"}
              variant="tertiary"
              accessibilityLabel="Expands"
              onClick={() => {
                setIsExpanded((prev) => !prev);
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
                  selectedQuantity={goal.cartQuantity ?? "2"}
                  price={goal.price ?? "100"}
                  onChange={handleOnChange}
                />
                <s-divider />
                <RewardBlocK
                  isActive={isActive}
                  selectedGifts={selectedGifts}
                  idx={idx}
                  selectedOfferPercentage={goal.cartDiscount ?? "10"}
                  selectedRewardChoice={
                    (goal.offer as AddRewardBlockChoices) ??
                    AddRewardBlockChoices.FREE_SHIPPING
                  }
                  onChange={onChange}
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
                        onClick={() => {
                          onChange();
                          onRemove(id);
                        }}
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

interface InlineEditableTextProps {
  value: string;
  onSave: React.Dispatch<SetStateAction<string>>;
  index: number;
}

export const InlineEditableText = ({
  value,
  onSave,
  index,
}: InlineEditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    if (isEditing) {
      setIsEditing(false);
      if (inputValue.trim() !== value) {
        onSave(inputValue.trim());
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onSave(inputValue.trim());
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setInputValue(value); // reset to original
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        name={`goals[${index}][goalName]`}
        value={inputValue}
        readOnly={!isEditing}
        onDoubleClick={handleDoubleClick}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{
          border: isEditing ? "1px solid #ccc" : "1px solid transparent",
          background: isEditing ? "#fff" : "transparent",
          cursor: isEditing ? "text" : "pointer",
          padding: "4px 6px",
          borderRadius: "4px",
          fontSize: "14px",
          outline: "none",
          width: "100%",
        }}
      />
    </>
  );
};
