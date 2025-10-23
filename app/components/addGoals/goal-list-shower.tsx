import React from "react";
import { GoalType, GoalCondition, GoalOffer, Product } from "./path-to-types";

// Helper function to format the goal text
const formatGoalText = (goal: GoalType): string => {
  let conditionText = "";
  let offerText = "";

  // Check for the condition part
  if (goal.condition === "cart_value") {
    conditionText = `Cart value greater than ${goal.price ?? 0}`;
  } else if (goal.condition === "has_product") {
    conditionText = `Has product(s)`;
  } else if (goal.condition === "cart_quantity") {
    conditionText = `Buy ${goal.cartQuantity ?? 2} products`;
  }

  // Check for the offer part
  if (goal.offer === "free_shipping") {
    offerText = "➜ Get free shipping";
  } else if (goal.offer === "order_discount") {
    offerText = `➜ Get ${goal.cartDiscount ?? 0}% discount`;
  } else if (goal.offer === "free_gift") {
    offerText = `➜ Get free gift${goal.freeGifts && goal.freeGifts.length > 0 ? ` (s)` : ""}`;
  }

  // Combine the condition and offer parts
  return `(${conditionText} ${offerText})`;
};

// Component that takes the goals array and renders formatted goal text
const GoalListShower: React.FC<{ goal: GoalType }> = ({ goal }) => {
  return <>{formatGoalText(goal)}</>;
};

export default GoalListShower;
