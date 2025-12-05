import { createRequestHandler } from "@remix-run/node";
import { createServer } from "node:http";
import * as build from "./build/server";

const PORT = process.env.PORT || 3000;

const handleRequest = createRequestHandler(build, process.env.NODE_ENV);

createServer(async (req, res) => {
  try {
    let response = await handleRequest(req, res);

    // 🔥 Ngrok no warning skip karva mate header add karo
    response = new Response(response.body, response);
    response.headers.set("ngrok-skip-browser-warning", "true");

    // Final response return karo
    const body = await response.text();
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(body);
  } catch (error) {
    console.error("Server Error:", error);
    res.writeHead(500);
    res.end("Internal Server Error");
  }
}).listen(PORT, () => {
  console.log(`🚀 Remix server running at http://localhost:${PORT}`);
});
