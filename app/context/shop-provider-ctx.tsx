import React, { createContext, useContext, ReactNode } from "react";

const ShopContext = createContext<unknown>(undefined);

export function ShopProvider<T>({
  children,
  shop,
}: {
  children: ReactNode;
  shop: T;
}) {
  return <ShopContext.Provider value={shop}>{children}</ShopContext.Provider>;
}

// Custom hook to consume the shop context
export function useShop<T>() {
  const context = useContext(ShopContext) as T;
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
