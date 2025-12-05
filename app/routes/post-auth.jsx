import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const host = url.searchParams.get("host");

  console.log("🔔 [Post-Auth] Page Loaded");
  console.log("🛒 Shop:", shop);
  console.log("🏠 Host:", host);
  console.log("🎯 This confirms redirect after OAuth is successful!");

  return json({ shop, host });
};

export default function PostAuth() {
  const { shop, host } = useLoaderData();

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>🎉 App Installed Successfully!</h1>

      <p>
        <strong>Shop:</strong> {shop}
      </p>
      <p>
        <strong>Host (encoded):</strong> {host}
      </p>

      <p style={{ marginTop: "20px" }}>
        Now you can redirect user to your actual dashboard screen.
      </p>

      <a
        href={`/app?shop=${shop}&host=${host}`}
        style={{
          padding: "12px 20px",
          background: "#005BD5",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
        }}
      >
        Go to Dashboard →
      </a>
    </div>
  );
}
