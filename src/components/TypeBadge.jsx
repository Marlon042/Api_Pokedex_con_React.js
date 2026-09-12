import { typeColor } from "@/lib/pokeapi";

export function TypeBadge({ type }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize text-white ${typeColor(
        type
      )}`}
    >
      {type}
    </span>
  );
}
