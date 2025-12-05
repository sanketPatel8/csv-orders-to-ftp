import { authenticate } from "../shopify.server";
import { deleteStore } from "../models/acmeStores.server";

export const action = async ({ request }) => {
  const { shop, topic } = await authenticate.webhook(request);

  console.log("🔥 App uninstalled from:", shop);

  // Remove store from MySQL
  await deleteStore(shop);

  return new Response("Webhook processed", { status: 200 });
};
