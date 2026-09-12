"use client";

import { useCallback, useRef, useState } from "react";
import { fetchPokemonCard } from "@/lib/pokeapi";

// Caché en memoria + dedupe de requests en vuelo.
// Solo trae el detalle de los ids que se le piden (página visible).
export function usePokemonDetails(initialCards = []) {
  const cacheRef = useRef(null);
  if (cacheRef.current === null) {
    cacheRef.current = new Map(initialCards.map((c) => [c.id, c]));
  }
  const pendingRef = useRef(new Map());
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(false);

  const ensure = useCallback(async (ids) => {
    const unique = [...new Set(ids)].filter(
      (id) => !cacheRef.current.has(id)
    );
    if (unique.length === 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const jobs = unique.map((id) => {
      if (!pendingRef.current.has(id)) {
        const job = fetchPokemonCard(id).finally(() =>
          pendingRef.current.delete(id)
        );
        pendingRef.current.set(id, job);
      }
      return pendingRef.current.get(id);
    });
    const results = await Promise.all(jobs);
    let changed = false;
    for (const card of results) {
      if (card && !cacheRef.current.has(card.id)) {
        cacheRef.current.set(card.id, card);
        changed = true;
      }
    }
    if (changed) setVersion((v) => v + 1);
    setLoading(false);
  }, []);

  const getCards = useCallback(
    (ids) => ids.map((id) => cacheRef.current.get(id)).filter(Boolean),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version]
  );

  return { ensure, getCards, loading };
}
