import { useEffect } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useFetcher, useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const resp = await admin.graphql(`query{
  shop{
    url
    primaryDomain{
      host
    }
  }
  app{
    apiKey
  }
}`);

  const data = (await resp.json()).data;
  const shop = data.shop.primaryDomain.host;
  const api_key = data.app.apiKey;

  console.log("resp", shop, api_key);

  return { shop, api_key };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();

  const product = responseJson.data!.productCreate!.product!;
  const variantId = product.variants.edges[0]!.node!.id!;

  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyReactRouterTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    },
  );

  const variantResponseJson = await variantResponse.json();

  return {
    product: responseJson!.data!.productCreate!.product,
    variant:
      variantResponseJson!.data!.productVariantsBulkUpdate!.productVariants,
  };
};

export default function Index() {
  const { shop, api_key } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";
  const productId = fetcher.data?.product?.id.replace(
    "gid://shopify/Product/",
    "",
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId, shopify]);
  const generateProduct = () => fetcher.submit({}, { method: "POST" });

  return (
    <s-page heading="ZuperApps Goalify">
      <s-button
        slot="primary-action"
        variant="primary"
        onClick={generateProduct}
      >
        Create Goal
      </s-button>

      <s-box accessibilityLabel="Empty state section">
        <s-grid gap="base" justifyItems="center" paddingBlock="large-400">
          <s-box maxInlineSize="200px" maxBlockSize="200px">
            <s-image
              aspectRatio="1/0.5"
              src="https://cdn.shopify.com/static/images/polaris/patterns/callout.png"
              alt="A stylized graphic of four characters, each holding a puzzle piece"
            />
          </s-box>
          <s-grid justifyItems="center" maxInlineSize="450px" gap="base">
            <s-stack alignItems="center">
              <s-heading>Start creating Goals</s-heading>
              <s-paragraph>
                Create and manage your collection of Goals for increase AVO.
              </s-paragraph>
            </s-stack>
            <s-button-group>
               <s-button slot="secondary-actions" aria-label="Learn more about creating puzzles"
               href={`https://${shop}/admin/themes/current/editor?context=apps&template=${'main'}&activateAppId=${api_key}/${'app-embed-block'}`}
              > Goto Inside </s-button>
      
              <s-button
                slot="primary-action"
                aria-label="Add a new Goal"
                href="/app/configuration-add-goals"
              >
                View Goal
              </s-button>
            </s-button-group>
          </s-grid>
        </s-grid>
      </s-box>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};

// <s-section heading="Congrats on creating a new Shopify app 🎉">
//   <s-paragraph>
//     This embedded app template uses{" "}
//     <s-link
//       href="https://shopify.dev/docs/apps/tools/app-bridge"
//       target="_blank"
//     >
//       App Bridge
//     </s-link>{" "}
//     interface examples like an{" "}
//     <s-link href="/app/additional">additional page in the app nav</s-link>
//     , as well as an{" "}
//     <s-link
//       href="https://shopify.dev/docs/api/admin-graphql"
//       target="_blank"
//     >
//       Admin GraphQL
//     </s-link>{" "}
//     mutation demo, to provide a starting point for app development.
//   </s-paragraph>
// </s-section>
// <s-section heading="Get started with products">
//   <s-paragraph>
//     Generate a product with GraphQL and get the JSON output for that
//     product. Learn more about the{" "}
//     <s-link
//       href="https://shopify.dev/docs/api/admin-graphql/latest/mutations/productCreate"
//       target="_blank"
//     >
//       productCreate
//     </s-link>{" "}
//     mutation in our API references.
//   </s-paragraph>
//   <s-stack direction="inline" gap="base">
//     <s-button
//       onClick={generateProduct}
//       {...(isLoading ? { loading: true } : {})}
//     >
//       Generate a product
//     </s-button>
//     {fetcher.data?.product && (
//       <s-button
//         href={`shopify:admin/products/${productId}`}
//         target="_blank"
//         variant="tertiary"
//       >
//         View product
//       </s-button>
//     )}
//   </s-stack>
//   {fetcher.data?.product && (
//     <s-section heading="productCreate mutation">
//       <s-stack direction="block" gap="base">
//         <s-box
//           padding="base"
//           borderWidth="base"
//           borderRadius="base"
//           background="subdued"
//         >
//           <pre style={{ margin: 0 }}>
//             <code>{JSON.stringify(fetcher.data.product, null, 2)}</code>
//           </pre>
//         </s-box>

//         <s-heading>productVariantsBulkUpdate mutation</s-heading>
//         <s-box
//           padding="base"
//           borderWidth="base"
//           borderRadius="base"
//           background="subdued"
//         >
//           <pre style={{ margin: 0 }}>
//             <code>{JSON.stringify(fetcher.data.variant, null, 2)}</code>
//           </pre>
//         </s-box>
//       </s-stack>
//     </s-section>
//   )}
// </s-section>

// <s-section slot="aside" heading="App template specs">
//   <s-paragraph>
//     <s-text>Framework: </s-text>
//     <s-link href="https://reactrouter.com/" target="_blank">
//       React Router
//     </s-link>
//   </s-paragraph>
//   <s-paragraph>
//     <s-text>Interface: </s-text>
//     <s-link
//       href="https://shopify.dev/docs/api/app-home/using-polaris-components"
//       target="_blank"
//     >
//       Polaris web components
//     </s-link>
//   </s-paragraph>
//   <s-paragraph>
//     <s-text>API: </s-text>
//     <s-link
//       href="https://shopify.dev/docs/api/admin-graphql"
//       target="_blank"
//     >
//       GraphQL
//     </s-link>
//   </s-paragraph>
//   <s-paragraph>
//     <s-text>Database: </s-text>
//     <s-link href="https://www.prisma.io/" target="_blank">
//       Prisma
//     </s-link>
//   </s-paragraph>
// </s-section>

// <s-section slot="aside" heading="Next steps">
//   <s-unordered-list>
//     <s-list-item>
//       Build an{" "}
//       <s-link
//         href="https://shopify.dev/docs/apps/getting-started/build-app-example"
//         target="_blank"
//       >
//         example app
//       </s-link>
//     </s-list-item>
//     <s-list-item>
//       Explore Shopify&apos;s API with{" "}
//       <s-link
//         href="https://shopify.dev/docs/apps/tools/graphiql-admin-api"
//         target="_blank"
//       >
//         GraphiQL
//       </s-link>
//     </s-list-item>
//   </s-unordered-list>
// </s-section>
