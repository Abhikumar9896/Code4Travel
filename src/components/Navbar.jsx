"use client";
import React, { useState, useEffect } from "react";
import {
  Bus,
  MapPin,
  Users,
  BookOpen,
  Navigation,
  LogIn,
  ArrowRight,
  Home,
  LogOut,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
// Mock AuthNav component
const AuthNav = () => (
  <div className="flex items-center gap-3">
    <Link
      href="/authpage"
      className="flex items-center gap-2 px-4 py-2 text-sm font-mono text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
    >
      <LogIn size={16} />
      Login
    </Link>
  </div>
);

export default function LandingPage() {
    const [user, setUser] = useState(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    useEffect(() => {
        let ignore = false;
      
        const loadProfile = async () => {
          try {
            const res = await fetch("/api/auth/me", {
              method: "GET",
              headers: { Accept: "application/json" },
              credentials: "same-origin",
            });
            if (!res.ok) return; // 405/500 handled server-side; do nothing on client
            const { data } = await res.json();
            if (!ignore) setUser(data); // data is either user object or null
          } catch {
            // ignore network/parse errors
          }
        };
      
        loadProfile();
        return () => { ignore = true; };
      }, []);
    
    const getUserName = () => (user?.fullName || user?.name || user?.email || "User");
    const getInitial = () => (getUserName()?.charAt(0)?.toUpperCase() || "U");
    
    const handleLogout = () => {
        try {
          // Optional: remove localStorage if you still keep anything there
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
          if (typeof document !== "undefined") {
            // Clear cookies set on the client
            document.cookie = "customUser=; Max-Age=0; path=/";
            document.cookie = "token=; Max-Age=0; path=/"; // if you also set a token cookie
          }
        } catch {}
        setUser(null);
        setIsUserMenuOpen(false);
        router.push("/authpage");
        toast.success("Logout successful!");
      };

  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/ourteam", label: "Our Team", icon: Users },
  
    { href: "/BusTracker", label: "Bus Tracker", icon: Navigation },
    { href: "/BusLocation", label: "Bus Location", icon: MapPin },
    { href: "/BusBook", label: "Book Ticket", icon: BookOpen },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Modern transportation Navbar */}
      <nav className="sticky top-0 z-20 bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Bus className="text-white" size={24} />
              </div>
              {/* Animated dot indicator */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-mono">
                Smart Bus Tracker
              </h1>
              <p className="text-xs text-blue-200/70 font-mono">
                Real-time tracking
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-2 px-4 py-2 text-sm font-mono text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 relative overflow-hidden"
              >
                <item.icon
                  size={16}
                  className="group-hover:text-cyan-400 transition-colors"
                />
                {item.label}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></div>
              </Link>
            ))}
          </div>

      {/* Auth Navigation - Desktop */}
<div className="hidden lg:block">
  {user ? (
    <div className="relative">
      <button
        onClick={() => setIsUserMenuOpen((v) => !v)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-white/90"
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
          {getInitial()}
        </div>
        <span className="font-mono">{getUserName()}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-slate-900/90 border border-white/20 rounded-lg shadow-xl backdrop-blur p-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-left text-white/90 hover:bg-white/10 rounded-md"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  ) : (
    <AuthNav />
  )}
</div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden relative p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-200"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <div
                className={`w-5 h-0.5 bg-white transform transition-all duration-300 ${
                  isMenuOpen
                    ? "rotate-45 translate-y-0.5"
                    : "-translate-y-1"
                }`}
              ></div>
              <div
                className={`w-5 h-0.5 bg-white transform transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></div>
              <div
                className={`w-5 h-0.5 bg-white transform transition-all duration-300 ${
                  isMenuOpen
                    ? "-rotate-45 -translate-y-0.5"
                    : "translate-y-1"
                }`}
              ></div>
            </div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/20 bg-white/5 backdrop-blur-lg">
            <div className="px-4 py-6 space-y-1 max-h-96 overflow-y-auto">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group w-full flex items-center gap-3 px-4 py-3 text-left text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 font-mono"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg group-hover:bg-cyan-500/20 transition-all duration-200">
                    <item.icon
                      size={16}
                      className="group-hover:text-cyan-400 transition-colors"
                    />
                  </div>
                  <span>{item.label}</span>
                  <ArrowRight
                    size={16}
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              ))}

     {/* Mobile Auth Section */}
<div className="pt-4 mt-4 border-t border-white/20">
  <div className="space-y-3">
    {user ? (
      <>
        <div className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
            {getInitial()}
          </div>
          <span className="text-white font-mono">{getUserName()}</span>
        </div>
        <button
          onClick={() => {
            handleLogout();
            setIsMenuOpen(false);
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-mono text-white bg-red-600/80 hover:bg-red-600 rounded-xl transition-all duration-200 shadow-lg"
        >
          <LogOut size={16} />
          Logout
        </button>
      </>
    ) : (
      <Link
        href="/authpage"
        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-mono text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl transition-all duration-200 shadow-lg"
        onClick={() => setIsMenuOpen(false)}
      >
        <LogIn size={16} />
        Login
      </Link>
    )}
  </div>
</div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
