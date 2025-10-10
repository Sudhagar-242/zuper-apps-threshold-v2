// import AddGoalBlock from "app/components/addGoals/goal-add-block";
// import React, { useState } from "react";

// // export default function GoalTab() {
// //   const [goalIndexes, setGoalIndexes] = useState<number[]>([0]);

// //   const generateStaticId = (index: number) => `goal-${index}`;

// //   const handleAddGoal = () => {
// //     setGoalIndexes((prev) => [
// //       ...prev,
// //       prev.length ? Math.max(...prev) + 1 : 0,
// //     ]);
// //     shopify.saveBar.show("Configuration");
// //   };

// //   const handleRemoveGoal = (indexToRemove: number) => {
// //     setGoalIndexes((prev) => prev.filter((idx) => idx !== indexToRemove));
// //   };

// //   const handleFormSubmit = (event: React.FormEvent) => {
// //     event.preventDefault();
// //     const formData = new FormData(event.target);
// //     const formEntries = Object.fromEntries(formData);
// //     console.log("Form data", formEntries);
// //   };

// //   const handleFormReset = () => {
// //     setGoalIndexes([0]);
// //   };

// //   return (
// //     <form
// //       id="Configuration"
// //       data-save-bar
// //       data-discard-confirmation
// //       onSubmit={handleFormSubmit}
// //       onReset={handleFormReset}
// //     >
// //       <ui-save-bar id="my-save-bar">
// //         <button variant="primary" id="save-button"></button>
// //         <button id="discard-button"></button>
// //       </ui-save-bar>

// //       {/* Hidden input to track dynamic changes */}
// //       <input type="hidden" name="__goals_count__" value={goalIndexes.length} />

// //       <s-page>
// //         {goalIndexes.map((idx) => {
// //           const id = generateStaticId(idx);
// //           return (
// //             <AddGoalBlock
// //               key={id}
// //               id={id}
// //               index={idx}
// //               onRemove={() => handleRemoveGoal(idx)}
// //             />
// //           );
// //         })}

// //         <s-button onClick={handleAddGoal}>Add Goal</s-button>

// //         <s-box slot="aside">
// //           <s-paragraph>Hello There</s-paragraph>
// //         </s-box>
// //       </s-page>
// //     </form>
// //   );
// // }

// export default function GoalTab() {
//   const [goalIndexes, setGoalIndexes] = useState([0]);
//   const [dirty, setDirty] = useState(false);

//   const generateStaticId = (index) => `goal-${index}`;

//   const handleAddGoal = (e) => {
//     e.preventDefault();
//     setGoalIndexes((prev) => [
//       ...prev,
//       prev.length ? Math.max(...prev) + 1 : 0,
//     ]);
//     setDirty(true); // Mark form as dirty to trigger save bar
//   };

//   const handleRemoveGoal = (indexToRemove) => {
//     setGoalIndexes((prev) => prev.filter((idx) => idx !== indexToRemove));
//     setDirty(true); // Mark form as dirty to trigger save bar
//   };

//   const handleFormSubmit = (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     // Parse FormData into an array of goals
//     const goals = [];
//     for (let [key, value] of formData.entries()) {
//       const match = key.match(/^goals\[(\d+)\]\[(.+)\]$/);
//       if (match) {
//         const idx = Number(match[1]);
//         const field = match[2];
//         if (!goals[idx]) goals[idx] = {};
//         goals[idx][field] = value;
//       }
//     }
//     // Remove empty slots if any
//     const goalsArray = goals.filter(Boolean);
//     console.log("Goals array", goalsArray);
//     setDirty(false); // Reset dirty state after save
//     // ...submit to backend or further processing
//   };

//   const handleFormReset = () => {
//     setGoalIndexes([0]);
//     setDirty(false);
//   };

//   return (
//     <form
//       id="Configuration"
//       data-save-bar
//       data-discard-confirmation
//       onSubmit={handleFormSubmit}
//       onReset={handleFormReset}
//     >
//       {/* Hidden input to trigger save bar when dirty */}
//       <input type="hidden" name="__dirty__" value={dirty ? "1" : ""} />
//       <input type="hidden" name="__goals_count__" value={goalIndexes.length} />

//       <s-page>
//         {goalIndexes.map((idx, i) => {
//           const id = generateStaticId(idx);
//           return (
//             <AddGoalBlock
//               key={id}
//               id={id}
//               index={i}
//               onRemove={() => handleRemoveGoal(idx)}
//             />
//           );
//         })}

//         <s-button type="button" onClick={handleAddGoal}>
//           Add Goal
//         </s-button>

//         <s-box slot="aside">
//           <s-paragraph>Hello There</s-paragraph>
//         </s-box>

//         <s-button type="submit">Save</s-button>
//         <s-button type="reset" variant="secondary">
//           Reset
//         </s-button>
//       </s-page>
//     </form>
//   );
// }

// import AddGoalBlock from "app/components/addGoals/goal-add-block";
// import React, { useState } from "react";

// export default function GoalTab() {
//   const [goalIndexes, setGoalIndexes] = useState([0]);
//   const [dirtyCount, setDirtyCount] = useState(true);

//   const generateStaticId = (index) => `goal-${index}`;

//   const handleAddGoal = (e) => {
//     e.preventDefault();
//     setGoalIndexes((prev) => [
//       ...prev,
//       prev.length ? Math.max(...prev) + 1 : 0,
//     ]);
//     setDirtyCount(true); // Mark form as dirty to trigger save bar
//   };

//   const handleRemoveGoal = (indexToRemove) => {
//     setGoalIndexes((prev) => prev.filter((idx) => idx !== indexToRemove));
//     setDirtyCount(false); // Mark form as dirty to trigger save bar
//   };

//   const handleFormSubmit = (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     const formEntries = Object.fromEntries(formData);
//     console.log("Form data", formEntries);
//     // Parse FormData into an array of goals
//     const goals = [];
//     for (let [key, value] of formData.entries()) {
//       const match = key.match(/^goals\[(\d+)\]\[(.+)\]$/);
//       if (match) {
//         const idx = Number(match[1]);
//         const field = match[2];
//         if (!goals[idx]) goals[idx] = {};
//         goals[idx][field] = value;
//       }
//     }
//     // Remove empty slots if any
//     const goalsArray = goals.filter(Boolean);
//     console.log("Goals array", goalsArray);
//     setDirtyCount(false); // Reset dirty state after save
//     // ...submit to backend or further processing
//   };

//   const handleFormReset = () => {
//     console.log("Handle discarded changes if necessary");
//     setDirtyCount(false);
//   };

//   return (
//     <form
//       id="Configuration"
//       data-save-bar
//       data-discard-confirmation
//       onSubmit={handleFormSubmit}
//       onReset={handleFormReset}
//     >
//       {/* Hidden input to trigger save bar when dirty */}
//       <input type="hidden" name="__dirty__" value={JSON.stringify(dirtyCount)} />
//       <input type="hidden" name="__goals_count__" value={goalIndexes.length} />

//       <s-page>
//         {goalIndexes.map((idx, i) => {
//           const id = generateStaticId(idx);
//           return (
//             <AddGoalBlock
//               key={id}
//               id={id}
//               idx={i}
//               onRemove={() => handleRemoveGoal(idx)}
//             />
//           );
//         })}

//         <s-stack direction="inline" gap="base" alignItems="center">
//           <s-button type="button" onClick={handleAddGoal}>
//             Add Goal
//           </s-button>
//           {dirtyCount && (
//             <s-button type="submit" variant="primary">
//               Save
//             </s-button>
//           )}
//         </s-stack>

//         <s-box slot="aside">
//           <s-paragraph>Hello There</s-paragraph>
//         </s-box>
//       </s-page>
//     </form>
//   );
// }

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

interface loaderResponse {
  shop: {
    id: string;
    name: string;
    url: string;
    currencyCode: string;
    goals: any | null; // Adjust this based on actual structure of `goals` metafield
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
  const response = await admin.graphql(CREATE_OR_UPDATE_METAFIELD, {
    variables: {
      ownerId: formData.get("shopId"),
      namespace: "zuper_threshold",
      key: "goals",
      type: "json",
      value: formData.get("goals"),
    },
  });
  console.log(response);
  // console.log(response.json());

  return null;
}

export default function GoalTab() {
  const { id: shopId, goals: goalsMetafield } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const [goals, setGoals] = useState<GoalType[]>(
    JSON.parse(goalsMetafield.value),
  );
  const [lastSavedGoals, setLastSavedGoals] = useState<GoalType[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  console.log(goals);

  // Notify Shopify save bar
  useEffect(() => {
    if (inputRef.current && hasUnsavedChanges) {
      inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }, [hasUnsavedChanges]);

  // Util: Create a default goal
  const createEmptyGoal = (): Partial<GoalType> => ({
    isActive: "true",
    condition: "cart_value",
    offer: "free_shipping",
    compined: "true",
  });

  // Parse FormData into GoalType[]
  const parseGoalsFromForm = (formData: FormData): GoalType[] => {
    const parsed: Record<number, Partial<GoalType>> = {};

    for (const [key, value] of formData.entries()) {
      const match = key.match(/^goals\[(\d+)]\[(.+)]$/);
      if (match) {
        const index = Number(match[1]);
        const field = match[2];
        if (!parsed[index]) parsed[index] = {};
        parsed[index][field] = value.toString();
      }
    }

    return Object.values(parsed).filter(Boolean) as GoalType[];
  };

  // Handlers
  const handleAddGoal = useCallback(() => {
    setGoals((prev) => [...prev, createEmptyGoal()]);
    setHasUnsavedChanges(true);
  }, []);

  const handleRemoveGoal = useCallback((index: number) => {
    setGoals((prev) => prev.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);

    shopify.toast.show(`Goal ${index + 1} removed`, { duration: 3000 });
  }, []);

  const handleFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const parsedGoals = parseGoalsFromForm(formData);

      submit(
        { goals: JSON.stringify(parsedGoals), shopId },
        { method: "post" },
      );

      setGoals(parsedGoals);
      setLastSavedGoals(parsedGoals);
      setHasUnsavedChanges(false);
    },
    [submit, shopId],
  );

  const handleFormReset = useCallback(() => {
    if (lastSavedGoals.length > 0) {
      setGoals(lastSavedGoals);
    } else {
      setGoals(JSON.parse(goalsMetafield.value));
    }
    setHasUnsavedChanges(false);
  }, [lastSavedGoals, goalsMetafield.value]);

  return (
    <form
      data-save-bar
      data-discard-confirmation
      onSubmit={handleFormSubmit}
      onReset={handleFormReset}
    >
      {/* Hidden inputs to trigger save bar */}
      <input
        type="hidden"
        name="__dirty__"
        value={hasUnsavedChanges ? "true" : "false"}
        onChange={() => {}}
      />
      <input
        ref={inputRef}
        type="hidden"
        name="__goals_count__"
        value={goals.length}
      />

      <s-page>
        {goals.length > 0 ? (
          goals.map((goal, index) => (
            <AddGoalBlock
              key={`goal-${index}`}
              id={`goal-${index}`}
              idx={index}
              goal={goal}
              isActiveGoal={goal.isActive === "true"}
              onChange={() => setHasUnsavedChanges(true)}
              onRemove={() => handleRemoveGoal(index)}
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
          <s-button type="button" variant="primary" onClick={handleAddGoal}>
            Add New Goal
          </s-button>

          {hasUnsavedChanges && (
            <s-button type="submit" variant="primary">
              Save
            </s-button>
          )}
        </s-stack>

        <s-box slot="aside">
          <s-paragraph>Hello There</s-paragraph>
        </s-box>
      </s-page>
    </form>
  );
}
// export default function GoalTab() {
//   const loaderData = useLoaderData<typeof loader>();
//   const submit = useSubmit();
//   const [goals, setGoals] = useState<GoalType[]>(JSON.parse(loaderData.goals.value));
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//   const [lastSavedGoals, setLastSavedGoals] = useState<GoalType[] | null>(null);

//   const inputRef = useRef<HTMLInputElement>(null);

//   // Dispatches event to Shopify's save bar when dirty
//   useEffect(() => {
//     if (inputRef.current && hasUnsavedChanges) {
//       inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
//     }
//   }, [hasUnsavedChanges]);

//   console.log(loaderData);

//   // Handlers
//   const handleAddGoal = () => {
//     const newGoal: GoalType = {
//       isActive: "true",
//       condition: "cart_value",
//       offer: "free_shipping",
//       compined: "true",
//     };
//     setGoals((prev) => [...prev, newGoal]);
//     setHasUnsavedChanges(true);
//   };

//   const handleRemoveGoal = (indexToRemove: number) => {
//     setGoals((prev) => prev.filter((_, idx) => idx !== indexToRemove));
//     setHasUnsavedChanges(true);
//     shopify.toast.show(`Goal ${indexToRemove + 1} removed`, {
//       duration: 3000,
//     });
//   };

//   const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     const formData = new FormData(event.currentTarget);
//     const parsedGoals: Record<number, Partial<GoalType>> = {};

//     for (const [key, value] of formData.entries()) {
//       const match = key.match(/^goals\[(\d+)]\[(.+)]$/);
//       if (match) {
//         const index = Number(match[1]);
//         const field = match[2];

//         if (!parsedGoals[index]) parsedGoals[index] = {};
//         parsedGoals[index][field] = value.toString();
//       }
//     }

//     const cleanedGoals = Object.values(parsedGoals) as GoalType[];
//     submit(
//        { goals: JSON.stringify(cleanedGoals), shopId: loaderData.id },
//       { method: "post" },
//     );
//     setGoals(cleanedGoals);
//     setLastSavedGoals(cleanedGoals);
//     setHasUnsavedChanges(false);

//     // TODO: Add actual backend call to save goals
//     console.log("Parsed goals:", cleanedGoals);
//   };

//   const handleFormReset = () => {
//     if (lastSavedGoals) {
//       setGoals(lastSavedGoals);
//       setHasUnsavedChanges(false);
//     }
//   };

//   return (
//     <form
//       data-save-bar
//       data-discard-confirmation
//       onSubmit={handleFormSubmit}
//       onReset={handleFormReset}
//     >
//       <input
//         type="hidden"
//         name="__dirty__"
//         value={hasUnsavedChanges ? "true" : "false"}
//         onChange={() => {}}
//       />
//       <input
//         ref={inputRef}
//         type="hidden"
//         name="__goals_count__"
//         value={goals.length}
//       />

//       {/* -- Unchanged JSX below -- */}
//       <s-page>
//         {goals.length > 0 ? (
//           goals.map((goal, index) => (
//             <AddGoalBlock
//               key={`goal-${index}`}
//               id={`goal-${index}`}
//               idx={index}
//               goal={goal}
//               isActiveGoal={goal.isActive === "true"}
//               onChange={() => setHasUnsavedChanges(true)}
//               onRemove={() => handleRemoveGoal(index)}
//             />
//           ))
//         ) : (
//           <s-banner heading="No Goals" tone="info">
//             No Goals Was Created
//           </s-banner>
//         )}

//         <s-stack
//           direction="inline"
//           gap="base"
//           padding="base"
//           alignItems="center"
//           alignContent="center"
//           justifyContent="center"
//         >
//           <s-button type="button" variant="primary" onClick={handleAddGoal}>
//             Add New Goal
//           </s-button>
//           {hasUnsavedChanges && (
//             <s-button type="submit" variant="primary">
//               Save
//             </s-button>
//           )}
//         </s-stack>

//         <s-box slot="aside">
//           <s-paragraph>Hello There</s-paragraph>
//         </s-box>
//       </s-page>
//     </form>
//   );
// }

// import React, { useEffect, useRef, useState } from "react";
// import AddGoalBlock from "app/components/addGoals/goal-add-block";
// import { GoalType } from "app/types/goals";

// const defaultGoals = [
//   {
//     isActive: "true",
//     title: "Free Shipping Over $50",
//     condition: "cart_value",
//     price: "50.00",
//     offer: "free_shipping",
//     headline: "Spend $50 and get Free Shipping!",
//     topBarHeadlineIcons: "🚚 Free Shipping",
//     topBarHeadlineSimple: "Spend $50 to unlock free shipping",
//     confirmationMessage: "You've unlocked free shipping!",
//     remainingTargetMessage: "$%remaining% left to unlock free shipping",
//     discountAppliedMessage: "Free Shipping Applied",
//     compined: "true",
//   },
//   {
//     isActive: "true",
//     title: "10% Off Antique Items",
//     condition: "has_product",
//     productsCondition: "any",
//     Products: [
//       {
//         availablePublicationCount: 3,
//         createdAt: "2025-09-08T05:31:35Z",
//         descriptionHtml: "<p>Antique wooden chest of drawers</p>",
//         handle: "antique-drawers",
//         hasOnlyDefaultVariant: true,
//         id: "gid://shopify/Product/10033057825047",
//         images: [
//           {
//             id: "gid://shopify/MediaImage/41089431142679",
//             altText: "",
//             originalSrc:
//               "https://cdn.shopify.com/s/files/1/0955/3176/1943/files/babys-room_925x_db66353c-5ec6-4fd1-a406-3d0c011110c2.jpg?v=1757309497",
//           },
//         ],
//         options: [
//           {
//             id: "gid://shopify/ProductOption/12605064970519",
//             name: "Title",
//             position: 1,
//             values: ["Default Title"],
//           },
//         ],
//         productType: "Indoor",
//         publishedAt: "2025-09-08T05:31:35Z",
//         tags: ["Antique", "Bedroom"],
//         templateSuffix: null,
//         title: "Antique Drawers",
//         totalInventory: 0,
//         totalVariants: 1,
//         tracksInventory: false,
//         updatedAt: "2025-10-08T07:37:00Z",
//         variants: [
//           {
//             availableForSale: true,
//             barcode: null,
//             compareAtPrice: "300.00",
//             createdAt: "2025-09-08T05:31:35Z",
//             displayName: "Antique Drawers - Default Title",
//             fulfillmentService: {
//               id: "gid://shopify/FulfillmentService/manual",
//               inventoryManagement: false,
//               productBased: true,
//               serviceName: "Manual",
//               type: "MANUAL",
//             },
//             id: "gid://shopify/ProductVariant/51050929586455",
//             inventoryItem: {
//               __typename: "InventoryItem",
//               id: "gid://shopify/InventoryItem/53121194295575",
//             },
//             inventoryManagement: "NOT_MANAGED",
//             inventoryPolicy: "DENY",
//             inventoryQuantity: 2,
//             position: 1,
//             price: "250.00",
//             product: {
//               __typename: "Product",
//               id: "gid://shopify/Product/10033057825047",
//             },
//             requiresShipping: true,
//             selectedOptions: [
//               {
//                 __typename: "SelectedOption",
//                 value: "Default Title",
//               },
//             ],
//             sku: null,
//             taxable: true,
//             title: "Default Title",
//             updatedAt: "2025-09-08T05:31:35Z",
//             weight: 0,
//             weightUnit: "KILOGRAMS",
//           },
//         ],
//         vendor: "Company 123",
//         status: "ACTIVE",
//       },
//       {
//         availablePublicationCount: 3,
//         createdAt: "2025-09-08T05:31:47Z",
//         descriptionHtml: "<p>Wooden bedside table</p>",
//         handle: "bedside-table",
//         hasOnlyDefaultVariant: true,
//         id: "gid://shopify/Product/10033058349335",
//         images: [
//           {
//             id: "gid://shopify/MediaImage/41089431863575",
//             altText: "",
//             originalSrc:
//               "https://cdn.shopify.com/s/files/1/0955/3176/1943/files/dark-wall-bedside-table_925x_9726cf55-2e74-42fa-9efc-9ebd5de7e96c.jpg?v=1757309508",
//           },
//         ],
//         options: [
//           {
//             id: "gid://shopify/ProductOption/12605065494807",
//             name: "Title",
//             position: 1,
//             values: ["Default Title"],
//           },
//         ],
//         productType: "Indoor",
//         publishedAt: "2025-09-08T05:31:47Z",
//         tags: ["Bedroom", "Wood"],
//         templateSuffix: null,
//         title: "Bedside Table",
//         totalInventory: 0,
//         totalVariants: 1,
//         tracksInventory: false,
//         updatedAt: "2025-10-08T07:37:05Z",
//         variants: [
//           {
//             availableForSale: true,
//             barcode: null,
//             compareAtPrice: "85.00",
//             createdAt: "2025-09-08T05:31:47Z",
//             displayName: "Bedside Table - Default Title",
//             fulfillmentService: {
//               id: "gid://shopify/FulfillmentService/manual",
//               inventoryManagement: false,
//               productBased: true,
//               serviceName: "Manual",
//               type: "MANUAL",
//             },
//             id: "gid://shopify/ProductVariant/51050930110743",
//             inventoryItem: {
//               __typename: "InventoryItem",
//               id: "gid://shopify/InventoryItem/53121194819863",
//             },
//             inventoryManagement: "NOT_MANAGED",
//             inventoryPolicy: "DENY",
//             inventoryQuantity: 1,
//             position: 1,
//             price: "69.99",
//             product: {
//               __typename: "Product",
//               id: "gid://shopify/Product/10033058349335",
//             },
//             requiresShipping: true,
//             selectedOptions: [
//               {
//                 __typename: "SelectedOption",
//                 value: "Default Title",
//               },
//             ],
//             sku: null,
//             taxable: true,
//             title: "Default Title",
//             updatedAt: "2025-09-08T05:31:47Z",
//             weight: 0,
//             weightUnit: "KILOGRAMS",
//           },
//         ],
//         vendor: "Company 123",
//         status: "ACTIVE",
//       },
//       {
//         availablePublicationCount: 3,
//         createdAt: "2025-09-08T05:31:33Z",
//         descriptionHtml: "<p>Classic blown clay pot for plants</p>",
//         handle: "clay-plant-pot",
//         hasOnlyDefaultVariant: false,
//         id: "gid://shopify/Product/10033057726743",
//         images: [
//           {
//             id: "gid://shopify/MediaImage/41089430978839",
//             altText: "",
//             originalSrc:
//               "https://cdn.shopify.com/s/files/1/0955/3176/1943/files/single-sprout-in-a-pot_925x_072384d9-3c6c-492b-8727-a8da08b42ee6.jpg?v=1757309494",
//           },
//           {
//             id: "gid://shopify/MediaImage/41089431011607",
//             altText: "",
//             originalSrc:
//               "https://cdn.shopify.com/s/files/1/0955/3176/1943/files/pot-with-a-single-sprout_925x_0455e3a4-354f-40a2-b823-ff87d635a0c8.jpg?v=1757309495",
//           },
//         ],
//         options: [
//           {
//             id: "gid://shopify/ProductOption/12605064872215",
//             name: "Size",
//             position: 1,
//             values: ["Regular", "Large"],
//           },
//         ],
//         productType: "Outdoor",
//         publishedAt: "2025-09-08T05:31:32Z",
//         tags: ["Plants", "Pot"],
//         templateSuffix: null,
//         title: "Clay Plant Pot",
//         totalInventory: 0,
//         totalVariants: 2,
//         tracksInventory: false,
//         updatedAt: "2025-10-08T07:36:59Z",
//         variants: [
//           {
//             availableForSale: true,
//             barcode: null,
//             compareAtPrice: null,
//             createdAt: "2025-09-08T05:31:33Z",
//             displayName: "Clay Plant Pot - Regular",
//             fulfillmentService: {
//               id: "gid://shopify/FulfillmentService/manual",
//               inventoryManagement: false,
//               productBased: true,
//               serviceName: "Manual",
//               type: "MANUAL",
//             },
//             id: "gid://shopify/ProductVariant/51050929455383",
//             inventoryItem: {
//               __typename: "InventoryItem",
//               id: "gid://shopify/InventoryItem/53121194164503",
//             },
//             inventoryManagement: "NOT_MANAGED",
//             inventoryPolicy: "DENY",
//             inventoryQuantity: 1,
//             position: 1,
//             price: "9.99",
//             product: {
//               __typename: "Product",
//               id: "gid://shopify/Product/10033057726743",
//             },
//             requiresShipping: true,
//             selectedOptions: [
//               {
//                 __typename: "SelectedOption",
//                 value: "Regular",
//               },
//             ],
//             sku: null,
//             taxable: true,
//             title: "Regular",
//             updatedAt: "2025-09-08T05:31:33Z",
//             weight: 0,
//             weightUnit: "KILOGRAMS",
//           },
//           {
//             availableForSale: true,
//             barcode: null,
//             compareAtPrice: null,
//             createdAt: "2025-09-08T05:31:33Z",
//             displayName: "Clay Plant Pot - Large",
//             fulfillmentService: {
//               id: "gid://shopify/FulfillmentService/manual",
//               inventoryManagement: false,
//               productBased: true,
//               serviceName: "Manual",
//               type: "MANUAL",
//             },
//             id: "gid://shopify/ProductVariant/51050929488151",
//             inventoryItem: {
//               __typename: "InventoryItem",
//               id: "gid://shopify/InventoryItem/53121194197271",
//             },
//             inventoryManagement: "NOT_MANAGED",
//             inventoryPolicy: "DENY",
//             inventoryQuantity: 3,
//             position: 2,
//             price: "15.99",
//             product: {
//               __typename: "Product",
//               id: "gid://shopify/Product/10033057726743",
//             },
//             requiresShipping: true,
//             selectedOptions: [
//               {
//                 __typename: "SelectedOption",
//                 value: "Large",
//               },
//             ],
//             sku: null,
//             taxable: true,
//             title: "Large",
//             updatedAt: "2025-09-08T05:31:33Z",
//             weight: 0,
//             weightUnit: "KILOGRAMS",
//           },
//         ],
//         vendor: "Company 123",
//         status: "ACTIVE",
//       },
//     ],
//     offer: "order_discount",
//     cartDiscount: "10",
//     headline: "Buy an antique and get 10% off!",
//     topBarHeadlineIcons: "🪑 10% Off",
//     topBarHeadlineSimple: "Buy select antiques, get 10% off",
//     confirmationMessage: "You received 10% off!",
//     remainingTargetMessage: "%remaining% item(s) left to get 10% off",
//     discountAppliedMessage: "10% discount applied",
//     compined: "true",
//   },
//   {
//     isActive: "false",
//     title: "Free Gift With 2 Items",
//     condition: "cart_quantity",
//     cartQuantity: "2",
//     offer: "free_gift",
//     freeGifts: [
//       {
//         availablePublicationCount: 3,
//         createdAt: "2025-09-08T05:31:35Z",
//         descriptionHtml: "<p>Antique wooden chest of drawers</p>",
//         handle: "antique-drawers",
//         hasOnlyDefaultVariant: true,
//         id: "gid://shopify/Product/10033057825047",
//         images: [
//           {
//             id: "gid://shopify/MediaImage/41089431142679",
//             altText: "",
//             originalSrc:
//               "https://cdn.shopify.com/s/files/1/0955/3176/1943/files/babys-room_925x_db66353c-5ec6-4fd1-a406-3d0c011110c2.jpg?v=1757309497",
//           },
//         ],
//         options: [
//           {
//             id: "gid://shopify/ProductOption/12605064970519",
//             name: "Title",
//             position: 1,
//             values: ["Default Title"],
//           },
//         ],
//         productType: "Indoor",
//         publishedAt: "2025-09-08T05:31:35Z",
//         tags: ["Antique", "Bedroom"],
//         templateSuffix: null,
//         title: "Antique Drawers",
//         totalInventory: 0,
//         totalVariants: 1,
//         tracksInventory: false,
//         updatedAt: "2025-10-08T07:37:00Z",
//         variants: [
//           {
//             availableForSale: true,
//             barcode: null,
//             compareAtPrice: "300.00",
//             createdAt: "2025-09-08T05:31:35Z",
//             displayName: "Antique Drawers - Default Title",
//             fulfillmentService: {
//               id: "gid://shopify/FulfillmentService/manual",
//               inventoryManagement: false,
//               productBased: true,
//               serviceName: "Manual",
//               type: "MANUAL",
//             },
//             id: "gid://shopify/ProductVariant/51050929586455",
//             inventoryItem: {
//               __typename: "InventoryItem",
//               id: "gid://shopify/InventoryItem/53121194295575",
//             },
//             inventoryManagement: "NOT_MANAGED",
//             inventoryPolicy: "DENY",
//             inventoryQuantity: 2,
//             position: 1,
//             price: "250.00",
//             product: {
//               __typename: "Product",
//               id: "gid://shopify/Product/10033057825047",
//             },
//             requiresShipping: true,
//             selectedOptions: [
//               {
//                 __typename: "SelectedOption",
//                 value: "Default Title",
//               },
//             ],
//             sku: null,
//             taxable: true,
//             title: "Default Title",
//             updatedAt: "2025-09-08T05:31:35Z",
//             weight: 0,
//             weightUnit: "KILOGRAMS",
//           },
//         ],
//         vendor: "Company 123",
//         status: "ACTIVE",
//       },
//       {
//         availablePublicationCount: 3,
//         createdAt: "2025-09-08T05:31:47Z",
//         descriptionHtml: "<p>Wooden bedside table</p>",
//         handle: "bedside-table",
//         hasOnlyDefaultVariant: true,
//         id: "gid://shopify/Product/10033058349335",
//         images: [
//           {
//             id: "gid://shopify/MediaImage/41089431863575",
//             altText: "",
//             originalSrc:
//               "https://cdn.shopify.com/s/files/1/0955/3176/1943/files/dark-wall-bedside-table_925x_9726cf55-2e74-42fa-9efc-9ebd5de7e96c.jpg?v=1757309508",
//           },
//         ],
//         options: [
//           {
//             id: "gid://shopify/ProductOption/12605065494807",
//             name: "Title",
//             position: 1,
//             values: ["Default Title"],
//           },
//         ],
//         productType: "Indoor",
//         publishedAt: "2025-09-08T05:31:47Z",
//         tags: ["Bedroom", "Wood"],
//         templateSuffix: null,
//         title: "Bedside Table",
//         totalInventory: 0,
//         totalVariants: 1,
//         tracksInventory: false,
//         updatedAt: "2025-10-08T07:37:05Z",
//         variants: [
//           {
//             availableForSale: true,
//             barcode: null,
//             compareAtPrice: "85.00",
//             createdAt: "2025-09-08T05:31:47Z",
//             displayName: "Bedside Table - Default Title",
//             fulfillmentService: {
//               id: "gid://shopify/FulfillmentService/manual",
//               inventoryManagement: false,
//               productBased: true,
//               serviceName: "Manual",
//               type: "MANUAL",
//             },
//             id: "gid://shopify/ProductVariant/51050930110743",
//             inventoryItem: {
//               __typename: "InventoryItem",
//               id: "gid://shopify/InventoryItem/53121194819863",
//             },
//             inventoryManagement: "NOT_MANAGED",
//             inventoryPolicy: "DENY",
//             inventoryQuantity: 1,
//             position: 1,
//             price: "69.99",
//             product: {
//               __typename: "Product",
//               id: "gid://shopify/Product/10033058349335",
//             },
//             requiresShipping: true,
//             selectedOptions: [
//               {
//                 __typename: "SelectedOption",
//                 value: "Default Title",
//               },
//             ],
//             sku: null,
//             taxable: true,
//             title: "Default Title",
//             updatedAt: "2025-09-08T05:31:47Z",
//             weight: 0,
//             weightUnit: "KILOGRAMS",
//           },
//         ],
//         vendor: "Company 123",
//         status: "ACTIVE",
//       },
//       {
//         availablePublicationCount: 3,
//         createdAt: "2025-09-08T05:31:33Z",
//         descriptionHtml: "<p>Classic blown clay pot for plants</p>",
//         handle: "clay-plant-pot",
//         hasOnlyDefaultVariant: false,
//         id: "gid://shopify/Product/10033057726743",
//         images: [
//           {
//             id: "gid://shopify/MediaImage/41089430978839",
//             altText: "",
//             originalSrc:
//               "https://cdn.shopify.com/s/files/1/0955/3176/1943/files/single-sprout-in-a-pot_925x_072384d9-3c6c-492b-8727-a8da08b42ee6.jpg?v=1757309494",
//           },
//           {
//             id: "gid://shopify/MediaImage/41089431011607",
//             altText: "",
//             originalSrc:
//               "https://cdn.shopify.com/s/files/1/0955/3176/1943/files/pot-with-a-single-sprout_925x_0455e3a4-354f-40a2-b823-ff87d635a0c8.jpg?v=1757309495",
//           },
//         ],
//         options: [
//           {
//             id: "gid://shopify/ProductOption/12605064872215",
//             name: "Size",
//             position: 1,
//             values: ["Regular", "Large"],
//           },
//         ],
//         productType: "Outdoor",
//         publishedAt: "2025-09-08T05:31:32Z",
//         tags: ["Plants", "Pot"],
//         templateSuffix: null,
//         title: "Clay Plant Pot",
//         totalInventory: 0,
//         totalVariants: 2,
//         tracksInventory: false,
//         updatedAt: "2025-10-08T07:36:59Z",
//         variants: [
//           {
//             availableForSale: true,
//             barcode: null,
//             compareAtPrice: null,
//             createdAt: "2025-09-08T05:31:33Z",
//             displayName: "Clay Plant Pot - Regular",
//             fulfillmentService: {
//               id: "gid://shopify/FulfillmentService/manual",
//               inventoryManagement: false,
//               productBased: true,
//               serviceName: "Manual",
//               type: "MANUAL",
//             },
//             id: "gid://shopify/ProductVariant/51050929455383",
//             inventoryItem: {
//               __typename: "InventoryItem",
//               id: "gid://shopify/InventoryItem/53121194164503",
//             },
//             inventoryManagement: "NOT_MANAGED",
//             inventoryPolicy: "DENY",
//             inventoryQuantity: 1,
//             position: 1,
//             price: "9.99",
//             product: {
//               __typename: "Product",
//               id: "gid://shopify/Product/10033057726743",
//             },
//             requiresShipping: true,
//             selectedOptions: [
//               {
//                 __typename: "SelectedOption",
//                 value: "Regular",
//               },
//             ],
//             sku: null,
//             taxable: true,
//             title: "Regular",
//             updatedAt: "2025-09-08T05:31:33Z",
//             weight: 0,
//             weightUnit: "KILOGRAMS",
//           },
//           {
//             availableForSale: true,
//             barcode: null,
//             compareAtPrice: null,
//             createdAt: "2025-09-08T05:31:33Z",
//             displayName: "Clay Plant Pot - Large",
//             fulfillmentService: {
//               id: "gid://shopify/FulfillmentService/manual",
//               inventoryManagement: false,
//               productBased: true,
//               serviceName: "Manual",
//               type: "MANUAL",
//             },
//             id: "gid://shopify/ProductVariant/51050929488151",
//             inventoryItem: {
//               __typename: "InventoryItem",
//               id: "gid://shopify/InventoryItem/53121194197271",
//             },
//             inventoryManagement: "NOT_MANAGED",
//             inventoryPolicy: "DENY",
//             inventoryQuantity: 3,
//             position: 2,
//             price: "15.99",
//             product: {
//               __typename: "Product",
//               id: "gid://shopify/Product/10033057726743",
//             },
//             requiresShipping: true,
//             selectedOptions: [
//               {
//                 __typename: "SelectedOption",
//                 value: "Large",
//               },
//             ],
//             sku: null,
//             taxable: true,
//             title: "Large",
//             updatedAt: "2025-09-08T05:31:33Z",
//             weight: 0,
//             weightUnit: "KILOGRAMS",
//           },
//         ],
//         vendor: "Company 123",
//         status: "ACTIVE",
//       },
//     ],
//     headline: "Buy 2 items and get a free gift!",
//     topBarHeadlineIcons: "🎁 Free Gift",
//     topBarHeadlineSimple: "Buy 2 items to get a free gift",
//     confirmationMessage: "You’ve received a free gift!",
//     remainingTargetMessage: "Add %remaining% more item(s) to get a gift",
//     discountAppliedMessage: "Free gift added to your order",
//     compined: "false",
//   },
// ];

// export default function GoalTab() {
//   const [goals, setGoals] = useState(defaultGoals);
//   const [dirtyCount, setDirtyCount] = useState(false);
//   const [PreviousSaved, setPreviousSaved] = useState(null);

//   const inputRef = useRef();

//   useEffect(() => {
//     if (inputRef.current && dirtyCount) {
//       inputRef.current?.dispatchEvent(new Event("input", { bubbles: true }));
//     }
//   }, [dirtyCount]);

//   useEffect(() => {
//     if (dirtyCount) {
//       shopify.saveBar.show("my-save-bar");
//     }
//   }, [dirtyCount]);

//   const handleAddGoal = () => {
//     const newGoal = {
//       isActive: "true",
//       title: "",
//       condition: "cart_value",
//       price: "",
//       offer: "free_shipping",
//       headline: "",
//       topBarHeadlineIcons: "",
//       topBarHeadlineSimple: "",
//       confirmationMessage: "",
//       remainingTargetMessage: "",
//       discountAppliedMessage: "",
//       compined: "true",
//     };
//     setGoals((prev) => [...prev, newGoal]);
//     setDirtyCount(true);
//   };

//   const handleRemoveGoal = (indexToRemove) => {
//     setGoals((prev) => prev.filter((_, idx) => idx !== indexToRemove));
//     setDirtyCount(true);
//   };

//   const handleFormSubmit = (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);

//     const parsedGoals = [];
//     for (let [key, value] of formData.entries()) {
//       const match = key.match(/^goals\[(\d+)]\[(.+)]$/);
//       if (match) {
//         const idx = Number(match[1]);
//         const field = match[2];
//         if (!parsedGoals[idx]) parsedGoals[idx] = {};
//         parsedGoals[idx][field] = value;
//       }
//     }

//     const cleanedGoals = parsedGoals.filter(Boolean);
//     console.log("Parsed goals:", cleanedGoals);
//     setGoals(cleanedGoals);
//     setPreviousSaved(cleanedGoals);
//     setDirtyCount(false);
//     // Submit to backend here if needed
//   };

//   const handleFormReset = () => {
//     setGoals(PreviousSaved);
//     setDirtyCount(false);
//   };

//   return (
//     <form data-save-bar data-discard-confirmation>
//       <input
//         type="hidden"
//         name="__dirty__"
//         value={dirtyCount ? "true" : "false"}
//         onChange={() => console.log({})}
//       />
//       <input
//         ref={inputRef}
//         type="hidden"
//         name="__goals_count__"
//         value={goals.length}
//       />
//       <s-page>
//         {goals.map((goal, index) => (
//           <AddGoalBlock
//             key={`goal-${index}`}
//             id={`goal-${index}`}
//             idx={index}
//             goal={goal as GoalType}
//             isActiveGoal={JSON.parse(goal.isActive)}
//             onChange={() => console.log("Changed")}
//             onRemove={() => handleRemoveGoal(index)}
//           />
//         ))}

//         <s-text-field
//           label="Product Title"
//           name="title"
//           required
//         ></s-text-field>
//         <s-stack
//           direction="inline"
//           gap="base"
//           alignItems="center"
//           alignContent="center"
//           justifyContent="center"
//         >
//           <s-button type="button" onClick={handleAddGoal}>
//             Add Goal
//           </s-button>
//           {dirtyCount && (
//             <s-button type="submit" variant="primary">
//               Save
//             </s-button>
//           )}
//         </s-stack>

//         <s-box slot="aside">
//           <s-paragraph>Hello There</s-paragraph>
//         </s-box>
//       </s-page>
//     </form>
//   );
// }

// import AddGoalBlock from "app/components/addGoals/goal-add-block";
// import React, { useState } from "react";

// const Goals = [
//   {
//     "isActive": "true",
//     "title": "Free Shipping Over $50",
//     "condition": "cart_value",
//     "price": "50.00",
//     "offer": "free_shipping",
//     "headline": "Spend $50 and get Free Shipping!",
//     "topBarHeadlineIcons": "🚚 Free Shipping",
//     "topBarHeadlineSimple": "Spend $50 to unlock free shipping",
//     "confirmationMessage": "You've unlocked free shipping!",
//     "remainingTargetMessage": "$%remaining% left to unlock free shipping",
//     "discountAppliedMessage": "Free Shipping Applied",
//     "compined": "true"
//   },
//   {
//     "isActive": "true",
//     "title": "10% Off Antique Items",
//     "condition": "has_product",
//     "productsCondition": "any",
//     "Products": "[{ \"id\": \"gid://shopify/Product/10033057825047\", \"title\": \"Antique Drawers\" }, { \"id\": \"gid://shopify/Product/10033058349335\", \"title\": \"Bedside Table\" }]",
//     "offer": "order_discount",
//     "cartDiscount": "10",
//     "headline": "Buy an antique and get 10% off!",
//     "topBarHeadlineIcons": "🪑 10% Off",
//     "topBarHeadlineSimple": "Buy select antiques, get 10% off",
//     "confirmationMessage": "You received 10% off!",
//     "remainingTargetMessage": "%remaining% item(s) left to get 10% off",
//     "discountAppliedMessage": "10% discount applied",
//     "compined": "true"
//   },
//   {
//     "isActive": "true",
//     "title": "Free Gift With 2 Items",
//     "condition": "cart_quantity",
//     "cartQuantity": "2",
//     "offer": "free_gift",
//     "freeGifts": "[{ \"id\": \"gid://shopify/Product/10033058087191\", \"title\": \"Biodegradable Cardboard Pots\" }]",
//     "headline": "Buy 2 items and get a free gift!",
//     "topBarHeadlineIcons": "🎁 Free Gift",
//     "topBarHeadlineSimple": "Buy 2 items to get a free gift",
//     "confirmationMessage": "You’ve received a free gift!",
//     "remainingTargetMessage": "Add %remaining% more item(s) to get a gift",
//     "discountAppliedMessage": "Free gift added to your order",
//     "compined": "false"
//   }
// ];

// export default function GoalTab() {
//   const [goalIndexes, setGoalIndexes] = useState([0]);
//   const [dirtyCount, setDirtyCount] = useState(false); // boolean flag

//   const generateStaticId = (index) => `goal-${index}`;

//   useEffect(() => {
//     if (dirtyCount) {
//         shopify.saveBar.show()
//     }
//   }, [dirtyCount])

//   const handleAddGoal = (e) => {
//     e.preventDefault();
//     setGoalIndexes((prev) => [
//       ...prev,
//       prev.length ? Math.max(...prev) + 1 : 0,
//     ]);
//     setDirtyCount(true); // mark form as dirty
//   };

//   const handleRemoveGoal = (indexToRemove) => {
//     setGoalIndexes((prev) => prev.filter((idx) => idx !== indexToRemove));
//     setDirtyCount(true); // mark form as dirty
//   };

//   const handleFormSubmit = (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);

//     // Parse FormData into an array of goals
//     const goals = [];
//     for (let [key, value] of formData.entries()) {
//       const match = key.match(/^goals\[(\d+)\]\[(.+)\]$/);
//       if (match) {
//         const idx = Number(match[1]);
//         const field = match[2];
//         if (!goals[idx]) goals[idx] = {};
//         goals[idx][field] = value;
//       }
//     }

//     // Remove empty slots if any
//     const goalsArray = goals.filter(Boolean);
//     console.log("Goals array", goalsArray);

//     setDirtyCount(false); // reset dirty flag after save
//     // ...submit to backend or further processing here
//   };

//   const handleFormReset = () => {
//     setGoalIndexes([0]);
//     setDirtyCount(false); // reset dirty flag on reset
//   };

//   return (
//     <form
//       id="Configuration"
//       data-save-bar
//       data-discard-confirmation
//       onSubmit={handleFormSubmit}
//       onReset={handleFormReset}
//     >
//       {/* Hidden input to trigger save bar when dirty */}
//       <input
//         type="hidden"
//         name="__dirty__"
//         value={dirtyCount ? "true" : "false"}
//       />
//       <input type="hidden" name="__goals_count__" value={goalIndexes.length} />

//       <s-page>
//         {goalIndexes.map((idx, i) => {
//           const id = generateStaticId(idx);
//           return (
//             <AddGoalBlock
//               key={id}
//               id={id}
//               idx={i}
//               onRemove={() => handleRemoveGoal(idx)}
//             />
//           );
//         })}

//         <s-stack direction="inline" gap="base" alignItems="center" alignContent="center" justifyContent="center">
//           <s-button type="button" onClick={handleAddGoal}>
//             Add Goal
//           </s-button>
//           {dirtyCount && (
//             <s-button type="submit" variant="primary">
//               Save
//             </s-button>
//           )}
//         </s-stack>

//         <s-box slot="aside">
//           <s-paragraph>Hello There</s-paragraph>
//         </s-box>
//       </s-page>
//     </form>
//   );
// }

// export default function GoalTab() {
//   const [goalIndexes, setGoalIndexes] = useState([0]);
//   const [dirtyCount, setDirtyCount] = useState(false); // boolean flag

//   const generateStaticId = (index) => `goal-${index}`;

//   useEffect(() => {
//     if (dirtyCount) {
//         shopify.saveBar.show()
//     }
//   }, [dirtyCount])

//   const handleAddGoal = (e) => {
//     e.preventDefault();
//     setGoalIndexes((prev) => [
//       ...prev,
//       prev.length ? Math.max(...prev) + 1 : 0,
//     ]);
//     setDirtyCount(true); // mark form as dirty
//   };

//   const handleRemoveGoal = (indexToRemove) => {
//     setGoalIndexes((prev) => prev.filter((idx) => idx !== indexToRemove));
//     setDirtyCount(true); // mark form as dirty
//   };

//   const handleFormSubmit = (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);

//     // Parse FormData into an array of goals
//     const goals = [];
//     for (let [key, value] of formData.entries()) {
//       const match = key.match(/^goals\[(\d+)\]\[(.+)\]$/);
//       if (match) {
//         const idx = Number(match[1]);
//         const field = match[2];
//         if (!goals[idx]) goals[idx] = {};
//         goals[idx][field] = value;
//       }
//     }

//     // Remove empty slots if any
//     const goalsArray = goals.filter(Boolean);
//     console.log("Goals array", goalsArray);

//     setDirtyCount(false); // reset dirty flag after save
//     // ...submit to backend or further processing here
//   };

//   const handleFormReset = () => {
//     setGoalIndexes([0]);
//     setDirtyCount(false); // reset dirty flag on reset
//   };

//   return (
//     <form
//       id="Configuration"
//       data-save-bar
//       data-discard-confirmation
//       onSubmit={handleFormSubmit}
//       onReset={handleFormReset}
//     >
//       {/* Hidden input to trigger save bar when dirty */}
//       <input
//         type="hidden"
//         name="__dirty__"
//         value={dirtyCount ? "true" : "false"}
//       />
//       <input type="hidden" name="__goals_count__" value={goalIndexes.length} />

//       <s-page>
//         {goalIndexes.map((idx, i) => {
//           const id = generateStaticId(idx);
//           return (
//             <AddGoalBlock
//               key={id}
//               id={id}
//               idx={i}
//               onRemove={() => handleRemoveGoal(idx)}
//             />
//           );
//         })}

//         <s-stack direction="inline" gap="base" alignItems="center" alignContent="center" justifyContent="center">
//           <s-button type="button" onClick={handleAddGoal}>
//             Add Goal
//           </s-button>
//           {dirtyCount && (
//             <s-button type="submit" variant="primary">
//               Save
//             </s-button>
//           )}
//         </s-stack>

//         <s-box slot="aside">
//           <s-paragraph>Hello There</s-paragraph>
//         </s-box>
//       </s-page>
//     </form>
//   );
// }
