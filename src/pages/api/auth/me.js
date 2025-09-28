export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });
  try {
    const raw = req.cookies.customUser;
    if (!raw) return res.status(200).json({ data: null });

    let user = null;
    try {
      user = JSON.parse(raw);
    } catch {
      user = null;
    }
    return res.status(200).json({ data: user });
  } catch (e) {
    return res.status(500).json({ message: "Failed to load profile" });
  }
}