import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import {
  getStoreByDomain,
  updateFtpDetails,
} from "../models/acmeStores.server";

// Loader → store details fetch
export async function loader({ request }) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) return json({ error: "Shop domain missing" });

  const store = await getStoreByDomain(shop);
  return json({ store });
}

// Action → Save FTP details
export async function action({ request }) {
  const form = await request.formData();

  const shop_domain = form.get("shop_domain");

  const ftpData = {
    host: form.get("ftp_host"),
    port: form.get("ftp_port"),
    username: form.get("ftp_username"),
    password: form.get("ftp_password"),
    directory: form.get("ftp_directory"),
  };

  await updateFtpDetails(shop_domain, ftpData);

  return json({ success: true });
}

// UI Component
export default function DashboardFTP() {
  const { store } = useLoaderData();
  const actionData = useActionData();

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>FTP Settings</h2>

      {actionData?.success && (
        <p
          style={{
            background: "#d4edda",
            padding: "10px",
            borderRadius: "5px",
            color: "#155724",
          }}
        >
          FTP details saved successfully!
        </p>
      )}

      <Form
        method="post"
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <input type="hidden" name="shop_domain" value={store?.shop_domain} />

        <label>FTP Host</label>
        <input
          type="text"
          name="ftp_host"
          defaultValue={store?.ftp_host}
          placeholder="ftp.example.com"
          required
        />

        <label>FTP Port</label>
        <input
          type="number"
          name="ftp_port"
          defaultValue={store?.ftp_port || 21}
          placeholder="21"
        />

        <label>FTP Username</label>
        <input
          type="text"
          name="ftp_username"
          defaultValue={store?.ftp_username}
          placeholder="username"
        />

        <label>FTP Password</label>
        <input
          type="password"
          name="ftp_password"
          defaultValue={store?.ftp_password}
          placeholder="password"
        />

        <label>FTP Directory Path</label>
        <input
          type="text"
          name="ftp_directory"
          defaultValue={store?.ftp_directory}
          placeholder="/exports/"
        />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#111",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Save FTP Settings
        </button>
      </Form>
    </div>
  );
}
