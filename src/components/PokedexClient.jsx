"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchBar } from "./SearchBar";
import { TypeFilter } from "./TypeFilter";
import { PokemonGrid } from "./PokemonGrid";
import { Pagination } from "./Pagination";

const PAGE_SIZE = 30;

function matchesQuery(p, q) {
  if (!q) return true;
  const query = q.trim().toLowerCase();
  if (!query) return true;
  if (String(p.id) === query) return true;
  return p.name.toLowerCase().includes(query);
}

export function PokedexClient({ allPokemon, types }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);

  const debouncedQuery = useDebounce(query, 300);

  const filtered = useMemo(() => {
    return allPokemon.filter(
      (p) =>
        matchesQuery(p, debouncedQuery) &&
        (type === "" || (p.types ?? []).includes(type))
    );
  }, [allPokemon, debouncedQuery, type]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const handleQuery = (v) => {
    setQuery(v);
    setPage(1);
  };
  const handleType = (v) => {
    setType(v);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <SearchBar value={query} onChange={handleQuery} />
        <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm">
          <span className="text-slate-400">
            <strong className="text-slate-100">{filtered.length}</strong> /{" "}
            {allPokemon.length} Pokémon
          </span>
          <span className="rounded-full bg-slate-800 px-3 py-1 font-mono text-xs">
            pág {safePage}/{totalPages}
          </span>
        </div>
      </div>

      <TypeFilter types={types} selected={type} onSelect={handleType} />

      {(debouncedQuery || type) && (
        <button
          onClick={() => {
            setQuery("");
            setType("");
            setPage(1);
          }}
          className="text-sm font-semibold text-red-400 hover:text-red-300"
        >
          ✕ Limpiar filtros ({filtered.length} resultados)
        </button>
      )}

      <PokemonGrid items={paged} loading={false} />

      <Pagination page={safePage} totalPages={totalPages} onPage={setPage} />
    </div>
  );
}
