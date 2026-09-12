"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
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

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
      className="grid h-9 w-9 place-items-center rounded-full bg-slate-200 text-lg transition hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
