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
      <Link href="/" className="inline-block text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
        ← Volver a la Pokédex
      </Link>

      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
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

        <div className="grid gap-6 bg-slate-100 p-8 md:grid-cols-2 dark:bg-slate-950">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-extrabold">Stats base</h2>
            <div className="mt-4 space-y-3">
              {pokemon.stats?.map((s) => (
                <StatBar key={s.stat.name} label={s.stat.name.replace("-", " ")} value={s.base_stat} />
              ))}
            </div>
          </section>
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-extrabold">Habilidades</h2>
              <ul className="mt-3 space-y-2">
                {pokemon.abilities?.map((a) => (
                  <li
                    key={a.ability.name}
                    className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2 text-sm capitalize dark:bg-slate-800"
                  >
                    <span>{a.ability.name.replace("-", " ")}</span>
                    {a.is_hidden && (
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs dark:bg-slate-700">oculta</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-extrabold">Sprites</h2>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[
                  { src: pokemon.sprites?.front_default, label: "Normal · Frente" },
                  { src: pokemon.sprites?.back_default, label: "Normal · Espalda" },
                  { src: pokemon.sprites?.front_shiny, label: "Shiny · Frente" },
                  { src: pokemon.sprites?.back_shiny, label: "Shiny · Espalda" },
                ]
                  .filter((s) => Boolean(s.src))
                  .map((s) => (
                    <div
                      key={s.label}
                      title={s.label}
                      className="group relative aspect-square rounded-xl bg-slate-100 dark:bg-slate-800"
                    >
                      <Image
                        src={s.src}
                        alt={s.label}
                        fill
                        className="object-contain p-1"
                      />
                      <span className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-900 opacity-0 shadow-xl transition group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                        {s.label}
                      </span>
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
            className="rounded-full bg-slate-200 px-5 py-2.5 text-sm font-bold hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            ← #{pokemon.id - 1}
          </Link>
        ) : (
          <span />
        )}
        <Link
          href={`/pokemon/${pokemon.id + 1}`}
          className="rounded-full bg-slate-200 px-5 py-2.5 text-sm font-bold hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          #{pokemon.id + 1} →
        </Link>
      </div>
    </div>
  );
}
