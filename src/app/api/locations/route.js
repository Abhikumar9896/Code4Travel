import { NextResponse } from "next/server";
import { getAllLocations } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const locations = getAllLocations();
  return NextResponse.json({ locations });
}
