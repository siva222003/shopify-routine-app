import { json, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

import prisma from "~/db.server";
import { useLoaderData } from "@remix-run/react";
import { api } from "~/utils/axios";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { session, admin } = await authenticate.public.appProxy(request);

  if (!session) {
    return json({ success: "UnAuthorized" });
  }

  // const { admin, session } = await authenticate.admin(request);

  const url = new URL(request.url);
  // const loggedInCustomerId = url.searchParams.get("logged_in_customer_id");

  const type = url.searchParams.get("type");

  try {
    if (type === "all") {
      // const routines = await prisma.routine.findMany({});
      const routines = await api.get("/admin/reminderlist?page=1");

      return json({ success: true, routines: routines.data.data.docs });
    } else if (type === "single") {
      const id = url.searchParams.get("id");

      if (!id) {
        return json({ success: false, error: "No id provided for routine" });
      }

      // const routine = await prisma.routine.findUnique({
      //   where: {
      //     id,
      //   },
      //   include: {
      //     productReminders: true,
      //     activityReminders: true,
      //     WeeklyBenfits: true,
      //   },
      // });

      const routine = await api.get(`/admin/reminderlist/${id}`);

      return json({ success: true, routine: routine.data });
    }
  } catch (error) {
    console.log(error);
    return json({ success: false, error });
  }
}
