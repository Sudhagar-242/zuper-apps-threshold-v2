import FormComponent from "app/components/addGoals/formExampleComponent";
import { ErrorContextProvider } from "app/context/goal-error-context";
import { GoalType } from "app/types/goals";
import { error } from "console";
import React, { useEffect, useState } from "react";

const FormCreation = () => {
  const [savedGoals, setSavedGoals] = useState<GoalType[]>([]);
  const [goals, setGoals] = useState<GoalType[]>([]);
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
                {/* <FormComponent
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
                /> */}
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
