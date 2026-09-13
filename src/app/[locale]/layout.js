import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import "../globals.css";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function LocaleLayout({children, params}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({locale, namespace: 'Footer'});

  return (
    <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Header locale={locale} />
            <main className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-16 pt-8">
              {children}
            </main>
            <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-500">
              <p className="text-base font-bold text-slate-900 dark:text-slate-200">
                {t('devBy')}
              </p>
              <p className="mt-1">{t('role')}</p>
              <p className="mt-3 space-x-4">
                <a
                  className="font-semibold text-red-600 underline-offset-4 hover:text-red-500 hover:underline dark:text-red-400 dark:hover:text-red-300"
                  href="https://marlongv.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('portfolio')}
                </a>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <a
                  className="underline-offset-4 hover:text-slate-700 hover:underline dark:hover:text-slate-300"
                  href="https://pokeapi.co"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('data')}
                </a>
              </p>
            </footer>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
