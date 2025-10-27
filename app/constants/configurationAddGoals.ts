import { AddRewardBlockChoices } from "app/enums/addBlock";
import type { GoalType } from "app/types/goals";

// Route-specific, centralised strings and UI identifiers for the Goal
// Configuration page. These are marked `as const` where appropriate so
// callers get narrow literal types when needed.

export const AppFunctionNames = {
  discount_function: "threshold-discount",
  cart_transform: "cart-transformer",
};

export const UI = {
  saveBarId: "my-save-bar",
  portalsId: "portals",
  backHref: "/app",
} as const;

export const Labels = {
  pageTitle: "Goal Configuration",
  noGoalsHeading: "No Goals",
  noGoalsMessage: "No Goals Were Created",
  backAccessibilityLabel: "back",
  addGoalHeadingPrefix: "Goal ",
  // Re-usable smaller labels used by child components
  rewardsHeading: "Rewards",
  conditionsHeading: "Conditions",
  otherOptionsHeading: "Other Options",
  goalTextHeading: "Goal Text",
  selectGiftsButton: "Select Gift(s)",
  selectProductsButton: "Select Product(s)",
  freeShippingNoticeTitle: "Notice:",
  freeShippingInfo:
    "All of your shipping options will be free of charge when the goal is reached.",
  freeShippingInfoMore:
    "If you want to make only a specific shipping option free, you need to use your own shipping options instead - Contact us for more information.",
} as const;

export const Buttons = {
  addNewGoal: "Add New Goal",
  save: "Save",
  discard: "Discard",
} as const;

export const Toasts = {
  goalSaved: "Goal Saved",
} as const;

export const Validation = {
  discountRange: "Must be between 1 and 100",
  discountRangeDetail: "Discount must be between 1 and 100",
  selectAtLeastOneProduct: "Select at least one product.",
  priceGreaterThanZero: "Price must be greater than 0",
  quantityGreaterThanZero: "Quantity must be greater than 0",
  cannotBeEmpty: "This field cannot be empty",
} as const;

export const DefaultGoalMessages = {
  titlePrefix: "Goal #",
  headline: "%remaining% more for %discount% off",
  topBarHeadlineIcons: "%discount% discount",
  topBarHeadlineSimple: "Spend %remaining% more to get %discount% off",
  confirmationMessage: "You got %discount% off",
  remainingTargetMessage: "%remaining% away",
  discountAppliedMessage: "%discount% off",
} as const;

export function createDefaultGoal(overrides?: Partial<GoalType>): GoalType {
  const base: GoalType = {
    id: `goal_${Date.now()}`,
    title: "",
    isActive: true,
    headline: DefaultGoalMessages.headline,
    topBarHeadlineIcons: DefaultGoalMessages.topBarHeadlineIcons,
    topBarHeadlineSimple: DefaultGoalMessages.topBarHeadlineSimple,
    confirmationMessage: DefaultGoalMessages.confirmationMessage,
    remainingTargetMessage: DefaultGoalMessages.remainingTargetMessage,
    discountAppliedMessage: DefaultGoalMessages.discountAppliedMessage,
    compined: true,
    condition: "cart_value",
    price: "0",
    offer: AddRewardBlockChoices.FREE_SHIPPING
  };

  return {
    ...base,
    ...overrides,
  } as GoalType;
}

const configurationStrings = {
  UI,
  Labels,
  Buttons,
  Toasts,
  Validation,
  DefaultGoalMessages,
  createDefaultGoal,
} as const;

export default configurationStrings;
