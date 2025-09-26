"use client";

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
  const [markers, setMarkers] = useState({}); // busId -> {lat,lng,name}
  const evtRef = useRef(null);

  useEffect(() => {
    // Bootstrap with buses list and their current locations
    const bootstrap = async () => {
      const res = await fetch("/api/buses", { cache: "no-store" });
      const data = await res.json();
      const base = {};
      for (const bus of data.buses) {
        try {
          const lr = await fetch(`/api/location/${bus.id}`, { cache: "no-store" });
          if (lr.ok) {
            const loc = await lr.json();
            base[bus.id] = { ...loc, name: bus.name };
          }
        } catch {}
      }
      setMarkers(base);
    };
    bootstrap();
  }, []);

  useEffect(() => {
    const es = new EventSource(eventUrl);
    evtRef.current = es;
    es.addEventListener("location", (e) => {
      try {
        const evt = JSON.parse(e.data);
        const payload = evt.payload || evt;
        setMarkers((prev) => ({
          ...prev,
          [payload.busId]: { ...prev[payload.busId], ...payload },
        }));
      } catch {}
    });
    es.onerror = () => {
      // will auto-retry via SSE retry
    };
    return () => es.close();
  }, [eventUrl]);

  const center = useMemo(() => initialCenter, [initialCenter]);

  return (
    <div className="h-full w-full">
      <LeafletMap center={center}>
        {Object.entries(markers).map(([busId, m]) => (
          <Marker key={busId} position={[m.lat, m.lng]}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{m.name || busId}</div>
                <div>Lat: {m.lat.toFixed(5)} Lng: {m.lng.toFixed(5)}</div>
                <div>Speed: {m.speedKmph ?? 0} km/h</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </LeafletMap>
    </div>
  );
}
