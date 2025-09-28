import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    return res.status(500).json({ message: "Missing Razorpay keys. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local" });
  }

  try {
    const { amountPaise, currency = "INR" } = req.body || {};
    if (!amountPaise || amountPaise < 100) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const instance = new Razorpay({ key_id, key_secret });
    const order = await instance.orders.create({ amount: amountPaise, currency, receipt: `rcpt_${Date.now()}` });

    return res.status(200).json({ order, key: key_id });
  } catch (e) {
    console.error("order error", e);
    return res.status(500).json({ message: "Failed to create order" });
  }
}
