import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SPRINGS, motionCss, settleMs, springAt } from "../../scripts/build-springs.mjs";

// Motion tokens (motion-bookmarks.pdf): springs as CSS linear() easings, generated, never edited by hand.
describe("motion tokens", () => {
  it("motion.css is what the generator writes", () => {
    expect(readFileSync(new URL("../../src/styles/motion.css", import.meta.url), "utf8")).toBe(motionCss());
  });

  it("every spring starts at 0, ends at 1 and settles inside its duration", () => {
    for (const spring of Object.values(SPRINGS) as [number, number][]) {
      expect(springAt(spring, 0)).toBeCloseTo(0, 6);
      expect(Math.abs(springAt(spring, settleMs(spring) / 1000) - 1)).toBeLessThan(0.011);
    }
  });

  it("follow does not overshoot (something held by the pointer); pop overshoots (a select)", () => {
    const peak = (s: [number, number]) => Math.max(...Array.from({ length: 600 }, (_, i) => springAt(s, i / 1000)));
    expect(peak(SPRINGS.follow as [number, number])).toBeLessThan(1.02);
    expect(peak(SPRINGS.pop as [number, number])).toBeGreaterThan(1.1);
  });
});
