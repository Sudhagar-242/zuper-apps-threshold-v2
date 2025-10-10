type Product = {
  id: string;
  title: string;
};

type GoalBase = {
  isActive: "true" | "false";
  title: string;
  headline: string;
  topBarHeadlineIcons: string;
  topBarHeadlineSimple: string;
  confirmationMessage: string;
  remainingTargetMessage: string;
  discountAppliedMessage: string;
  compined: "true" | "false";
};

// Condition-specific fields
type CartValueCondition = {
  condition: "cart_value";
  price: string; // required
  cartQuantity?: never;
  productsCondition?: never;
  Products?: never;
};

type HasProductCondition = {
  condition: "has_product";
  productsCondition: "any" | "all";
  Products: string; // stringified JSON array of Product objects
  price?: never;
  cartQuantity?: never;
};

type CartQuantityCondition = {
  condition: "cart_quantity";
  cartQuantity: string;
  price?: never;
  productsCondition?: never;
  Products?: never;
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
  freeGifts: string; // stringified JSON array of Product objects
  cartDiscount?: never;
};

// Combined type for conditions and offers
type GoalCondition = CartValueCondition | HasProductCondition | CartQuantityCondition;
type GoalOffer = FreeShippingOffer | OrderDiscountOffer | FreeGiftOffer;

// Final Goal type
export type GoalType = GoalBase & GoalCondition & GoalOffer;
