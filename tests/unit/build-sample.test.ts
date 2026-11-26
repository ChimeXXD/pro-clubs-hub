import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BuildPageView } from "@/components/builds/BuildPageView";
import { nearestLevel, stepLevel } from "@/lib/build-level";
import { buildPageView } from "@/lib/build-page";
import { loadContent, type LoadedBuild } from "@/lib/content/load";

// Figma's sample build (D-107), drawn in the Build frames (298:3630 / 306:794 / 306:1286), the level-32 state
// (371:1697), the not-yet-checked and older-season states (371:2208, 371:2719) and the share cards (316:888, 316:973).
const content = loadContent(join(process.cwd(), "content"), { includeDrafts: true });
const sources = content.archetypeFile.sources;
const sample = content.builds.find((b) => b.id === "meta-finisher") as LoadedBuild;
const view = buildPageView(sample, sources);
const render = (build: LoadedBuild, season?: number) =>
  renderToStaticMarkup(createElement(BuildPageView, { view: buildPageView(build, sources, season) }));
const page = render(sample);

describe("the sample build's page (D-107)", () => {
  it("is a draft that says it is a sample, in place of the Draft tag", () => {
    expect(sample.status).toBe("draft");
    expect(view.sampleLabel).toBe("Sample build · values and prices not checked in game");
    expect(page).toContain("Sample build · values and prices not checked in game");
    expect(page).not.toContain(">Draft<");
  });

  it("credits the sample's maker without claiming it was made in game", () => {
    expect(view.credit).toBe("Made by — (sample) · Played for one match before it's called meta");
    expect(view.versionTag).toBe("FC 27 · Season 2 · Not yet checked in game");
  });

  it("shows the key stats and group gauges as drawn", () => {
    expect(view.keyStats).toEqual(["PAC 88", "SHO 80", "PAS 58", "DRI 84", "DEF 38", "PHY 66"].map((s) => ({ code: s.slice(0, 3), value: s.slice(4) })));
    expect(view.attributeGroups.map((g) => [g.name, g.value])).toEqual([
      ["Pace", 88], ["Shooting", 80], ["Passing", 58], ["Dribbling", 84], ["Defending", 38], ["Physical", 66],
    ]);
    expect(page).not.toMatch(/>–</);
  });

  it("names AcceleRATE as the game does", () => {
    expect(view.facts.find((f) => f.term === "AcceleRATE")?.value).toBe("Controlled Explosive");
  });

  it("has the level switch at the build's level, with the drawn level-32 state", () => {
    expect(view.levels?.initial).toBe(55);
    expect(view.levels?.max).toBe(55);
    expect(view.levels?.states).toEqual([
      { level: 32, ap: "724", spent: "724", left: "0", callout: "At level 32 you're 695 AP short of this build. Its specialization needs level 50." },
      { level: 55, ap: "1,419", spent: "1,410", left: "9", callout: null },
    ]);
    expect(page).toContain("Your level");
    expect(page).toMatch(/AP at level 55: <b[^>]*>1,419<\/b> · spent <b[^>]*>1,410<\/b> · left <b[^>]*>9<\/b>/);
  });

  it("says all of it fits at its level, with the AP to spare", () => {
    expect(view.allOfIt).toEqual({ heading: "All of it at level 55", text: "Every step of the build fits, with 9 AP to spare." });
  });

  it("explains the specialization's targets as the sample counts them, and where it is reached from", () => {
    const spec = view.specialization;
    expect(spec?.note).toBe(
      "Targets Ball Control, Composure, Reactions: one at 92, two at 90. Which one is 92 isn't recorded yet, so this sample counts all three at 92.",
    );
    expect(spec?.targets).toEqual([
      { attribute: "Ball Control", value: 92, target: 92 },
      { attribute: "Composure", value: 92, target: 92 },
      { attribute: "Reactions", value: 92, target: 92 },
    ]);
    expect(spec?.reachedAt).toBe(55);
    expect(spec?.reachedFrom).toBe("Reached from level 50 with the sample prices. Counts raw values only.");
  });

  it("ends with the draft-art footnote", () => {
    expect(view.footnote).toBe(
      "Draft only: PlayStyle icons are EA's art, archetype emblems are Pro Clubs HQ's tracings and the stances are Chime's screenshots. None of them ships as is.",
    );
  });

  it("words the two share cards as drawn", () => {
    const { overview, attributes } = view.share;
    expect(overview).toMatchObject({
      archetypeLine: "Finisher · Forward",
      level: "55",
      height: "185 cm",
      weight: "80 kg",
      link: "probuilds.club/builds/finisher/meta-finisher",
      footer: "Made by — (sample). Not endorsed by or affiliated with EA or its licensors. Not endorsed by the people named.",
    });
    expect(overview.plus.map((p) => p.name)).toEqual(["Low Driven Shot", "First Touch"]);
    expect(overview.regular.map((p) => p.name)).toEqual(["Finesse Shot", "Power Shot", "Rapid", "Quick Step", "Precision Header", "Acrobatic"]);
    expect(attributes.subtitle).toBe("Meta Finisher · Level 55 · Finisher");
    expect(attributes.masteryNote).toBe("+2 is Mastery: levelling Finisher to 55 adds it. Not included in the values.");
    expect(attributes.columns.map((col) => col.map((g) => `${g.name} ${g.value}`))).toEqual([
      ["Pace 88", "Shooting 80", "Passing 58"],
      ["Dribbling 84", "Defending 38", "Physical 66"],
    ]);
  });

  it("reads from a creator's video in place of the maker's credit when not yet checked (Figma 371:2208)", () => {
    const read: LoadedBuild = {
      ...sample,
      badge: null,
      credits: [
        ...sample.credits,
        { role: "reference", name: "a creator", url: "https://www.youtube.com/watch?v=x", creatorId: null, creator: null },
      ],
    };
    const video = render(read);
    expect(buildPageView(read, sources).credit).toBeNull();
    expect(video).toMatch(/Read from a creator&#x27;s video · <a[^>]*href="https:\/\/www.youtube.com\/watch\?v=x"[^>]*>Watch the video<\/a>/);
    expect(video).toContain("Not yet checked in game: we read this build from the creator&#x27;s video.");
  });

  it("warns above the build when it was made for an older season (Figma 371:2719)", () => {
    const old = render({ ...sample, versionTag: { ...sample.versionTag, verifiedOn: "2026-11-19" } }, 3);
    expect(old.indexOf("Made for Season 2. Values may have changed since.")).toBeLessThan(old.indexOf("Meta pick"));
    expect(old).toContain("FC 27 · Season 2 · verified 19 Nov 2026");
  });
});

describe("moving the level switch between the levels the sample draws", () => {
  it("snaps to the nearest drawn level", () => {
    expect(nearestLevel([32, 55], 40)).toBe(32);
    expect(nearestLevel([32, 55], 44)).toBe(55);
    expect(nearestLevel([32, 55], 1)).toBe(32);
  });

  it("steps to the next drawn level down or up, and stops at the ends", () => {
    expect(stepLevel([32, 55], 55, -1)).toBe(32);
    expect(stepLevel([32, 55], 32, -1)).toBe(32);
    expect(stepLevel([32, 55], 32, 1)).toBe(55);
    expect(stepLevel([32, 55], 55, 1)).toBe(55);
  });
});
