"use client";

export function RegionFilter({ regions, total, selected, onSelect }) {
  const isAll = selected === "all";
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
        Región
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect("all")}
          className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
            isAll
              ? "bg-red-600 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Todas · {total}
        </button>
        {regions.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelect(selected === r.id ? "all" : r.id)}
            title={`Generación ${r.id}`}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold capitalize transition ${
              selected === r.id
                ? "bg-red-600 text-white ring-2 ring-red-300"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {r.label} · {r.count}
          </button>
        ))}
      </div>
    </div>
  );
}
