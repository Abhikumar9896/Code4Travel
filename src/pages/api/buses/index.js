import { getAllBuses, getRoutes, getStops } from "@/lib/data";

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });
  try {
    const buses = getAllBuses();
    const routes = getRoutes();
    const stops = getStops();
    return res.status(200).json({ buses, routes, stops });
  } catch (e) {
    return res.status(500).json({ message: "Failed to load buses" });
  }
}