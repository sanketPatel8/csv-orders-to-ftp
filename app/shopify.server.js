import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { MySQLSessionStorage } from "@shopify/shopify-app-session-storage-mysql";
import { db, pool } from "./utils/db.server";

export const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(","),

  appUrl: process.env.SHOPIFY_APP_URL || "",

  authPathPrefix: "/auth",
  auth: { path: "/auth", callbackPath: "/auth/callback" },

  sessionStorage: new MySQLSessionStorage(
    "mysql://apps_db4:q4w3noVm8Pqe@157.173.220.171:3306/apps_db4",
  ),

  distribution: AppDistribution.Standalone,

  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },

  hooks: {
    // 🚀 Runs IMMEDIATELY after OAuth success
    afterAuth: async ({ session }) => {
      try {
        console.log("🟢 AFTER AUTH HOOK TRIGGERED!");
        console.log("🛒 Shop:", session.shop);
        console.log("🔑 Access Token:", session.accessToken);

        // -------------------------------------------
        // 1️⃣ Store Shopify session in SessionStorage
        // -------------------------------------------
        await shopify.sessionStorage.storeSession(session);
        console.log("💾 Session stored successfully in session storage!");

        // -------------------------------------------
        // 2️⃣ Fetch Shop details from Shopify API
        // -------------------------------------------
        const client = new shopify.clients.Rest({ session });

        const storeInfo = await client.get({
          path: "shop",
        });

        const shopDetails = storeInfo.body.shop;

        console.log("🏪 Store Details Retrieved:", shopDetails);

        // Extract required fields
        const shop_domain = session.shop;
        const access_token = session.accessToken;
        const store_name = shopDetails.name;
        const email = shopDetails.email;
        const country = shopDetails.country;

        // -------------------------------------------
        // 3️⃣ Insert or Update into your acme_stores table
        // -------------------------------------------

        const [existing] = await pool.query(
          "SELECT id FROM acme_stores WHERE shop_domain = ?",
          [shop_domain],
        );

        if (existing.length > 0) {
          // UPDATE record
          await pool.query(
            `
            UPDATE acme_stores 
            SET 
              access_token = ?, 
              store_name = ?, 
              email = ?, 
              country = ?,
              updated_at = NOW()
            WHERE shop_domain = ?
            `,
            [access_token, store_name, email, country, shop_domain],
          );

          console.log("🔄 Store updated in acme_stores table!");
        } else {
          // INSERT new record
          await pool.query(
            `
            INSERT INTO acme_stores 
              (shop_domain, access_token, store_name, email, country) 
            VALUES (?, ?, ?, ?, ?)
            `,
            [shop_domain, access_token, store_name, email, country],
          );

          console.log("🆕 New store inserted into acme_stores!");
        }

        // -------------------------------------------
        // 4️⃣ Register ALL webhooks
        // -------------------------------------------
        await shopify.registerWebhooks({ session });
        console.log("🔔 All Shopify Webhooks Registered!");

        // -------------------------------------------
        // 5️⃣ NO REDIRECT HERE (Remix will ignore)
        // -------------------------------------------
        console.log(
          "⚠️ afterAuth cannot redirect. Redirect must happen in callback route.",
        );
      } catch (err) {
        console.error("❌ ERROR in afterAuth:", err);
        throw err;
      }
    },
  },
});

export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
