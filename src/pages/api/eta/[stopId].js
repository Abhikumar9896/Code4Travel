import { getAllBuses, getBusLocation, getRouteById, getStopById } from "@/lib/data";

function haversineKm(a, b) {
  const R = 6371; // km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

export default function handler(req, res) {
  const { stopId } = req.query;
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });
  try {
    const stop = getStopById(stopId);
    if (!stop) return res.status(404).json({ message: "Stop not found" });

    const buses = getAllBuses();
    const etas = [];

    for (const bus of buses) {
      const route = getRouteById(bus.routeId);
      if (!route || !route.stops.includes(stopId)) continue;
      const loc = getBusLocation(bus.id);
      if (!loc) continue;

      const distanceKm = haversineKm({ lat: loc.lat, lng: loc.lng }, { lat: stop.lat, lng: stop.lng });
      const speed = Number(loc.speedKmph || 25);
      const etaMinutes = speed > 0 ? Math.round((distanceKm / speed) * 60) : null;

      etas.push({
        busId: bus.id,
        busName: bus.name,
        distanceKm: Number(distanceKm.toFixed(2)),
        etaMinutes: etaMinutes === null ? null : Math.max(0, etaMinutes),
      });
    }

    etas.sort((a, b) => (a.etaMinutes ?? Infinity) - (b.etaMinutes ?? Infinity));
    return res.status(200).json({ etas });
  } catch (e) {
    return res.status(500).json({ message: "Failed to load ETA" });
  }
}