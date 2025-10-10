import { AdminApiContext } from "@shopify/shopify-app-react-router/server";
import {
  CREATE_AUTOMATIC_DISCOUNT_MUTATION,
  SET_DISCOUNT_ID_METAFIELD,
  FUNCTION_AUTOMATIC_DISCOUNT_QUERY,
} from "app/graphql/discount-existance-query";

const DISCOUNT_TITLE = "Cart Goal Discount";

function buildDiscountInput(functionId: string): Record<string, any> {
  return {
    title: DISCOUNT_TITLE,
    functionId,
    startsAt: new Date().toISOString(),
    discountClasses: ["PRODUCT", "SHIPPING", "ORDER"],
    combinesWith: {
      orderDiscounts: true,
      productDiscounts: true,
      shippingDiscounts: true,
    },
  };
}

async function createDiscount(admin: AdminApiContext, functionId: string) {
  const discountInput = buildDiscountInput(functionId);

  try {
    const response = await admin.graphql(CREATE_AUTOMATIC_DISCOUNT_MUTATION, {
      variables: { discountInput },
    });

    const json = await response.json();
    const data = json?.data?.discountAutomaticAppCreate;

    const userErrors = data?.userErrors || [];

    if (userErrors.length > 0) {
      return { success: false, errors: userErrors };
    }

    return {
      success: !!data?.automaticAppDiscount?.discountId,
      discountId: data?.automaticAppDiscount?.discountId,
    };
  } catch (error) {
    console.error("[Discount] Error creating discount:", error);
    return { success: false, errors: [error as Error] };
  }
}

async function saveDiscountIdMetafield(
  admin: AdminApiContext,
  shopId: string,
  discountId: string,
) {
  try {
    await admin.graphql(SET_DISCOUNT_ID_METAFIELD, {
      variables: { ShopId: shopId, discountId },
    });
  } catch (err) {
    console.error("[Metafield] Error saving discountId:", err);
  }
}

async function discountExists(
  admin: AdminApiContext,
  discountId: string,
): Promise<boolean> {
  try {
    const response = await admin.graphql(FUNCTION_AUTOMATIC_DISCOUNT_QUERY, {
      variables: { id: discountId },
    });

    const json = await response.json();
    const data = json?.data?.discountNode;

    return !!data;
  } catch (err) {
    console.error("[Discount] Error verifying discount existence:", err);
    return false;
  }
}

export async function ensureDiscountExists(
  admin: AdminApiContext,
  existingDiscountId: string | null,
  shopId: string,
  functionId: string,
) {
  const isValidDiscountId =
    existingDiscountId?.startsWith("gid://shopify/DiscountAutomaticNode/") ??
    false;

  if (
    isValidDiscountId &&
    (await discountExists(admin, existingDiscountId ?? ""))
  ) {
    console.log("[Discount] Existing discount valid:", existingDiscountId);
    return { success: true, discountId: existingDiscountId };
  }

  // Create new discount
  const creation = await createDiscount(admin, functionId);

  if (!creation.success) {
    const isDuplicateTitle = creation.errors?.some(
      (error: { message: string }) =>
        error.message === "Title must be unique for automatic discount.",
    );

    if (isDuplicateTitle) {
      console.error(
        "[Discount] Title conflict. Title must be unique for automatic discount.",
      );
    } else {
      console.error("[Discount] Discount creation failed:", creation.errors);
    }

    return { success: false, errors: creation.errors };
  }

  // Save metafield and return
  if (creation.discountId) {
    console.log("[Discount] Saving new discountId:", creation.discountId);
    await saveDiscountIdMetafield(admin, shopId, creation.discountId);
    return { success: true, discountId: creation.discountId };
  }

  return { success: false };
}
