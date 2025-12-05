import { shopify } from "../shopify.server";
import { redirect } from "@remix-run/node";

export const loader = async ({ request, params }) => {
  console.log("🔔 [Callback Route] Hit /auth/{shop}/callback");
  console.log("📦 Params received:", params);

  try {
    console.log("🔄 Completing OAuth callback...");

    const { session, redirectUrl } = await shopify.auth.callback({ request });

    console.log("✅ OAuth Completed");
    console.log("🛒 Shop:", session?.shop);
    console.log("🔑 Access Token Exists:", !!session?.accessToken);
    console.log("➡️ redirectUrl from Shopify:", redirectUrl || "None");

    // If Shopify wants to redirect internally
    if (redirectUrl) {
      console.log(
        "📌 Redirecting to internal Shopify redirectUrl:",
        redirectUrl,
      );
      return redirect(redirectUrl);
    }

    const shop = session.shop;

    console.log("🎉 OAuth Success — Now redirecting to /post-auth");
    const finalUrl = `/post-auth?shop=${shop}&host=${Buffer.from(shop).toString("base64")}`;

    console.log("🚀 Final Redirect URL:", finalUrl);

    return redirect(finalUrl);
  } catch (error) {
    console.error("❌ ERROR in auth callback:", error);
    throw error;
  }
};
