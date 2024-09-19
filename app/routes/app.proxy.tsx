import { json, LoaderFunctionArgs } from "@remix-run/node";
import React from "react";
import { authenticate } from "~/shopify.server";

import prisma from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log("-----------------TEST-----------------");
  const { session, storefront } = await authenticate.public.appProxy(request);

  if (!session || !storefront) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const url = new URL(request.url);

    const query = url.searchParams.get("type");

    if (query === "routines") {
      const routines = await prisma.routine.findMany();
      return json({ data: routines });
    }

    if (query === "routine") {
      const id = url.searchParams.get("id");

      if (!id) {
        return json(
          { error: "Routine ID is required", data: [] },
          { status: 400 },
        );
      }

      const routine = await prisma.routine.findUnique({
        where: {
          id: id,
        },
      });
      return json({ data: routine });
    }
  } catch (error) {
    return json({ error: "Some Error Occured", data: [] }, { status: 500 });
  }
}
