export const revalidate = 60;

import { fetchRoutineData } from "../../lib/sheets";
import { notFound } from "next/navigation";
import RoutineHeader from "../../components/RoutineHeader";
import WarmupList from "../../components/WarmupList";
import ExerciseList from "../../components/ExerciseList";
import FinishForm from "../../components/FinishForm";
import type { Progresion, RoutineCardBlock } from "../../lib/types";

type PageParams = { slug: string };

function progresionLabel(value: "base" | "progresion 1" | "progresion 2") {
  if (value === "base") return "Base";
  if (value === "progresion 1") return "Progresion 1";
  return "Progresion 2";
}

function cardsByProgresion(cards: RoutineCardBlock[]) {
  const order: Progresion[] = ["base", "progresion 1", "progresion 2"];
  return order
    .map((progresion) => ({
      progresion,
      cards: cards.filter((c) => c.progresion === progresion),
    }))
    .filter((group) => group.cards.length > 0);
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
  const groups = cardsByProgresion(day.cards);

  return (
    <main className="mx-auto max-w-xl p-4 space-y-4">
      <RoutineHeader title={day.label} />
      <WarmupList items={data.warmup} collapsible />

      {groups.map((group) => (
        <details
          key={group.progresion}
          className="group rounded-2xl bg-white shadow border border-neutral-100 p-3"
        >
          <summary className="cursor-pointer list-none">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm transition-transform group-open:rotate-90">
                  ▸
                </span>
                <h2 className="text-sm font-semibold">
                  {progresionLabel(group.progresion)}
                </h2>
              </div>
              <p className="text-xs opacity-60">{group.cards.length} bloques</p>
            </div>
          </summary>
          <div className="mt-3 space-y-3">
            {group.cards.map((card, idx) => (
              <ExerciseList
                key={`${group.progresion}-${card.title}-${idx}`}
                title={card.title}
                subtitle={card.subtitle}
                items={card.ejercicios}
              />
            ))}
          </div>
        </details>
      ))}

      <FinishForm dayLabel={day.label} />
    </main>
  );
}
