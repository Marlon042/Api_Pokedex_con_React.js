"use client";

import {useTranslations} from 'next-intl';

export default function Error({ error, reset }) {
  const t = useTranslations('Error');

  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <p className="text-6xl">⚠️</p>
      <h1 className="mt-4 text-2xl font-black">{t('title')}</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{error?.message}</p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-slate-200 px-6 py-3 font-bold hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
      >
        {t('retry')}
      </button>
    </div>
  );
}
