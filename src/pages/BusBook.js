// src/pages/index.js
"use client";
import { toast } from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";
 

export default function Page() {
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [stops, setStops] = useState([]);
    const [selectedStop, setSelectedStop] = useState("");
    const [etas, setEtas] = useState([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    
  // Booking state
const [bookingBusId, setBookingBusId] = useState("");
const [fromStopId, setFromStopId] = useState("");
const [toStopId, setToStopId] = useState("");
const [travelDate, setTravelDate] = useState("");
const [seats, setSeats] = useState(1);
const [amountPaise, setAmountPaise] = useState(50); // demo: ₹50.00
useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/buses", { cache: "no-store" });
      const data = await res.json();
      setBuses(data.buses);
      setRoutes(data.routes);
      setStops(data.stops);
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedStop) return;
    const loadETA = async () => {
      const res = await fetch(`/api/eta/${selectedStop}`, { cache: "no-store" });
      const data = await res.json();
      setEtas(Array.isArray(data?.etas) ? data.etas : []);
    };
    loadETA();
    const t = setInterval(loadETA, 10000);
    return () => clearInterval(t);
  }, [selectedStop]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return buses;
    return buses.filter((b) => b.name.toLowerCase().includes(q));
  }, [buses, query]);

  const bookingBus = useMemo(
    () => buses.find((b) => b.id === bookingBusId) || null,
    [buses, bookingBusId]
  );
  const bookingRoute = useMemo(
    () => routes.find((r) => r.id === (bookingBus?.routeId || "")) || null,
    [routes, bookingBus]
  );
  const routeStops = useMemo(
    () => bookingRoute?.stopDetails || [],
    [bookingRoute]
  );
 
 
  const handleBookAndPay = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Must be logged in
      const me = await fetch("/api/auth/me", { cache: "no-store" }).then((r) => r.json());
      const user = me?.data;
      if (!user) {
        toast.error("Please log in to book a ticket.");
        setLoading(false);
        return;
      }
  
      if (!bookingBusId || !fromStopId || !toStopId || !travelDate) {
        toast.error("Please fill all booking fields.");
        setLoading(false);
        return;
      }
      if (fromStopId === toStopId) {
        toast.error("From and To stops must be different.");
        setLoading(false);
        return;
      }
  
      // Create order
      const orderRes = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountPaise: Number(amountPaise) || 500, currency: "INR" }),
      });
      if (!orderRes.ok) throw new Error("Failed to create order");
      const { order, key } = await orderRes.json();
  
      const bus = bookingBus;
      const route = bookingRoute;
      const fromStop = routeStops.find((s) => s.id === fromStopId);
      const toStop = routeStops.find((s) => s.id === toStopId);
  
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "Smart Bus Ticket",
        description: `${bus?.name || bookingBusId} - ${fromStop?.name || fromStopId} → ${toStop?.name || toStopId}`,
        order_id: order.id,
        handler: async function (resp) {
          try {
            // Confirm booking in DB + generate QR
            const confirmRes = await fetch("/api/bookings/confirm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: user.id,
                userEmail: user.email,
                busId: bus.id,
                busName: bus.name,
                routeId: route.id,
                fromStopId,
                fromStopName: fromStop?.name || fromStopId,
                toStopId,
                toStopName: toStop?.name || toStopId,
                travelDate,
                seats: Number(seats) || 1,
                amountPaise: order.amount,
                currency: order.currency,
                razorpayOrderId: resp.razorpay_order_id,
                razorpayPaymentId: resp.razorpay_payment_id,
                razorpaySignature: resp.razorpay_signature,
              }),
            });
            const data = await confirmRes.json();
            if (!confirmRes.ok || !data.ok) throw new Error(data.message || "Booking failed");
            toast.success("Ticket booked successfully!");
            // Show QR code in a new window (demo)
            if (data.booking?.qrDataUrl) {
              const win = window.open();
              win?.document.write(`<img src="${data.booking.qrDataUrl}" alt="QR" />`);
            }
            setLoading(false);
          } catch (err) {
            console.error(err);
            toast.error("Payment captured, but booking confirmation failed.");
          }
        },
        prefill: {
          name: user.name || user.email || "Passenger",
          email: user.email || "",
        },
        theme: { color: "#2563eb" },
      };
  
      const rz = new window.Razorpay(options);
      rz.open();
    } catch (err) {
      console.error(err);
      toast.error("Unable to start payment.");
    }
  };

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
 

      <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] max-w-6xl mx-auto w-full gap-4 p-4">
       
  


        {/* Booking Form */}
        <section className="max-w-6xl mx-auto w-full p-4">
  <div className="bg-white border rounded-xl shadow-sm p-4">
    <div className="font-semibold mb-3">Book a Ticket</div>
    <form className="grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={handleBookAndPay}>
      <select className="border rounded px-3 py-2"
        value={bookingBusId}
        onChange={(e) => { setBookingBusId(e.target.value); setFromStopId(""); setToStopId(""); }}>
        <option value="">Select Bus</option>
        {buses.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
      </select>

      <select className="border rounded px-3 py-2" value={fromStopId}
        onChange={(e) => setFromStopId(e.target.value)} disabled={!bookingBusId}>
        <option value="">From Stop</option>
        {routeStops.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>

      <select className="border rounded px-3 py-2" value={toStopId}
        onChange={(e) => setToStopId(e.target.value)} disabled={!bookingBusId}>
        <option value="">To Stop</option>
        {routeStops.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>

      <input type="date" className="border rounded px-3 py-2"
        value={travelDate} onChange={(e) => setTravelDate(e.target.value)} />

      <input type="number" min={1} max={5} className="border rounded px-3 py-2"
        value={seats} onChange={(e) => setSeats(Number(e.target.value))} />

      <input type="number" min={100} step={100} className="border rounded px-3 py-2"
        value={amountPaise} onChange={(e) => setAmountPaise(Number(e.target.value))} />

      <button type="submit" className="md:col-span-3 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
      {
      loading ? "Loading..." : "Pay & Book"}
      </button>
    </form>
  </div>
         </section>

      </div>
    </div> 
  );
}