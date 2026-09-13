"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "pokedex-theme";

const ThemeContext = createContext({theme: "dark", toggle: () => {}});

export function useAppTheme() {
  return useContext(ThemeContext);
}

function initialTheme() {
  if (typeof window === "undefined") return "dark";
  let stored = null;
  try {
    stored = window.localStorage.getItem(STORAGE_KEY);
  } catch {}
  const initial = stored === "light" || stored === "dark" ? stored : "dark";
  // Se aplica durante el render de hidratación (antes del pintado en la
  // práctica) y la clase vive solo en el DOM: React nunca la gestiona,
  // así que sobrevive a remontajes (ej. cambio ES/EN). Sin <script>.
  document.documentElement.classList.toggle("dark", initial === "dark");
  return initial;
}

export function Providers({ children }) {
  const [theme, setTheme] = useState(initialTheme);

  // Seguro: re-sincroniza el DOM si el estado cambia por cualquier vía.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {}
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{theme, toggle}}>
      {children}
    </ThemeContext.Provider>
  );
}
