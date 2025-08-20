// src/app/api/complete/route.ts
import { appendCompleted } from "@/app/lib/sheets";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  // Helpful for sanity checks when you open /api/complete in a browser
  const hasEmail = !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const hasKey = !!process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const hasId = !!process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const target = process.env.COMPLETED_SHEET || "Completadas!A:C";
  return NextResponse.json({
    ok: true,
    expects: "POST dia, note",
    env: { hasEmail, hasKey, hasId, target },
  });
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const dia = String(form.get("dia") || "");
    const note = String(form.get("note") || "");
    if (!dia)
      return NextResponse.json(
        { ok: false, error: 'Falta "dia"' },
        { status: 400 }
      );

    await appendCompleted(dia, note);
    return NextResponse.redirect(new URL("/?done=1", req.url), 303);
  } catch (err: any) {
    console.error("complete POST error:", err?.message || err);
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
