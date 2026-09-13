"use client";

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';

const LOCALES = [
  {code: 'es', label: 'Español'},
  {code: 'en', label: 'English'},
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label="Idioma / Language"
      className="flex items-center gap-1 rounded-full bg-slate-200 p-1 text-sm font-bold dark:bg-slate-800"
    >
      {LOCALES.map(({code, label}) => (
        <button
          key={code}
          onClick={() => {
            if (code !== locale) router.replace(pathname, {locale: code});
          }}
          aria-pressed={code === locale}
          aria-label={label}
          title={label}
          className={`group relative rounded-full px-3 py-1.5 uppercase transition ${
            code === locale
              ? "bg-red-600 text-white"
              : "text-slate-600 hover:bg-slate-300 dark:text-slate-300 dark:hover:bg-slate-700"
          }`}
        >
          {code}
          <span className="pointer-events-none absolute -bottom-1 left-1/2 z-50 -translate-x-1/2 translate-y-full whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold normal-case text-slate-900 opacity-0 shadow-xl transition group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
