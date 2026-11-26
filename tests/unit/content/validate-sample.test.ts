import { describe, expect, it } from "vitest";
import { validateBuild, type Context } from "@/lib/content/validate";
import buildGood from "../fixtures/build-good.json";

// The seven AcceleRATE types the game shows, and Figma's sample figures on a draft build (D-107, FORMAT §Build).
const ctx: Context = {
  archetypeIds: new Set(["spark", "finisher"]),
  creatorIds: new Set(["test-creator"]),
  buildIds: new Set(["test-spark-build"]),
  faceIds: new Set(),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function changed<T>(fixture: T, change: (copy: any) => void): T {
  const copy = structuredClone(fixture);
  change(copy);
  return copy;
}
const problems = (data: unknown) => validateBuild("builds/x.json", data, ctx).map((p) => [p.path, p.message]);

const SAMPLE = {
  keyStats: { PAC: 88, SHO: 80, PAS: 58, DRI: 84, DEF: 38, PHY: 66 },
  levels: [
    { level: 55, ap: 1419, spent: 1410, apShort: null },
    { level: 32, ap: 724, spent: 724, apShort: 695 },
  ],
  specialization: { note: "Targets Ball Control, Composure, Reactions.", target: 92, reachedFrom: 50 },
};
/** The good fixture as a level-55 draft carrying the sample. */
const sampled = (change: (copy: any) => void = () => {}) => // eslint-disable-line @typescript-eslint/no-explicit-any
  changed(buildGood, (b) => {
    b.status = "draft";
    b.level = 55;
    b.sample = structuredClone(SAMPLE);
    change(b);
  });

describe("validateBuild AcceleRATE", () => {
  it("passes each of the game's seven types, and null", () => {
    const types = ["explosive", "mostly-explosive", "controlled-explosive", "controlled", "controlled-lengthy", "mostly-lengthy", "lengthy", null];
    for (const accelerate of types) expect(problems(changed(buildGood, (b) => (b.body.accelerate = accelerate)))).toEqual([]);
  });

  it("fails a type the game doesn't have", () => {
    const bad = changed(buildGood, (b) => (b.body.accelerate = "Controlled Explosive"));
    expect(problems(bad).map(([path]) => path)).toEqual(["body.accelerate"]);
  });
});

describe("validateBuild sample (D-107)", () => {
  it("passes a draft with Figma's sample figures, and a build with none", () => {
    expect(problems(sampled())).toEqual([]);
    expect(problems(sampled((b) => (b.sample.specialization = null)))).toEqual([]);
    expect(problems(buildGood)).toEqual([]);
  });

  it("fails sample figures on a published build: samples show on the preview only", () => {
    expect(problems(sampled((b) => (b.status = "published")))).toEqual([["sample", "published but still has sample figures (D-107)"]]);
  });

  it("needs all six key stats, each 0 to 99, and nothing else", () => {
    const missing = sampled((b) => delete b.sample.keyStats.PHY);
    expect(problems(missing)).toEqual([["sample.keyStats.PHY", "must be a whole number from 0 to 99"]]);
    const extra = sampled((b) => (b.sample.keyStats.GK = 50));
    expect(problems(extra)).toEqual([["sample.keyStats.GK", "is not a key stat"]]);
    const high = sampled((b) => (b.sample.keyStats.PAC = 100));
    expect(problems(high)).toEqual([["sample.keyStats.PAC", "must be a whole number from 0 to 99"]]);
  });

  it("needs the build's own level among the drawn levels, each once, spending no more AP than there is", () => {
    const noOwn = sampled((b) => (b.sample.levels = [b.sample.levels[1]]));
    expect(problems(noOwn)).toEqual([["sample.levels", "needs the build's own level, 55"]]);
    const twice = sampled((b) => b.sample.levels.push({ level: 32, ap: 724, spent: 700, apShort: 695 }));
    expect(problems(twice)).toEqual([["sample.levels[2].level", "is listed twice"]]);
    const over = sampled((b) => (b.sample.levels[1].spent = 800));
    expect(problems(over)).toEqual([["sample.levels[1].spent", "must be a whole number from 0 to 724"]]);
    const short = sampled((b) => (b.sample.levels[1].apShort = 0));
    expect(problems(short)).toEqual([["sample.levels[1].apShort", "must be a whole number of 1 or more"]]);
    const high = sampled((b) => (b.sample.levels[1].level = 56));
    expect(problems(high)).toEqual([["sample.levels[1].level", "must be a whole number from 1 to 55"]]);
  });

  it("checks the specialization note, its counted target and the level it is reached from", () => {
    const bad = sampled((b) => (b.sample.specialization = { note: "", target: 120, reachedFrom: 0 }));
    expect(problems(bad)).toEqual([
      ["sample.specialization.note", "must be text"],
      ["sample.specialization.target", "must be a whole number from 0 to 99"],
      ["sample.specialization.reachedFrom", "must be a whole number from 1 to 55"],
    ]);
  });
});
