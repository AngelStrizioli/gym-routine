export default function FinishForm({ dayLabel }: { dayLabel: string }) {
  return (
    <form
      action="/api/complete"
      method="POST"
      className="rounded-2xl bg-white shadow p-4 space-y-2"
    >
      <input type="hidden" name="dia" value={dayLabel} />
      <label className="text-sm">Notas (opcional)</label>
      <textarea
        name="note"
        className="w-full border rounded-xl p-2 text-sm"
        rows={3}
        placeholder="Cómo te sentiste, pesos usados, etc."
      />
      <button className="w-full rounded-2xl bg-black text-white py-2 font-semibold">
        Finalizar rutina
      </button>
    </form>
  );
}
