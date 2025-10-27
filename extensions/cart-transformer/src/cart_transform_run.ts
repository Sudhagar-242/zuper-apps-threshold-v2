import type {
  CartTransformRunInput,
  CartTransformRunResult,
} from "../generated/api";

const NO_CHANGES: CartTransformRunResult = {
  operations: [],
};

export function cartTransformRun(
  input: CartTransformRunInput,
): CartTransformRunResult {
  console.log(
    "cart transfoermer workers",
    JSON.stringify(input.shop.metafield?.value),
  );
  return NO_CHANGES;
}

// import type {
//   CartTransformRunInput,
//   CartTransformRunResult,
// } from "../generated/api";

// const NO_CHANGES: CartTransformRunResult = {
//   operations: [],
// };

// export function cartTransformRun(
//   input: CartTransformRunInput,
// ): CartTransformRunResult {
//   const threshold = 20;
//   const freeGiftVariantId = "gid://shopify/ProductVariant/51050929586455";

//   // Calculate subtotal
//   const subtotal = input.cart.lines.reduce((sum, line) => {
//     const amount = parseFloat(
//       line.cost?.totalAmount?.amount ??
//         line.cost?.totalAmount?.amount ??
//         "0",
//     );
//     return sum + amount * (line.quantity ?? 1);
//   }, 0);

//   // Check if free gift is already in cart
//   const hasFreeGift = input.cart.lines.some(
//     (line) =>
//       line.merchandise?.__typename === "ProductVariant" &&
//       line.merchandise.id === freeGiftVariantId,
//   );

//   if (subtotal >= threshold && !hasFreeGift && input.cart.lines.length > 0) {
//     const firstLine = input.cart.lines[0];
//     return {
//       operations: [
//         {
//           lineExpand: {
//             cartLineId: firstLine.id,
//             expandedCartItems: [
//               {
//                 merchandiseId: firstLine.merchandise.id,
//                 quantity: firstLine.quantity,
//                 price: firstLine.cost?.totalAmount
//                   ? {
//                       adjustment: {
//                         fixedPricePerUnit: {
//                           amount: firstLine.cost.totalAmount.amount,
//                         },
//                       },
//                     }
//                   : undefined,
//               },
//               {
//                 merchandiseId: freeGiftVariantId,
//                 quantity: 1,
//                 price: {
//                   adjustment: {
//                     fixedPricePerUnit: {
//                       amount: 0,
//                     },
//                   },
//                 },
//               },
//             ],
//             title: firstLine.merchandise?.title,
//           },
//         },
//       ],
//     };
//   }

//   return NO_CHANGES;
// }
