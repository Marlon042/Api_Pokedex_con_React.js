"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { useAppTheme } from "./Providers";

export function ThemeToggle() {
  const t = useTranslations("Header");
  const { theme, toggle } = useAppTheme();
  // Evita mismatch de hidratación: en servidor siempre "no montado".
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <span className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800" />
    );
  }

  const isDark = theme === "dark";
  const label = isDark ? t("toLight") : t("toDark");

  return (
    <button
      onClick={toggle}
      aria-label={label}
      title={label}
      className="group relative grid h-9 w-9 place-items-center rounded-full bg-slate-200 text-lg transition hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
    >
      {isDark ? "☀️" : "🌙"}
      <span className="pointer-events-none absolute -bottom-1 left-1/2 z-50 -translate-x-1/2 translate-y-full whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-900 opacity-0 shadow-xl transition group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
        {label}
      </span>
    </button>
  );
}
