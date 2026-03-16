import { useCallback, useEffect, useState } from "react";

type Theme = "emerald" | "amber" | "light";

const STORAGE_KEY = "focusflow-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "amber" || saved === "light") return saved;
    return "emerald";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      if (prev === "emerald") return "amber";
      if (prev === "amber") return "light";
      return "emerald";
    });
  }, []);

  return { theme, toggleTheme };
}
