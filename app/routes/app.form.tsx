import FormComponent from "app/components/addGoals/formExampleComponent";
import { ErrorContextProvider } from "app/context/goal-error-context";
import { GoalType } from "app/types/goals";
import { error } from "console";
import React, { useEffect, useState } from "react";

// Example goals as you provided
const exampleGoals: GoalType[] = [
  {
    id: "goal-001",
    isActive: "true",
    title: "Spend & Save",
    goalName: "Holiday Campaign",
    headline: "Buy More, Save More!",
    topBarHeadlineIcons: "🎁🔥",
    topBarHeadlineSimple: "Special Offer Inside!",
    confirmationMessage: "Discount applied at checkout!",
    remainingTargetMessage: "You're just $10 away from a discount!",
    discountAppliedMessage: "You've unlocked a 10% discount!",
    compined: "false",

    condition: "has_product",
    productsCondition: "any",
    products: [
      {
        id: "gid://shopify/Product/1234567890",
        title: "Red T-Shirt",
        vendor: "FashionBrand",
        handle: "red-t-shirt",
        variants: [],
        images: [],
      },
      {
        id: "gid://shopify/Product/0987654321",
        title: "Blue Jeans",
        vendor: "DenimCo",
        handle: "blue-jeans",
        variants: [],
        images: [],
      },
    ],

    offer: "order_discount",
    cartDiscount: "10",
  },

  {
    id: "goal-002",
    isActive: "true",
    title: "Free Shipping Goal",
    goalName: "Summer Promo",
    headline: "Free Shipping Awaits!",
    topBarHeadlineIcons: "🚚💨",
    topBarHeadlineSimple: "Free shipping goal active",
    confirmationMessage: "You've got free shipping!",
    remainingTargetMessage: "Add $15 more to get free shipping.",
    discountAppliedMessage: "Shipping cost removed!",
    compined: "false",

    condition: "cart_value",
    price: "50.00",

    offer: "free_shipping",
  },

  {
    id: "goal-003",
    isActive: "false",
    title: "Bulk Buy Bonus",
    goalName: "Winter Sale",
    headline: "Buy More Than 5!",
    topBarHeadlineIcons: "❄️🛍️",
    topBarHeadlineSimple: "Bulk purchase offer",
    confirmationMessage: "Bulk discount applied!",
    remainingTargetMessage: "Add 2 more items to get discount.",
    discountAppliedMessage: "Discount applied for bulk purchase!",
    compined: "true",

    condition: "cart_quantity",
    cartQuantity: "5",

    offer: "free_gift",
    freeGifts: [
      {
        id: "gid://shopify/Product/5555555555",
        title: "Free Mug",
        vendor: "PromoCo",
        handle: "free-mug",
        variants: [],
        images: [],
      },
    ],
  },

  {
    id: "goal-004",
    isActive: "true",
    title: "Exclusive Product Offer",
    goalName: "Flash Sale",
    headline: "Buy all select items!",
    topBarHeadlineIcons: "⚡🔥",
    topBarHeadlineSimple: "Limited time offer",
    confirmationMessage: "Discount unlocked!",
    remainingTargetMessage: "Add the last product to unlock offer!",
    discountAppliedMessage: "You saved 15%!",
    compined: "false",

    condition: "has_product",
    productsCondition: "all",
    products: [
      {
        id: "gid://shopify/Product/1111111111",
        title: "Sneakers",
        vendor: "Sporty",
        handle: "sneakers",
        variants: [],
        images: [],
      },
      {
        id: "gid://shopify/Product/2222222222",
        title: "Socks",
        vendor: "Comfort",
        handle: "socks",
        variants: [],
        images: [],
      },
    ],

    offer: "order_discount",
    cartDiscount: "15",
  },
];
const FormCreation = () => {
  const [savedGoals, setSavedGoals] = useState<GoalType[]>(exampleGoals);
  const [goals, setGoals] = useState<GoalType[]>(exampleGoals);
  const [isDirty, setIsDirty] = useState(false);
  const [hasError, setHasError] = useState<{ id: string; error: boolean }[]>(
    [],
  );

  useEffect(() => {
    setIsDirty(JSON.stringify(goals) !== JSON.stringify(savedGoals));
  }, [goals, savedGoals]);

  useEffect(() => {
    if (isDirty) {
      shopify.saveBar.show("my-save-bar");
    } else {
      shopify.saveBar.hide("my-save-bar");
    }
  }, [isDirty]);

  // Handle field changes
  const updateGoalField = (goal: GoalType) => {
    setGoals((prev) => prev.map((g) => (g.id === goal.id ? goal : g)));
  };

  // Add a new blank goal
  const addGoal = () => {
    const newGoal: GoalType = {
      id: `goal_${Date.now()}`,
      isActive: true,
      title: "",
      headline: "%remaining% more for %discount% off",
      topBarHeadlineIcons: "%discount% discount",
      topBarHeadlineSimple: "Spend %remaining% more to get %discount% off",
      confirmationMessage: "You got %discount% off",
      remainingTargetMessage: "%remaining% away",
      discountAppliedMessage: "%discount% off",
      compined: false,
      condition: "cart_value",
      price: "0",
      offer: "free_shipping",
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const handleRemove = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const handleSave = () => {
    console.log(goals);
    const isSafe =
      hasError.length === 0
        ? true
        : hasError.some((error) => error.error === true);
    if (!isSafe) {
      setSavedGoals(goals);
      setIsDirty(false);
    }
    console.log("error", hasError);
  };

  const handleDiscard = () => {
    console.log(hasError);
    setHasError([]);
    setGoals(savedGoals);
    setIsDirty(false);
  };

  return (
    <>
      <s-page>
        <s-stack gap="large">
          <s-box paddingInlineStart="small" paddingBlockStart="large">
            <s-stack alignItems="center" gap="large" direction="inline">
              <s-button
                variant="tertiary"
                type="button"
                icon="arrow-left"
                accessibilityLabel="back"
                href="/app"
              />
              <h2>Goal Configuration</h2>
            </s-stack>
          </s-box>
          {goals?.length > 0 ? (
            goals.map((goal) => (
              <React.Fragment key={goal.id}>
                <FormComponent
                  goal={goal}
                  onChange={updateGoalField}
                  onRemove={handleRemove}
                  AllGoals={goals}
                  announceError={(id: string, error: boolean) => {
                    setHasError((prev) => {
                      const updated = prev.filter((entry) => entry.id !== id);
                      return [...updated, { id, error }];
                    });
                  }}
                />
              </React.Fragment>
            ))
          ) : (
            <s-banner heading="No Goals" tone="info">
              No Goals Were Created
            </s-banner>
          )}

          <s-stack
            direction="inline"
            gap="base"
            padding="base"
            alignItems="center"
            justifyContent="center"
          >
            <s-button type="button" variant="primary" onClick={addGoal}>
              Add New Goal
            </s-button>

            {isDirty && (
              <s-button type="submit" variant="primary" onClick={handleSave}>
                Save
              </s-button>
            )}
          </s-stack>
        </s-stack>
      </s-page>

      <div id="portals">
        <ui-save-bar id="my-save-bar">
          <button onClick={handleDiscard}>Discard</button>
          <button variant="primary" onClick={handleSave}>
            Save
          </button>
        </ui-save-bar>
      </div>
    </>
  );
};

export default FormCreation;
