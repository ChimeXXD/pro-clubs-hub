import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildTokensCss, contrastRatio, cssName } from "../../scripts/build-tokens.mjs";

// tokens.css is the code side of the Figma Design System (D-14). The snapshot in docs/design is read from
// Figma; these tests prove the CSS carries every value from it and that its text colours stay readable.
const ROOT = join(import.meta.dirname, "..", "..");
const figma = JSON.parse(readFileSync(join(ROOT, "docs", "design", "figma-variables.json"), "utf8"));
const css = readFileSync(join(ROOT, "src", "styles", "tokens.css"), "utf8");
const theme: Record<string, { dark: string; light: string }> = figma.theme;
/** A theme colour in one mode; throws on a name the snapshot doesn't have, so a typo can't pass. */
const colour = (name: string, mode: "dark" | "light"): string => {
  const entry = theme[name];
  if (!entry) throw new Error(`no theme colour ${name}`);
  return entry[mode];
};

/** The declarations inside the first block whose selector line contains `selector`. */
function block(selector: string): string {
  const start = css.indexOf(selector);
  if (start < 0) return "";
  return css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
}

describe("src/styles/tokens.css mirrors the Figma snapshot", () => {
  it("is exactly what scripts/build-tokens.mjs makes from docs/design/figma-variables.json", () => {
    expect(css).toBe(buildTokensCss(figma));
  });

  it("has every theme colour, light value first and dark second", () => {
    for (const [name, { dark, light }] of Object.entries(theme)) {
      expect(css).toContain(`--${cssName(name)}: light-dark(${light}, ${dark});`);
    }
  });

  it("puts phone sizes in the theme, then tablet and desktop sizes in their media blocks", () => {
    const sizes = { ...figma.tokens, ...figma.typography } as Record<string, Record<string, number>>;
    const phone = block("@theme static {");
    const tablet = block("@media (min-width: 744px)");
    const desktop = block("@media (min-width: 1280px)");
    for (const [name, v] of Object.entries(sizes)) {
      if (name === "layout/breakpoint") continue;
      expect(phone).toContain(`--${cssName(name)}: ${v.phone}px;`);
      if (v.tablet !== v.phone) expect(tablet).toContain(`--${cssName(name)}: ${v.tablet}px;`);
      if (v.desktop !== v.tablet) expect(desktop).toContain(`--${cssName(name)}: ${v.desktop}px;`);
    }
  });

  it("keeps Figma's named spacing out of Tailwind's spacing namespace, so max-w-md stays a width", () => {
    expect(css).not.toMatch(/--spacing-[a-z0-9]+:/);
    expect(css).toContain(`--space-xs: ${figma.tokens["spacing/xs"].phone}px;`);
  });

  it("keeps the phone and tablet touch target on any touch screen, however wide", () => {
    expect(block("@media (pointer: coarse)")).toContain(`--layout-touch-target: ${figma.tokens["layout/touch-target"].phone}px;`);
  });

  it("follows the device's light or dark setting, and a switch overrides it (D-37)", () => {
    expect(block(":root {")).toContain("color-scheme: light dark;");
    expect(block(':root[data-theme="light"]')).toContain("color-scheme: light;");
    expect(block(':root[data-theme="dark"]')).toContain("color-scheme: dark;");
  });

  it("turns Tailwind's own colour palette off, so only token colours exist", () => {
    expect(css).toContain("--color-*: initial;");
  });

  it("has a utility class for every Figma text style", () => {
    for (const style of figma.textStyles) expect(css).toContain(`@utility type-${style.name} {`);
  });
});

describe("text on its background passes WCAG AA in both modes (UI-BRIEF §2)", () => {
  const pairs: [string, string][] = [];
  for (const fg of ["text/primary", "text/secondary", "text/muted", "accent/text"]) {
    for (const bg of ["bg/page", "bg/surface", "bg/raised"]) pairs.push([fg, bg]);
  }
  pairs.push(["accent/on-fill", "accent/fill"], ["accent/on-fill", "accent/fill-hover"]);
  pairs.push(["text/inverse", "bg/inverse"], ["system/on-tooltip", "system/tooltip"]);
  for (const s of ["success", "warning", "danger", "info"]) {
    pairs.push([`status/${s}`, `status/${s}-bg`], [`status/${s}`, "bg/page"], [`status/${s}`, "bg/surface"]);
  }

  for (const mode of ["dark", "light"] as const) {
    it.each(pairs)(`${mode}: %s on %s is at least 4.5:1`, (fg, bg) => {
      expect(contrastRatio(colour(fg, mode), colour(bg, mode))).toBeGreaterThanOrEqual(4.5);
    });
    it(`${mode}: the focus ring is at least 3:1 on the page and on surfaces`, () => {
      for (const bg of ["bg/page", "bg/surface"]) {
        expect(contrastRatio(colour("focus/ring", mode), colour(bg, mode))).toBeGreaterThanOrEqual(3);
      }
    });
  }
});
