import { db } from "../utils/db.server";

export async function loader({ params }) {
  const [rows] = await db.query(
    "SELECT filename, csv_blob FROM reports WHERE id = ?",
    [params.id],
  );

  if (!rows.length) {
    throw new Response("Not found", { status: 404 });
  }

  const file = rows[0];

  return new Response(file.csv_blob, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${file.filename}"`,
    },
  });
}
