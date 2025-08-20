// src/app/api/slugs/route.ts
import { NextResponse } from "next/server";
import { fetchRoutineData } from "../../lib/sheets";

export const runtime = "nodejs";

export async function GET() {
  const data = await fetchRoutineData();
  return NextResponse.json({
    slugs: data.dias.map((d) => d.slug),
    labels: data.dias.map((d) => d.label),
  });
}
