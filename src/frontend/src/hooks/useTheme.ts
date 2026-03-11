import { useCallback, useEffect, useState } from "react";

type Theme = "emerald" | "amber";

const STORAGE_KEY = "focusflow-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved === "amber" ? "amber" : "emerald") as Theme;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "emerald" ? "amber" : "emerald"));
  }, []);

  return { theme, toggleTheme };
}
