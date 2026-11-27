// The design tokens' colours for images drawn at build time (link previews), which can't read CSS variables.
// Read from src/styles/tokens.css itself, so the images can only use token colours (CLAUDE.md: no hard-coded
// colours). Dark mode: Figma draws the link preview dark. Build time only (node:fs).
import { readFileSync } from "node:fs";
import { join } from "node:path";

let css: string | null = null;

/** "bg-page" → the dark value of --color-bg-page, as a hex colour. Throws for a name that isn't a colour token. */
export function tokenColour(name: string): string {
  css ??= readFileSync(join(process.cwd(), "src", "styles", "tokens.css"), "utf8");
  const match = new RegExp(`--color-${name}:\\s*light-dark\\((#[0-9a-f]{6}),\\s*(#[0-9a-f]{6})\\)`, "i").exec(css);
  if (!match?.[2]) throw new Error(`--color-${name} is not a colour token with a dark value`);
  return match[2].toLowerCase();
}
