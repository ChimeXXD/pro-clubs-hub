// Light and dark (D-112, D-114 (1)). The site is dark on every device; light only when the user picks it with the top
// bar's switch. The choice is kept in this browser under THEME_KEY and set as data-theme="light" on <html>, which the
// tokens read (tokens.css). THEME_SCRIPT runs inline in <head>, before anything paints, so a light page never flashes
// dark first.
export type Theme = "dark" | "light";

export const THEME_KEY = "theme";

/** Plain ES5, run as is in <head>. Storage can be missing or refuse (private mode): the page then stays dark. */
export const THEME_SCRIPT = `try{if(localStorage.getItem(${JSON.stringify(THEME_KEY)})==="light")document.documentElement.dataset.theme="light"}catch(e){}`;

/** The button's name says the mode a tap switches to (497:976's description; the wording is marked draft there). */
export function themeLabel(current: Theme): string {
  return current === "dark" ? "Switch to light mode" : "Switch to dark mode";
}
