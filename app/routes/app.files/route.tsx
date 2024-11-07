import { json, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const { admin } = await authenticate.admin(request);
    const response = await admin.graphql(
      `#graphql
    query {
      files(first: 10, query: "mime_type:image/") {
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
      }
    }`,
    );

    const data = await response.json();
    const files = data.data.files.edges.map((edge: any) => edge.node);
    return json({
      success: true,
      files,
    });
  } catch (error) {
    console.error(error);
    return json({
      success: false,
      files: [],
    });
  }
}
