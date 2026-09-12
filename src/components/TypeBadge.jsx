import { typeColor, typeName } from "@/lib/pokeapi";

export function TypeBadge({ type, locale = "es" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize text-white ${typeColor(
        type
      )}`}
    >
      {typeName(type, locale)}
    </span>
  );
}
