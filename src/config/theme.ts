export function applyTheme() {
  const forceTheme = import.meta.env.VITE_THEME;

  const getTheme = () => {
    if (forceTheme === "light" || forceTheme === "dark") return forceTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  document.documentElement.setAttribute("data-theme", getTheme());
}
