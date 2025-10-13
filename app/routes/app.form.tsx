import { useState, useEffect, useRef } from "react";

import { authenticate } from "app/shopify.server";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useLoaderData,
  useSubmit,
} from "react-router";
import FormExampleComponent from "app/components/addGoals/formExampleComponent";
import {
  GET_GOALS_METAFIELD_QUERY,
  CREATE_OR_UPDATE_METAFIELD,
} from "app/graphql/get-and-update-goals-metafield";
import { GoalType } from "app/types/goals";
import { ensureDiscountExists } from "app/utils/create-discount-function-existance";
import AddGoalBlock from "app/components/addGoals/goal-add-block";
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
  title: "",
  goalName: "Spend More",
  isActive: "true",
  condition: "cart_value",
  price: "100",
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
  console.log(functionId);
  await ensureDiscountExists(
    admin,
    data.shop.discountId,
    data.shop.id,
    functionId,
  );
  return await { shopId: data.shop.id, goalsMetafield: data.shop.goals };
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

const parseGoalsFromForm = (formData) => {
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

function DynamicForm() {
  const { shopId, goalsMetafield } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  console.log("goals", goalsMetafield);
  console.log("id", shopId);

  // Last saved state of inputs
  const [savedInputs, setSavedInputs] = useState(
    JSON.parse(goalsMetafield?.value as string),
  );
  // Inputs used for rendering; changes live here
  const [inputs, setInputs] = useState(savedInputs);
  const [UnSavedChanges, setUnSavedChanges] = useState(false);

  const [savedOrNot, setSavedOrNot] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (UnSavedChanges) {
      triggerChange();
    }
  }, [inputs, UnSavedChanges]);

  const triggerChange = () => {
    console.log("Ref before dispatch:", inputRef.current);
    if (inputRef.current) {
      inputRef.current.value = JSON.stringify(Math.random());
      inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    } else {
      console.log("Ref is null or detached.");
    }
  };

  // Add new empty input group
  const handleAdd = () => {
    setInputs((prev) => [...prev, createEmptyGoal]);
    console.log(inputRef.current);
    setUnSavedChanges(true);
  };

  // Remove input group by index
  const handleRemove = (index) => {
    console.log("Removing index:", index);
    setInputs((prev) => prev.filter((_, i) => i !== index));
    setUnSavedChanges(true);
  };

  // Save: update savedInputs and inputs state
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const parsedData = parseGoalsFromForm(formData);
    console.log(parsedData);
    submit({ goals: JSON.stringify(parsedData), shopId }, { method: "POST" });
    setSavedInputs(parsedData);
    setInputs(parsedData);
    setUnSavedChanges(false);
    setSavedOrNot(true);
    alert("Saved data:\n" + JSON.stringify(parsedData, null, 2));
  };

  // Discard: reset inputs to last savedInputs on form reset
  const handleDiscard = (event) => {
    event.preventDefault();
    setInputs(savedInputs);
    setUnSavedChanges(false);
    setSavedOrNot(false);
    alert("Changes discarded, reverted to last saved state.");
  };

  return (
    <FormSaveBarStatusProvider
      setSavedOrNot={setSavedOrNot}
      savedOrNot={savedOrNot}
    >
      <div style={{ margin: "auto" }}>
        <h3>Dynamic Input Form with Save/Discard</h3>
        <form
          onSubmit={handleSubmit}
          onReset={handleDiscard}
          onErrorCapture={(e) => console.log("error occurs")}
          data-save-bar
        >
          <input hidden name={`goals[id]`} ref={inputRef} />
          {inputs?.map((input, index) => (
            <div
              key={index}
              style={{
                marginBottom: 15,
                paddingBottom: 10,
                borderBottom: "1px solid #ccc",
              }}
            >
              <AddGoalBlock
                key={`goal-${index}`}
                id={`goal-${index}`}
                idx={index}
                goal={input}
                isActiveGoal={input.isActive === "true"}
                onChange={() => setUnSavedChanges(true)}
                onRemove={() => handleRemove(index)}
              />
              {inputs.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  style={{
                    marginLeft: 20,
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={handleAdd} style={{ marginRight: 10 }}>
            Add New
          </button>
          <button type="submit" style={{ marginRight: 10 }}>
            Save All
          </button>
          <button type="reset">Discard Changes</button>
        </form>
      </div>
    </FormSaveBarStatusProvider>
  );
}

export default DynamicForm;

// export default function MyForm() {
//   const [savedData, setSavedData] = useState(initialData);
//   const [formData, setFormData] = useState(initialData);
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = (e) => {
//     e.preventDefault();
//     setSavedData(formData);
//     console.log("Saved!");
//   };

//   // Called on form reset event
//   const handleDiscard = (e) => {
//     e.preventDefault();
//     setFormData(savedData); // Revert form data to last saved state
//     console.log("Changes discarded!");
//   };

//   return (
//     <form data-save-bar onReset={handleDiscard} onSubmit={handleSave}>
//       {<input name="name" value={formData.name} onChange={handleChange} />
//       <input name="email" value={formData.email} onChange={handleChange} />}
//       <button type="submit" onClick={handleSave}>
//         Save
//       </button>
//       <button type="reset">Discard</button>
//     </form>
//   );
// }
