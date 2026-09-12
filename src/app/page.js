import { PokedexClient } from "@/components/PokedexClient";
import {
  getPokemonList,
  getPokemonListWithDetails,
  getRegions,
  getTypes,
} from "@/lib/pokeapi";

// SSG híbrido: índice liviano + regiones pre-render en build (ISR diaria),
// detalles de cada carta bajo demanda en el cliente.
export const revalidate = 86400;

export default async function Home() {
  // 1 request para el índice de 1025 + 9 de generaciones + tipos.
  // Kanto pre-cargado con detalle para pintura instantánea.
  const [index, types, regions, initialCards] = await Promise.all([
    getPokemonList(1025, 0),
    getTypes(),
    getRegions(),
    getPokemonListWithDetails(151, 0),
  ]);

  const total = regions.reduce((acc, r) => acc + r.count, 0);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 p-8 text-white shadow-2xl">
        <p className="text-sm font-bold uppercase tracking-widest opacity-80">
          9 regiones · {total} Pokémon
        </p>
        <h1 className="mt-2 max-w-xl text-4xl font-black leading-tight sm:text-5xl">
          Tu Pokédex, ahora moderna.
        </h1>
        <p className="mt-3 max-w-xl text-white/90">
          Explora por región —de Kanto a Paldea—, busca por nombre o número,
          filtra por tipo y pagina. Click en cualquier carta para ver stats,
          altura, peso y habilidades.
        </p>
      </section>

      <PokedexClient
        index={index}
        regions={regions}
        types={types}
        initialCards={initialCards}
      />
    </div>
  );
}
