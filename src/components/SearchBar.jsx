"use client";

import { useEffect, useRef } from "react";

export function SearchBar({ value, onChange, autoFocus = true }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        ⌕
      </span>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nombre o número… ej: pikachu o 25"
        className="w-full rounded-2xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-10 text-slate-100 placeholder:text-slate-500 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Limpiar búsqueda"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-800 px-2.5 py-1 text-sm text-slate-300 hover:bg-slate-700"
        >
          ✕
        </button>
      )}
    </div>
  );
}
