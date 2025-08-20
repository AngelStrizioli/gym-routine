export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function undoDateyRange(s: string): string {
  const m = s.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    const [, , mm, dd] = m;
    return `${parseInt(dd, 10)}-${parseInt(mm, 10)}`;
  }
  return s;
}

export function parseRepRange(raw?: string) {
  if (!raw) return null;
  const s = undoDateyRange(String(raw).trim()).replace(/\s+/g, " ");
  const norm = s.replace(/\s*a\s*/i, "–").replace(/-/g, "–");
  const range = norm.match(/^(\d+)\s*–\s*(\d+)$/);
  const single = norm.match(/^(\d+)$/);
  if (range)
    return {
      text: `${+range[1]}–${+range[2]}`,
      min: +range[1],
      max: +range[2],
    };
  if (single)
    return { text: `${+single[1]}`, min: +single[1], max: +single[1] };
  return { text: norm };
}

export function numberOnly(raw?: string) {
  if (!raw) return null;
  const m = String(raw).match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
}

// NEW: detect the header row that starts the cardio block
export function isCardioHeader(text?: string) {
  if (!text) return false;
  const s = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
  // handle both HIIT and HIT spellings
  return /\bcircuito\s+hii?t\b/.test(s);
}
