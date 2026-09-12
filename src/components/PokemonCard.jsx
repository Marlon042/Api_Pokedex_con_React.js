import Image from "next/image";
import Link from "next/link";
import { TypeBadge } from "./TypeBadge";

export function PokemonCard({ pokemon }) {
  const idLabel = String(pokemon.id).padStart(4, "0");
  return (
    <Link
      href={`/pokemon/${pokemon.name}`}
      className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-4 transition hover:-translate-y-1 hover:border-slate-600 hover:shadow-2xl hover:shadow-black/50"
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-mono text-slate-500">#{idLabel}</span>
        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-300 opacity-0 transition group-hover:opacity-100">
          Ver →
        </span>
      </div>
      <div className="relative mx-auto h-32 w-32 transition duration-300 group-hover:scale-110">
        {pokemon.sprite ? (
          <Image
            src={pokemon.sprite}
            alt={pokemon.name}
            fill
            sizes="128px"
            className="object-contain drop-shadow-xl"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-4xl">❓</div>
        )}
      </div>
      <h3 className="mt-2 text-center text-lg font-extrabold capitalize tracking-tight">
        {pokemon.name}
      </h3>
      <div className="mt-2 flex flex-wrap justify-center gap-1.5">
        {(pokemon.types ?? []).map((t) => (
          <TypeBadge key={t} type={t} />
        ))}
      </div>
    </Link>
  );
}

export function PokemonCardSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl border border-slate-800 bg-slate-900 p-4">
      <div className="h-4 w-12 rounded bg-slate-800" />
      <div className="mx-auto mt-4 h-32 w-32 rounded-2xl bg-slate-800" />
      <div className="mx-auto mt-4 h-5 w-2/3 rounded bg-slate-800" />
      <div className="mx-auto mt-2 flex justify-center gap-2">
        <div className="h-5 w-16 rounded-full bg-slate-800" />
        <div className="h-5 w-16 rounded-full bg-slate-800" />
      </div>
    </div>
  );
}
