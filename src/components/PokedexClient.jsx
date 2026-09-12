"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fetchTypeIds } from "@/lib/pokeapi";
import { useDebounce } from "@/hooks/useDebounce";
import { usePokemonDetails } from "@/hooks/usePokemonDetails";
import { SearchBar } from "./SearchBar";
import { TypeFilter } from "./TypeFilter";
import { RegionFilter } from "./RegionFilter";
import { PokemonGrid } from "./PokemonGrid";
import { Pagination } from "./Pagination";

const PAGE_SIZE = 30;

function matchesQuery(entry, q) {
  if (!q) return true;
  const query = q.trim().toLowerCase();
  if (!query) return true;
  if (String(entry.id) === query) return true;
  return entry.name.toLowerCase().includes(query);
}

export function PokedexClient({ index, regions, types, initialCards }) {
  const [region, setRegion] = useState("all");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [typeIds, setTypeIds] = useState(null);
  const [typeLoading, setTypeLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300);
  const { ensure, getCards, loading: detailsLoading } =
    usePokemonDetails(initialCards);

  const activeRegion = useMemo(
    () => regions.find((r) => r.id === region) ?? null,
    [regions, region]
  );
  const regionSet = useMemo(
    () => (activeRegion ? new Set(activeRegion.ids) : null),
    [activeRegion]
  );
  const scopeTotal = activeRegion ? activeRegion.count : index.length;

  // Ids de tipo vía /type/{name} (1 request, cacheado) — evita traer 1025 detalles.
  // Se resuelve en el handler (evento), no en un efecto, para no hacer setState síncrono.
  const typeRequest = useRef(0);
  const handleType = async (v) => {
    setType(v);
    setPage(1);
    if (!v) {
      setTypeIds(null);
      setTypeLoading(false);
      return;
    }
    const ticket = ++typeRequest.current;
    setTypeLoading(true);
    try {
      const ids = await fetchTypeIds(v);
      if (typeRequest.current === ticket) setTypeIds(new Set(ids));
    } catch {
      if (typeRequest.current === ticket) setTypeIds(new Set());
    } finally {
      if (typeRequest.current === ticket) setTypeLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return index.filter(
      (p) =>
        (!regionSet || regionSet.has(p.id)) &&
        (!typeIds || typeIds.has(p.id)) &&
        matchesQuery(p, debouncedQuery)
    );
  }, [index, regionSet, typeIds, debouncedQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedIds = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE).map((p) => p.id);
  }, [filtered, safePage]);

  // Solo trae el detalle de la página visible, con caché entre páginas/regiones.
  useEffect(() => {
    ensure(pagedIds);
  }, [ensure, pagedIds.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  const cards = getCards(pagedIds);
  const gridLoading = detailsLoading || typeLoading;

  const handleQuery = (v) => {
    setQuery(v);
    setPage(1);
  };
  const handleRegion = (v) => {
    setRegion(v);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <SearchBar value={query} onChange={handleQuery} />
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-slate-500 dark:text-slate-400">
            <strong className="text-slate-900 dark:text-slate-100">{filtered.length}</strong> /{" "}
            {scopeTotal} Pokémon
            {activeRegion ? ` · ${activeRegion.label}` : " · Todas"}
          </span>
          <span className="rounded-full bg-slate-200 px-3 py-1 font-mono text-xs dark:bg-slate-800">
            pág {safePage}/{totalPages}
          </span>
        </div>
      </div>

      <RegionFilter
        regions={regions}
        total={index.length}
        selected={region}
        onSelect={handleRegion}
      />

      <TypeFilter types={types} selected={type} onSelect={handleType} />

      {(debouncedQuery || type) && (
        <button
          onClick={() => {
            handleQuery("");
            handleType("");
          }}
          className="text-sm font-semibold text-red-400 hover:text-red-300"
        >
          ✕ Limpiar filtros ({filtered.length} resultados)
        </button>
      )}

      <PokemonGrid items={cards} loading={gridLoading} />

      <Pagination page={safePage} totalPages={totalPages} onPage={setPage} />
    </div>
  );
}
