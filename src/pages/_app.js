import "./globals.css";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import AuthNav from "@/components/AuthNav";
import Script from "next/script";

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen z-40 text-gray-900 antialiased">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <Toaster position="top-center" />
      <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white text-xs">SB</span>
            <span>Smart Bus Tracker</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/ourteam" className="hover:text-blue-600 transition-colors">Our Team</Link>
            <Link href="/BusBook" className="hover:text-blue-600 transition-colors">Book Ticket</Link>
            <Link href="/BusTracker" className="hover:text-blue-600 transition-colors">Bus Tracker</Link>
            <Link href="/BusLocation" className="hover:text-blue-600 transition-colors">Bus Location</Link>
            <div className="ml-2"><AuthNav /></div>
          </div>
        </div>
      </nav>

      <main className="pb-10">
        <Component {...pageProps} />
      </main>

      <footer className="border-t bg-white/70">
        <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-gray-500">
          © {new Date().getFullYear()} Smart Bus Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}