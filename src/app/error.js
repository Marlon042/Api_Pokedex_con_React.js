"use client";

export default function Error({ error, reset }) {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <p className="text-6xl">⚠️</p>
      <h1 className="mt-4 text-2xl font-black">Algo falló con la PokeAPI</h1>
      <p className="mt-2 text-sm text-slate-400">{error?.message}</p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-slate-800 px-6 py-3 font-bold hover:bg-slate-700"
      >
        Reintentar
      </button>
    </div>
  );
}
