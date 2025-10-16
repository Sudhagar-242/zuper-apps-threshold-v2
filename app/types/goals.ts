import { Product } from "node_modules/@shopify/app-bridge-react/build/types/cjs/index.cjs";

type GoalBase = {
  id: string;
  isActive: boolean;
  title: string;
  goalName?: string;
  headline: string;
  topBarHeadlineIcons: string;
  topBarHeadlineSimple: string;
  confirmationMessage: string;
  remainingTargetMessage: string;
  discountAppliedMessage: string;
  compined: boolean;
};

// Condition-specific fields
type CartValueCondition = {
  condition: "cart_value";
  price: string; // required
  cartQuantity?: never;
  productsCondition?: never;
  products?: never;
};

type HasProductCondition = {
  condition: "has_product";
  productsCondition: "any" | "all";
  products: Product[]; // stringified JSON array of Product objects
  price?: never;
  cartQuantity?: never;
};

type CartQuantityCondition = {
  condition: "cart_quantity";
  cartQuantity: string;
  price?: never;
  productsCondition?: never;
  products?: never;
};

// Offer-specific fields
type FreeShippingOffer = {
  offer: "free_shipping";
  cartDiscount?: never;
  freeGifts?: never;
};

type OrderDiscountOffer = {
  offer: "order_discount";
  cartDiscount: string;
  freeGifts?: never;
};

type FreeGiftOffer = {
  offer: "free_gift";
  freeGifts: Product[]; // stringified JSON array of Product objects
  cartDiscount?: never;
};

// Combined type for conditions and offers
type GoalCondition =
  | CartValueCondition
  | HasProductCondition
  | CartQuantityCondition;
type GoalOffer = FreeShippingOffer | OrderDiscountOffer | FreeGiftOffer;

// Final Goal type
export type GoalType = GoalBase & GoalCondition & GoalOffer;
