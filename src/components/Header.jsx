import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-red-600 text-xl font-black shadow-lg shadow-red-900">
            ●
          </span>
          <div>
            <p className="text-lg font-extrabold leading-none tracking-tight">
              Pokédex <span className="text-red-500">Next</span>
            </p>
            <p className="text-xs text-slate-400">App Router + PokeAPI</p>
          </div>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="rounded-full bg-slate-800 px-4 py-2 font-semibold hover:bg-slate-700"
          >
            Inicio
          </Link>
          <a
            href="https://pokeapi.co"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full border border-slate-700 px-4 py-2 text-slate-300 hover:bg-slate-800 sm:block"
          >
            PokeAPI
          </a>
        </nav>
      </div>
    </header>
  );
}
