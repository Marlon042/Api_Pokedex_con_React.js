import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <p className="text-6xl">👻</p>
      <h1 className="mt-4 text-3xl font-black">Pokémon no encontrado</h1>
      <p className="mt-2 text-slate-400">
        Ese nombre o número no existe en la Pokédex.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-500"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
