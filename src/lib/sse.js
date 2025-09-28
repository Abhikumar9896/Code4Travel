// Simple in-memory SSE hub (resets on server restart)
const clients = new Set();

export function addClient(res) {
  clients.add(res);
  return () => {
    try {
      clients.delete(res);
    } catch {}
  };
}

export function broadcast(event, payload) {
  const msg = payload && typeof payload === "object" ? payload : { payload };
  for (const res of clients) {
    try {
      if (event) {
        res.write(`event: ${event}\n`);
      }
      res.write(`data: ${JSON.stringify(msg)}\n\n`);
    } catch {
      // ignore broken pipes
    }
  }
}

export function clientCount() {
  return clients.size;
}
