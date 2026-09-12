"use client";

import { PokemonCard, PokemonCardSkeleton } from "./PokemonCard";

export function PokemonGrid({ items, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <PokemonCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/50 p-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
        <p className="text-4xl">🔍</p>
        <p className="mt-3 text-lg font-bold">Sin resultados</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Prueba con otro nombre, número o tipo.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((p) => (
        <PokemonCard key={p.id} pokemon={p} />
      ))}
    </div>
  );
}
