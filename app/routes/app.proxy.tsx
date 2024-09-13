import { json, LoaderFunctionArgs } from "@remix-run/node";
import React from "react";
import { authenticate } from "~/shopify.server";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log("-----------------TEST-----------------");
  const { session, storefront } = await authenticate.public.appProxy(request);

  if (!session || !storefront) {
    return new Response("Unauthorized", { status: 401 });
  }

  return json({ message: "Hello from loader proxy!" });
}
