"use client";

export function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;

  const go = (p) => onPage(Math.min(Math.max(1, p), totalPages));

  // Ventana de páginas: 1 ... p-1 p p+1 ... N
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => go(page - 1)}
        disabled={page === 1}
        className="rounded-full bg-slate-200 px-4 py-2 text-sm font-bold disabled:opacity-40 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
      >
        ← Prev
      </button>
      {pages.map((p, idx) =>
        p === "…" ? (
          <span key={`e${idx}`} className="px-1 text-slate-500">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => go(p)}
            className={`h-9 min-w-9 rounded-full px-3 text-sm font-bold ${
              p === page ? "bg-red-600 text-white" : "bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        className="rounded-full bg-slate-200 px-4 py-2 text-sm font-bold disabled:opacity-40 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
      >
        Next →
      </button>
    </div>
  );
}
