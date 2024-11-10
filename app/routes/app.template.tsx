import { ActionFunctionArgs, json } from "@remix-run/node";
import { userApi } from "~/utils/axios";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return json({ success: false, error: "No id provided for routine" });
    }

    const data = await request.json();
    console.log("Received Payload:", data);

    const response = await userApi.post(
      `/reminderlist/template/clone/${id}`,
      data,
    );

    console.log("API Response:", response.data);

    return json({
      success: true,
      response: response.data,
    });
  } catch (error: any) {
    console.error("Error Adding Channels:", error.message || error);

    return json({
      success: false,
      error: error.message || "Something went wrong",
    });
  }
}
