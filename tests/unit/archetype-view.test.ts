import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ArchetypeBuildsView } from "@/components/builds/ArchetypeBuildsView";
import { archetypeBuilds, buildCardView } from "@/lib/archetype-page";
import { archetypeViews } from "@/lib/builds";
import { loadContent } from "@/lib/content/load";

// The archetype page as the static export renders it (Figma 288:1031 / 290:796 / 290:1084, D-62), from the real
// content with drafts on (the preview). Spark has the one draft build; Finisher has none yet.
const content = loadContent(join(process.cwd(), "content"), { includeDrafts: true });
const views = archetypeViews(content.archetypeFile);
const render = (id: string) => {
  const archetype = views.find((v) => v.id === id);
  if (!archetype) throw new Error(id);
  const cards = archetypeBuilds(content.builds, id).map((b) => buildCardView(b));
  return renderToStaticMarkup(createElement(ArchetypeBuildsView, { archetype, cards }));
};
const spark = render("spark");
const finisher = render("finisher");

describe("ArchetypeBuildsView", () => {
  it("has the breadcrumb back to Builds, opening on this archetype", () => {
    expect(spark).toMatch(/<nav aria-label="Breadcrumb"/);
    expect(spark).toMatch(/<a[^>]*href="\/builds#spark"[^>]*>Builds<\/a>/);
    expect(spark).toMatch(/aria-current="page"[^>]*>Spark</);
  });

  it("titles the page with the archetype, its group and build count", () => {
    expect(spark).toMatch(/<h1[^>]*>Spark<\/h1>/);
    expect(spark).toContain("Forward · 1 build");
    expect(finisher).toMatch(/<h1[^>]*>Finisher<\/h1>/);
    expect(finisher).toContain("Forward · 0 builds");
  });

  it("keeps the emblem slot empty, named by the archetype (D-39)", () => {
    expect(spark).toMatch(/data-testid="archetype-emblem"[^>]*role="img"[^>]*aria-label="Spark"|role="img"[^>]*aria-label="Spark"[^>]*data-testid="archetype-emblem"/);
    expect(spark).not.toMatch(/archetypes\/[a-z-]+\.(svg|png|webp)/);
  });

  it("shows the draft build as a card linking to its page, values as written", () => {
    expect(spark).toMatch(/<a[^>]*href="\/builds\/spark\/spark-2008-winger"[^>]*data-testid="build-card-spark-2008-winger"|data-testid="build-card-spark-2008-winger"[^>]*href="\/builds\/spark\/spark-2008-winger"/);
    expect(spark).toMatch(/<h2[^>]*>PLACEHOLDER<\/h2>/);
    expect(spark).toContain(">Draft<");
    expect(spark).toContain(">RW<");
    expect(spark).toContain(">LW<");
    expect(spark).toContain("Level PLACEHOLDER · PLACEHOLDER cm · PLACEHOLDER kg");
    expect(spark).toContain("/art/probuilds-face.svg");
  });

  it("has the six key stats and the PlayStyles+ with their badges", () => {
    for (const code of ["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"]) expect(spark).toContain(`<dt class="type-caption text-text-secondary">${code}</dt>`);
    expect(spark).toContain("PlayStyles+");
    expect(spark).toContain("/art/playstyles-plus/trickster.webp");
    expect(spark).toContain("/art/playstyles-plus/rapid.webp");
    expect(spark).toMatch(/>PLACEHOLDER<\/span><\/li>/);
  });

  it("carries the version tag and credit line on the card (D-05, D-08)", () => {
    expect(spark).toContain("FC 27 · Season 2 · not yet checked in game");
    expect(spark).toContain("Made by Chime in game");
  });

  it("fills the last row's gap with Submit a build on tablet and desktop, never on phone", () => {
    // One build: the tile shows beside it on tablet and across the two empty cells on desktop.
    expect(spark).toMatch(/<li class="row-span-4 hidden tablet:flex desktop:flex desktop:col-span-2"><a [^>]*data-testid="submit-tile"/);
    expect(spark).toMatch(/<a [^>]*href="\/submit"[^>]*data-testid="submit-tile"|<a [^>]*data-testid="submit-tile"[^>]*href="\/submit"/);
    expect(spark).toContain("Submit a build");
    expect(finisher).not.toContain("submit-tile");
  });
});
