import React, { useCallback, useEffect, useRef, useState } from "react";
import AddGoalBlock from "app/components/addGoals/goal-add-block";
import { GoalType } from "app/types/goals";
import {
  LoaderFunctionArgs,
  useLoaderData,
  ActionFunctionArgs,
  useSubmit,
} from "react-router";
import { authenticate } from "app/shopify.server";
import {
  CREATE_OR_UPDATE_METAFIELD,
  GET_GOALS_METAFIELD_QUERY,
} from "app/graphql/get-and-update-goals-metafield";
import { ensureDiscountExists } from "app/utils/create-discount-function-existance";
import { FormSaveBarStatusProvider } from "app/context/form-save-bar-status";

interface loaderResponse {
  shop: {
    id: string;
    name: string;
    url: string;
    currencyCode: string;
    goals: Record<string, unknown> | null;
    discountId: string | null;
  };
  app: {
    id: string;
    title: string;
    apiKey: string;
  };
  shopifyFunctions: {
    edges: Array<{
      node: {
        id: string;
        app: {
          id: string;
          title: string;
        };
      };
    }>;
  };
}

const createEmptyGoal: GoalType = {
  id: crypto.randomUUID(),
  title: "",
  goalName: "Discount",
  isActive: "true",
  condition: "cart_value",
  price: "1",
  offer: "free_shipping",
  headline: "Buy YYY and get free gift",
  topBarHeadlineIcons: "Free gift",
  topBarHeadlineSimple: "Buy YYY to get free gift",
  confirmationMessage: "You got free gift",
  remainingTargetMessage: `%remaining% left`,
  discountAppliedMessage: "Free gift",
  compined: "true",
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(GET_GOALS_METAFIELD_QUERY);
  const data = (await response.json()).data as loaderResponse;
  const functionId = (() => {
    let id = "";
    data.shopifyFunctions.edges.forEach((edge) => {
      if (edge.node.app.id === data.app.id) {
        id = edge.node.id;
      }
    });
    return id;
  })();
  await ensureDiscountExists(
    admin,
    data.shop.discountId,
    data.shop.id,
    functionId,
  );
  return await data.shop;
}

export async function action({ request }: ActionFunctionArgs) {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const response = await admin.graphql(CREATE_OR_UPDATE_METAFIELD, {
    variables: {
      ownerId: formData.get("shopId"),
      namespace: "zuper_threshold",
      key: "goals",
      type: "json",
      value: formData.get("goals"),
    },
  });

  return null;
}

const parseGoalsFromForm = (formData: FormData) => {
  const parsed = [];

  for (const [key, value] of formData.entries()) {
    const match = key.match(/^goals\[(\d+)]\[(.+)]$/);
    if (!match) continue;

    const index = Number(match[1]);
    const field = match[2];

    if (!parsed[index]) parsed[index] = {};
    parsed[index][field] = value.toString();
  }

  return parsed;
};

export default function GoalTab() {
  const { id: shopId, goals: goalsMetafield } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  // Last saved state of goals
  const [savedGoals, setSavedGoals] = useState(
    JSON.parse(goalsMetafield?.value as string),
  );
  // goals used for rendering; changes live here
  const [goals, setGoals] = useState<GoalType[]>(savedGoals);
  const [UnSavedChanges, setUnSavedChanges] = useState(false);

  const [savedOrNot, setSavedOrNot] = useState(true);
  const [preventSaveBar, setPreventSaveBar] = useState(false);

  const [validationErrors, setValidationErrors] = useState<
    { index: number; message: string }[]
  >([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const formRef = useRef(null);
  console.log(formRef);

  useEffect(() => {
    if (UnSavedChanges) {
      triggerChange();
    }
  }, [goals, UnSavedChanges]);

  const triggerChange = () => {
    if (inputRef.current) {
      inputRef.current.value = JSON.stringify(Math.random());
      inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    }
  };

  // Add new empty input group
  const handleAdd = () => {
    if (!AnyDuplicate(goals, createEmptyGoal)) {
      setGoals((prev) => [...prev, createEmptyGoal]);
      setUnSavedChanges(true);
      return null;
    }
    shopify.toast.show("No Duplicaes Are Allowed", {
      isError: true,
      duration: 1200,
    });
    return null;
  };

  // Remove input group by index
  const handleRemove = (index: number) => {
    setGoals((prev) => prev.filter((_, i) => i !== index));
    setUnSavedChanges(true);
  };

  // Save: update savedGoals and goals state
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const parsedData = parseGoalsFromForm(formData) as GoalType[];

    const { isValid, validGoals, errors } = validateAndCleanGoals(goals);
    console.log({ isValid, validGoals, errors });

    if (!AnyDuplicate(goals, createEmptyGoal)) {
      submit({ goals: JSON.stringify(parsedData), shopId }, { method: "POST" });
      setSavedGoals(parsedData);
      setGoals(parsedData);
      setUnSavedChanges(false);
      setSavedOrNot(true);
      setPreventSaveBar(false);
      shopify.toast.show("Saved data");
      return null;
    }
    shopify.toast.show("No Duplicaes Are Allowed", {
      isError: true,
      duration: 1200,
    });
  };

  // Discard: reset goals to last savedGoals on form reset
  const handleDiscard = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("discarded");
    setGoals(savedGoals);
    setUnSavedChanges(false);
    setSavedOrNot(false);
    shopify.toast.show("Changes discarded, reverted to last saved state.");
  };
  return (
    <FormSaveBarStatusProvider
      savedOrNot={savedOrNot}
      setSavedOrNot={setSavedOrNot}
    >
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
          <form
            data-save-bar
            data-discard-confirmation
            onSubmit={handleSubmit}
            onReset={handleDiscard}
            ref={formRef}
          >
            <input
              hidden
              ref={inputRef}
              name="update_save-bar"
              value={String(Boolean)}
              onChange={() => {}}
            />
            {preventSaveBar && (
              <input
                type="hidden"
                aria-hidden
                name="prevent_save-bar"
                onChange={() => {}}
                required
              />
            )}
            <s-page>
              {goals?.length > 0 ? (
                goals.map((goal, index) => (
                  <AddGoalBlock
                    key={`goal-${index}`}
                    id={`goal-${index}`}
                    idx={index}
                    goal={goal}
                    isActiveGoal={goal.isActive === "true"}
                    onChange={() => setUnSavedChanges(true)}
                    onRemove={() => handleRemove(index)}
                  />
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
                <s-button type="button" variant="primary" onClick={handleAdd}>
                  Add New Goal
                </s-button>

                {UnSavedChanges && (
                  <s-button type="submit" variant="primary">
                    Save
                  </s-button>
                )}
              </s-stack>
            </s-page>
          </form>
        </s-stack>
      </s-page>
    </FormSaveBarStatusProvider>
  );
}

type ValidationResult = {
  isValid: boolean;
  validGoals: GoalType[];
  errors: Array<{ index: number; message: string }>;
};

function validateAndCleanGoals(goals: GoalType[]): ValidationResult {
  const validGoals: GoalType[] = [];
  const errors: Array<{ index: number; message: string }> = [];

  return {
    isValid: errors.length === 0,
    validGoals,
    errors,
  };
}

const AnyDuplicate = (goals: GoalType[], NewGoal: GoalType): boolean => {
  for (const goal of goals) {
    // if (goal.title === NewGoal.title) {
    //   return true;
    // }

    switch (goal.condition) {
      case "cart_value":
        if (goal.price === NewGoal.price) {
          return true;
        }
        break;
      case "cart_quantity":
        if (goal.cartQuantity === NewGoal.cartQuantity) {
          return true;
        }
        break;
      default:
        // no condition match, continue checking other goals
        break;
    }

    switch (goal.offer) {
      case "order_discount":
        if (goal.cartDiscount === NewGoal.cartDiscount) {
          return true;
        }
        break;
      default:
        // no offer match, continue checking other goals
        break;
    }
  }
  return false; // no duplicates found
};
