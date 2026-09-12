"use client";

import {useLocale, useTranslations} from 'next-intl';
import {typeName} from '@/lib/pokeapi';

export function TypeFilter({ types, selected, onSelect }) {
  const t = useTranslations('Type');
  const locale = useLocale();
  const idle =
    "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700";

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect("")}
        className={`rounded-full px-3 py-1.5 text-sm font-semibold capitalize transition ${
          selected === "" ? "bg-red-600 text-white" : idle
        }`}
      >
        {t('all')}
      </button>
      {types.map((type) => (
        <button
          key={type.name}
          onClick={() => onSelect(selected === type.name ? "" : type.name)}
          className={`rounded-full px-3 py-1.5 text-sm font-semibold capitalize transition ${
            selected === type.name
              ? "bg-red-600 text-white ring-2 ring-red-300"
              : idle
          }`}
        >
          {typeName(type.name, locale)}
        </button>
      ))}
    </div>
  );
}
