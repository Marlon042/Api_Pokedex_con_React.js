import {getLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({locale, namespace: 'NotFound'});

  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <p className="text-6xl">👻</p>
      <h1 className="mt-4 text-3xl font-black">{t('title')}</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        {t('description')}
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-500"
      >
        {t('home')}
      </Link>
    </div>
  );
}
