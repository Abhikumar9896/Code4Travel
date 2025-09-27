import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthNav from "@/components/AuthNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Smart Bus Tracker",
  description: "Live bus tracking, ETA, and routes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} min-h-screen text-gray-900 antialiased`}>
        <Toaster position="top-center" />
        <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white text-xs">SB</span>
              <span>Smart Bus Tracker</span>
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <Link href="/driver" className="hover:text-blue-600 transition-colors">Driver</Link>
              <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
              <div className="ml-2"><AuthNav /></div>
            </div>
          </div>
        </nav>
        <main className="pb-10">{children}</main>
        <footer className="border-t bg-white/70">
          <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-gray-500">
            © {new Date().getFullYear()} Smart Bus Tracker. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
