export function StatBar({ label, value, max = 200 }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color =
    pct >= 70 ? "bg-green-500" : pct >= 45 ? "bg-yellow-400" : "bg-red-500";
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="capitalize text-slate-600 dark:text-slate-300">{label}</span>
        <span className="font-mono font-bold">{value}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
