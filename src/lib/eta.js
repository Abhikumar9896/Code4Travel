import { getBusLocation, getRouteById, getStopById, buses } from "./data";

function haversine(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // km
}

// Simple ETA: distance/speed for each bus whose route includes the stop
export function computeETAForStop(stopId) {
  const stop = getStopById(stopId);
  if (!stop) return [];
  const results = [];
  for (const bus of buses) {
    const route = getRouteById(bus.routeId);
    if (!route || !route.stops.includes(stopId)) continue;
    const loc = getBusLocation(bus.id);
    if (!loc) continue;
    const distKm = haversine(loc.lat, loc.lng, stop.lat, stop.lng);
    const speed = Math.max(loc.speedKmph || 20, 5);
    const etaMinutes = Math.round((distKm / speed) * 60);
    results.push({ busId: bus.id, busName: bus.name, etaMinutes, distanceKm: Number(distKm.toFixed(2)) });
  }
  results.sort((a, b) => a.etaMinutes - b.etaMinutes);
  return results;
}
