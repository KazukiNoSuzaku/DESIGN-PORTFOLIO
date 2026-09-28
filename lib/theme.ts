// Duotone palettes. `ink` is the dark field, `paper` the light one.
// Every colour on the site is derived from these two values.

export type Theme = { id: string; name: string; ink: string; paper: string; by: "you" | "claude" };

export const themes: Theme[] = [
  { id: "mono", name: "Mono", ink: "#0B0B0B", paper: "#EFEFED", by: "claude" },
  { id: "lime", name: "Olive / Lime", ink: "#0F0E06", paper: "#C6E385", by: "you" },
  { id: "cobalt", name: "Cobalt", ink: "#021F94", paper: "#F5F2F3", by: "you" },
  { id: "claret", name: "Claret", ink: "#5A2132", paper: "#EFE9E9", by: "you" },
  { id: "signal", name: "Signal Red", ink: "#D3261A", paper: "#F4EEE3", by: "claude" },
  { id: "ember", name: "Ember", ink: "#121212", paper: "#FF5B1F", by: "claude" },
  { id: "forest", name: "Forest / Bone", ink: "#10281D", paper: "#EDE6D3", by: "claude" },
  { id: "riso", name: "Riso Violet", ink: "#2A1A5E", paper: "#FF9ECF", by: "claude" },
  { id: "chrome", name: "Chrome / Ice", ink: "#16181D", paper: "#B9D7EA", by: "claude" },
];

export const THEME_KEY = "portfolio-theme";

type Listener = (t: Theme) => void;
const listeners = new Set<Listener>();
let current: Theme = themes[0];

export const getTheme = () => current;

export const onTheme = (fn: Listener) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

export const applyTheme = (theme: Theme) => {
  current = theme;
  const root = document.documentElement;
  root.style.setProperty("--ink", theme.ink);
  root.style.setProperty("--paper", theme.paper);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme.ink);
  try {
    localStorage.setItem(THEME_KEY, theme.id);
  } catch {}
  listeners.forEach((fn) => fn(theme));
};

/** Inline <head> script: apply the saved theme before first paint. */
export const themeBootScript = `(function(){try{var t=${JSON.stringify(
  Object.fromEntries(themes.map((t) => [t.id, [t.ink, t.paper]])),
)}[localStorage.getItem("${THEME_KEY}")];if(t){var r=document.documentElement.style;r.setProperty("--ink",t[0]);r.setProperty("--paper",t[1]);}}catch(e){}})();`;
