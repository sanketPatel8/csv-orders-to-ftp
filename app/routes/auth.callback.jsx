// app/routes/auth.callback.jsx
import { shopify } from "~/shopify.server";
import { json, redirect } from "@remix-run/node";
import { db } from "~/utils/db.server"; // your MySQL or Prisma DB
import { registerWebhooks } from "~/utils/register-webhooks.server";

export const loader = async ({ request }) => {
  try {
    // 1️⃣ OAuth callback → Token generate
    const { session, headers } = await shopify.auth.callback({
      request,
    });

    const shop = session.shop;
    const accessToken = session.accessToken;

    console.log("🟢 SHOP:", shop);
    console.log("🟢 ACCESS TOKEN:", accessToken);

    // 2️⃣ Store DB ma save / update
    await db.store.upsert({
      where: { shopDomain: shop },
      update: {
        accessToken,
        installed: true,
      },
      create: {
        shopDomain: shop,
        accessToken,
        installed: true,
      },
    });

    console.log("🟢 Store saved successfully in DB");

    // 3️⃣ Register Webhooks (App Uninstall etc.)
    await registerWebhooks(session);

    console.log("🟢 Webhooks registered successfully");

    // 4️⃣ Redirect user to app dashboard
    return redirect(`/app?shop=${shop}`, { headers });
  } catch (error) {
    console.error("❌ ERROR IN CALLBACK:", error);

    return json(
      { error: "OAuth Callback Failed", details: error.message },
      { status: 500 },
    );
  }
};
