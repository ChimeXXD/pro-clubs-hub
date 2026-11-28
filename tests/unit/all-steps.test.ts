import { describe, expect, it } from "vitest";
import { staggerDelay } from "@/components/faces/allStepsMotion";
import { type Recipe, sectionDone } from "@/lib/face-page";

// Task list's stagger on open: 30 ms apart at first, each gap shorter, capped at the eighth line (product UI: the
// whole group under ~300 ms with its 150 ms fade).
describe("staggerDelay", () => {
  it("starts at 0, 30 ms apart, gaps shrinking, the eighth line and later all at the cap", () => {
    const d = Array.from({ length: 10 }, (_, i) => staggerDelay(i));
    expect(d.slice(0, 3)).toEqual([0, 30, 56]);
    for (let i = 2; i < 8; i++) expect(d[i]! - d[i - 1]!).toBeLessThanOrEqual(d[i - 1]! - (d[i - 2] ?? 0));
    expect(d[7]).toBe(d[9]);
    expect(d[7]! + 150).toBeLessThan(300);
  });
});

// Task list (motion-bookmarks #11): each section in All steps shows how many of its screens are done, "3 of 4".
const recipe: Recipe = {
  total: 7,
  sections: [
    { name: "Preset", values: 1, screens: 1, first: 1 },
    { name: "Skin", values: 4, screens: 2, first: 2 },
    { name: "Sculpt", values: 12, screens: 4, first: 4 },
  ],
  screens: [],
};

describe("sectionDone", () => {
  it("counts a section's screens before the step in hand, of all its screens", () => {
    expect(sectionDone(recipe, 1)).toEqual([
      { name: "Preset", first: 1, done: 0, of: 1 },
      { name: "Skin", first: 2, done: 0, of: 2 },
      { name: "Sculpt", first: 4, done: 0, of: 4 },
    ]);
    expect(sectionDone(recipe, 5).map((s) => `${s.done} of ${s.of}`)).toEqual(["1 of 1", "2 of 2", "1 of 4"]);
  });

  it("is all done once the walk is finished (step total + 1)", () => {
    expect(sectionDone(recipe, 8).map((s) => s.done === s.of)).toEqual([true, true, true]);
  });
});
