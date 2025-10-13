import React, { useState } from "react";

interface Props {
  index: number;
  name: string;
  email: string;
  choice: string;
}

function FormExampleComponent({ name, email, index, choice }: Props) {
  const [selected, setselected] = useState(choice);
  console.log(selected);
  return (
    <>
      <s-choice-list
        label="Company name"
        name={`goals[${index}][choice]`}
        details="The company name will be displayed on the checkout page."
        onChange={(e) => setselected(e.currentTarget.values[0])}
      >
        <s-choice value="hidden" defaultSelected={choice === "hidden"}>
          Hidden
        </s-choice>
        <s-choice value="optional" defaultSelected={choice === "optional"}>
          Optional
        </s-choice>
        <s-choice value="required" defaultSelected={choice === "required"}>
          Required
        </s-choice>
      </s-choice-list>
      <s-text-field
        label="name"
        name={`goals[${index}][name]`}
        defaultValue={name}
        placeholder="Enter name"
        labelAccessibilityVisibility="exclusive"
      />
      <s-email-field
        label="email"
        name={`goals[${index}][email]`}
        defaultValue={email}
        placeholder="Enter email"
        labelAccessibilityVisibility="exclusive"
      />
    </>
  );
}

export default FormExampleComponent;
