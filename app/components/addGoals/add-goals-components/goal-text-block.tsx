import { useEffect, useState } from "react";

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
  selectedHeadline,
  selectedTopBarHeadlineIcons,
  selectedTopBarHeadlineSimple,
  selectedConfirmationMessage,
  selectedRemainingTargetMessage,
  selectedDiscountAppliedMessage,
}: GoalTextBlockType) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [headline, setHeadline] = useState(selectedHeadline || "");
  const [topBarHeadlineIcons, setTopBarHeadlineIcons] = useState(
    selectedTopBarHeadlineIcons || "",
  );
  const [topBarHeadlineSimple, setTopBarHeadlineSimple] = useState(
    selectedTopBarHeadlineSimple || "",
  );
  const [confirmationMessage, setConfirmationMessage] = useState(
    selectedConfirmationMessage || "",
  );
  const [remainingTargetMessage, setRemainingTargetMessage] = useState(
    selectedRemainingTargetMessage || "",
  );
  const [discountAppliedMessage, setDiscountAppliedMessage] = useState(
    selectedDiscountAppliedMessage || "",
  );

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const newErrors: { [key: string]: boolean } = {};

    newErrors.headline = headline.trim() === "";
    newErrors.topBarHeadlineIcons = topBarHeadlineIcons.trim() === "";
    newErrors.topBarHeadlineSimple = topBarHeadlineSimple.trim() === "";
    newErrors.confirmationMessage = confirmationMessage.trim() === "";
    newErrors.remainingTargetMessage = remainingTargetMessage.trim() === "";
    newErrors.discountAppliedMessage = discountAppliedMessage.trim() === "";

    setErrors(newErrors);
  }, [
    headline,
    topBarHeadlineIcons,
    topBarHeadlineSimple,
    confirmationMessage,
    remainingTargetMessage,
    discountAppliedMessage,
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
                  name={`goals[${idx}][headline]`}
                  value={headline}
                  onChange={(e) => setHeadline(e.currentTarget.value)}
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
                  name={`goals[${idx}][topBarHeadlineIcons]`}
                  value={topBarHeadlineIcons}
                  onChange={(e) =>
                    setTopBarHeadlineIcons(e.currentTarget.value)
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
                  name={`goals[${idx}][topBarHeadlineSimple]`}
                  value={topBarHeadlineSimple}
                  onChange={(e) =>
                    setTopBarHeadlineSimple(e.currentTarget.value)
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
                  name={`goals[${idx}][confirmationMessage]`}
                  value={confirmationMessage}
                  onChange={(e) =>
                    setConfirmationMessage(e.currentTarget.value)
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
                  name={`goals[${idx}][remainingTargetMessage]`}
                  value={remainingTargetMessage}
                  onChange={(e) =>
                    setRemainingTargetMessage(e.currentTarget.value)
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
                  name={`goals[${idx}][discountAppliedMessage]`}
                  value={discountAppliedMessage}
                  onChange={(e) =>
                    setDiscountAppliedMessage(e.currentTarget.value)
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
                {Object.values(errors).some(Boolean) && (
                  <input hidden name="prevent_save_bar" required />
                )}
              </s-stack>
            </s-box>
          </s-stack>
        </s-stack>
      </s-section>
    </>
  );
};

export default GoalTextBlock;

// const GoalTextBlock = ({
//   isActive,
//   idx,
//   selectedHeadline,
//   selectedTopBarHeadlineIcons,
//   selectedTopBarHeadlineSimple,
//   selectedConfirmationMessage,
//   selectedRemainingTargetMessage,
//   selectedDiscountAppliedMessage,
// }: GoalTextBlockType) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [headline, setHeadline] = useState(selectedHeadline);
//   const [topBarHeadlineIcons, setTopBarHeadlineIcons] = useState(
//     selectedTopBarHeadlineIcons,
//   );
//   const [topBarHeadlineSimple, setTopBarHeadlineSimple] = useState(
//     selectedTopBarHeadlineSimple,
//     required
//   );
//   const [confirmationMessage, setConfirmationMessage] = useState(
//     selectedConfirmationMessage,
//   );
//   const [remainingTargetMessage, setRemainingTargetMessage] = useState(
//     selectedRemainingTargetMessage,
//   );
//   const [discountAppliedMessage, setDiscountAppliedMessage] = useState(
//     selectedDiscountAppliedMessage,
//   );

//   return (
//     <>
//       <s-section padding="base">
//         <s-stack
//           gap={isExpanded ? "base" : undefined}
//           justifyContent="space-evenly"
//         >
//           <s-stack direction="inline" gap="base" alignItems="center">
//             <s-heading>Goal Text</s-heading>
//             <s-button
//               variant="primary"
//               icon={isExpanded ? "minus" : "plus"}
//               onClick={() => setIsExpanded((prev) => !prev)}
//               accessibilityLabel="Expands"
//               disabled={!isActive}
//             >
//               {isExpanded
//                 ? "Hide text & translate options"
//                 : "Show text & translate options"}
//             </s-button>
//           </s-stack>
//           {
//             <s-stack
//               accessibilityVisibility={isExpanded ? "visible" : "exclusive"}
//             >
//               <s-box
//                 padding="base"
//                 border="base strong dashed"
//                 borderColor="strong"
//                 borderRadius="small"
//               >
//                 <s-stack justifyContent="space-between" gap="base">
//                   <s-box>
//                     <p>
//                       This is your default (main) language:{" "}
//                       <strong>English</strong>
//                     </p>
//                   </s-box>
//                   {/* Headline */}
//                   <s-text-field
//                     label="Headline"
//                     placeholder="Example: Spend %target% For Free Express Shipping"
//                     name={`goals[${idx}][headline]`}
//                     value={headline}
//                     onChange={(e) => setHeadline(e.currentTarget.value)}
//                     readOnly={!isActive}
//                     required
//                   />

//                   {/* Top Bar Headline (Icons Design) */}
//                   <s-text-field
//                     label="Top bar headline [Icons design]"
//                     placeholder="Example: Free Shipping"
//                     name={`goals[${idx}][topBarHeadlineIcons]`}
//                     value={topBarHeadlineIcons}
//                     onChange={(e) =>
//                       setTopBarHeadlineIcons(e.currentTarget.value)
//                     }
//                     readOnly={!isActive}
//                     required
//                   />

//                   {/* Top Bar Headline (Simple Design) */}
//                   <s-text-field
//                     label="Top bar headline [Simple design]"
//                     placeholder="Example: Free Shipping"
//                     name={`goals[${idx}][topBarHeadlineSimple]`}
//                     value={topBarHeadlineSimple}
//                     onChange={(e) =>
//                       setTopBarHeadlineSimple(e.currentTarget.value)
//                     }
//                     readOnly={!isActive}
//                     required
//                   />

//                   {/* Confirmation Message */}
//                   <s-text-field
//                     label="Confirmation message"
//                     placeholder="You're Eligible For Free Express Shipping"
//                     name={`goals[${idx}][confirmationMessage]`}
//                     value={confirmationMessage}
//                     onChange={(e) =>
//                       setConfirmationMessage(e.currentTarget.value)
//                     }
//                     readOnly={!isActive}
//                     required
//                   />

//                   {/* Remaining Target Message */}
//                   <s-text-field
//                     label="Remaining target message"
//                     placeholder="%remaining% away"
//                     name={`goals[${idx}][remainingTargetMessage]`}
//                     value={remainingTargetMessage}
//                     onChange={(e) =>
//                       setRemainingTargetMessage(e.currentTarget.value)
//                     }
//                     readOnly={!isActive}
//                     required
//                   />

//                   {/* Discount Applied Message */}
//                   <s-text-field
//                     label="Discount applied message"
//                     placeholder="You got %discount% off for spend %target%"
//                     name={`goals[${idx}][discountAppliedMessage]`}
//                     value={discountAppliedMessage}
//                     onChange={(e) =>
//                       setDiscountAppliedMessage(e.currentTarget.value)
//                     }
//                     readOnly={!isActive}
//                     required
//                   />
//                 </s-stack>
//               </s-box>
//             </s-stack>
//           }
//         </s-stack>
//       </s-section>
//     </>
//   );
// };

// export default GoalTextBlock;
