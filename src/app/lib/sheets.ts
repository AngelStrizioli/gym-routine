import { google } from "googleapis";
import { parseGrid } from "./parseGrid";
import type { RoutineData } from "./types";

const SCOPES: string[] = ["https://www.googleapis.com/auth/spreadsheets"];

function getAuth() {
  const email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL!;
  const key = process.env.GOOGLE_SHEETS_PRIVATE_KEY!.replace(/\\n/g, "\n");
  return new google.auth.JWT({ email, key, scopes: SCOPES });
}

export async function fetchRoutineData(): Promise<RoutineData> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const id = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  const range = process.env.SHEET_RANGE || "Hoja1!A1:L200";

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: id,
    range,
  });
  return parseGrid(res.data.values || []);
}

function formatLocalTimestamp(
  tz = process.env.LOCAL_TZ || "America/Argentina/Buenos_Aires"
) {
  const parts = new Intl.DateTimeFormat("es-AR", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get(
    "minute"
  )}:${get("second")}`;
}

export async function appendCompleted(dia: string, note = "") {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const id = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  const target = process.env.COMPLETED_SHEET || "Completadas!A:C";

  const ts = formatLocalTimestamp(); // <-- local time string

  await sheets.spreadsheets.values.append({
    spreadsheetId: id,
    range: target,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [[ts, dia, note]] },
  });
}
