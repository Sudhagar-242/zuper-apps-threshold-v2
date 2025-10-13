import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the context
type FormSaveBarContextType = {
  savedOrNot: boolean;
  setSavedOrNot: React.Dispatch<React.SetStateAction<boolean>>;
};

// Create the context with a default (optional)
const FormSaveBarStatusContext = createContext<
  FormSaveBarContextType | undefined
>(undefined);

// Create a provider component
export const FormSaveBarStatusProvider = ({
  children,
  savedOrNot,
  setSavedOrNot,
}: {
  children: ReactNode;
  savedOrNot: boolean;
  setSavedOrNot: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <FormSaveBarStatusContext.Provider value={{ savedOrNot, setSavedOrNot }}>
      {children}
    </FormSaveBarStatusContext.Provider>
  );
};

// Optional: create a custom hook to consume the context
export const useFormSaveBarStatus = () => {
  const context = useContext(FormSaveBarStatusContext);
  if (!context) {
    throw new Error(
      "useFormSaveBarStatus must be used within a FormSaveBarStatusProvider",
    );
  }
  return context;
};
