import { updateFtpDetails } from "../models/acmeStores.server";

export async function action({ request }) {
  const form = await request.formData();
  const shop = form.get("shop_domain");

  const ftpData = {
    host: form.get("ftp_host"),
    port: form.get("ftp_port"),
    username: form.get("ftp_username"),
    password: form.get("ftp_password"),
    directory: form.get("ftp_directory"),
  };

  await updateFtpDetails(shop, ftpData);

  return { success: true };
}
