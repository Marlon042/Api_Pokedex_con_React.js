"use client";

export function TypeFilter({ types, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect("")}
        className={`rounded-full px-3 py-1.5 text-sm font-semibold capitalize transition ${
          selected === ""
            ? "bg-red-600 text-white"
            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
        }`}
      >
        Todos
      </button>
      {types.map((t) => (
        <button
          key={t.name}
          onClick={() => onSelect(selected === t.name ? "" : t.name)}
          className={`rounded-full px-3 py-1.5 text-sm font-semibold capitalize transition ${
            selected === t.name
              ? "bg-red-600 text-white ring-2 ring-red-300"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {t.name}
        </button>
      ))}
    </div>
  );
}
