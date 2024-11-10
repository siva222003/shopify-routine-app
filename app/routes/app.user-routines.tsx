import { json, LoaderFunctionArgs } from "@remix-run/node";
import { userApi } from "~/utils/axios";
import { genToken, isTokenExpired } from "~/utils/gen-token";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // const token =
    //   request.headers.get("Authorization")?.split("Bearer ")[1] || null;
    // const id = request.headers.get("customer-id");

    // const isTokenProvided = token !== null && token !== "";

    // const tokenExpired = token ? isTokenExpired(token) : true;

    // let newToken: string | null = null;

    // const parsedId = id ? parseInt(id) : null;

    // if (!isTokenProvided || tokenExpired || !parsedId) {
    //   if (!parsedId) {
    //     return json({
    //       success: false,
    //       error: "Invalid customer ID provided",
    //     });
    //   }
    //   newToken = genToken({ id: parsedId });
    // } else {
    //   newToken = token as string;
    // }

    // console.log("New token:", newToken);

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
