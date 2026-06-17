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

function syncDocumentTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
}

export function setTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, theme);
  syncDocumentTheme(theme);
}

export function applyTheme(theme: Theme): void {
  syncDocumentTheme(theme);
}

export const themeInitScript = `(function(){try{var t=localStorage.getItem("ems_theme");var d=t==="dark";var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";}catch(e){document.documentElement.style.colorScheme="light";}})();`;
