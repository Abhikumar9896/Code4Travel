"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthNav() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (!ignore) setUser(res.ok ? data.data : null);
      } catch (e) {
        if (!ignore) setUser(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [pathname]);

  const onLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      toast.success("Logged out");
      if (pathname.startsWith("/dashboard")) router.push("/");
    } catch (e) {
      toast.error("Failed to logout");
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">...</div>;
  }

  if (!user) {
    const from = encodeURIComponent(pathname || "/");
    return (
      <div className="flex items-center gap-3">
        <Link href={`/auth/login?from=${from}`} className="hover:text-blue-600 transition-colors text-sm">Login</Link>
        <Link href={`/auth/signup?from=${from}`} className="bg-blue-600 text-white text-sm px-3 py-1 rounded">Sign up</Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-gray-700">Hi, <span className="font-medium">{user.name?.split(" ")[0] || "Traveler"}</span></span>
      <button onClick={onLogout} className="border px-3 py-1 rounded hover:bg-gray-50">Logout</button>
    </div>
  );
}
