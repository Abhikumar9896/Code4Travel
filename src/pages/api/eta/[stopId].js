import { getETAForStop } from "@/lib/data"; // adjust if your helper name differs

export default function handler(req, res) {
  const { stopId } = req.query;
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });
  try {
    const etas = getETAForStop(stopId);
    return res.status(200).json({ etas });
  } catch (e) {
    return res.status(500).json({ message: "Failed to load ETA" });
  }
}