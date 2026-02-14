export type Progresion = "base" | "progresion 1" | "progresion 2";

export type Exercise = {
  progresion: Progresion;
  ejercicio: string;
  series?: string | null;
  reps?: string | null;
  carga?: string | null;
};

export type RoutineCardBlock = {
  progresion: Progresion;
  title: string;
  subtitle?: string | null;
  ejercicios: Exercise[];
};

export type RoutineDay = {
  label: string; // e.g. "Rutina dia 1"
  slug: string; // e.g. "rutina-dia-1"
  cards: RoutineCardBlock[];
  ejercicios: Exercise[];
};

export type RoutineData = {
  warmup: string[]; // Entrada en calor lines
  dias: RoutineDay[];
};
