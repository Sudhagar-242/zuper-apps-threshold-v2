
export const SET_GOAL_DISCOUNTS_METAFIELD = `
  mutation SetGoalDiscounts($ownerId: ID!, $value: String!) {
    metafieldsSet(
      metafields: [
        {
          ownerId: $ownerId,
          namespace: "spending_goal",
          key: "goal_discounts",
          type: "json",
          value: $value
        }
      ]
    ) {
      metafields { id namespace key value }
      userErrors { code field message }
    }
  }
`;

export const SET_DISCOUNT_ID_METAFIELD = `
  mutation SetDiscountId($ownerId: ID!, $discountId: String!) {
    metafieldsSet(
      metafields: [
        {
          ownerId: $ownerId,
          namespace: "spending_goal",
          key: "discount_id",
          type: "single_line_text_field",
          value: $discountId
        }
      ]
    ) {
      metafields { id namespace key value }
      userErrors { code field message }
    }
  }
`;


//Query
export const FUNCTION_AUTOMATIC_DISCOUNT_QUERY = `
  query getDiscount($id: ID!){
  discountNode(id: $id){
    id
    discount{
      ... on DiscountAutomaticApp{
        title
        appDiscountType{
          title
        }
      }
    }
  }
}
`;

//mutations
export const CREATE_AUTOMATIC_DISCOUNT_MUTATION = `
  mutation CreateAutomaticDiscount($discountInput: DiscountAutomaticAppInput!) {
    discountAutomaticAppCreate(automaticAppDiscount: $discountInput) {
      automaticAppDiscount {
        discountId
      }
      userErrors { code field message }
    }
  }
`;

export interface CREATE_AUTOMATIC_DISCOUNT_MUTATION_TYPE {
  discountInput: {
    title: string;
    functionId: string;
    startsAt: string;
    discountClasses: ('PRODUCT' | 'SHIPPING' | 'ORDER')[];
    combinesWith: {
      orderDiscounts: boolean;
      productDiscounts: boolean;
      shippingDiscounts: boolean;
    };
  };
}

export const UPDATE_AUTOMATIC_DISCOUNT_MUTATION = `
  mutation UpdateAutomaticDiscount($id: ID!,$discountInput: DiscountAutomaticAppInput!) {
    discountAutomaticAppUpdate(id: $id,automaticAppDiscount: $discountInput) {
      automaticAppDiscount {
        discountId
      }
      userErrors { code field message }
    }
  }
`;
