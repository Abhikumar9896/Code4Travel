import { setBusLocation } from "@/lib/data";
import { broadcast } from "@/lib/sse";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { busId, lat, lng, speedKmph } = req.body || {};
    if (!busId || typeof lat === "undefined" || typeof lng === "undefined") {
      return res.status(400).json({ success: false, message: "Missing busId/lat/lng" });
    }

    const updated = setBusLocation({ busId, lat, lng, speedKmph });

    // Broadcast to all listeners
    broadcast("location", updated);

    return res.status(200).json({ success: true, location: updated });
  } catch (e) {
    console.error("update location error", e);
    return res.status(500).json({ success: false, message: "Failed to update location" });
  }
}
