import { json, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log("Came");

  const { session, admin } = await authenticate.public.appProxy(request);

  console.log("Came");

  if (!session) {
    return json({ success: "UnAuthorized" });
  }

  console.log("Came");

  return json({ message: "Hello, world!" });
}
