"use client";

import { useEffect, useMemo, useState } from "react";
import MapView from "@/components/MapView";

export default function Page() {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedStop, setSelectedStop] = useState("");
  const [etas, setEtas] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/buses", { cache: "no-store" });
      const data = await res.json();
      setBuses(data.buses);
      setRoutes(data.routes);
      setStops(data.stops);
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedStop) return;
    const loadETA = async () => {
      const res = await fetch(`/api/eta/${selectedStop}`, { cache: "no-store" });
      const data = await res.json();
      setEtas(data.etas);
    };
    loadETA();
    const t = setInterval(loadETA, 10000);
    return () => clearInterval(t);
  }, [selectedStop]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return buses;
    return buses.filter((b) => b.name.toLowerCase().includes(q));
  }, [buses, query]);

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      <header className="border-b bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="text-xl font-semibold">Find your bus in real-time</div>
          <div className="flex-1 flex gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search buses by name..."
              className="flex-1 max-w-md rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            />
            <select
              value={selectedStop}
              onChange={(e) => setSelectedStop(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">Select Stop for ETA</option>
              {stops.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] max-w-6xl mx-auto w-full gap-4 p-4">
        <aside className="bg-white rounded-xl border shadow-sm h-[70vh] overflow-hidden flex flex-col">
          <div className="p-4 border-b font-semibold">Buses</div>
          <ul className="overflow-auto">
            {filtered.map((b) => (
              <li key={b.id} className="px-4 py-3 text-sm border-b last:border-0 hover:bg-gray-50 transition-colors">
                <div className="font-medium">{b.name}</div>
                <div className="text-gray-500">Route: {b.routeId}</div>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="p-4 text-sm text-gray-500">No buses found.</li>
            )}
          </ul>
          <div className="p-4 border-t bg-gray-50">
            <div className="font-semibold mb-2">ETA</div>
            {selectedStop ? (
              <ul className="space-y-2">
                {etas.map((e) => (
                  <li key={e.busId} className="text-sm flex items-center justify-between">
                    <span className="text-gray-700">{e.busName}</span>
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">{e.etaMinutes} min</span>
                      <span className="text-gray-500">{e.distanceKm} km</span>
                    </span>
                  </li>
                ))}
                {etas.length === 0 && (
                  <div className="text-sm text-gray-500">No buses approaching.</div>
                )}
              </ul>
            ) : (
              <div className="text-sm text-gray-500">Select a stop to view ETA.</div>
            )}
          </div>
        </aside>

        <section className="h-[70vh] bg-white rounded-xl overflow-hidden border shadow-sm">
          <MapView />
        </section>
      </div>
    </div>
  );
} 
