import { json, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const { admin } = await authenticate.admin(request);

    const url = new URL(request.url);
    const afterCursor = url.searchParams.get("after") || null;

    const response = await admin.graphql(
      `#graphql
      query($after: String) {
        files(first: 10, after: $after) {
          edges {
            node {
              id
              preview {
                image {
                  url
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }`,
      {
        variables: { after: afterCursor }, // Changed this line to use 'variables' property
      },
    );

    const data = await response.json();
    console.log({ imageData: data.data.files });
    const files = data.data.files.edges.map((edge: any) => edge.node);
    return json({
      success: true,
      files,
      hasNextPage: data.data.files.pageInfo.hasNextPage,
      endCursor: data.data.files.pageInfo.endCursor,
    });
  } catch (error) {
    console.error(error);
    return json({
      success: false,
      files: [],
      hasNextPage: false,
      endCursor: null,
    });
  }
}
