import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_secret) return res.status(500).json({ message: "Missing RAZORPAY_KEY_SECRET" });

  try {
    const { orderId, paymentId, signature } = req.body || {};
    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ message: "Missing orderId/paymentId/signature" });
    }

    const payload = `${orderId}|${paymentId}`;
    const expected = crypto.createHmac("sha256", key_secret).update(payload).digest("hex");
    const ok = expected === signature;
    if (!ok) return res.status(400).json({ ok: false, message: "Invalid signature" });

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("verify error", e);
    return res.status(500).json({ message: "Failed to verify payment" });
  }
}
