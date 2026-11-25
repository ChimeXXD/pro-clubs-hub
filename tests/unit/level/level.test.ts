import { describe, expect, it } from "vitest";
import { apAtLevel, apShort, MAX_LEVEL } from "@/lib/level/ap";
import { planAtLevel, specializationFrom, type PriceOf } from "@/lib/level/plan";
import type { Spend } from "@/lib/content/types";

describe("apAtLevel (RESEARCH 10.1)", () => {
  // Every total in the research table, at each row's last level.
  const TOTALS: [number, number][] = [
    [1, 100], [4, 127], [5, 146], [9, 186], [10, 224], [14, 276], [15, 301], [19, 353], [20, 397], [24, 473], [25, 511], [29, 611],
    [30, 674], [34, 774], [35, 812], [39, 912], [40, 962], [44, 1062], [45, 1106], [49, 1206], [50, 1269], [54, 1369], [55, 1419],
  ];
  it.each(TOTALS)("level %i has %i AP", (level, ap) => expect(apAtLevel(level)).toBe(ap));

  it("matches the level-42 total Chime's screen should show", () => expect(apAtLevel(42)).toBe(1012));

  it.each([0, 56, 10.5, NaN])("refuses level %s", (level) => expect(() => apAtLevel(level)).toThrow(/level/));

  it("says how far a level is behind a build's level: 53 is 75 AP short of 55", () => {
    expect(apShort(53, 55)).toBe(75);
    expect(apShort(55, 55)).toBe(0);
    expect(apShort(55, 53)).toBe(0);
  });
});

// Test prices only: 10 AP a point up to 80, 20 after, and 60 a star. Not the game's.
const price: PriceOf = (raise, to) => (raise === "Skill Moves" || raise === "Weak Foot" ? 60 : to <= 80 ? 10 : 20);
const spend: Spend = {
  start: [{ name: "Finishing", value: 75 }, { name: "Composure", value: 70 }],
  startStars: { skillMoves: 3, weakFoot: 3 },
  steps: [
    { raise: "Finishing", to: 82 }, // 5 x 10 + 2 x 20 = 90
    { raise: "Weak Foot", to: 4 }, // 60
    { raise: "Composure", to: 72 }, // 20
  ],
};

describe("planAtLevel (D-43, D-44)", () => {
  it("spends point by point and stops at the first point it can't afford, never skipping ahead", () => {
    const plan = planAtLevel(spend, 1, price); // 100 AP
    expect(plan).toMatchObject({ ap: 100, spent: 90, left: 10, done: false });
    expect(plan?.values).toEqual(new Map([["Finishing", 82], ["Composure", 70], ["Skill Moves", 3], ["Weak Foot", 3]]));
    expect(plan?.pending[0]).toEqual({ raise: "Weak Foot", from: 3, to: 4, apMore: 50 });
    expect(plan?.pending[1]).toEqual({ raise: "Composure", from: 70, to: 72, apMore: 20 });
  });

  it("stops part-way through a step", () => {
    const dear: PriceOf = () => 30;
    expect(planAtLevel(spend, 1, dear)).toMatchObject({ spent: 90, left: 10 });
    expect(planAtLevel(spend, 1, dear)?.values.get("Finishing")).toBe(78);
  });

  it("finishes the build when the AP covers it", () => {
    const plan = planAtLevel(spend, MAX_LEVEL, price);
    expect(plan).toMatchObject({ spent: 170, left: 1249, done: true, pending: [] });
  });

  it("gives null when any price on the way isn't known, so the page shows no made-up plan", () => {
    const gap: PriceOf = (raise, to) => (raise === "Composure" ? null : price(raise, to));
    expect(planAtLevel(spend, 1, gap)).toBeNull();
    expect(planAtLevel(spend, MAX_LEVEL, gap)).toBeNull();
  });

  it("refuses a price that isn't a positive whole number", () => {
    expect(() => planAtLevel(spend, 1, () => 0)).toThrow(/price/);
  });
});

describe("specializationFrom", () => {
  it("gives the first level whose raw values reach every target", () => {
    expect(specializationFrom(spend, [{ attribute: "Finishing", value: 82 }], price)).toBe(1);
    expect(specializationFrom(spend, [{ attribute: "Composure", value: 72 }], price)).toBe(8); // 170 AP: level 7 has 166, level 8 has 176
  });

  it("gives null when the build never reaches a target, or a target or price isn't known", () => {
    expect(specializationFrom(spend, [{ attribute: "Finishing", value: 92 }], price)).toBeNull();
    expect(specializationFrom(spend, [{ attribute: "Finishing", value: null }], price)).toBeNull();
    expect(specializationFrom(spend, null, price)).toBeNull();
    expect(specializationFrom(spend, [{ attribute: "Finishing", value: 82 }], () => null)).toBeNull();
  });
});
