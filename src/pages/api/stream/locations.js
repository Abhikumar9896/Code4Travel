import { addClient, broadcast, clientCount } from "@/lib/sse";
import { getAllLocations } from "@/lib/data";

export const config = {
  api: { bodyParser: false },
};

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end("Method Not Allowed");

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });

  // Send an initial snapshot so clients have current positions
  try {
    const snapshot = getAllLocations();
    res.write(`event: snapshot\n`);
    res.write(`data: ${JSON.stringify({ locations: snapshot })}\n\n`);
  } catch {}

  // Keep-alive ping
  const keepAlive = setInterval(() => {
    try {
      res.write(`event: ping\n`);
      res.write(`data: ${JSON.stringify({ t: Date.now(), clients: clientCount() })}\n\n`);
    } catch {}
  }, 25000);

  const remove = addClient(res);

  req.on("close", () => {
    clearInterval(keepAlive);
    remove();
    try { res.end(); } catch {}
  });
}