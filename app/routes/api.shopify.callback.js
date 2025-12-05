import { createOrUpdateStore } from "../models/acmeStores.server";

export async function loader({ request }) {
  // After OAuth complete
  const shop = "demo.myshopify.com";
  const accessToken = "xyz";
  const storeInfo = {
    shop_domain: shop,
    access_token: accessToken,
    store_name: "Demo Store",
    email: "owner@test.com",
    country: "IN",
  };

  await createOrUpdateStore(storeInfo);

  return new Response("Installed");
}
