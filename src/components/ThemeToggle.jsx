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

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? t("toLight") : t("toDark")}
      title={isDark ? t("toLight") : t("toDark")}
      className="grid h-9 w-9 place-items-center rounded-full bg-slate-200 text-lg transition hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
