import { useLoaderData, Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import { db } from "../../utils/db.server";

export async function loader({ request }) {
  const [rows] = await db.query(
    "SELECT id, report_date, report_type, filename, s3_url, created_at FROM reports ORDER BY id DESC",
  );
  return json({ reports: rows });
}

export default function ReportsPage() {
  const { reports } = useLoaderData();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Generated Reports</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Type</th>
            <th>File</th>
            <th>Download</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.report_date}</td>
              <td>{r.report_type}</td>
              <td>{r.filename}</td>
              <td>
                <Link to={`/reports/${r.id}/download`}>Download</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
