import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

export async function Header({locale}) {
  const t = await getTranslations({locale, namespace: 'Header'});

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-red-600 text-xl font-black text-white shadow-lg shadow-red-900/30">
            ●
          </span>
          <div>
            <p className="text-lg font-extrabold leading-none tracking-tight">
              Pokédex <span className="text-red-600 dark:text-red-500">Next</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('subtitle')}</p>
          </div>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link
            href="/"
            className="rounded-full bg-slate-200 px-4 py-2 font-semibold hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            {t('home')}
          </Link>
          <a
            href="https://pokeapi.co"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full border border-slate-300 px-4 py-2 text-slate-600 hover:bg-slate-100 sm:block dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            PokeAPI
          </a>
        </nav>
      </div>
    </header>
  );
}
