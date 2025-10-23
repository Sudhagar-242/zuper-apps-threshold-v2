export const CREATE_CART_TRANSFORM_EXISTANCE = `mutation CartTransformCreate($functionId: String!, $blockOnFailure: Boolean!) {
  cartTransformCreate(
    functionHandle: $functionId
    blockOnFailure: $blockOnFailure
  ) {
    userErrors {
      field
      message
    }
    cartTransform {
      id
    }
  }
}`;
