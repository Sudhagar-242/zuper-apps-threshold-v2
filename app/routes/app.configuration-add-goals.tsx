import React, { useEffect, useState } from "react";
import {
  LoaderFunctionArgs,
  ActionFunctionArgs,
  useLoaderData,
  useSubmit,
} from "react-router";
import { authenticate } from "app/shopify.server";
import {
  CREATE_OR_UPDATE_METAFIELD,
  GET_GOALS_METAFIELD_QUERY,
} from "app/graphql/get-and-update-goals-metafield";
import { ensureDiscountExists } from "app/utils/create-discount-function-existance";
import { GoalType } from "app/types/goals";
import { ShopProvider } from "app/context/shop-provider-ctx";
import { Product } from "node_modules/@shopify/app-bridge-react/build/types/cjs/index.cjs";
import {
  createDefaultGoal,
  Labels as ConfigLabels,
  Toasts as ConfigToasts,
  UI as ConfigUI,
  DefaultGoalMessages,
  AppFunctionNames,
} from "app/constants/configurationAddGoals";
import GoalConfiguration from "app/components/addGoals/goal-add-block";
import { CREATE_CART_TRANSFORM_EXISTANCE } from "app/graphql/cart-transform-existance-query";

export interface loaderResponse {
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

export async function loader({ request }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(GET_GOALS_METAFIELD_QUERY);

  const createCartTransform = await admin.graphql(
    CREATE_CART_TRANSFORM_EXISTANCE,
    {
      variables: {
        functionId: "cart-transformer",
        blockOnFailure: true,
      },
    },
  );
  const data = (await response.json()).data as loaderResponse;
  const functionId = (() => {
    let id = "";
    data.shopifyFunctions.edges.forEach((edge) => {
      if (
        edge.node.app.id === data.app.id &&
        edge.node.title === AppFunctionNames.discount_function
      ) {
        id = edge.node.id;
      }
    });
    return id;
  })();
  console.log(functionId);
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
  await admin.graphql(CREATE_OR_UPDATE_METAFIELD, {
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

const FormCreation = () => {
  const Shop = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const [alreadySelectedProducts, setAlreadySelectedProducts] = useState<
    Product[]
  >([]);

  const [savedGoals, setSavedGoals] = useState<GoalType[]>(
    Shop.goals
      ? typeof Shop.goals.value === "string"
        ? JSON.parse(Shop.goals?.value)
        : Shop.goals.value
      : [],
  );
  const [goals, setGoals] = useState<GoalType[]>(
    Shop.goals
      ? typeof Shop.goals.value === "string"
        ? JSON.parse(Shop.goals?.value)
        : Shop.goals?.value
      : [],
  );
  const [isDirty, setIsDirty] = useState(false);
  const [hasError, setHasError] = useState<{ id: string; error: boolean }[]>(
    [],
  );

  useEffect(() => {
    setIsDirty(JSON.stringify(goals) !== JSON.stringify(savedGoals));
  }, [goals, savedGoals]);

  useEffect(() => {
    setAlreadySelectedProducts(goals.flatMap((goal) => goal.products ?? []));
  }, [goals]);

  console.log("loader", Shop);
  useEffect(() => {
    if (isDirty) {
      shopify.saveBar.show(ConfigUI.saveBarId);
    } else {
      shopify.saveBar.hide(ConfigUI.saveBarId);
    }
  }, [isDirty]);

  // Handle field changes
  const updateGoalField = (goal: GoalType) => {
    setGoals((prev) => prev.map((g) => (g.id === goal.id ? goal : g)));
  };

  // Add a new blank goal using the centralized factory
  const addGoal = () => {
    const newGoal = createDefaultGoal({
      title: `${DefaultGoalMessages.titlePrefix}${goals.length + 1}`,
      productsCondition: "any",
      cartDiscount: "10",
    });
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
      const formData = new FormData();
      formData.append("shopId", Shop.id);
      formData.append("goals", JSON.stringify(goals));

      // This triggers the Remix action above
      submit(formData, { method: "post" });

      setSavedGoals(goals);
      setIsDirty(false);
      shopify.toast.show(ConfigToasts.goalSaved, { duration: 1000 });
    }
    console.log("error", hasError);
  };

  const handleDiscard = () => {
    setHasError((prev) =>
      prev
        .filter((error) => savedGoals.some((g) => g.id === error.id))
        .map((error) => ({ ...error, error: false })),
    );
    setGoals(savedGoals);
    setIsDirty(false);
  };

  return (
    <>
      <ShopProvider shop={Shop}>
        <s-page>
          <s-stack gap="large">
            <s-box paddingInlineStart="small" paddingBlockStart="large">
              <s-stack alignItems="center" gap="large" direction="inline">
                <s-button
                  variant="tertiary"
                  type="button"
                  icon="arrow-left"
                  accessibilityLabel={ConfigLabels.backAccessibilityLabel}
                  href={ConfigUI.backHref}
                />
                <h2>{ConfigLabels.pageTitle}</h2>
              </s-stack>
            </s-box>
            {goals?.length > 0 ? (
              goals.map((goal) => (
                <React.Fragment key={goal.id}>
                  <GoalConfiguration
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
                    AlredyExistedProducts={alreadySelectedProducts}
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
      </ShopProvider>
    </>
  );
};

export default FormCreation;
