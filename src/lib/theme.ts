export type Theme = "light" | "dark";

const THEME_KEY = "ems_theme";

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(THEME_KEY);
  return value === "dark" || value === "light" ? value : null;
}

export function getTheme(): Theme {
  return getStoredTheme() ?? "light";
}

export function setTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export const themeInitScript = `(function(){try{var t=localStorage.getItem("ems_theme");if(t==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`;
