import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPokemon, getPokemonSpecies, typeColor } from "@/lib/pokeapi";
import { StatBar } from "@/components/StatBar";
import { TypeBadge } from "@/components/TypeBadge";

export const revalidate = 86400;

export async function generateStaticParams() {
  // Pre-render solo los 151 para builds rápidos. El resto se genera on-demand.
  return Array.from({ length: 151 }, (_, i) => ({ name: String(i + 1) }));
}

export async function generateMetadata({ params }) {
  const { name } = await params;
  try {
    const p = await getPokemon(name);
    return {
      title: `#${p.id} ${p.name} — Pokédex`,
      description: `Stats, tipos y habilidades de ${p.name}.`,
    };
  } catch {
    return { title: "Pokémon no encontrado" };
  }
}

export default async function PokemonPage({ params }) {
  const { name } = await params;
  let pokemon;
  let species = null;
  try {
    pokemon = await getPokemon(name);
    try {
      species = await getPokemonSpecies(pokemon.id);
    } catch {}
  } catch {
    notFound();
  }

  const idLabel = String(pokemon.id).padStart(4, "0");
  const artwork =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ??
    pokemon.sprites?.front_default;
  const flavor =
    species?.flavor_text_entries
      ?.find((e) => e.language.name === "es")
      ?.flavor_text?.replace(/[\n\f]/g, " ") ??
    species?.flavor_text_entries
      ?.find((e) => e.language.name === "en")
      ?.flavor_text?.replace(/[\n\f]/g, " ");

  const mainType = pokemon.types?.[0]?.type?.name ?? "normal";

  return (
    <div className="space-y-6">
      <Link href="/" className="inline-block text-sm font-bold text-slate-300 hover:text-white">
        ← Volver a la Pokédex
      </Link>

      <div className="overflow-hidden rounded-3xl border border-slate-800">
        <div className={`p-8 text-white ${typeColor(mainType)}`}>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="relative h-56 w-56 shrink-0 drop-shadow-2xl">
              {artwork && (
                <Image src={artwork} alt={pokemon.name} fill className="object-contain" priority />
              )}
            </div>
            <div className="flex-1">
              <p className="font-mono opacity-80">#{idLabel}</p>
              <h1 className="text-4xl font-black capitalize sm:text-5xl">{pokemon.name}</h1>
              <div className="mt-3 flex flex-wrap gap-2">
                {pokemon.types?.map((t) => (
                  <TypeBadge key={t.type.name} type={t.type.name} />
                ))}
              </div>
              {flavor && <p className="mt-4 max-w-xl text-white/90">{flavor}</p>}
              <div className="mt-4 grid max-w-md grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-black/25 p-3">
                  <p className="text-xs uppercase opacity-80">Altura</p>
                  <p className="text-lg font-black">{(pokemon.height / 10).toFixed(1)} m</p>
                </div>
                <div className="rounded-2xl bg-black/25 p-3">
                  <p className="text-xs uppercase opacity-80">Peso</p>
                  <p className="text-lg font-black">{(pokemon.weight / 10).toFixed(1)} kg</p>
                </div>
                <div className="rounded-2xl bg-black/25 p-3">
                  <p className="text-xs uppercase opacity-80">Exp base</p>
                  <p className="text-lg font-black">{pokemon.base_experience ?? "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 bg-slate-950 p-8 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-lg font-extrabold">Stats base</h2>
            <div className="mt-4 space-y-3">
              {pokemon.stats?.map((s) => (
                <StatBar key={s.stat.name} label={s.stat.name.replace("-", " ")} value={s.base_stat} />
              ))}
            </div>
          </section>
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-lg font-extrabold">Habilidades</h2>
              <ul className="mt-3 space-y-2">
                {pokemon.abilities?.map((a) => (
                  <li
                    key={a.ability.name}
                    className="flex items-center justify-between rounded-xl bg-slate-800 px-3 py-2 text-sm capitalize"
                  >
                    <span>{a.ability.name.replace("-", " ")}</span>
                    {a.is_hidden && (
                      <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs">oculta</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-lg font-extrabold">Sprites</h2>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[
                  pokemon.sprites?.front_default,
                  pokemon.sprites?.back_default,
                  pokemon.sprites?.front_shiny,
                  pokemon.sprites?.back_shiny,
                ]
                  .filter(Boolean)
                  .map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-xl bg-slate-800">
                      <Image src={src} alt="" fill className="object-contain p-1" />
                    </div>
                  ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="flex justify-between">
        {pokemon.id > 1 ? (
          <Link
            href={`/pokemon/${pokemon.id - 1}`}
            className="rounded-full bg-slate-800 px-5 py-2.5 text-sm font-bold hover:bg-slate-700"
          >
            ← #{pokemon.id - 1}
          </Link>
        ) : (
          <span />
        )}
        <Link
          href={`/pokemon/${pokemon.id + 1}`}
          className="rounded-full bg-slate-800 px-5 py-2.5 text-sm font-bold hover:bg-slate-700"
        >
          #{pokemon.id + 1} →
        </Link>
      </div>
    </div>
  );
}
