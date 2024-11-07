import { json, LoaderFunctionArgs } from "@remix-run/node";
import { userApi } from "~/utils/axios";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const [productRemindersData, activityRemindersData] = await Promise.all([
      userApi.get("/reminder/find/today"),
      userApi.get("/reminder-activity/find/today"),
    ]);

    const productReminders = productRemindersData.data.data;
    const activityReminders = activityRemindersData.data.data;

    return json({
      success: true,
      productReminders,
      activityReminders,
    });
  } catch (error: any) {
    console.error("Error fetching data:", error.message || error);

    return json({
      success: false,
      error: error.message || "Something went wrong",
    });
  }
}
