"use client";

import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Bus, Navigation, Gauge } from "lucide-react";

// Dynamically import react-leaflet components (client-only)
const LeafletMap = dynamic(
  async () => {
    const L = await import("react-leaflet");
    return ({ center, children }) => (
      <L.MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <L.TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {children}
      </L.MapContainer>
    );
  },
  { ssr: false }
);

const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
});

export default function MapView({
  initialCenter = [28.8955, 76.6066],
  eventUrl = "/api/stream/locations",
}) {
  const [markers, setMarkers] = useState({});
  const [busMeta, setBusMeta] = useState({});
  const evtRef = useRef(null);
  const bufferRef = useRef({});
  const rafRef = useRef(null);

  // ✅ Fix Leaflet marker icons only on client
  useEffect(() => {
    (async () => {
      const L = await import("leaflet");
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png",
      });
    })();
  }, []);

  // Load bus meta once
  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("/api/buses", { cache: "no-store" });
        if (!r.ok) return;
        const data = await r.json();
        const meta = {};
        for (const b of data.buses || [])
          meta[b.id] = { name: b.name, routeId: b.routeId };
        setBusMeta(meta);
      } catch {}
    };
    load();
  }, []);

  // Throttled update
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
          const meta = busMeta[id] || {};
          next[id] = { ...next[id], ...payload, ...meta };
        }
        return next;
      });
    });
  };

  // Connect SSE
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
          if (
            !payload ||
            typeof payload.lat !== "number" ||
            typeof payload.lng !== "number" ||
            !payload.busId
          )
            return;
          bufferRef.current[payload.busId] = {
            ...bufferRef.current[payload.busId],
            ...payload,
          };
          scheduleFlush();
        } catch {}
      };

      es.onmessage = (e) => onPayload(e.data);
      es.addEventListener("location", (e) => onPayload(e.data));
      es.addEventListener("snapshot", (e) => {
        try {
          const { locations } = JSON.parse(e.data) || {};
          if (!Array.isArray(locations)) return;
          const batch = {};
          for (const loc of locations) {
            if (
              loc &&
              typeof loc.lat === "number" &&
              typeof loc.lng === "number" &&
              loc.busId
            ) {
              batch[loc.busId] = loc;
            }
          }
          bufferRef.current = { ...bufferRef.current, ...batch };
          scheduleFlush();
        } catch {}
      });
      es.onerror = () => {
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
  }, [eventUrl, busMeta]);

  const center = useMemo(() => initialCenter, [initialCenter]);

  return (
    <div className="h-full w-full z-10">
      <LeafletMap center={center}>
        {Object.entries(markers).map(([busId, m]) =>
          typeof m.lat === "number" && typeof m.lng === "number" ? (
            <Marker key={busId} position={[m.lat, m.lng]}>
              <Popup>
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2 font-semibold">
                    <Bus className="w-4 h-4 text-blue-600" />
                    {m.name || busId}
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-green-600" />
                    Route: {m.routeId || "-"}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    {m.lat.toFixed(5)}, {m.lng.toFixed(5)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-orange-600" />
                    {m.speedKmph ?? 0} km/h
                  </div>
                </div>
              </Popup>
            </Marker>
          ) : null
        )}
      </LeafletMap>
    </div>
  );
}
