import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { topic, shop, payload } = await authenticate.webhook(request);

  console.log(`🔄 Scopes updated for: ${shop}`);
  console.log("New scopes:", payload?.current);

  return new Response("OK", { status: 200 });
};
