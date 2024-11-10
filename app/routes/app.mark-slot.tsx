import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { userApi } from "~/utils/axios";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const data = await request.json();

    console.log({ data });

    const { reminderId } = data;

    const response = await userApi.patch(`/marker/${reminderId}`, data);

    return json({
      success: true,
      response: response.data.data,
    });
  } catch (error: any) {
    console.error("Error Updating Slot:", error.message || error);

    return json({
      success: false,
      error: error.message || "Something went wrong",
    });
  }
}
