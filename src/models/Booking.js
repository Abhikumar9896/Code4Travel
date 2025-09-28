import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userEmail: { type: String },

    busId: { type: String, required: true },
    busName: { type: String, required: true },
    routeId: { type: String, required: true },

    fromStopId: { type: String, required: true },
    fromStopName: { type: String, required: true },
    toStopId: { type: String, required: true },
    toStopName: { type: String, required: true },

    travelDate: { type: Date, required: true },
    seats: { type: Number, default: 1 },

    amountPaise: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String, required: true },

    status: { type: String, enum: ["paid", "refunded", "cancelled"], default: "paid" },

    qrDataUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
