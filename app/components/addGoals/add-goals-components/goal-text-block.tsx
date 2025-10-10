import { useState } from "react";

interface GoalTextBlockType {
  isActive: boolean;
  idx: number;
  selectedHeadline?: string;
  selectedTopBarHeadlineIcons?: string;
  selectedTopBarHeadlineSimple?: string;
  selectedConfirmationMessage?: string;
  selectedRemainingTargetMessage?: string;
  selectedDiscountAppliedMessage?: string;
}

const GoalTextBlock = ({
  isActive,
  idx,
  selectedHeadline = "Buy YYY and get free gift",
  selectedTopBarHeadlineIcons = "Free gift",
  selectedTopBarHeadlineSimple = "Buy YYY to get free gift",
  selectedConfirmationMessage = "You got free gift",
  selectedRemainingTargetMessage = "%remaining% left",
  selectedDiscountAppliedMessage = "Free gift",
}: GoalTextBlockType) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [headline, setHeadline] = useState(selectedHeadline);
  const [topBarHeadlineIcons, setTopBarHeadlineIcons] = useState(
    selectedTopBarHeadlineIcons,
  );
  const [topBarHeadlineSimple, setTopBarHeadlineSimple] = useState(
    selectedTopBarHeadlineSimple,
  );
  const [confirmationMessage, setConfirmationMessage] = useState(
    selectedConfirmationMessage,
  );
  const [remainingTargetMessage, setRemainingTargetMessage] = useState(
    selectedRemainingTargetMessage,
  );
  const [discountAppliedMessage, setDiscountAppliedMessage] = useState(
    selectedDiscountAppliedMessage,
  );

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
          {
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
                  {/* Headline */}
                  <s-text-field
                    label="Headline"
                    placeholder="Example: Spend %target% For Free Express Shipping"
                    name={`goals[${idx}][headline]`}
                    value={headline}
                    onChange={(e) => setHeadline(e.currentTarget.value)}
                    readOnly={!isActive}
                  />

                  {/* Top Bar Headline (Icons Design) */}
                  <s-text-field
                    label="Top bar headline [Icons design]"
                    placeholder="Example: Free Shipping"
                    name={`goals[${idx}][topBarHeadlineIcons]`}
                    value={topBarHeadlineIcons}
                    onChange={(e) =>
                      setTopBarHeadlineIcons(e.currentTarget.value)
                    }
                    readOnly={!isActive}
                  />

                  {/* Top Bar Headline (Simple Design) */}
                  <s-text-field
                    label="Top bar headline [Simple design]"
                    placeholder="Example: Free Shipping"
                    name={`goals[${idx}][topBarHeadlineSimple]`}
                    value={topBarHeadlineSimple}
                    onChange={(e) =>
                      setTopBarHeadlineSimple(e.currentTarget.value)
                    }
                    readOnly={!isActive}
                  />

                  {/* Confirmation Message */}
                  <s-text-field
                    label="Confirmation message"
                    placeholder="You're Eligible For Free Express Shipping"
                    name={`goals[${idx}][confirmationMessage]`}
                    value={confirmationMessage}
                    onChange={(e) =>
                      setConfirmationMessage(e.currentTarget.value)
                    }
                    readOnly={!isActive}
                  />

                  {/* Remaining Target Message */}
                  <s-text-field
                    label="Remaining target message"
                    placeholder="%remaining% away"
                    name={`goals[${idx}][remainingTargetMessage]`}
                    value={remainingTargetMessage}
                    onChange={(e) =>
                      setRemainingTargetMessage(e.currentTarget.value)
                    }
                    readOnly={!isActive}
                  />

                  {/* Discount Applied Message */}
                  <s-text-field
                    label="Discount applied message"
                    placeholder="You got %discount% off for spend %target%"
                    name={`goals[${idx}][discountAppliedMessage]`}
                    value={discountAppliedMessage}
                    onChange={(e) =>
                      setDiscountAppliedMessage(e.currentTarget.value)
                    }
                    readOnly={!isActive}
                  />
                </s-stack>
              </s-box>
            </s-stack>
          }
        </s-stack>
      </s-section>
    </>
  );
};


export default GoalTextBlock;