import Link from "next/link";

export default function RoutineCard({
  slug,
  label,
  count,
}: {
  slug: string;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={`/rutina/${slug}`}
      className="block rounded-2xl shadow bg-white p-4 hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold">{label}</h3>
      <p className="text-xs opacity-70 mt-1">{count} ejercicios</p>
    </Link>
  );
}
