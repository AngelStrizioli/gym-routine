import Link from "next/link";

export default function RoutineHeader({ title }: { title: string }) {
  const today = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-2">
      <nav className="flex items-center gap-3">
        <Link href="/" className="text-sm underline">
          ← Volver al inicio
        </Link>
        <span className="text-xs opacity-60 ml-auto">{today}</span>
      </nav>
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
}
