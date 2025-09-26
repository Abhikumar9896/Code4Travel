import { NextResponse } from "next/server";
import { getBusLocation } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const { busId } = await params;
  const loc = getBusLocation(busId);
  if (!loc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(loc);
}
