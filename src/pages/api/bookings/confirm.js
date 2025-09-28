import crypto from "crypto";
import QRCode from "qrcode";
import connectDB from "@/lib/dbConnect";
import Booking from "@/models/Booking";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });
  await connectDB();

  try {
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) return res.status(500).json({ message: "Missing RAZORPAY_KEY_SECRET" });

    const {
      userId,
      userEmail,
      busId,
      busName,
      routeId,
      fromStopId,
      fromStopName,
      toStopId,
      toStopName,
      travelDate,
      seats = 1,
      amountPaise,
      currency = "INR",
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body || {};

    const required = [userId, busId, busName, routeId, fromStopId, fromStopName, toStopId, toStopName, travelDate, amountPaise, razorpayOrderId, razorpayPaymentId, razorpaySignature];
    if (required.some((v) => !v)) return res.status(400).json({ message: "Missing required fields" });

    // Verify signature
    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expected = crypto.createHmac("sha256", key_secret).update(payload).digest("hex");
    if (expected !== razorpaySignature) return res.status(400).json({ message: "Invalid signature" });

    // Generate QR with core ticket data
    const qrPayload = {
      userId,
      busId,
      busName,
      routeId,
      fromStopId,
      toStopId,
      travelDate,
      seats,
      razorpayPaymentId,
      ts: Date.now(),
    };
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrPayload));

    const doc = await Booking.create({
      userId,
      userEmail: userEmail || null,
      busId,
      busName,
      routeId,
      fromStopId,
      fromStopName,
      toStopId,
      toStopName,
      travelDate: new Date(travelDate),
      seats: Number(seats) || 1,
      amountPaise: Number(amountPaise),
      currency,
      razorpayOrderId,
      razorpayPaymentId,
      status: "paid",
      qrDataUrl,
    });

    return res.status(200).json({ ok: true, booking: doc });
  } catch (e) {
    console.error("confirm booking error", e);
    return res.status(500).json({ message: "Failed to confirm booking" });
  }
}
