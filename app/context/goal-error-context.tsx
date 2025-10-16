import React, { createContext, useState, ReactNode, useContext } from "react";

type ErrorContextType = {
  isAnyError: boolean;
  setIsAnyError: React.Dispatch<React.SetStateAction<boolean>>;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

type ProviderProps = {
  children: ReactNode;
  isAnyError: boolean;
  setIsAnyError: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ErrorContextProvider = ({
  children,
  isAnyError,
  setIsAnyError,
}: ProviderProps) => {
  return (
    <ErrorContext.Provider value={{ isAnyError, setIsAnyError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorContext = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error(
      "useErrorContextContext must be used within a ErrorContextContextProvider",
    );
  }
  return context;
};

export default ErrorContext;
