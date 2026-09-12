"use client";

import {useTranslations} from 'next-intl';

export function RegionFilter({ regions, total, selected, onSelect }) {
  const t = useTranslations('Region');
  const isAll = selected === "all";
  const idle =
    "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700";

  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {t('label')}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect("all")}
          className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
            isAll ? "bg-red-600 text-white" : idle
          }`}
        >
          {t('all')} · {total}
        </button>
        {regions.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelect(selected === r.id ? "all" : r.id)}
            title={`Generación ${r.id} / Generation ${r.id}`}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold capitalize transition ${
              selected === r.id
                ? "bg-red-600 text-white ring-2 ring-red-300"
                : idle
            }`}
          >
            {r.label} · {r.count}
          </button>
        ))}
      </div>
    </div>
  );
}
