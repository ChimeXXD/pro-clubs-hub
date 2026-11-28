import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadContent } from "@/lib/content/load";
import {
  apAtLevel,
  apCounter,
  archetypesIn,
  attributeError,
  bodyChanges,
  bodyRange,
  groupAverage,
  heightImperial,
  levelLine,
  nextAttribute,
  plusOptions,
  pickPlus,
  POSITIONS_BY_GROUP,
  SAMPLE_DRAFT,
  stepLine,
  weightImperial,
} from "@/lib/submit/editor";

// Submit a build, the editor's rules (D-85 to D-90) and Figma's sample (400:3219, 399:3121, 406:3024; D-107).
const { archetypeFile } = loadContent(join(process.cwd(), "content"), { includeDrafts: true });
const finisher = archetypeFile.archetypes.find((a) => a.id === "finisher")!;

describe("AP by level (RESEARCH §10.1)", () => {
  it("gives each level's total, as the table adds up", () => {
    expect(apAtLevel(1)).toBe(100);
    expect(apAtLevel(4)).toBe(127);
    expect(apAtLevel(40)).toBe(962);
    expect(apAtLevel(44)).toBe(1062);
    expect(apAtLevel(45)).toBe(1106);
    expect(apAtLevel(55)).toBe(1419);
  });

  it("words the level card as Figma 400:3372 does", () => {
    expect(levelLine(44)).toEqual({ spend: "1,062 AP to spend", next: "Level 45 adds 44 more" });
    expect(levelLine(55).next).toBeNull();
  });
});

describe("height and weight (RESEARCH §10.3, D-90)", () => {
  it("uses the archetype's range read in game", () => {
    expect(bodyRange("finisher")).toEqual({ height: { min: 165, max: 190 }, weight: { min: 70, max: 90 } });
    expect(bodyRange("boss")).toEqual({ height: { min: 180, max: 196 }, weight: { min: 80, max: 100 } });
  });

  it("shows feet and pounds beside the metric value", () => {
    expect(heightImperial(185)).toBe("6'1\"");
    expect(weightImperial(80)).toBe("176 lb");
  });

  it("shows Figma's sample body changes only for the sample's body; no other body has figures yet", () => {
    expect(bodyChanges(SAMPLE_DRAFT)).toEqual({
      changes: [
        { attribute: "Acceleration", delta: -2 },
        { attribute: "Agility", delta: -2 },
        { attribute: "Strength", delta: 2 },
      ],
      accelerate: "Controlled",
      rule: "Explosive needs 182 cm or less. Updates as you set attributes.",
    });
    expect(bodyChanges({ ...SAMPLE_DRAFT, heightCm: 186 })).toBeNull();
    expect(bodyChanges({ ...SAMPLE_DRAFT, archetype: "target" })).toBeNull();
  });
});

describe("archetypes and positions", () => {
  it("lists the group's archetypes in the file's order, with their two signature PlayStyles", () => {
    expect(archetypesIn(archetypeFile, "attacker").map((a) => a.id)).toEqual(["spark", "magician", "finisher", "target"]);
  });

  it("lists Figma's forward positions in its order", () => {
    expect(POSITIONS_BY_GROUP.attacker).toEqual(["ST", "CF", "LW", "RW", "CAM", "LM", "RM"]);
  });
});

describe("attributes (D-85)", () => {
  it("averages each group as Figma's sample shows (87, 83, 68, 85, 46, 74)", () => {
    const av = (code: string) => groupAverage(SAMPLE_DRAFT.attributes, code);
    expect(["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"].map(av)).toEqual([87, 83, 68, 85, 46, 74]);
  });

  it("stops values over 99 (428:5513)", () => {
    expect(attributeError(100)).toBe("Attributes go up to 99");
    expect(attributeError(99)).toBeNull();
    expect(attributeError(0)).toBeNull();
  });

  it("names the next attribute, across groups", () => {
    expect(nextAttribute("Finishing")).toBe("Shot Power");
    expect(nextAttribute("Sprint Speed")).toBe("Att. Position");
    expect(nextAttribute("Aggression")).toBeNull();
  });

  it("counts AP with the sample's spend until prices exist (D-85 (3), O-14)", () => {
    expect(apCounter(SAMPLE_DRAFT)).toEqual({ left: "51", spent: "1,011 spent", total: "1,062 at level 44", percent: (1011 / 1062) * 100 });
    // Never below zero: at level 30 the sample's spend is more than the level gives.
    expect(apCounter({ ...SAMPLE_DRAFT, level: 30 }).left).toBe("0");
  });

  it("titles each step as Figma does", () => {
    expect(stepLine(SAMPLE_DRAFT, finisher, "Attributes")).toBe("Finisher · Level 44 · Attributes");
  });
});

describe("PlayStyle+ (D-87, D-88)", () => {
  it("offers the archetype's two signatures and its specializations' PlayStyle+ only", () => {
    expect(plusOptions(finisher).map((o) => [o.name, o.source])).toEqual([
      ["Low Driven Shot", "Signature"],
      ["First Touch", "Signature"],
      ["Chip Shot", "Finisher+"],
      ["Gamechanger", "Hunter"],
      ["Relentless", "Presser"],
    ]);
  });

  it("puts a specialization in a slot in place of a signature, one specialization at a time", () => {
    expect(SAMPLE_DRAFT.plus).toEqual(["Low Driven Shot", "Chip Shot"]);
    const swapped = pickPlus(SAMPLE_DRAFT.plus, finisher, 1, "Gamechanger");
    expect(swapped).toEqual(["Low Driven Shot", "Gamechanger"]);
    // A second specialization replaces the first: only one is active.
    expect(pickPlus(["Chip Shot", "First Touch"], finisher, 1, "Relentless")).toEqual(["Low Driven Shot", "Relentless"]);
    expect(pickPlus(SAMPLE_DRAFT.plus, finisher, 1, "First Touch")).toEqual(["Low Driven Shot", "First Touch"]);
  });
});
