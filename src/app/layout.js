import "./globals.css";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Pokédex Next — PokeAPI",
  description: "Pokédex moderna con Next.js App Router, búsqueda, filtros por tipo y paginación.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Header />
        <main className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-16 pt-8">
          {children}
        </main>
        <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
          <p className="text-base font-bold text-slate-200">
            Desarrollado por Marlon Gutiérrez V.
          </p>
          <p className="mt-1">Ingeniero en Sistemas de la UNA</p>
          <p className="mt-3 space-x-4">
            <a
              className="font-semibold text-red-400 underline-offset-4 hover:text-red-300 hover:underline"
              href="https://marlongv.vercel.app"
              target="_blank"
              rel="noreferrer"
            >
              Portafolio personal
            </a>
            <span className="text-slate-700">·</span>
            <a
              className="underline-offset-4 hover:text-slate-300 hover:underline"
              href="https://pokeapi.co"
              target="_blank"
              rel="noreferrer"
            >
              Datos: PokeAPI
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
