// src/app/rutina/page.tsx
export const revalidate = 60;
export const runtime = "nodejs";

import { fetchRoutineData } from "../lib/sheets";
import RoutineCard from "../components/RoutineCard";

export default async function RutinaIndex() {
  const data = await fetchRoutineData();
  return (
    <main className="mx-auto max-w-xl p-4 space-y-4">
      <h1 className="text-2xl font-bold">Rutinas</h1>
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.dias.map((d) => (
          <RoutineCard
            key={d.slug}
            slug={d.slug}
            label={d.label}
            count={d.ejercicios.length}
          />
        ))}
      </section>
    </main>
  );
}
