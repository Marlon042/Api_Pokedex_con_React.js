const API_BASE = "https://pokeapi.co/api/v2";

export function getIdFromUrl(url) {
  const match = url?.match(/\/pokemon\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
}

export function getSpeciesIdFromUrl(url) {
  const match = url?.match(/\/pokemon-species\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
}

export function getSpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

async function fetchJson(url, revalidate = 86400) {
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) throw new Error(`PokeAPI error: ${res.status} ${url}`);
  return res.json();
}

export async function getPokemonList(limit = 151, offset = 0) {
  const data = await fetchJson(`${API_BASE}/pokemon?limit=${limit}&offset=${offset}`);
  return (data.results ?? []).map((p) => ({
    ...p,
    id: getIdFromUrl(p.url),
  }));
}

export async function getPokemon(nameOrId) {
  return fetchJson(`${API_BASE}/pokemon/${String(nameOrId).toLowerCase()}`, 86400);
}

export async function getPokemonSpecies(nameOrId) {
  return fetchJson(`${API_BASE}/pokemon-species/${String(nameOrId).toLowerCase()}`, 86400);
}

export async function getTypes() {
  const data = await fetchJson(`${API_BASE}/type`, 86400 * 7);
  // Filtramos shadow/unknown que no sirven para filtro
  return (data.results ?? []).filter((t) => !["shadow", "unknown"].includes(t.name));
}

// Trae detalles en batches para no saturar la API (hibrido: SSG lista + detalle bajo demanda)
export async function getPokemonListWithDetails(limit = 1025, offset = 0, batchSize = 50) {
  const list = await getPokemonList(limit, offset);
  const detailed = [];
  for (let i = 0; i < list.length; i += batchSize) {
    const batch = list.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map((p) =>
        fetchJson(`${API_BASE}/pokemon/${p.id}`, 86400)
          .then((d) => ({
            id: d.id,
            name: d.name,
            url: p.url,
            sprite: d.sprites?.other?.["official-artwork"]?.front_default ?? d.sprites?.front_default,
            types: d.types?.map((t) => t.type.name) ?? [],
          }))
          .catch(() => ({
            id: p.id,
            name: p.name,
            url: p.url,
            sprite: getSpriteUrl(p.id),
            types: [],
          }))
      )
    );
    detailed.push(...results);
  }
  return detailed;
}

// ---- Regiones / generaciones (PokeAPI v2, endpoint /generation) ----
export const GENERATION_META = [
  { id: 1, labels: { es: "Kanto", en: "Kanto" }, from: 1, to: 151 },
  { id: 2, labels: { es: "Johto", en: "Johto" }, from: 152, to: 251 },
  { id: 3, labels: { es: "Hoenn", en: "Hoenn" }, from: 252, to: 386 },
  { id: 4, labels: { es: "Sinnoh", en: "Sinnoh" }, from: 387, to: 493 },
  { id: 5, labels: { es: "Teselia", en: "Unova" }, from: 494, to: 649 },
  { id: 6, labels: { es: "Kalos", en: "Kalos" }, from: 650, to: 721 },
  { id: 7, labels: { es: "Alola", en: "Alola" }, from: 722, to: 809 },
  { id: 8, labels: { es: "Galar", en: "Galar" }, from: 810, to: 905 },
  { id: 9, labels: { es: "Paldea", en: "Paldea" }, from: 906, to: 1025 },
];

export function generationLabel(meta, locale) {
  return meta.labels?.[locale] ?? meta.labels?.es ?? "";
}

// Nombres de tipos por idioma (la API los da en inglés).
export const TYPE_NAMES = {
  es: {
    normal: "normal",
    fighting: "lucha",
    flying: "volador",
    poison: "veneno",
    ground: "tierra",
    rock: "roca",
    bug: "bicho",
    ghost: "fantasma",
    steel: "acero",
    fire: "fuego",
    water: "agua",
    grass: "planta",
    electric: "eléctrico",
    psychic: "psíquico",
    ice: "hielo",
    dragon: "dragón",
    dark: "siniestro",
    fairy: "hada",
    stellar: "estelar",
    shadow: "sombra",
    unknown: "desconocido",
  },
  en: {
    normal: "normal",
    fighting: "fighting",
    flying: "flying",
    poison: "poison",
    ground: "ground",
    rock: "rock",
    bug: "bug",
    ghost: "ghost",
    steel: "steel",
    fire: "fire",
    water: "water",
    grass: "grass",
    electric: "electric",
    psychic: "psychic",
    ice: "ice",
    dragon: "dragon",
    dark: "dark",
    fairy: "fairy",
    stellar: "stellar",
    shadow: "shadow",
    unknown: "unknown",
  },
};

export function typeName(type, locale) {
  return TYPE_NAMES[locale]?.[type] ?? TYPE_NAMES.en[type] ?? type;
}

// Nombres de stats por idioma (la API los da en inglés).
export const STAT_NAMES = {
  es: {
    hp: "PS",
    attack: "Ataque",
    defense: "Defensa",
    "special-attack": "At. especial",
    "special-defense": "Def. especial",
    speed: "Velocidad",
  },
  en: {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Special Attack",
    "special-defense": "Special Defense",
    speed: "Speed",
  },
};

export function statName(stat, locale) {
  return STAT_NAMES[locale]?.[stat] ?? stat.replace(/-/g, " ");
}

function rangeIds(from, to) {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

export async function getGenerationSpecies(genId) {
  const data = await fetchJson(`${API_BASE}/generation/${genId}`, 86400 * 7);
  return (data.pokemon_species ?? [])
    .map((s) => getSpeciesIdFromUrl(s.url))
    .filter((id) => Number.isInteger(id) && id <= 1025)
    .sort((a, b) => a - b);
}

// Mapa de regiones con ids exactos según la API; fallback a rangos estáticos si falla.
export async function getRegions() {
  const results = await Promise.all(
    GENERATION_META.map(async (meta) => {
      try {
        const ids = await getGenerationSpecies(meta.id);
        return { ...meta, ids: ids.length ? ids : rangeIds(meta.from, meta.to) };
      } catch {
        return { ...meta, ids: rangeIds(meta.from, meta.to) };
      }
    })
  );
  return results.map((r) => ({ ...r, count: r.ids.length }));
}

// ---- Detalle liviano para cards (seguro en server y cliente) ----
export function toCardData(d) {
  return {
    id: d.id,
    name: d.name,
    sprite:
      d.sprites?.other?.["official-artwork"]?.front_default ??
      d.sprites?.front_default ??
      getSpriteUrl(d.id),
    types: d.types?.map((t) => t.type.name) ?? [],
  };
}

export async function fetchPokemonCard(id) {
  try {
    const res = await fetch(`${API_BASE}/pokemon/${id}`);
    if (!res.ok) throw new Error(`PokeAPI error: ${res.status}`);
    return toCardData(await res.json());
  } catch {
    return null;
  }
}

const typeIdsCache = new Map();

export async function fetchTypeIds(type) {
  if (typeIdsCache.has(type)) return typeIdsCache.get(type);
  const res = await fetch(`${API_BASE}/type/${type}`);
  if (!res.ok) throw new Error(`PokeAPI error: ${res.status}`);
  const data = await res.json();
  const ids = (data.pokemon ?? [])
    .map((p) => getIdFromUrl(p.pokemon?.url))
    .filter((id) => Number.isInteger(id) && id >= 1 && id <= 1025);
  const unique = [...new Set(ids)].sort((a, b) => a - b);
  typeIdsCache.set(type, unique);
  return unique;
}

export const TYPE_COLORS = {
  normal: "bg-stone-400",
  fire: "bg-orange-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400 text-slate-900",
  grass: "bg-green-500",
  ice: "bg-cyan-300 text-slate-900",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-amber-600",
  flying: "bg-sky-400 text-slate-900",
  psychic: "bg-pink-500",
  bug: "bg-lime-500 text-slate-900",
  rock: "bg-yellow-700",
  ghost: "bg-violet-700",
  dragon: "bg-indigo-600",
  dark: "bg-slate-800",
  steel: "bg-slate-400 text-slate-900",
  fairy: "bg-rose-300 text-slate-900",
};

export function typeColor(type) {
  return TYPE_COLORS[type] ?? "bg-slate-600";
}
