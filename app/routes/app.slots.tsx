import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { userApi } from "~/utils/axios";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const data = await request.json();

    const { date, Ids } = data;

    const reminderIds = Ids.join(",");

    const reminders = await userApi.get(
      `/marker/slots/by-date?reminderIds=${reminderIds}&date=${date}`,
    );

    return json({ success: true, reminders: reminders.data.data });
  } catch (error: any) {
    console.error("Error fetching routine:", error.message || error);

    return json({
      success: false,
      error: error.message || "Something went wrong while fetching routine",
    });
  }
}
