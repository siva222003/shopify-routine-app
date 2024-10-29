import { json, LoaderFunctionArgs } from "@remix-run/node";
import { userApi } from "~/utils/axios";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const routines = await userApi.get(`/reminderlist`);

    return json({ success: true, routines: routines.data.data });
  } catch (error: any) {
    console.error("Error fetching user routines:", error.message || error);

    return json({
      success: false,
      error:
        error.message || "Something went wrong while fetching user routines",
    });
  }
}
