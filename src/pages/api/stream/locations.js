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

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  // Example interval broadcaster. Replace with your real-time source
  const interval = setInterval(() => {
    // TODO: Pull and send live locations data here
    send({ ping: Date.now() });
  }, 10000);

  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
}