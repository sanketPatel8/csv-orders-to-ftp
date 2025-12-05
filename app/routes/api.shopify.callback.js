import { authenticate } from "../shopify.server";
import { createOrUpdateStore } from "../models/acmeStores.server";

export const loader = async ({ request }) => {
  const { session, admin, shop, accessToken } =
    await authenticate.callback(request);

  // Save ONLY basic data (no name, no email, no country)
  await createOrUpdateStore({
    shop_domain: shop,
    access_token: accessToken,
    store_name: "",
    email: "",
    country: "",
  });

  return session.redirect("/");
};
