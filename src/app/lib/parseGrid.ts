import type { RoutineData, RoutineDay, Exercise } from "./types";
import {
  slugify,
  parseRepRange,
  numberOnly,
  undoDateyRange,
  isCardioHeader,
} from "./utils";

type Cell = string | number | boolean | null | undefined;

function cell(v: unknown): string {
  if (v == null) return "";
  return undoDateyRange(String(v).trim());
}

export function parseGrid(values: Cell[][]): RoutineData {
  const rows = values || [];

  // Warmup
  const warmup: string[] = [];
  const warmIdx = rows.findIndex((r) =>
    (r?.[0] || "").toString().toLowerCase().includes("entrada")
  );
  if (warmIdx >= 0) {
    for (let i = warmIdx + 1; i < rows.length; i++) {
      const a = cell(rows[i]?.[0]);
      if (/rutina.*dia/i.test(a)) break;
      if (a) warmup.push(a);
    }
  }

  const dias: RoutineDay[] = [];
  for (let r = 0; r < rows.length; r++) {
    const a = cell(rows[r]?.[0]);
    if (/rutina.*dia/i.test(a)) {
      const label = a.replace(/:/g, "").trim();

      // skip header row
      if (
        r + 1 < rows.length &&
        String(rows[r + 1]?.[0] || "")
          .toLowerCase()
          .includes("ejercicio")
      ) {
        r += 2;
      } else {
        r += 1;
      }

      const ejercicios: Exercise[] = [];
      let section: "base" | "cardio" = "base"; // <-- NEW

      for (; r < rows.length; r++) {
        const marker = cell(rows[r]?.[0]);
        if (/rutina.*dia/i.test(marker)) {
          r--;
          break;
        }

        // if any block cell is "Circuito HIIT/HIT", flip section and continue
        const maybeHeaders = [
          cell(rows[r]?.[0]),
          cell(rows[r]?.[4]),
          cell(rows[r]?.[8]),
        ];
        if (maybeHeaders.some(isCardioHeader)) {
          section = "cardio";
          continue;
        }

        const blocks: Array<[number, Exercise["progresion"]]> = [
          [0, "base"],
          [4, "progresion 1"],
          [8, "progresion 2"],
        ];

        let added = false;
        for (const [start, prog] of blocks) {
          const ej = cell(rows[r]?.[start]);
          if (!ej || /^(ejercicio|ejercicios|series:|rep:|carga:)$/i.test(ej))
            continue;

          const series = cell(rows[r]?.[start + 1]);
          const reps = cell(rows[r]?.[start + 2]);
          const carga = cell(rows[r]?.[start + 3]);

          ejercicios.push({
            section, // <-- NEW
            progresion: prog,
            ejercicio: ej,
            series: series ? Number(series) : null,
            reps: parseRepRange(reps),
            carga: numberOnly(carga),
          });
          added = true;
        }
        if (!added && !marker) break;
      }

      dias.push({ label, slug: slugify(label), ejercicios });
    }
  }

  return { warmup, dias };
}
