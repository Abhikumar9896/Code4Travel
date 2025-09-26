// In-memory mock data and location store
// Note: This resets on server restart (fine for hackathon/demo)

export const stops = [
  // Rohtak area
  { id: "s1", name: "Rohtak Bus Stand", lat: 28.8955, lng: 76.6066 },
  { id: "s2", name: "PGIMS Rohtak", lat: 28.8935, lng: 76.6220 },
  { id: "s3", name: "Sector 1 Rohtak", lat: 28.9020, lng: 76.6305 },
  { id: "s4", name: "Maharshi Dayanand Univ.", lat: 28.8888, lng: 76.6130 },
  { id: "s5", name: "Kalanaur Road", lat: 28.9058, lng: 76.5900 },

  // Sonipat / Bahadurgarh / Jind corridor
  { id: "s6", name: "Sonipat Old DC Road", lat: 28.9931, lng: 77.0151 },
  { id: "s7", name: "Sonipat Railway Stn", lat: 29.0000, lng: 77.0185 },
  { id: "s8", name: "Bahadurgarh City Park", lat: 28.6929, lng: 76.9200 },
  { id: "s9", name: "Bahadurgarh Bus Stand", lat: 28.6895, lng: 76.9350 },
  { id: "s10", name: "Jind Bus Stand", lat: 29.3160, lng: 76.3180 },
];

export const routes = [
  {
    id: "r1",
    name: "Route 1 - East",
    stops: ["s1", "s2", "s3", "s4", "s5"],
  },
  {
    id: "r2",
    name: "Route 2 - West",
    stops: ["s6", "s7", "s8", "s9", "s10"],
  },
];

export const buses = [
  { id: "b1", name: "Bus 101", routeId: "r1" },
  { id: "b2", name: "Bus 102", routeId: "r1" },
  { id: "b3", name: "Bus 201", routeId: "r2" },
];

// In-memory locations keyed by busId
const locations = new Map();

// Initialize locations roughly at first stop for each route
for (const bus of buses) {
  const route = routes.find((r) => r.id === bus.routeId);
  const firstStop = stops.find((s) => s.id === route.stops[0]);
  locations.set(bus.id, {
    busId: bus.id,
    lat: firstStop.lat + (Math.random() - 0.5) * 0.002,
    lng: firstStop.lng + (Math.random() - 0.5) * 0.002,
    speedKmph: 25,
    updatedAt: Date.now(),
  });
}

export function getAllBuses() {
  return buses;
}

export function getRoutes() {
  return routes.map((r) => ({
    ...r,
    stopDetails: r.stops.map((sid) => stops.find((s) => s.id === sid)),
  }));
}

export function getStops() {
  return stops;
}

export function getBusLocation(busId) {
  return locations.get(busId) || null;
}

export function setBusLocation({ busId, lat, lng, speedKmph }) {
  const existing = locations.get(busId) || {};
  const updated = {
    busId,
    lat: Number(lat),
    lng: Number(lng),
    speedKmph: Number(speedKmph ?? existing.speedKmph ?? 25),
    updatedAt: Date.now(),
  };
  locations.set(busId, updated);
  return updated;
}

export function getAllLocations() {
  return Array.from(locations.values());
}

export function getRouteById(routeId) {
  return routes.find((r) => r.id === routeId) || null;
}

export function getStopById(stopId) {
  return stops.find((s) => s.id === stopId) || null;
}
