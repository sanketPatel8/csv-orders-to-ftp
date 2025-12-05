// utils/register-webhooks.server.js
import shopify from "../shopify.server";

export async function registerWebhooks(session) {
  const responses = await shopify.webhooks.register({
    session,
    registrations: [
      {
        topic: "APP_UNINSTALLED",
        deliveryMethod: "HTTP",
        callbackUrl: "/webhooks/app/uninstalled",
      },
    ],
  });

  console.log("WEBHOOK RESPONSE:", responses);
}
