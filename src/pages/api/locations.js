import { getLiveLocations } from "@/lib/data"; // or whatever function exists

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });
  try {
    const locations = getLiveLocations();
    return res.status(200).json({ locations });
  } catch (e) {
    return res.status(500).json({ message: "Failed to load locations" });
  }
}