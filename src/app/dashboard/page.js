"use client";

import { useEffect, useMemo, useState } from "react";

export default function DashboardPage() {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [brs, lrs] = await Promise.all([
        fetch("/api/buses", { cache: "no-store" }),
        fetch("/api/locations", { cache: "no-store" }),
      ]);
      const bdata = await brs.json();
      const ldata = await lrs.json();
      setBuses(bdata.buses);
      setRoutes(bdata.routes);
      setStops(bdata.stops);
      setLocations(ldata.locations || []);
    };
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, []);

  const stats = useMemo(() => {
    const active = locations.length;
    const total = buses.length;
    const byRoute = routes.map((r) => ({
      route: r.id,
      name: r.name,
      buses: buses.filter((b) => b.routeId === r.id).length,
      active: locations.filter((l) => buses.find((b) => b.id === l.busId)?.routeId === r.id).length,
    }));
    return { active, total, byRoute };
  }, [locations, buses, routes]);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Authority Dashboard</h1>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500">Total Buses</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500">Active (reporting)</div>
          <div className="text-2xl font-bold">{stats.active}</div>
        </div>
        <div className="bg-white border rounded-xl p-4 col-span-2 shadow-sm">
          <div className="text-sm text-gray-500 mb-2">By Route</div>
          <div className="flex flex-wrap gap-3">
            {stats.byRoute.map((r) => (
              <div key={r.route} className="px-3 py-2 border rounded-lg text-sm bg-gray-50">
                <span className="font-medium">{r.name}</span>
                <span className="ml-2 text-gray-500">{r.active}/{r.buses} active</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b font-semibold">Live Bus Locations</div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-50 text-gray-600">
                <th className="text-left p-3 border-b">Bus</th>
                <th className="text-left p-3 border-b">Route</th>
                <th className="text-left p-3 border-b">Latitude</th>
                <th className="text-left p-3 border-b">Longitude</th>
                <th className="text-left p-3 border-b">Speed</th>
                <th className="text-left p-3 border-b">Updated</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((l) => {
                const bus = buses.find((b) => b.id === l.busId);
                return (
                  <tr key={l.busId} className="odd:bg-white even:bg-gray-50">
                    <td className="p-3 border-b">{bus?.name || l.busId}</td>
                    <td className="p-3 border-b">{bus?.routeId || "-"}</td>
                    <td className="p-3 border-b">{l.lat.toFixed(5)}</td>
                    <td className="p-3 border-b">{l.lng.toFixed(5)}</td>
                    <td className="p-3 border-b">{l.speedKmph ?? 0} km/h</td>
                    <td className="p-3 border-b">{new Date(l.updatedAt).toLocaleTimeString()}</td>
                  </tr>
                );
              })}
              {locations.length === 0 && (
                <tr>
                  <td className="p-4 text-gray-500" colSpan={6}>No live locations yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
