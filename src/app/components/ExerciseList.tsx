import type { Exercise } from "../lib/types";

export default function ExerciseList({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle?: string | null;
  items: Exercise[];
}) {
  if (!items?.length) return null;
  const isComplexCore = title.toLowerCase().includes("complex core");
  const cleanSubtitle = isComplexCore ? "" : subtitle;
  const topRightLabel =
    isComplexCore && items[0]?.series
      ? `Series ${items[0].series}`
      : `${items.length} ejercicios`;

  return (
    <section className="rounded-2xl bg-white shadow p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold">{title}</h3>
          {cleanSubtitle && (
            <p className="text-xs opacity-70 mt-1">{cleanSubtitle}</p>
          )}
        </div>
        <p className="text-xs opacity-60">{topRightLabel}</p>
      </div>
      <ul className="divide-y mt-2">
        {items.map((ex, idx) => (
          <li key={idx} className="py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">{ex.ejercicio}</p>
                <p className="text-sm opacity-70">
                  {!isComplexCore && ex.series && `Series: ${ex.series}`}
                  {!isComplexCore && ex.series && ex.reps ? " • " : ""}
                  {ex.reps && `Rep/tiempo: ${ex.reps}`}
                </p>
                {ex.carga && <p className="text-sm">Carga: {ex.carga}</p>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
