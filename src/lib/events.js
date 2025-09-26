// Very light pub-sub for server-side location updates -> SSE stream
const subscribers = new Set();

export function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function publish(event) {
  for (const fn of subscribers) {
    try { fn(event); } catch {}
  }
}
