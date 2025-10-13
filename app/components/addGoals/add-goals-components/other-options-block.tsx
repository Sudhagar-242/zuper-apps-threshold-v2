import { useState } from "react";


interface OtherOptionsBlockType {
  isActive: boolean;
  idx: number;
  isCombined: boolean;
}

const OtherOptionsBlock = ({
  isActive,
  idx,
  isCombined,
}: OtherOptionsBlockType) => {
  const [selected, setSelected] = useState(isCombined);
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
              {/* <s-select
                label="Select the icon you want to display (used in Icons design)"
                disabled={!isActive}
              >
                <s-option value="1">icon</s-option>
                <s-option value="2">icon 2</s-option>
                <s-option value="3">icoon 3</s-option>
              </s-select> */}
              <s-text>Combine this goal with your other goals</s-text>
              <input
                hidden
                name={`goals[${idx}][compined]`}
                value={JSON.stringify(selected)}
                onChange={() => {}}
              />
              <s-checkbox
                label="compine"
                accessibilityLabel="Compine"
                checked={selected}
                onChange={(e) => setSelected(e.currentTarget.checked)}
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