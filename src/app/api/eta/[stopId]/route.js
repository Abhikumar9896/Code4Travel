import { NextResponse } from "next/server";
import { computeETAForStop } from "@/lib/eta";

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const { stopId } = await params;
  const etas = computeETAForStop(stopId);
  return NextResponse.json({ stopId, etas });
}
