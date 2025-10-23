import { GoalType } from "app/types/goals";
import { useEffect, useState } from "react";

interface GoalTextBlockType {
  isActive: boolean;
  goal: GoalType;
  onChange: (field: keyof GoalType, value: unknown) => void;
}

const GoalTextBlock = ({ isActive, goal, onChange }: GoalTextBlockType) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const newErrors: { [key: string]: boolean } = {};
    if (isActive) {
      newErrors.headline = goal.headline.trim() === "";
      newErrors.topBarHeadlineIcons = goal.topBarHeadlineIcons.trim() === "";
      newErrors.topBarHeadlineSimple = goal.topBarHeadlineSimple.trim() === "";
      newErrors.confirmationMessage = goal.confirmationMessage.trim() === "";
      newErrors.remainingTargetMessage =
        goal.remainingTargetMessage.trim() === "";
      newErrors.discountAppliedMessage =
        goal.discountAppliedMessage.trim() === "";

      setErrors(newErrors);
    }
  }, [
    goal.headline,
    goal.topBarHeadlineSimple,
    goal.topBarHeadlineIcons,
    goal.remainingTargetMessage,
    goal.remainingTargetMessage,
  ]);

  const commonErrorMessage = "This field cannot be empty";

  return (
    <>
      <s-section padding="base">
        <s-stack
          gap={isExpanded ? "base" : undefined}
          justifyContent="space-evenly"
        >
          <s-stack direction="inline" gap="base" alignItems="center">
            <s-heading>Goal Text</s-heading>
            <s-button
              variant="primary"
              icon={isExpanded ? "minus" : "plus"}
              onClick={() => setIsExpanded((prev) => !prev)}
              accessibilityLabel="Expands"
              disabled={!isActive}
            >
              {isExpanded
                ? "Hide text & translate options"
                : "Show text & translate options"}
            </s-button>
          </s-stack>
          <s-stack
            accessibilityVisibility={isExpanded ? "visible" : "exclusive"}
          >
            <s-box
              padding="base"
              border="base strong dashed"
              borderColor="strong"
              borderRadius="small"
            >
              <s-stack justifyContent="space-between" gap="base">
                <s-box>
                  <p>
                    This is your default (main) language:{" "}
                    <strong>English</strong>
                  </p>
                </s-box>

                <s-text-field
                  label="Headline"
                  placeholder="Example: Spend %target% For Free Express Shipping"
                  name={`goals[headline]`}
                  value={goal.headline}
                  onChange={(e) => onChange("headline", e.currentTarget.value)}
                  readOnly={!isActive}
                  required
                  error={errors.headline ? commonErrorMessage : undefined}
                  error-message={
                    errors.headline ? commonErrorMessage : undefined
                  }
                />

                <s-text-field
                  label="Top bar headline [Icons design]"
                  placeholder="Example: Free Shipping"
                  name={`goals[topBarHeadlineIcons]`}
                  value={goal.topBarHeadlineIcons}
                  onChange={(e) =>
                    onChange("topBarHeadlineIcons", e.currentTarget.value)
                  }
                  readOnly={!isActive}
                  required
                  error={
                    errors.topBarHeadlineIcons ? commonErrorMessage : undefined
                  }
                  error-message={
                    errors.topBarHeadlineIcons ? commonErrorMessage : undefined
                  }
                />

                <s-text-field
                  label="Top bar headline [Simple design]"
                  placeholder="Example: Free Shipping"
                  name={`goals[topBarHeadlineSimple]`}
                  value={goal.topBarHeadlineSimple}
                  onChange={(e) =>
                    onChange("topBarHeadlineSimple", e.currentTarget.value)
                  }
                  readOnly={!isActive}
                  required
                  error={
                    errors.topBarHeadlineSimple ? commonErrorMessage : undefined
                  }
                  error-message={
                    errors.topBarHeadlineSimple ? commonErrorMessage : undefined
                  }
                />

                <s-text-field
                  label="Confirmation message"
                  placeholder="You're Eligible For Free Express Shipping"
                  name={`goals[confirmationMessage]`}
                  value={goal.confirmationMessage}
                  onChange={(e) =>
                    onChange("confirmationMessage", e.currentTarget.value)
                  }
                  readOnly={!isActive}
                  required
                  error={
                    errors.confirmationMessage ? commonErrorMessage : undefined
                  }
                  error-message={
                    errors.confirmationMessage ? commonErrorMessage : undefined
                  }
                />

                <s-text-field
                  label="Remaining target message"
                  placeholder="%remaining% away"
                  name={`goals[remainingTargetMessage]`}
                  value={goal.remainingTargetMessage}
                  onChange={(e) =>
                    onChange("remainingTargetMessage", e.currentTarget.value)
                  }
                  readOnly={!isActive}
                  required
                  error={
                    errors.remainingTargetMessage
                      ? commonErrorMessage
                      : undefined
                  }
                  error-message={
                    errors.remainingTargetMessage
                      ? commonErrorMessage
                      : undefined
                  }
                />

                <s-text-field
                  label="Discount applied message"
                  placeholder="You got %discount% off for spend %target%"
                  name={`goals[discountAppliedMessage]`}
                  value={goal.discountAppliedMessage}
                  onChange={(e) =>
                    onChange("discountAppliedMessage", e.currentTarget.value)
                  }
                  readOnly={!isActive}
                  required
                  error={
                    errors.discountAppliedMessage
                      ? commonErrorMessage
                      : undefined
                  }
                  error-message={
                    errors.discountAppliedMessage
                      ? commonErrorMessage
                      : undefined
                  }
                />
              </s-stack>
            </s-box>
          </s-stack>
        </s-stack>
      </s-section>
    </>
  );
};

export default GoalTextBlock;
