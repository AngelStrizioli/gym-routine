export const revalidate = 60;

import { fetchRoutineData } from "../../lib/sheets";
import { notFound } from "next/navigation";
import RoutineHeader from "../../components/RoutineHeader";
import WarmupList from "../../components/WarmupList";
import ExerciseList from "../../components/ExerciseList";
import FinishForm from "../../components/FinishForm";

type PageParams = { slug: string };

function groupByProg<T extends { progresion: string }>(items: T[]) {
  return items.reduce<Record<string, T[]>>((acc, it) => {
    (acc[it.progresion] ||= []).push(it);
    return acc;
  }, {});
}

export default async function Page({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const data = await fetchRoutineData();
  const day = data.dias.find((d) => d.slug === slug);
  if (!day) return notFound();

  const byProg = groupByProg(day.ejercicios);
  const baseNoCardio = (byProg["base"] || []).filter(
    (e) => e.section !== "cardio"
  );
  const cardio = day.ejercicios.filter((e) => e.section === "cardio");

  return (
    <main className="mx-auto max-w-xl p-4 space-y-4">
      <RoutineHeader title={day.label} />
      <WarmupList items={data.warmup} />

      {/* Base (excludes cardio) */}
      <ExerciseList title="Circuito Pesas" items={baseNoCardio} />

      {/* Progresiones */}
      <ExerciseList title="Progresión 1" items={byProg["progresion 1"] || []} />
      <ExerciseList title="Progresión 2" items={byProg["progresion 2"] || []} />

      {/* Cardio block */}
      <ExerciseList title="Circuito HIIT (cardio)" items={cardio} />

      <FinishForm dayLabel={day.label} />
    </main>
  );
}
