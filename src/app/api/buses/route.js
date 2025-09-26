import { NextResponse } from "next/server";
import { getAllBuses, getRoutes, getStops } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const buses = getAllBuses();
  const routes = getRoutes();
  const stops = getStops();
  return NextResponse.json({ buses, routes, stops });
}
