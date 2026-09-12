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
        <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
          Datos de <a className="underline" href="https://pokeapi.co">PokeAPI</a> · Hecho con Next.js App
          Router
        </footer>
      </body>
    </html>
  );
}
