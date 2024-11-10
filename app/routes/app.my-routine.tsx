import { json, LoaderFunctionArgs } from "@remix-run/node";
import { userApi } from "~/utils/axios";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return json({ success: false, error: "No id provided for routine" });
    }

    const routine = await userApi.get(`/reminderlist/${id}`);

    return json({ success: true, routine: routine.data.data });
  } catch (error: any) {
    console.error("Error fetching routine:", error.message || error);

    return json({
      success: false,
      error: error.message || "Something went wrong while fetching routine",
    });
  }
}
