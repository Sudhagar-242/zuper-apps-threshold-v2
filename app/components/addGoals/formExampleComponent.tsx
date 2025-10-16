// import { SetStateAction, useEffect, useRef, useState } from "react";
// import {
//   AddConditionBlockChoices,
//   AddRewardBlockChoices,
// } from "../../enums/addBlock";

// import type { GoalType } from "app/types/goals";
// import ConditionBlock from "./add-goals-components/condition-block";
// import GoalTextBlock from "./add-goals-components/goal-text-block";
// import OtherOptionsBlock from "./add-goals-components/other-options-block";
// import RewardBlocK from "./add-goals-components/rewards-block";

// export const ArrowPlacer = ({
//   place,
// }: {
//   place: "start" | "center" | "end";
// }) => (
//   <s-stack paddingBlock="small-200 small-400" justifyContent={place}>
//     <s-text>➜ </s-text>
//   </s-stack>
// );

// type AddGoalBlockProps = {
//   idx: number;
//   id: string;
//   onRemove: (id: string) => void;
//   goal: GoalType;
//   isActiveGoal: boolean;
//   onChange?: () => void;
// };

// const AddGoalBlock = ({
//   idx,
//   id,
//   onRemove,
//   goal,
//   isActiveGoal = true,
//   onChange = () => {},
// }: AddGoalBlockProps) => {
//   const [isActive, setIsActive] = useState<boolean>(
//     typeof isActiveGoal === "string" ? JSON.parse(isActiveGoal) : isActiveGoal,
//   );
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [goalName, setGoalName] = useState<string>(goal.goalName ?? "");

//   const [selectedProducts, setSelectedProducts] = useState(
//     (typeof goal.Products === "string"
//       ? JSON.parse(goal.Products)
//       : goal.Products) ?? null,
//   );

//   const [selectedGifts, setSelectedGifts] = useState(
//     (typeof goal.freeGifts === "string"
//       ? JSON.parse(goal.freeGifts)
//       : goal.freeGifts) ?? null,
//   );

//   const [_, setAnyChanges] = useState(false);

//   const handleOnChange = () => {
//     setAnyChanges((prev) => !prev);
//     setSelectedProducts(
//       (typeof goal.Products === "string"
//         ? JSON.parse(goal.Products)
//         : goal.Products) ?? null,
//     );
//     setSelectedGifts(
//       (typeof goal.freeGifts === "string"
//         ? JSON.parse(goal.freeGifts)
//         : goal.freeGifts) ?? null,
//     );
//     console.log("handle on change");
//     onChange();
//   };
//   return (
//     <>
//       <s-section accessibilityLabel="Goal Block">
//         <s-stack gap={isExpanded ? "base base" : undefined}>
//           <s-stack direction="inline" justifyContent="space-between">
//             <s-stack
//               direction="inline"
//               alignItems="center"
//               alignContent="start"
//               gap="large"
//             >
//               <input
//                 hidden
//                 name={`goals[${idx}][isActive]`}
//                 value={isActive ? "true" : "false"}
//                 onChange={() => {}}
//               />
//               <s-switch
//                 checked={isActive}
//                 onChange={(e) => {
//                   setIsActive(e.currentTarget.checked);
//                 }}
//                 accessibilityLabel="isActive"
//                 defaultChecked={isActive}
//               ></s-switch>
//               <s-stack alignContent="start">
//                 <input
//                   hidden
//                   type="text"
//                   name={`goals[${idx}][title]`}
//                   value={`Goal ${idx + 1}`}
//                   placeholder="Enter goal title"
//                   onChange={() => {}}
//                 />
//                 <s-heading>Goal {idx + 1}</s-heading>
//                 <InlineEditableText
//                   index={idx}
//                   value={goalName}
//                   onSave={setGoalName}
//                 />
//               </s-stack>
//             </s-stack>
//             <s-button
//               icon={isExpanded ? "caret-up" : "caret-down"}
//               variant="tertiary"
//               accessibilityLabel="Expands"
//               onClick={() => {
//                 setIsExpanded((prev) => !prev);
//               }}
//             />
//           </s-stack>
//           {
//             <>
//               <s-stack
//                 accessibilityVisibility={isExpanded ? "visible" : "exclusive"}
//                 gap="base"
//               >
//                 <s-divider color="base" />
//                 <ConditionBlock
//                   isActive={isActive}
//                   selectedProducts={selectedProducts}
//                   setSelectedProducts={setSelectedProducts}
//                   idx={idx}
//                   selectedChoice={goal.condition as AddConditionBlockChoices}
//                   selectedProductCondition={goal.productsCondition ?? "any"}
//                   selectedQuantity={goal.cartQuantity ?? "2"}
//                   price={goal.price ?? "100"}
//                   onChange={handleOnChange}
//                 />
//                 <s-divider />
//                 <RewardBlocK
//                   isActive={isActive}
//                   selectedGifts={selectedGifts}
//                   idx={idx}
//                   selectedOfferPercentage={goal.cartDiscount ?? "10"}
//                   selectedRewardChoice={
//                     (goal.offer as AddRewardBlockChoices) ??
//                     AddRewardBlockChoices.FREE_SHIPPING
//                   }
//                   onChange={onChange}
//                 />
//                 <s-divider />
//                 <GoalTextBlock
//                   isActive={isActive}
//                   idx={idx}
//                   selectedHeadline={goal.headline}
//                   selectedTopBarHeadlineIcons={goal.topBarHeadlineIcons}
//                   selectedTopBarHeadlineSimple={goal.topBarHeadlineSimple}
//                   selectedConfirmationMessage={goal.confirmationMessage}
//                   selectedRemainingTargetMessage={goal.remainingTargetMessage}
//                   selectedDiscountAppliedMessage={goal.discountAppliedMessage}
//                 />

//                 <s-divider />
//                 <OtherOptionsBlock
//                   isActive={isActive}
//                   idx={idx}
//                   isCombined={
//                     typeof goal.compined === "string"
//                       ? JSON.parse(goal.compined)
//                       : goal.compined
//                   }
//                 />
//                 <s-divider />
//                 <s-box>
//                   <s-section>
//                     <s-stack direction="inline" justifyContent="space-between">
//                       <s-link
//                         target="_blank"
//                         tone="neutral"
//                         onClick={() => setIsExpanded(false)}
//                       >
//                         Close
//                       </s-link>
//                       <s-link
//                         target="_blank"
//                         tone="critical"
//                         onClick={() => {
//                           onChange();
//                           onRemove(id);
//                         }}
//                       >
//                         Remove
//                       </s-link>
//                     </s-stack>
//                   </s-section>
//                 </s-box>
//               </s-stack>
//             </>
//           }
//         </s-stack>
//       </s-section>
//     </>
//   );
// };

// export default AddGoalBlock;

// interface InlineEditableTextProps {
//   value: string;
//   onSave: React.Dispatch<SetStateAction<string>>;
//   index: number;
// }

// export const InlineEditableText = ({
//   value,
//   onSave,
//   index,
// }: InlineEditableTextProps) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [inputValue, setInputValue] = useState(value);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Focus input automatically when entering edit mode
//   useEffect(() => {
//     if (isEditing && inputRef.current) {
//       inputRef.current.focus();
//       inputRef.current.select();
//     }
//   }, [isEditing]);

//   const handleDoubleClick = () => {
//     setIsEditing(true);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value);
//   };

//   const handleBlur = () => {
//     if (isEditing) {
//       setIsEditing(false);
//       if (inputValue.trim() !== value) {
//         onSave(inputValue.trim());
//       }
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       setIsEditing(false);
//       onSave(inputValue.trim());
//     }
//     if (e.key === "Escape") {
//       setIsEditing(false);
//       setInputValue(value); // reset to original
//     }
//   };

//   return (
//     <>
//       <input
//         ref={inputRef}
//         type="text"
//         name={`goals[${index}][goalName]`}
//         value={inputValue}
//         readOnly={!isEditing}
//         onDoubleClick={handleDoubleClick}
//         onChange={handleChange}
//         onBlur={handleBlur}
//         onKeyDown={handleKeyDown}
//         style={{
//           border: isEditing ? "1px solid #ccc" : "1px solid transparent",
//           background: isEditing ? "#fff" : "transparent",
//           cursor: isEditing ? "text" : "pointer",
//           padding: "4px 6px",
//           borderRadius: "4px",
//           fontSize: "14px",
//           outline: "none",
//           width: "100%",
//         }}
//       />
//     </>
//   );
// };

// import { GoalType } from 'app/types/goals';
// import React, { useState } from 'react'

// interface props{
//   goal: GoalType,
//   onChange: any
// }

// const FormComponent = ({ goal: selectedGoal, onChange }: props) => {
//   const [goal, setGoal] = useState(selectedGoal);

//   return (

//   )
// }

// export default FormComponent;

import { GoalType } from "app/types/goals";
import ConditionBlock from "./add-goals-components/condition-block";
import RewardBlocK from "./add-goals-components/rewards-block";
import GoalTextBlock from "./add-goals-components/goal-text-block";
import { useState, useEffect } from "react";
import {
  AddConditionBlockChoices,
  AddRewardBlockChoices,
} from "app/enums/addBlock";
import OtherOptionsBlock from "./add-goals-components/other-options-block";

interface Props {
  goal: GoalType;
  onChange: (updatedGoal: GoalType) => void;
  onRemove: (id: string) => void;
  AllGoals: GoalType[];
  announceError: (id: string, error: boolean) => void;
}

interface ValidationResult {
  hasError: boolean;
  errors: {
    price?: string;
    discount?: string;
    gifts?: string;
    products?: string;
    quantity?: string;
    general: string;
    [key: string]: string | undefined;
  };
}

const FormComponent = ({
  goal: selectedGoal,
  onChange,
  onRemove,
  AllGoals,
  announceError,
}: Props) => {
  const [goal, setGoal] = useState<GoalType>(selectedGoal);
  const [isExpanded, setIsExpanded] = useState(true);
  const [validationErrors, setValidationErrors] = useState<
    ValidationResult["errors"]
  >({} as ValidationResult["errors"]);

  const handleValidateError = () => {
    const { hasError, errors } = validateGoal(goal, AllGoals);
    console.log(errors);
    setValidationErrors(errors);
    announceError(goal.id, hasError);
    console.log("Error occure resolve it to Save");
  };

  const validateGoal = (
    goal: GoalType,
    allGoals: GoalType[],
  ): ValidationResult => {
    const errors: ValidationResult["errors"] = {} as ValidationResult["errors"];
    let hasError = false;

    const currentId = goal.id;

    const isSameProductSet = (a: any[], b: any[]) => {
      if (a?.length !== b?.length) return false;
      const idsA = a.map((p) => p.id).sort();
      const idsB = b.map((p) => p.id).sort();
      return idsA.every((id, idx) => id === idsB[idx]);
    };

    const isExactDuplicate = allGoals.some((g) => {
      if (g.id === currentId) return false;

      const sameCondition = g.condition === goal.condition;
      const sameOffer = g.offer === goal.offer;
      const samePrice = Number(g.price ?? 0) === Number(goal.price ?? 0);
      const sameQuantity =
        Number(g.cartQuantity ?? 0) === Number(goal.cartQuantity ?? 0);
      const sameDiscount =
        Number(g.cartDiscount ?? 0) === Number(goal.cartDiscount ?? 0);
      const sameProducts = isSameProductSet(
        g.products ?? [],
        goal.products ?? [],
      );

      switch (goal.condition) {
        case AddConditionBlockChoices.CART_VALUE:
          return sameCondition && samePrice && sameOffer && sameDiscount;

        case AddConditionBlockChoices.CART_QUANTITY:
          return sameCondition && sameQuantity && sameOffer && sameDiscount;

        case AddConditionBlockChoices.CART_HAS_PRODUCTS:
          return sameCondition && sameProducts && sameOffer && sameDiscount;

        default:
          return false;
      }
    });

    if (isExactDuplicate) {
      errors.general =
        "A goal with the same condition and reward already exists.";
      shopify.toast.show(errors.general, { duration: 1000, isError: true });
      hasError = true;
    }

    const stringFieldsToCheck = [
      "headline",
      "topBarHeadlineIcons",
      "topBarHeadlineSimple",
      "confirmationMessage",
      "remainingTargetMessage",
      "discountAppliedMessage",
    ] as const;

    stringFieldsToCheck.forEach((field) => {
      if (!goal[field] || goal[field].trim() === "") {
        errors[field] = `${field} cannot be empty.`;
        hasError = true;
      }
    });

    switch (goal.condition) {
      case AddConditionBlockChoices.CART_VALUE: {
        const currentPrice = Number(goal.price ?? 0);

        const isDuplicate = allGoals.some(
          (g) => g.id !== goal.id && Number(g.price) === currentPrice,
        );
        if (!currentPrice || currentPrice <= 0) {
          errors.price = "Price must be greater than 0.";
          hasError = true;
        }
        if (isDuplicate) {
          errors.price = "Price must be unique across all goals.";
          hasError = true;
        }
        break;
      }

      case AddConditionBlockChoices.CART_HAS_PRODUCTS: {
        if (!goal.products || goal.products?.length === 0) {
          errors.products = "Select at least 1 product";
          hasError = true;
        }
        break;
      }

      case AddConditionBlockChoices.CART_QUANTITY: {
        if (Number(goal.cartQuantity) < 0) {
          errors.quantity = "Quantity must be greater than 0";
          hasError = true;
        }
        break;
      }

      default:
        break;
    }

    switch (goal.offer) {
      case AddRewardBlockChoices.FREE_SHIPPING: {
        break;
      }

      case AddRewardBlockChoices.ORDER_DISCOUNT: {
        if (
          goal.cartDiscount &&
          goal.cartDiscount.length === 0 &&
          Number(goal.cartDiscount) < 0 &&
          Number(goal.cartDiscount) > 100
        ) {
          errors.discount = "Enter Correct Discount Percentage";
          hasError = true;
        }
        break;
      }

      case AddRewardBlockChoices.FREE_GIFT: {
        if (!goal.freeGifts || goal.freeGifts?.length === 0) {
          errors.gifts = "Select at least 1 gift";
          hasError = true;
        }
        break;
      }

      default:
        break;
    }

    // if (goal.offer === AddRewardBlockChoices.ORDER_DISCOUNT) {
    //   const currentPrice = Number(goal.price ?? 0);
    //   const currentDiscount = Number(goal.cartDiscount ?? 0);

    //   if (!currentPrice || currentPrice <= 0) {
    //     errors.price = "Price must be greater than 0.";
    //     hasError = true;
    //   }

    //   if (!currentDiscount || currentDiscount <= 0) {
    //     errors.cartDiscount = "Discount must be greater than 0.";
    //     hasError = true;
    //   }

    //   // Only check discounts of previous goals in the list
    //   const currentIndex = allGoals.findIndex((g) => g.id === goal.id);

    //   const previousGoals = allGoals.slice(0, currentIndex).filter((g) => {
    //     return (
    //       g.offer === AddRewardBlockChoices.ORDER_DISCOUNT &&
    //       Number(g.price) < currentPrice
    //     );
    //   });

    //   for (const prevGoal of previousGoals) {
    //     const prevDiscount = Number(prevGoal.cartDiscount ?? 0);

    //     if (currentDiscount <= prevDiscount) {
    //       errors.cartDiscount = `Discount (${currentDiscount}%) must be greater than previous discount (${prevDiscount}%) for lower price tier ($${prevGoal.price}).`;
    //       hasError = true;
    //       break;
    //     }
    //   }
    // }

    return { hasError, errors };
  };

  // If parent passes a new goal prop, sync local state
  useEffect(() => {
    handleValidateError();
    setGoal(selectedGoal);
  }, [selectedGoal]);

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
                checked={JSON.parse(goal.isActive)}
                onChange={(e) => {
                  handleInputChange(
                    "isActive",
                    e.currentTarget.checked.toString() as "true" | "false",
                  );
                }}
                accessibilityLabel="isActive"
                defaultChecked={JSON.parse(goal.isActive)}
              ></s-switch>
              <s-stack alignContent="start">
                <s-heading>Goal {goal.id + 1}</s-heading>
                <s-text>
                  spend {goal.price} to get {goal.condition}
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
                  quantity: undefined,
                  products: validationErrors.products,
                }}
                onChange={handleInputChange}
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

              <s-divider />

              <OtherOptionsBlock
                isActive={goal.isActive}
                isCombined={goal.compined}
                onChange={handleInputChange}
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
                        handleRemove(goal.id);
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

export default FormComponent;
