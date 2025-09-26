import { NextResponse } from "next/server";
import { setBusLocation } from "@/lib/data";
import { publish } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const { busId, lat, lng, speedKmph } = body || {};
    if (!busId || lat == null || lng == null) {
      return NextResponse.json({ error: "busId, lat, lng are required" }, { status: 400 });
    }
    const updated = setBusLocation({ busId, lat, lng, speedKmph });
    publish({ type: "location", payload: updated });
    return NextResponse.json({ ok: true, location: updated });
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
