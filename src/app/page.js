import { PokedexClient } from "@/components/PokedexClient";
import { getPokemonListWithDetails, getTypes } from "@/lib/pokeapi";

// SSG híbrido: pre-render en build + revalidación diaria (ISR)
export const revalidate = 86400;

export default async function Home() {
  // Primera generación: 151 originales para build rápido en Vercel.
  // Cambia a 1025 si quieres la Pokédex completa (build más lento).
  const [allPokemon, types] = await Promise.all([
    getPokemonListWithDetails(151, 0),
    getTypes(),
  ]);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 p-8 text-white shadow-2xl">
        <p className="text-sm font-bold uppercase tracking-widest opacity-80">
          Kanto · 151 Pokémon
        </p>
        <h1 className="mt-2 max-w-xl text-4xl font-black leading-tight sm:text-5xl">
          Tu Pokédex, ahora moderna.
        </h1>
        <p className="mt-3 max-w-xl text-white/90">
          Búsqueda instantánea por nombre o número, filtro por tipo y paginación.
          Click en cualquier carta para ver stats, altura, peso y habilidades.
        </p>
      </section>

      <PokedexClient allPokemon={allPokemon} types={types} />
    </div>
  );
}
