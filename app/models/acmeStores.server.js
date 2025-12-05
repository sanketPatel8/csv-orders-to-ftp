import { db } from "../utils/db.server";

// Save store during app install
export async function createOrUpdateStore({
  shop_domain,
  access_token,
  store_name,
  email,
  country,
}) {
  const conn = await db.getConnection();
  console.log("DB Connected Successfully");

  try {
    // Check if store already exists
    const [rows] = await conn.query(
      "SELECT id FROM acme_stores WHERE shop_domain = ?",
      [shop_domain],
    );

    if (rows.length > 0) {
      // Update token & details
      await conn.query(
        `UPDATE acme_stores 
         SET access_token=?, store_name=?, email=?, country=? 
         WHERE shop_domain=?`,
        [access_token, store_name, email, country, shop_domain],
      );

      return { updated: true };
    }

    // Insert new store
    await conn.query(
      `INSERT INTO acme_stores 
       (shop_domain, access_token, store_name, email, country) 
       VALUES (?, ?, ?, ?, ?)`,
      [shop_domain, access_token, store_name, email, country],
    );

    return { created: true };
  } finally {
    conn.release();
  }
}

//update ftp

export async function updateFtpDetails(shop_domain, ftpData) {
  const conn = await db.getConnection();
  console.log("DB Connected Successfully");

  try {
    await conn.query(
      `UPDATE acme_stores 
       SET ftp_host=?, ftp_port=?, ftp_username=?, ftp_password=?, ftp_directory=?
       WHERE shop_domain=?`,
      [
        ftpData.host,
        ftpData.port,
        ftpData.username,
        ftpData.password,
        ftpData.directory,
        shop_domain,
      ],
    );

    return { success: true };
  } finally {
    conn.release();
  }
}

// ✔ Update CSV Settings

export async function updateCsvSettings(shop_domain, settings) {
  const conn = await db.getConnection();
  console.log("DB Connected Successfully");

  try {
    await conn.query(
      `UPDATE acme_stores 
       SET csv_prefix=?, csv_date_format=?, csv_extension=?, csv_auto_upload=?
       WHERE shop_domain=?`,
      [
        settings.csv_prefix,
        settings.csv_date_format,
        settings.csv_extension,
        settings.csv_auto_upload,
        shop_domain,
      ],
    );

    return { success: true };
  } finally {
    conn.release();
  }
}

// Update Last CSV Log

export async function updateCsvLog(shop_domain, csvName, status) {
  const conn = await db.getConnection();
  console.log("DB Connected Successfully");

  try {
    await conn.query(
      `UPDATE acme_stores
       SET last_csv_generated_at = NOW(),
           last_csv_name = ?,
           last_csv_upload_status = ?
       WHERE shop_domain = ?`,
      [csvName, status, shop_domain],
    );

    return { success: true };
  } finally {
    conn.release();
  }
}

// 👉 ✔ Get Store by Domain

export async function getStoreByDomain(shop_domain) {
  const conn = await db.getConnection();
  console.log("DB Connected Successfully");

  try {
    const [rows] = await conn.query(
      `SELECT * FROM acme_stores WHERE shop_domain = ?`,
      [shop_domain],
    );
    return rows[0] || null;
  } finally {
    conn.release();
  }
}
