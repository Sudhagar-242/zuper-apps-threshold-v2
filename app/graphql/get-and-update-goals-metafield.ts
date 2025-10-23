export const GET_GOALS_METAFIELD_QUERY = `query ShopAndCartGoal {
    shop {
      id
      name
      url
      currencyCode
      goals: metafield(namespace: "zuper_threshold", key: "goals") {
        id
        value
        type
      }
      discountId: metafield(namespace: "zuper_threshold", key: "discount_id") {
        id
        value
        type
      }
    }
  app {
    id
    title
    apiKey
  }
  shopifyFunctions(first: 200){
    edges{
      node{
        id
        title
        app{
          id
          title
        }
      }
    }
  }
  }`;

export const CREATE_OR_UPDATE_METAFIELD = `
mutation SetGoalDiscounts($ownerId: ID!,$key: String!,$namespace: String!, $value: String!, $type: String!) {
    metafieldsSet(
      metafields: [
        {
          ownerId: $ownerId,
          namespace: $namespace,
          key: $key,
          type: $type,
          value: $value
        }
      ]
    ) {
      metafields { id namespace key value }
      userErrors { code field message }
    }
  }
`;
