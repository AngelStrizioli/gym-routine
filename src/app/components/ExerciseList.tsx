import type { Exercise } from "../lib/types";

export default function ExerciseList({
  title,
  items,
}: {
  title: string;
  items: Exercise[];
}) {
  if (!items?.length) return null;
  return (
    <section className="rounded-2xl bg-white shadow p-3">
      <h3 className="text-sm font-semibold mb-2 capitalize">{title}</h3>
      <ul className="divide-y">
        {items.map((ex, idx) => (
          <li key={idx} className="py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium truncate">{ex.ejercicio}</p>
                <p className="text-sm opacity-70">
                  {ex.series != null && `Series: ${ex.series}`}{" "}
                  {ex.reps?.text && `• Reps: ${ex.reps.text}`}
                </p>
                {ex.carga != null && <p className="text-sm">RIR: {ex.carga}</p>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
