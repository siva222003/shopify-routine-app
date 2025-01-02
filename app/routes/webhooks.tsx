import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // Authenticate webhook and validate HMAC
    const { topic, shop, session, admin, payload } =
      await authenticate.webhook(request);
    console.log("Webhook received", topic);

    // console.log("Admin:", admin);

    // Check if the request is from an admin, unless it's for "SHOP_REDACT"
    // if (!admin && topic !== "SHOP_REDACT") {
    //   console.log("Unauthorized webhook request");
    //   return new Response("Unauthorized", { status: 401 });
    // }

    switch (topic) {
      case "APP_UNINSTALLED":
        if (session) {
          await db.session.deleteMany({ where: { shop } });
          console.log(`Sessions for shop ${shop} have been deleted.`);
        }
        return new Response("App uninstalled data cleared", { status: 200 });

      case "SHOP_REDACT":
        console.log(`Shop data for shop ${shop} has been erased.`);
        return new Response("Shop redaction processed", { status: 200 });

      case "CUSTOMERS_DATA_REQUEST":
        console.log("Customer data request received");
        return new Response("Data request received", { status: 200 });

      case "CUSTOMERS_REDACT":
        console.log("Customer data redaction received");
        return new Response("Customer redaction processed", { status: 200 });

      case "ORDERS_CREATE":
        console.log("Order created", payload);
        return new Response("Order created", { status: 200 });

      default:
        return new Response("Unhandled webhook topic", { status: 404 });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Unauthorized", { status: 401 });
  }
};
