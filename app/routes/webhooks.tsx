import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin } = await authenticate.webhook(request);

  console.log("Webhook received", topic);

  // if (!admin && topic !== "SHOP_REDACT") {
  //   console.log("Unauthorized webhook");
  //   throw new Response();
  // }

  switch (topic) {
    case "APP_UNINSTALLED":
      console.log("App Uninstalled");
      break;

    case "CUSTOMERS_DATA_REQUEST":
      // Handle customer data request here
      // Log or process data as needed, then acknowledge receipt
      console.log("Customer data request received");  
      return new Response("Data request received", { status: 200 });

    case "CUSTOMERS_REDACT":
      // Handle customer data redaction here
      // Perform redaction, log, or acknowledge as required
      return new Response("Customer redaction processed", { status: 200 });

    case "SHOP_REDACT":
      // Handle shop data redaction here
      // Perform redaction, log, or acknowledge as required
      return new Response("Shop redaction processed", { status: 200 });

    //  case "REA"

    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
