"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function AuthNav() {
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (!ignore) setAuthToken(res.ok ? data.data : null);
      } catch (e) {
        if (!ignore) setAuthToken(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [router.asPath]);

  const onLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setAuthToken(null);
      toast.success("Logged out");
      if (router.asPath.startsWith("/dashboard")) router.push("/");
    } catch (e) {
      toast.error("Failed to logout");
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">...</div>;
  }

  if (!authToken) {
    const from = encodeURIComponent(router.asPath || "/");
    return (
      <div className="flex items-center gap-3">
        <Link href={`/authpage?from=${from}&type=signup`} className="bg-blue-600 text-white text-sm px-3 py-1 rounded">Sign up</Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <button onClick={onLogout} className="border px-3 py-1 rounded hover:bg-gray-50">Logout</button>
    </div>
  );
}
