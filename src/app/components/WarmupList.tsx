export default function WarmupList({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <section className="rounded-2xl bg-white shadow p-4">
      <h2 className="text-base font-semibold mb-2">Entrada en calor</h2>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        {items.map((w, i) => (
          <li key={i}>{w}</li>
        ))}
      </ul>
    </section>
  );
}
