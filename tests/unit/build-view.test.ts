import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BuildPageView } from "@/components/builds/BuildPageView";
import { buildPageView } from "@/lib/build-page";
import { loadContent, type LoadedBuild } from "@/lib/content/load";

// The build page as the static export renders it (Figma 298:3630 / 306:794 / 306:1286, D-63), from the real content
// with drafts on (the preview), plus a recorded-looking Finisher build for the parts the draft leaves empty.
const content = loadContent(join(process.cwd(), "content"), { includeDrafts: true });
const sources = content.archetypeFile.sources;
const draft = content.builds.find((b) => b.id === "spark-2008-winger") as LoadedBuild;
const finisher = content.archetypeFile.archetypes.find((a) => a.id === "finisher");
if (!finisher) throw new Error("finisher");
const sample: LoadedBuild = {
  ...draft,
  id: "meta-finisher",
  slug: "meta-finisher",
  status: "published",
  title: "Meta Finisher",
  badge: "meta",
  archetype: finisher,
  positions: ["ST", "CF"],
  level: 55,
  body: { heightCm: 185, weightKg: 80, accelerate: "controlled" },
  attributes: [
    { name: "Finishing", value: 94 },
    { name: "Ball Control", value: 92 },
    { name: "Composure", value: 92 },
    { name: "Reactions", value: 92 },
  ],
  playStyles: { signature: ["Low Driven Shot", "First Touch"], plus: [], regular: ["Finesse Shot", "Slide Tackle"] },
  specialization: "Finisher+",
  skillMoves: 4,
  weakFoot: 4,
};
const render = (build: LoadedBuild, season?: number) =>
  renderToStaticMarkup(createElement(BuildPageView, { view: buildPageView(build, sources, season) }));
const page = render(draft);
const meta = render(sample);

describe("BuildPageView", () => {
  it("has the breadcrumb back to Builds and the archetype", () => {
    expect(page).toMatch(/<nav aria-label="Breadcrumb"/);
    expect(page).toMatch(/<a[^>]*href="\/builds#spark"[^>]*>Builds<\/a>/);
    expect(page).toMatch(/<a[^>]*href="\/builds\/spark"[^>]*>Spark<\/a>/);
    expect(page).toMatch(/aria-current="page"[^>]*>PLACEHOLDER</);
  });

  it("titles the page with the build, marked Draft, its version tag in words and its credit (rules 4, 5)", () => {
    expect(page).toMatch(/<h1[^>]*>PLACEHOLDER<\/h1>/);
    expect(page).toContain(">Draft<");
    expect(page).toContain("FC 27 · Season 2 · Not yet checked in game");
    expect(page).toContain("Made by Chime in game");
    expect(meta).toContain(">Meta pick<");
    expect(meta).toContain("Made by Chime in game · Played for one match before it&#x27;s called meta");
  });

  it("has the Share build button", () => {
    expect(page).toMatch(/<button[^>]*>.*Share build.*<\/button>/s);
  });

  it("shows the face, archetype, positions, level, height and weight, and the six key stats", () => {
    expect(page).toContain("/art/probuilds-face.svg");
    expect(page).toContain("No picture yet, so it shows the ProBuilds face.");
    expect(page).toContain("/art/archetypes/spark.svg");
    expect(page).toMatch(/>Spark<\/p>/);
    expect(page).toContain(">Forward<");
    expect(page).toContain(">RW<");
    expect(page).toContain("Level PLACEHOLDER · PLACEHOLDER cm · PLACEHOLDER kg");
    for (const code of ["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"]) expect(page).toContain(`>${code}</dt>`);
    expect(page).toContain("Raw values, as with Attribute totals off: masteries, height and weight and Amps aren&#x27;t added.");
  });

  it("lists body and skills as a definition list, height with weight (D-92)", () => {
    expect(meta).toMatch(/<dt[^>]*>Height<\/dt><dd[^>]*>6&#x27;1&quot; · 185 cm<\/dd>/);
    expect(meta).toMatch(/<dt[^>]*>Weight<\/dt><dd[^>]*>176 lb · 80 kg<\/dd>/);
    expect(meta).toMatch(/<dt[^>]*>Skill moves<\/dt><dd[^>]*><span aria-hidden="true">★★★★<\/span><span class="sr-only">4 stars<\/span><\/dd>/);
    expect(page).toMatch(/<dt[^>]*>Built at level<\/dt><dd[^>]*>PLACEHOLDER<\/dd>/);
  });

  it("names the specialization with its PlayStyle+, targets and the level it is reached at", () => {
    expect(meta).toContain(">Specialization<");
    expect(meta).toContain(">Finisher+<");
    expect(meta).toContain(">Chip Shot+<");
    expect(meta).toContain("/art/playstyles-plus/chip-shot.webp");
    expect(meta).toMatch(/Ball Control<\/span><span[^>]*><span[^>]*>92<\/span><span[^>]*> \/ 90<\/span>/);
    expect(meta).toContain(">Reached at level 55<");
    expect(page).toContain(">PLACEHOLDER<");
  });

  it("lists PlayStyles+ with Signature marked, and PlayStyles, with their badges", () => {
    expect(meta).toMatch(/<h2[^>]*>PlayStyles\+<\/h2>/);
    expect(meta).toMatch(/Low Driven Shot<\/span><span[^>]*>Signature<\/span>/);
    expect(meta).toContain("/art/playstyles-plus/low-driven-shot.webp");
    expect(meta).toMatch(/<h2[^>]*>PlayStyles<\/h2>/);
    expect(meta).toContain("/art/playstyles/finesse-shot.webp");
    expect(meta).toContain("/art/playstyles/slide-tackle.webp");
  });

  it("lists attributes by group with readable names and values, Mastery marked and explained", () => {
    expect(meta).toMatch(/<h2[^>]*>Attributes<\/h2>/);
    expect(meta).toContain("Mastery +2: levelling Finisher adds +1 to Finishing and Composure");
    expect(meta).toMatch(/<h3[^>]*>Shooting<\/h3>/);
    expect(meta).toMatch(/<li[^>]*><div[^>]*><span[^>]*>Finishing<\/span><span[^>]*>Mastery \+2<\/span><\/div><span[^>]*>94<\/span>/);
    expect(page).toMatch(/<li[^>]*><div[^>]*><span[^>]*>Acceleration<\/span><\/div><span[^>]*>PLACEHOLDER<\/span>/);
    expect(page).not.toContain("Mastery +2");
  });

  it("warns on an older season and on a build read from a video (D-05, D-66)", () => {
    const old = render({ ...sample, versionTag: { ...sample.versionTag, verifiedOn: "2026-11-19" } }, 3);
    expect(old).toContain("Made for Season 2. Values may have changed since.");
    expect(old).toContain("FC 27 · Season 2 · verified 19 Nov 2026");
    const video = render({
      ...sample,
      badge: null,
      credits: [{ role: "reference", name: "Leski", url: "https://www.youtube.com/watch?v=x", creatorId: null, creator: null }],
    });
    expect(video).toMatch(/<a[^>]*href="https:\/\/www.youtube.com\/watch\?v=x"[^>]*>Watch the video<\/a>/);
    expect(video).toContain("Not yet checked in game: we read this build from the creator&#x27;s video.");
  });
});
