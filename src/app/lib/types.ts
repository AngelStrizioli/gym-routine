export type RepRange = {
  text: string; // canonical text, e.g. "8–10"
  min?: number;
  max?: number;
};

export type Section = "base" | "cardio";

export type Exercise = {
  section: Section;
  progresion: "base" | "progresion 1" | "progresion 2";
  ejercicio: string;
  series?: number | null;
  reps?: RepRange | null;
  carga?: number | null; // numbers only (RIR 1 -> 1, "60 kg" -> 60)
};

export type RoutineDay = {
  label: string; // e.g. "Rutina dia 1"
  slug: string; // e.g. "rutina-dia-1"
  ejercicios: Exercise[];
};

export type RoutineData = {
  warmup: string[]; // Entrada en calor lines
  dias: RoutineDay[];
};
