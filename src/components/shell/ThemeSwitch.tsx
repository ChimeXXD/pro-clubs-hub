"use client";

import { THEME_KEY, type Theme, themeLabel } from "@/lib/theme";
import { Icon } from "./Icon";

// Figma "Theme switch" (497:976), Option=A · Top bar button (D-114 (1)): a 44 px ghost icon button, 8 px corners, a
// 20 px icon in text/primary: the sun while dark, the moon while light, the mode a tap switches to. One tap flips the
// site and remembers the choice in this browser (lib/theme.ts). Both faces are in the HTML and CSS picks one from
// <html>'s data-theme (the `light:` variant, as the logo does), so a light page shows the moon from the first paint,
// before any script runs. The hidden face is display: none, so it is out of the accessible name too.
function flip() {
  const root = document.documentElement;
  const next: Theme = root.dataset.theme === "light" ? "dark" : "light";
  if (next === "light") root.dataset.theme = "light";
  else delete root.dataset.theme;
  try {
    window.localStorage.setItem(THEME_KEY, next);
  } catch {
    // Not remembered; this page still switches.
  }
}

export function ThemeSwitch() {
  return (
    <button
      type="button"
      onClick={flip}
      className="flex size-11 shrink-0 items-center justify-center rounded-sm text-text-primary"
    >
      <span className="contents light:hidden">
        <Icon name="sun" size={20} />
        <span className="sr-only">{themeLabel("dark")}</span>
      </span>
      <span className="hidden light:contents">
        <Icon name="moon" size={20} />
        <span className="sr-only">{themeLabel("light")}</span>
      </span>
    </button>
  );
}
