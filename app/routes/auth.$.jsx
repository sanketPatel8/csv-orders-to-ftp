// import { authenticate } from "../shopify.server";

// export const loader = async ({ request }) => {
//   await authenticate.admin(request);

//   return null;
// };

import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  try {
    const { admin, session, shop } = await authenticate.admin(request);

    console.log("🔐 Admin authenticated:", shop);

    return null;
  } catch (error) {
    console.error("❌ Admin auth failed:", error);

    // Extract shop domain from URL
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");

    // Redirect user to Shopify login flow
    return Response.redirect(`/auth?shop=${shop}`, 302);
  }
};
