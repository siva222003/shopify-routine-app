import { json, LoaderFunctionArgs } from "@remix-run/node";
import { userApi } from "~/utils/axios";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const [routinesTemplates, categoryResponse] = await Promise.all([
      userApi.get("/reminderlist/list/templates"),
      userApi.get("/category"),
    ]);

    const routines = routinesTemplates.data.data;
    const categories = categoryResponse.data.data;

    return json({
      success: true,
      routines,
      categories,
    });
  } catch (error: any) {
    console.error("Error fetching data:", error.message || error);

    return json({
      success: false,
      error: error.message || "Something went wrong",
    });
  }
}
