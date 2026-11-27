import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadContent } from "@/lib/content/load";
import { asSharedBuild } from "@/lib/shared-build";
import { submitShareCards, toSubmission } from "@/lib/submit/document";
import { SAMPLE_DRAFT } from "@/lib/submit/editor";

// What Submit a build sends (D-86, D-99 (1), (2), (3)) and the player's card (D-89 (3), D-90 (3); Figma 401:3616,
// 413:3113). The document is a build as docs/FORMAT.md describes it, checked by the content validator (rule 6).
const { archetypeFile } = loadContent(join(process.cwd(), "content"), { includeDrafts: true });

describe("toSubmission", () => {
  it("makes a draft build document from the editor that passes the content validator", () => {
    const result = toSubmission({ ...SAMPLE_DRAFT, title: "My Finisher", credit: "Kola" }, archetypeFile, "2026-11-27");
    expect(result.problems).toEqual([]);
    const doc = result.document;
    expect(doc).toMatchObject({
      id: "my-finisher",
      status: "draft",
      title: "My Finisher",
      archetype: "finisher",
      positions: ["ST"],
      level: 44,
      body: { heightCm: 185, weightKg: 80, accelerate: null },
      // The specialization chosen and the signature it replaces (D-87, D-99 (3)): First Touch is the one left out.
      playStyles: { signature: ["Low Driven Shot"], plus: ["Chip Shot"], regular: ["Finesse Shot", "Power Shot", "Technical", "Rapid", "Quick Step"] },
      specialization: "Finisher+",
      skillMoves: 4,
      weakFoot: 4,
      versionTag: { game: "fc27", season: 2, verifiedOn: null, verifiedBy: null, platform: null },
      credits: [{ role: "made-by", name: "Kola", url: null, creatorId: null }],
    });
    expect(doc).not.toHaveProperty("sample");
    // The /b/ page reads it back as a shared build.
    expect(asSharedBuild(doc, archetypeFile)?.title).toBe("My Finisher");
  });

  it("names an unnamed build after its archetype and credits a player who leaves the name empty", () => {
    const { document } = toSubmission(SAMPLE_DRAFT, archetypeFile, "2026-11-27");
    expect(document.title).toBe("Your Finisher");
    expect(document.credits).toEqual([{ role: "made-by", name: "a player", url: null, creatorId: null }]);
  });

  it("refuses an attribute over 99 and a build with no position", () => {
    const over = SAMPLE_DRAFT.attributes.map((a) => (a.name === "Finishing" ? { ...a, value: 100 } : a));
    expect(toSubmission({ ...SAMPLE_DRAFT, attributes: over }, archetypeFile, "2026-11-27").problems.length).toBeGreaterThan(0);
    expect(toSubmission({ ...SAMPLE_DRAFT, positions: [] }, archetypeFile, "2026-11-27").problems.length).toBeGreaterThan(0);
  });

  it("leaves a PlayStyle picked as PlayStyle+ out of the regular ones, in the document and on the card", () => {
    // Chip Shot was ticked as a regular PlayStyle before it went into a PlayStyle+ slot.
    const draft = { ...SAMPLE_DRAFT, regular: [...SAMPLE_DRAFT.regular, "Chip Shot"] };
    const { document } = toSubmission(draft, archetypeFile, "2026-11-27");
    expect((document.playStyles as { regular: string[] }).regular).not.toContain("Chip Shot");
    const cards = submitShareCards(draft, archetypeFile, { link: null, picture: null });
    expect(cards.overview.regular.map((p) => p.name)).not.toContain("Chip Shot");
  });
});

describe("submitShareCards (the player's card)", () => {
  const cards = submitShareCards(SAMPLE_DRAFT, archetypeFile, { link: null, picture: null });

  it("fills the overview card from the editor (401:3616)", () => {
    expect(cards.overview).toMatchObject({
      badge: null,
      title: "Your Finisher",
      archetypeLine: "Finisher · Forward",
      positions: ["ST"],
      level: "44",
      height: "185 cm",
      weight: "80 kg",
      versionTag: "FC 27 · Season 2 · Not yet checked in game",
      link: "probuilds.club/b/your-finisher",
      footer: "Made by you. Not endorsed by or affiliated with EA or its licensors. Not endorsed by the people named.",
      picture: null,
    });
    expect(cards.overview.plus.map((p) => p.name)).toEqual(["Low Driven Shot", "Chip Shot"]);
    expect(cards.overview.regular.map((p) => p.name)).toEqual(["Finesse Shot", "Power Shot", "Technical", "Rapid", "Quick Step"]);
  });

  it("marks height and weight on the attributes card (413:3113, D-90 (3))", () => {
    expect(cards.attributes.subtitle).toBe("Your Finisher · Level 44 · Controlled");
    expect(cards.attributes.bodyNote).toBe("is height and weight (185 cm, 80 kg): added in a match. Not included in the values.");
    expect(cards.attributes.masteryNote).toBeNull();
    const pace = cards.attributes.columns[0]![0]!;
    expect(pace).toMatchObject({ name: "Pace", value: 87 });
    expect(pace.attributes[0]).toMatchObject({ name: "Acceleration", value: 88, body: -2 });
    expect(cards.attributes.columns.flat().map((g) => g.name)).toEqual(["Pace", "Shooting", "Passing", "Dribbling", "Defending", "Physical"]);
  });

  it("shows the made link, the player's name and picture once there are some", () => {
    const made = submitShareCards({ ...SAMPLE_DRAFT, credit: "Kola" }, archetypeFile, { link: "k7x2m9", picture: "blob:pic" });
    expect(made.overview.link).toBe("probuilds.club/b/k7x2m9");
    expect(made.overview.footer.startsWith("Made by Kola. ")).toBe(true);
    expect(made.overview.picture).toBe("blob:pic");
  });
});
