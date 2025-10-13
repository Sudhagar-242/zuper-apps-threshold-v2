// import { useState, useEffect, useRef } from "react";

// import { authenticate } from "app/shopify.server";
// import {
//   ActionFunctionArgs,
//   LoaderFunctionArgs,
//   useLoaderData,
//   useSubmit,
// } from "react-router";
// import FormExampleComponent from "app/components/addGoals/formExampleComponent";
// import {
//   GET_GOALS_METAFIELD_QUERY,
//   CREATE_OR_UPDATE_METAFIELD,
// } from "app/graphql/get-and-update-goals-metafield";
// import { GoalType } from "app/types/goals";
// import { ensureDiscountExists } from "app/utils/create-discount-function-existance";
// import AddGoalBlock from "app/components/addGoals/goal-add-block";
// import { FormSaveBarStatusProvider } from "app/context/form-save-bar-status";

// interface loaderResponse {
//   shop: {
//     id: string;
//     name: string;
//     url: string;
//     currencyCode: string;
//     goals: Record<string, unknown> | null;
//     discountId: string | null;
//   };
//   app: {
//     id: string;
//     title: string;
//     apiKey: string;
//   };
//   shopifyFunctions: {
//     edges: Array<{
//       node: {
//         id: string;
//         app: {
//           id: string;
//           title: string;
//         };
//       };
//     }>;
//   };
// }

// const createEmptyGoal: GoalType = {
//   title: "",
//   goalName: "Spend More",
//   isActive: "true",
//   condition: "cart_value",
//   price: "100",
//   offer: "free_shipping",
//   headline: "Buy YYY and get free gift",
//   topBarHeadlineIcons: "Free gift",
//   topBarHeadlineSimple: "Buy YYY to get free gift",
//   confirmationMessage: "You got free gift",
//   remainingTargetMessage: `%remaining% left`,
//   discountAppliedMessage: "Free gift",
//   compined: "true",
// };

// export async function loader({ request }: LoaderFunctionArgs) {
//   const { admin } = await authenticate.admin(request);
//   const response = await admin.graphql(GET_GOALS_METAFIELD_QUERY);
//   const data = (await response.json()).data as loaderResponse;
//   const functionId = (() => {
//     let id = "";
//     data.shopifyFunctions.edges.forEach((edge) => {
//       if (edge.node.app.id === data.app.id) {
//         id = edge.node.id;
//       }
//     });
//     return id;
//   })();
//   console.log(functionId);
//   await ensureDiscountExists(
//     admin,
//     data.shop.discountId,
//     data.shop.id,
//     functionId,
//   );
//   return await { shopId: data.shop.id, goalsMetafield: data.shop.goals };
// }

// export async function action({ request }: ActionFunctionArgs) {
//   const { admin } = await authenticate.admin(request);
//   const formData = await request.formData();
//   const response = await admin.graphql(CREATE_OR_UPDATE_METAFIELD, {
//     variables: {
//       ownerId: formData.get("shopId"),
//       namespace: "zuper_threshold",
//       key: "goals",
//       type: "json",
//       value: formData.get("goals"),
//     },
//   });
//   console.log(response);
//   // console.log(response.json());

//   return null;
// }

// const parseGoalsFromForm = (formData) => {
//   const parsed = [];

//   for (const [key, value] of formData.entries()) {
//     const match = key.match(/^goals\[(\d+)]\[(.+)]$/);
//     if (!match) continue;

//     const index = Number(match[1]);
//     const field = match[2];

//     if (!parsed[index]) parsed[index] = {};
//     parsed[index][field] = value.toString();
//   }

//   return parsed;
// };

// function DynamicForm() {
//   const { shopId, goalsMetafield } = useLoaderData<typeof loader>();
//   const submit = useSubmit();

//   console.log("goals", goalsMetafield);
//   console.log("id", shopId);

//   // Last saved state of inputs
//   const [savedInputs, setSavedInputs] = useState(
//     JSON.parse(goalsMetafield?.value as string),
//   );
//   // Inputs used for rendering; changes live here
//   const [inputs, setInputs] = useState(savedInputs);
//   const [UnSavedChanges, setUnSavedChanges] = useState(false);

//   const [savedOrNot, setSavedOrNot] = useState(false);

//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (UnSavedChanges) {
//       triggerChange();
//     }
//   }, [inputs, UnSavedChanges]);

//   const triggerChange = () => {
//     console.log("Ref before dispatch:", inputRef.current);
//     if (inputRef.current) {
//       inputRef.current.value = JSON.stringify(Math.random());
//       inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
//     } else {
//       console.log("Ref is null or detached.");
//     }
//   };

//   // Add new empty input group
//   const handleAdd = () => {
//     setInputs((prev) => [...prev, createEmptyGoal]);
//     console.log(inputRef.current);
//     setUnSavedChanges(true);
//   };

//   // Remove input group by index
//   const handleRemove = (index) => {
//     console.log("Removing index:", index);
//     setInputs((prev) => prev.filter((_, i) => i !== index));
//     setUnSavedChanges(true);
//   };

//   // Save: update savedInputs and inputs state
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     const parsedData = parseGoalsFromForm(formData);
//     console.log(parsedData);
//     submit({ goals: JSON.stringify(parsedData), shopId }, { method: "POST" });
//     setSavedInputs(parsedData);
//     setInputs(parsedData);
//     setUnSavedChanges(false);
//     setSavedOrNot(true);
//     alert("Saved data:\n" + JSON.stringify(parsedData, null, 2));
//   };

//   // Discard: reset inputs to last savedInputs on form reset
//   const handleDiscard = (event) => {
//     event.preventDefault();
//     setInputs(savedInputs);
//     setUnSavedChanges(false);
//     setSavedOrNot(false);
//     alert("Changes discarded, reverted to last saved state.");
//   };

//   return (
//     <FormSaveBarStatusProvider
//       setSavedOrNot={setSavedOrNot}
//       savedOrNot={savedOrNot}
//     >
//       <div style={{ margin: "auto" }}>
//         <h3>Dynamic Input Form with Save/Discard</h3>
//         <form
//           onSubmit={handleSubmit}
//           onReset={handleDiscard}
//           onErrorCapture={(e) => console.log("error occurs")}
//           data-save-bar
//         >
//           <input hidden name={`goals[id]`} ref={inputRef} />
//           {inputs?.map((input, index) => (
//             <div
//               key={index}
//               style={{
//                 marginBottom: 15,
//                 paddingBottom: 10,
//                 borderBottom: "1px solid #ccc",
//               }}
//             >
//               <AddGoalBlock
//                 key={`goal-${index}`}
//                 id={`goal-${index}`}
//                 idx={index}
//                 goal={input}
//                 isActiveGoal={input.isActive === "true"}
//                 onChange={() => setUnSavedChanges(true)}
//                 onRemove={() => handleRemove(index)}
//               />
//               {inputs.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => handleRemove(index)}
//                   style={{
//                     marginLeft: 20,
//                     backgroundColor: "#f44336",
//                     color: "white",
//                     border: "none",
//                     padding: "4px 8px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Remove
//                 </button>
//               )}
//             </div>
//           ))}

//           <button type="button" onClick={handleAdd} style={{ marginRight: 10 }}>
//             Add New
//           </button>
//           <button type="submit" style={{ marginRight: 10 }}>
//             Save All
//           </button>
//           <button type="reset">Discard Changes</button>
//         </form>
//       </div>
//     </FormSaveBarStatusProvider>
//   );
// }

// export default DynamicForm;

// // export default function MyForm() {
// //   const [savedData, setSavedData] = useState(initialData);
// //   const [formData, setFormData] = useState(initialData);
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const handleSave = (e) => {
// //     e.preventDefault();
// //     setSavedData(formData);
// //     console.log("Saved!");
// //   };

// //   // Called on form reset event
// //   const handleDiscard = (e) => {
// //     e.preventDefault();
// //     setFormData(savedData); // Revert form data to last saved state
// //     console.log("Changes discarded!");
// //   };

// //   return (
// //     <form data-save-bar onReset={handleDiscard} onSubmit={handleSave}>
// //       {<input name="name" value={formData.name} onChange={handleChange} />
// //       <input name="email" value={formData.email} onChange={handleChange} />}
// //       <button type="submit" onClick={handleSave}>
// //         Save
// //       </button>
// //       <button type="reset">Discard</button>
// //     </form>
// //   );
// // }

// ===
// Settings page pattern
// ===

// export default function SettingsPage() {
//   const handleFormReset = (event) => {
//     console.log("Handle discarded changes if necessary");
//   };

//   const handleFormSubmit = (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     const formEntries = Object.fromEntries(formData);
//     console.log("Form data", formEntries);
//   };

//   return (
//     <form data-save-bar onSubmit={handleFormSubmit} onReset={handleFormReset}>
//       <s-page heading="Settings" inlineSize="small">
//         {/* === */}
//         {/* Store Information */}
//         {/* === */}
//         <s-section heading="Store Information">
//           <s-number-field
//             label="number"
//             name="number"
//             value="1"
//             placeholder="Enter number"
//             required
//             min={1}
//             max={10}
//             error="Please apply correct"
//           />
//           <s-text-field
//             label="Store name"
//             name="store-name"
//             value="Puzzlify Store"
//             placeholder="Enter store name"
//             required
//             minLength={1}
//             maxLength={10}
//             error="Please apply correct"
//           />
//           <s-text-field
//             label="Business address"
//             name="business-address"
//             value="123 Main St, Anytown, USA"
//             placeholder="Enter business address"
//           />
//           <s-text-field
//             label="Store phone"
//             name="store-phone"
//             value="+1 (555) 123-4567"
//             placeholder="Enter phone number"
//           />
//           <s-choice-list label="Primary currency" name="currency">
//             <s-choice value="usd" selected>
//               US Dollar ($)
//             </s-choice>
//             <s-choice value="cad">Canadian Dollar (CAD)</s-choice>
//             <s-choice value="eur">Euro (€)</s-choice>
//           </s-choice-list>
//         </s-section>

//         {/* === */}
//         {/* Notifications */}
//         {/* === */}
//         <s-section heading="Notifications">
//           <s-select
//             label="Notification frequency"
//             name="notification-frequency"
//           >
//             <s-option value="immediately" selected>
//               Immediately
//             </s-option>
//             <s-option value="hourly">Hourly digest</s-option>
//             <s-option value="daily">Daily digest</s-option>
//           </s-select>
//           <s-choice-list
//             label="Notification types"
//             name="notifications-type"
//             multiple
//           >
//             <s-choice value="new-order" selected>
//               New order notifications
//             </s-choice>
//             <s-choice value="low-stock">Low stock alerts</s-choice>
//             <s-choice value="customer-review">
//               Customer review notifications
//             </s-choice>
//             <s-choice value="shipping-updates">Shipping updates</s-choice>
//           </s-choice-list>
//         </s-section>

//         {/* === */}
//         {/* Preferences */}
//         {/* === */}
//         <s-section heading="Preferences">
//           <s-box border="base" borderRadius="base">
//             <s-clickable
//               padding="small-100"
//               href="/app/settings/shipping"
//               accessibilityLabel="Configure shipping methods, rates, and fulfillment options"
//             >
//               <s-grid
//                 gridTemplateColumns="1fr auto"
//                 alignItems="center"
//                 gap="base"
//               >
//                 <s-box>
//                   <s-heading>Shipping & fulfillment</s-heading>
//                   <s-paragraph color="subdued">
//                     Shipping methods, rates, zones, and fulfillment preferences.
//                   </s-paragraph>
//                 </s-box>
//                 <s-icon type="chevron-right" />
//               </s-grid>
//             </s-clickable>
//             <s-box paddingInline="small-100">
//               <s-divider />
//             </s-box>

//             <s-clickable
//               padding="small-100"
//               href="/app/settings/products_catalog"
//               accessibilityLabel="Configure product defaults, customer experience, and catalog settings"
//             >
//               <s-grid
//                 gridTemplateColumns="1fr auto"
//                 alignItems="center"
//                 gap="base"
//               >
//                 <s-box>
//                   <s-heading>Products & catalog</s-heading>
//                   <s-paragraph color="subdued">
//                     Product defaults, customer experience, and catalog display
//                     options.
//                   </s-paragraph>
//                 </s-box>
//                 <s-icon type="chevron-right" />
//               </s-grid>
//             </s-clickable>
//             <s-box paddingInline="small-100">
//               <s-divider />
//             </s-box>

//             <s-clickable
//               padding="small-100"
//               href="/app/settings/customer_support"
//               accessibilityLabel="Manage customer support settings and help resources"
//             >
//               <s-grid
//                 gridTemplateColumns="1fr auto"
//                 alignItems="center"
//                 gap="base"
//               >
//                 <s-box>
//                   <s-heading>Customer support</s-heading>
//                   <s-paragraph color="subdued">
//                     Support settings, help resources, and customer service
//                     tools.
//                   </s-paragraph>
//                 </s-box>
//                 <s-icon type="chevron-right" />
//               </s-grid>
//             </s-clickable>
//           </s-box>
//         </s-section>

//         {/* === */}
//         {/* Tools */}
//         {/* === */}
//         <s-section heading="Tools">
//           <s-stack
//             gap="none"
//             border="base"
//             borderRadius="base"
//             overflow="hidden"
//           >
//             <s-box padding="small-100">
//               <s-grid
//                 gridTemplateColumns="1fr auto"
//                 alignItems="center"
//                 gap="base"
//               >
//                 <s-box>
//                   <s-heading>Reset app settings</s-heading>
//                   <s-paragraph color="subdued">
//                     Reset all settings to their default values. This action
//                     cannot be undone.
//                   </s-paragraph>
//                 </s-box>
//                 <s-button tone="critical">Reset</s-button>
//               </s-grid>
//             </s-box>
//             <s-box paddingInline="small-100">
//               <s-divider />
//             </s-box>

//             <s-box padding="small-100">
//               <s-grid
//                 gridTemplateColumns="1fr auto"
//                 alignItems="center"
//                 gap="base"
//               >
//                 <s-box>
//                   <s-heading>Export settings</s-heading>
//                   <s-paragraph color="subdued">
//                     Download a backup of all your current settings.
//                   </s-paragraph>
//                 </s-box>
//                 <s-button>Export</s-button>
//               </s-grid>
//             </s-box>
//           </s-stack>
//         </s-section>
//       </s-page>
//     </form>
//   );
// }

import { useState } from "react";

export default function SettingsPage() {
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Simple validation: require store name and business address
  const validate = (formEntries) => {
    const newErrors = {};
    if (!formEntries["store-name"]) {
      newErrors["store-name"] = "Store name is required";
    }
    if (!formEntries["business-address"]) {
      newErrors["business-address"] = "Business address is required";
    }
    return newErrors;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(event);
    const formData = new FormData(event.target);
    const formEntries = Object.fromEntries(formData);
    const validationErrors = validate(formEntries);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Prevent submit, show errors, keep save bar visible
      return;
    }

    setSubmitting(true);
    // Optionally, show a success message or reset the form
  };

  return (
    <>
      <form data-save-bar onSubmit={handleFormSubmit} id="form-save">
        <div>
          <label>
            Store name
            <input name="store-name" defaultValue="Puzzlify Store" required />
            <input name="jdnd-name" hidden required />
          </label>
          {errors["store-name"] && (
            <div style={{ color: "red" }}>{errors["store-name"]}</div>
          )}
        </div>
        <div>
          <label>
            Business address
            <input
              name="business-address"
              defaultValue="123 Main St, Anytown, USA"
              required
            />
            <s-text-field name="hjngngn" defaultValue="kjnji n vngn" required />
          </label>
          {errors["business-address"] && (
            <div style={{ color: "red" }}>{errors["business-address"]}</div>
          )}
        </div>
        <button type="submit" disabled={submitting} slot="primary">
          Save
        </button>
      </form>
      <s-button onClick={() => setSubmitting(false)}>false</s-button>
      <s-button onClick={() => setSubmitting(true)}>true</s-button>
      <form data-save-bar>
        <s-text-field
          label="Product Title"
          name="title"
          required
        ></s-text-field>

        <s-text-area
          label="Description"
          name="description"
          rows="4"
        ></s-text-area>

        <s-text-field
          label="Price"
          name="price"
          type="number"
          step="0.01"
          min="0"
        ></s-text-field>
      </form>
    </>
  );
}
