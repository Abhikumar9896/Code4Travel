import { subscribe } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  let closed = false;

  const write = async (text) => {
    if (closed) return;
    try {
      await writer.write(encoder.encode(text));
    } catch {
      // ignore if already closed
    }
  };

  const send = async (data) => {
    await write(`event: location\n`);
    await write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const unsub = subscribe((evt) => { void send(evt); });
  const ping = setInterval(() => { void write(`:\n\n`); }, 15000);
  await write(`retry: 3000\n\n`);

  const cleanup = async () => {
    if (closed) return;
    closed = true;
    clearInterval(ping);
    if (typeof unsub === "function") unsub();
    try { await writer.close(); } catch {}
  };

  if (request?.signal) {
    request.signal.addEventListener("abort", () => { void cleanup(); });
  }

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
