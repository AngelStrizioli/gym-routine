import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const path = searchParams.get("path") || "/";
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }
  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path, now: Date.now() });
}
