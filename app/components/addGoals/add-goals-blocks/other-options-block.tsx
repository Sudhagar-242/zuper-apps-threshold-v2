import { GoalType } from "app/types/goals";

interface OtherOptionsBlockType {
  isActive: boolean;
  isCombined: boolean;
  onChange: (field: keyof GoalType, value: unknown) => void;
}

const OtherOptionsBlock = ({
  isActive,
  isCombined,
  onChange,
}: OtherOptionsBlockType) => {
  return (
    <>
      <s-section padding="base">
        <s-stack gap="base">
          <s-heading>Other Options</s-heading>
          <s-box
            padding="base"
            border="base strong dashed"
            borderColor="strong"
            borderRadius="small"
          >
            <s-stack gap="base">
              <s-text>Combine this goal with your other goals</s-text>
              <s-checkbox
                label="compine"
                accessibilityLabel="Compine"
                checked={isCombined}
                onChange={(e) => {
                  console.log("compined", e.currentTarget.checked);
                  onChange("compined", e.currentTarget.checked);
                }}
                disabled={!isActive}
                defaultChecked={isCombined}
              ></s-checkbox>
            </s-stack>
          </s-box>
        </s-stack>
      </s-section>
    </>
  );
};

export default OtherOptionsBlock;
