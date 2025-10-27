import React from "react";
import { Product } from "node_modules/@shopify/app-bridge-react/build/types/cjs/index.cjs";

interface ProductTableType {
  handleRemoveProducts: (productId: string) => void;
  products: Product[];
}

const ProductTable = ({ handleRemoveProducts, products }: ProductTableType) => {
  return (
    <s-table>
      <s-table-header-row>
        <s-table-header listSlot="primary">Product</s-table-header>
        <s-table-header>Remove</s-table-header>
      </s-table-header-row>
      <s-table-body>
        {products.map((product) => (
          <React.Fragment key={product.id}>
            <s-table-row>
              <s-table-cell>{product.title}</s-table-cell>
              <s-table-cell>
                <s-link onClick={() => handleRemoveProducts(product.id)}>
                  Remove
                </s-link>
              </s-table-cell>
            </s-table-row>
          </React.Fragment>
        ))}
      </s-table-body>
    </s-table>
  );
};

export default ProductTable;
