"use client";

import {useTranslations} from 'next-intl';
import { useEffect, useRef } from "react";

export function SearchBar({ value, onChange, autoFocus = true }) {
  const t = useTranslations('Search');
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        ⌕
      </span>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('placeholder')}
        className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-10 text-slate-900 placeholder:text-slate-400 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label={t('clear')}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-200 px-2.5 py-1 text-sm text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          ✕
        </button>
      )}
    </div>
  );
}
