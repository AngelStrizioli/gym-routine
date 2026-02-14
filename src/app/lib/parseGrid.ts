import type {
  RoutineData,
  RoutineDay,
  Exercise,
  Progresion,
  RoutineCardBlock,
} from "./types";
import { slugify, undoDateyRange, isCardioHeader } from "./utils";

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
    (r?.[0] || "").toString().toLowerCase().includes("entrada"),
  );
  if (warmIdx >= 0) {
    for (let i = warmIdx + 1; i < rows.length; i++) {
      const a = cell(rows[i]?.[0]);
      if (/rutina.*dia/i.test(a)) break;
      if (a) warmup.push(a);
    }
  }

  const dias: RoutineDay[] = [];
  const blocks: Array<{ start: number; progresion: Progresion }> = [
    { start: 0, progresion: "base" },
    { start: 4, progresion: "progresion 1" },
    { start: 8, progresion: "progresion 2" },
  ];

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");

  const isDayLabel = (s: string) => /rutina\s*:?\s*dia\s*\d+/i.test(s);

  const getDayNumber = (s: string) => {
    const m = s.match(/dia\s*(\d+)/i);
    return m ? Number(m[1]) : null;
  };

  const cleanDayLabel = (s: string) =>
    s
      .replace(/:\s*$/, "")
      .replace(/\s+/g, " ")
      .trim();

  const sanitizeSubtitle = (s: string) =>
    s
      .replace(/^(ejercicio|ejercicios)\s*:?\s*/i, "")
      .replace(/\s+/g, " ")
      .trim();

  const titleFromHeader = (s: string): string => {
    const n = normalize(s);
    if (n.includes("complex") && n.includes("core")) return "Complex Core";
    if (n.includes("circuito complex")) return "Circuito Complex";
    if (isCardioHeader(s)) return "Circuito HIIT";
    if (n.includes("regenerativo")) return "Regenerativo";
    return "Principal";
  };

  const subtitleFromHeader = (s: string): string | null => {
    const n = normalize(s);
    const source = sanitizeSubtitle(s);
    if (!source) return null;
    if (n.includes("amrap")) return source;
    if (n.includes("time cap")) return source;
    if (/\bx\s*\d+\s*vueltas\b/i.test(n)) return source;
    if (n.includes("regenerativo")) return source;
    return null;
  };

  const headerLike = (s: string): boolean => {
    const n = normalize(s);
    if (!n) return false;
    if (/^(ejercicio|ejercicios)\b/.test(n)) return true;
    if (/^(series|rep|carga|rond|desc)\b/.test(n)) return true;
    if (n.includes("amrap")) return true;
    if (n.includes("complex")) return true;
    if (n.includes("time cap")) return true;
    if (n.includes("regenerativo")) return true;
    if (isCardioHeader(s)) return true;
    return false;
  };

  for (let r = 0; r < rows.length; r++) {
    const a = cell(rows[r]?.[0]);
    if (isDayLabel(a)) {
      const dayNumber = getDayNumber(a);
      const label = cleanDayLabel(a);
      const keepDay = dayNumber != null && dayNumber <= 5;

      // Move to the row after "Rutina dia X" and let the parser handle
      // block headers so AMRAP/time cap subtitles are preserved.
      r += 1;

      const cards: RoutineCardBlock[] = [];
      const currentCardByProg = new Map<Progresion, RoutineCardBlock>();

      const ensureCard = (
        progresion: Progresion,
        title = "Principal",
        subtitle?: string | null,
      ) => {
        const active = currentCardByProg.get(progresion);
        if (active && active.title === title) {
          if (!active.subtitle && subtitle) active.subtitle = subtitle;
          return active;
        }
        const card: RoutineCardBlock = {
          progresion,
          title,
          subtitle: subtitle || null,
          ejercicios: [],
        };
        cards.push(card);
        currentCardByProg.set(progresion, card);
        return card;
      };

      const currentCard = (progresion: Progresion) =>
        currentCardByProg.get(progresion) || ensureCard(progresion);

      for (; r < rows.length; r++) {
        const marker = cell(rows[r]?.[0]);
        if (isDayLabel(marker)) {
          r--;
          break;
        }

        for (const { start, progresion } of blocks) {
          const ej = cell(rows[r]?.[start]);
          const series = cell(rows[r]?.[start + 1]);
          const reps = cell(rows[r]?.[start + 2]);
          const carga = cell(rows[r]?.[start + 3]);

          if (!ej) continue;

          if (headerLike(ej)) {
            ensureCard(progresion, titleFromHeader(ej), subtitleFromHeader(ej));
            continue;
          }

          if (/^(series|rep|carga|rond|desc)\b/i.test(ej)) continue;

          const card = currentCard(progresion);
          const ex: Exercise = {
            progresion,
            ejercicio: ej,
            series: series || null,
            reps: reps || null,
            carga: carga || null,
          };
          card.ejercicios.push(ex);

          if (card.title === "Complex Core" && !card.subtitle) {
            const parts = [
              ex.series ? `Series ${ex.series}` : "",
              ex.reps ? `${ex.reps}` : "",
            ].filter(Boolean);
            if (parts.length) card.subtitle = parts.join(" • ");
          }
        }
      }
      const nonEmptyCards = cards.filter((c) => c.ejercicios.length > 0);
      const ejercicios = nonEmptyCards.flatMap((c) => c.ejercicios);
      if (keepDay && ejercicios.length > 0) {
        dias.push({ label, slug: slugify(label), cards: nonEmptyCards, ejercicios });
      }
    }
  }

  return { warmup, dias };
}
