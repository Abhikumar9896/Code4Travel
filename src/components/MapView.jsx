"use client";

import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

const LeafletMap = dynamic(
  async () => {
    const L = await import("react-leaflet");
    return ({ center, children }) => (
      <L.MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <L.TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        {children}
      </L.MapContainer>
    );
  },
  { ssr: false }
);

const Marker = dynamic(async () => (await import("react-leaflet")).Marker, { ssr: false });
const Popup = dynamic(async () => (await import("react-leaflet")).Popup, { ssr: false });

export default function MapView({ initialCenter = [28.8955, 76.6066], eventUrl = "/api/stream/locations" }) {
  const [markers, setMarkers] = useState({}); // busId -> {lat,lng,name,speedKmph}
  const evtRef = useRef(null);
  const bufferRef = useRef({});
  const rafRef = useRef(null);

  // Throttled state updater for incoming SSE messages
  const scheduleFlush = () => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      const batch = bufferRef.current;
      bufferRef.current = {};
      rafRef.current = null;
      if (Object.keys(batch).length === 0) return;
      setMarkers((prev) => {
        const next = { ...prev };
        for (const [id, payload] of Object.entries(batch)) {
          next[id] = { ...next[id], ...payload };
        }
        return next;
      });
    });
  };

  useEffect(() => {
    // Bootstrap markers from buses and current locations (single fetch each)
    const bootstrap = async () => {
      try {
        const [br, lr] = await Promise.all([
          fetch("/api/buses", { cache: "no-store" }),
          fetch("/api/locations", { cache: "no-store" }),
        ]);
        const buses = br.ok ? (await br.json()).buses : [];
        const locations = lr.ok ? (await lr.json()).locations : [];
        const nameById = Object.fromEntries(buses.map((b) => [b.id, b.name]));
        const base = {};
        for (const loc of locations) {
          if (typeof loc.lat !== "number" || typeof loc.lng !== "number") continue;
          base[loc.busId] = {
            lat: loc.lat,
            lng: loc.lng,
            speedKmph: loc.speedKmph ?? 0,
            name: nameById[loc.busId] || loc.busId,
          };
        }
        // Ensure buses with no location are still listed (optional)
        for (const b of buses) {
          if (!base[b.id]) base[b.id] = { name: b.name, lat: initialCenter[0], lng: initialCenter[1], speedKmph: 0 };
        }
        setMarkers(base);
      } catch {
        // ignore bootstrap failures for now
      }
    };
    bootstrap();
  }, [initialCenter]);

  useEffect(() => {
    let canceled = false;
    let es;

    const connect = () => {
      if (canceled) return;
      es = new EventSource(eventUrl);
      evtRef.current = es;

      const onPayload = (data) => {
        try {
          const evt = JSON.parse(data);
          const payload = evt.payload || evt;
          if (!payload || typeof payload.lat !== "number" || typeof payload.lng !== "number" || !payload.busId)
            return;
          bufferRef.current[payload.busId] = { ...bufferRef.current[payload.busId], ...payload };
          scheduleFlush();
        } catch {
          // ignore parse errors
        }
      };

      es.onmessage = (e) => onPayload(e.data);
      es.addEventListener("location", (e) => onPayload(e.data));
      es.onerror = () => {
        // Attempt to reconnect after a short delay
        es?.close();
        setTimeout(() => connect(), 1500);
      };
    };

    connect();
    return () => {
      canceled = true;
      es?.close();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      bufferRef.current = {};
    };
  }, [eventUrl]);

  const center = useMemo(() => initialCenter, [initialCenter]);

  return (
    <div className="h-full z-10 w-full">
      <LeafletMap center={center}>
        {Object.entries(markers).map(([busId, m]) => (
          typeof m.lat === "number" && typeof m.lng === "number" ? (
            <Marker key={busId} position={[m.lat, m.lng]}>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{m.name || busId}</div>
                  <div>Lat: {m.lat.toFixed(5)} Lng: {m.lng.toFixed(5)}</div>
                  <div>Speed: {m.speedKmph ?? 0} km/h</div>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </LeafletMap>
    </div>
  );
}
