import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { channel } from "diagnostics_channel";
import { userApi } from "~/utils/axios";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const data = await request.json();

    const response = await userApi.post("/channel", data);

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
