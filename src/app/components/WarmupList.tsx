export default function WarmupList({
  items,
  collapsible = false,
}: {
  items: string[];
  collapsible?: boolean;
}) {
  if (!items?.length) return null;

  if (collapsible) {
    return (
      <details className="group rounded-2xl bg-white shadow p-4">
        <summary className="cursor-pointer list-none">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm transition-transform group-open:rotate-90">
                ▸
              </span>
              <h2 className="text-base font-semibold">Entrada en calor</h2>
            </div>
            <p className="text-xs opacity-60">{items.length} items</p>
          </div>
        </summary>
        <ul className="list-disc pl-5 space-y-1 text-sm mt-3">
          {items.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </details>
    );
  }

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
