import { GoalType } from "app/types/goals";
import ConditionBlock from "./add-goals-blocks/condition-block";
import RewardBlocK from "./add-goals-blocks/rewards-block";
import GoalTextBlock from "./add-goals-blocks/goal-text-block";
import { useState, useEffect } from "react";
import OtherOptionsBlock from "./add-goals-blocks/other-options-block";
import { Product } from "node_modules/@shopify/app-bridge-react/build/types/cjs/index.cjs";

interface Props {
  goal: GoalType;
  onChange: (updatedGoal: GoalType) => void;
  onRemove: (id: string) => void;
  AllGoals: GoalType[];
  announceError: (id: string, error: boolean) => void;
  AlredyExistedProducts: Product[];
}

import { validateGoal, ValidationResult } from "app/utils/validateGoal";
import GoalListShower from "./goal-list-shower";

const GoalConfiguration = ({
  goal: selectedGoal,
  onChange,
  onRemove,
  AllGoals,
  announceError,
  AlredyExistedProducts,
}: Props) => {
  const [goal, setGoal] = useState<GoalType>(selectedGoal);
  const [isExpanded, setIsExpanded] = useState(true);
  const [validationErrors, setValidationErrors] = useState<
    ValidationResult["errors"]
  >({} as ValidationResult["errors"]);

  console.log("Duplicate Products", AlredyExistedProducts);

  useEffect(() => {
    const { hasError, errors } = validateGoal(goal, AllGoals);
    setValidationErrors(errors);
    announceError(goal.id, hasError);
    setGoal(selectedGoal);
  }, [selectedGoal, AlredyExistedProducts, goal, AllGoals]);

  const handleInputChange = (field: keyof GoalType, value: unknown) => {
    const updatedGoal = { ...goal, [field]: value };
    setGoal(updatedGoal);
    onChange(updatedGoal);
  };

  const handleRemove = () => {
    onRemove(goal.id);
    announceError(goal.id, false);
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
              <s-switch
                checked={goal.isActive}
                onChange={(e) => {
                  handleInputChange("isActive", e.currentTarget.checked);
                }}
                accessibilityLabel="isActive"
                defaultChecked={goal.isActive}
              ></s-switch>
              <s-stack alignContent="start">
                <s-heading>{goal.title}</s-heading>
                <input
                  type="text"
                  value={goal.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  style={{
                    border: "none",
                    background: "transparent",
                    outline: "none",
                  }}
                />
                <s-text>
                  <GoalListShower goal={goal} />
                </s-text>
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
            <s-stack
              accessibilityVisibility={isExpanded ? "visible" : "exclusive"}
              gap="base"
            >
              <s-divider color="base" />
              <ConditionBlock
                goal={goal}
                isActive={goal.isActive}
                errors={{
                  price: validationErrors.price,
                  quantity: validationErrors.quantity,
                  products: validationErrors.products,
                }}
                onChange={handleInputChange}
                alredyExistedProducts={AlredyExistedProducts}
              />

              <s-divider />
              <RewardBlocK
                goal={goal}
                isActive={goal.isActive}
                errors={{
                  discount: validationErrors.cartDiscount,
                  gifts: validationErrors.gifts,
                }}
                onChange={handleInputChange}
              />

              <s-divider />
              <GoalTextBlock
                goal={goal}
                isActive={goal.isActive}
                onChange={handleInputChange}
              />

              {/* <s-divider />

              <OtherOptionsBlock
                isActive={goal.isActive}
                isCombined={goal.compined}
                onChange={handleInputChange}
              /> */}

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
                        handleRemove();
                      }}
                    >
                      Remove
                    </s-link>
                  </s-stack>
                </s-section>
              </s-box>
            </s-stack>
          }
        </s-stack>
      </s-section>
    </>
  );
};

export default GoalConfiguration;

export const ArrowPlacer = ({
  place,
}: {
  place: "start" | "center" | "end";
}) => (
  <s-stack paddingBlock="small-200 small-400" justifyContent={place}>
    <s-text>➜ </s-text>
  </s-stack>
);
