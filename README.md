# Pokédex Next — PokeAPI

Pokédex moderna con **Next.js 16 (App Router), React 19 y Tailwind CSS v4**, que consume la **PokeAPI v2** para explorar los **1025 Pokémon de las 9 regiones** (Kanto → Paldea), en **español e inglés** y con **modo claro/oscuro**.

🌐 Demo en producción: `https://pokedexbymarlongv.vercel.app/es`

> Este proyecto nació como una tarea universitaria del curso de Programación III (React + PokeAPI) y fue modernizado por completo: migración de Pages Router a App Router, upgrade a Next.js 16 y despliegue continuo en Vercel.

## Funcionalidades

- **1025 Pokémon, 9 regiones**: Kanto, Johto, Hoenn, Sinnoh, Teselia/Unova, Kalos, Alola, Galar y Paldea, con conteo por región.
- **Búsqueda instantánea** por nombre o número (con debounce) + **filtro por tipo** + **paginación**.
- **Página de detalle** (`/es/pokemon/[name]`) con stats base, habilidades (incluidas ocultas), altura, peso, experiencia base, galería de sprites **normal/shiny con tooltips** y navegación secuencial (anterior/siguiente).
- **Internacionalización ES/EN** con `next-intl` y rutas con prefijo (`/es`, `/en`); tipos, stats y regiones también se traducen.
- **Modo claro/oscuro** persistente (sin dependencias externas ni parpadeo).
- Tooltips, skeletons de carga, páginas de error y 404 personalizadas, metadatos SEO dinámicos por Pokémon.

## Stack

`Next.js 16` · `React 19` · `Tailwind CSS v4` · `next-intl` · `PokeAPI v2` · `ESLint` · `Vercel`

## Arquitectura y datos (híbrido SSG + bajo demanda)

Para no saturar la API ni el build:

- **Servidor (SSG + ISR diaria)**: índice liviano de 1025 (`1 request`), mapa de regiones vía `/generation` (`9 requests`), tipos y pre-carga con detalle de Kanto. Las páginas de detalle se pre-renderizan (Kanto) y el resto se genera on-demand con ISR.
- **Cliente**: solo se trae el detalle de las 30 cartas visibles por página, con caché en memoria y deduplicación de peticiones (`usePokemonDetails`); el filtro por tipo usa el endpoint `/type/{name}` (`1 request`).

```
src/
├── app/
│   ├── layout.js            # Layout raíz
│   └── [locale]/            # Rutas localizadas (es/en)
│       ├── layout.js        # Providers + header + footer
│       ├── page.js          # Home (SSG)
│       ├── pokemon/[name]/  # Detalle (SSG + ISR)
│       ├── loading.js / error.js / not-found.js
│       └── globals.css
├── components/              # Header, SearchBar, PokemonCard/Grid,
│                            # RegionFilter, TypeFilter, Pagination,
│                            # PokedexClient, ThemeToggle, LanguageSwitcher…
├── hooks/                   # useDebounce, usePokemonDetails
├── lib/pokeapi.js           # Cliente API + diccionarios ES/EN
├── i18n/                    # routing, navigation, request (next-intl)
├── proxy.js                 # Redirección de locale
└── middleware → proxy.js
messages/
├── es.json / en.json        # ~30 claves de traducción
```

## Empezar

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) (redirige a `/es` según tu navegador).

```bash
npm run build   # Build de producción (306 páginas: 153 × 2 idiomas)
npm run start   # Servir el build
npm run lint    # ESLint
```

No se requieren variables de entorno ni API keys (PokeAPI es pública).

## Despliegue

Despliegue continuo en [Vercel](https://vercel.com): cada `push` a `main` redespliega automáticamente.

## Autor

**Desarrollado por Marlon Gutiérrez V.** — Ingeniero en Sistemas de la UNA.

- Portafolio: [marlongv.vercel.app](https://marlongv.vercel.app)
- Datos: [PokeAPI](https://pokeapi.co)
