"use client";

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';

const LOCALES = ['es', 'en'];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label="Idioma / Language"
      className="flex overflow-hidden rounded-full bg-slate-200 text-sm font-bold dark:bg-slate-800"
    >
      {LOCALES.map((lng) => (
        <button
          key={lng}
          onClick={() => {
            if (lng !== locale) router.replace(pathname, {locale: lng});
          }}
          aria-pressed={lng === locale}
          className={`px-3 py-2 uppercase transition ${
            lng === locale
              ? "bg-red-600 text-white"
              : "text-slate-600 hover:bg-slate-300 dark:text-slate-300 dark:hover:bg-slate-700"
          }`}
        >
          {lng}
        </button>
      ))}
    </div>
  );
}
