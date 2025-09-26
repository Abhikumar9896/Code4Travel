"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const demoPaths = {
  // Rohtak loop (near Bus Stand / PGIMS / MDU)
  b1: [
    [28.8955, 76.6066],
    [28.8935, 76.6220],
    [28.8888, 76.6130],
    [28.9020, 76.6305],
    [28.9058, 76.5900],
  ],
  // Bahadurgarh / Sonipat small path
  b3: [
    [28.6929, 76.9200],
    [28.6895, 76.9350],
    [28.9931, 77.0151],
    [29.0000, 77.0185],
  ],
};

export default function DriverPage() {
  const [busId, setBusId] = useState("b1");
  const [idx, setIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);

  const points = useMemo(() => demoPaths[busId] || [], [busId]);
  const point = points[idx] || points[0] || [28.8955, 76.6066];

  const sendUpdate = useCallback(async (lat, lng) => {
    await fetch("/api/location/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ busId, lat, lng, speedKmph: 25 }),
    });
  }, [busId]);

  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => {
      setIdx((i) => {
        const next = (i + 1) % points.length;
        const [lat, lng] = points[next];
        sendUpdate(lat, lng);
        return next;
      });
    }, 3000);
    return () => clearInterval(timer.current);
  }, [running, points, sendUpdate]);

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Driver Simulator</h1>
      <div className="bg-white rounded-xl border shadow-sm p-4 space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-600">Bus</label>
          <select
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
          >
            {Object.keys(demoPaths).map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-700">Current position: {point[0].toFixed(5)}, {point[1].toFixed(5)}</div>
        <div className="flex gap-2">
          <button
            onClick={() => setRunning(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
          >
            Start
          </button>
          <button
            onClick={() => setRunning(false)}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm hover:bg-gray-300 transition-colors"
          >
            Stop
          </button>
          <button
            onClick={() => { sendUpdate(point[0], point[1]); }}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition-colors"
          >
            Send Once
          </button>
        </div>
      </div>
      <p className="text-gray-600 text-sm">Use this page during demo to simulate bus movement.</p>
    </div>
  );
}
