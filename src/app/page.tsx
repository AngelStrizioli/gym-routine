export const revalidate = 60;
import { Suspense } from "react";
import { fetchRoutineData } from "./lib/sheets";
import RoutineCard from "./components/RoutineCard";
import WarmupList from "./components/WarmupList";
import DoneAlert from "./components/DoneAlert";

export default async function Home() {
  const data = await fetchRoutineData();
  return (
    <main className="mx-auto max-w-xl p-4 space-y-4">
      <Suspense>
        <DoneAlert />
      </Suspense>
      <header className="text-center">
        <h1 className="text-2xl font-bold">Mis Rutinas</h1>
        <p className="text-sm opacity-70">Sincronizado con Google Sheets</p>
      </header>

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
      <WarmupList items={data.warmup} />
    </main>
  );
}
