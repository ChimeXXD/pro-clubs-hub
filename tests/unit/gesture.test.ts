import { describe, expect, it } from "vitest";
import { SPRINGS as TOKENS } from "../../scripts/build-springs.mjs";
import { SPRINGS, VelocityTracker, project, rubberband, simulate, stepSpring } from "../../src/lib/motion.ts";

// The gesture maths behind the Swipe deck and the toast's swipe (motion-bookmarks.pdf #1, #30): the release
// spring seeded with the finger's speed, the speed of the last pointer moves, momentum projection and the
// rubber band at an end (apple-design §5, §6, §9; gestures "Release phase").
describe("gesture maths", () => {
  it("uses the same springs as the CSS tokens", () => {
    for (const [name, [stiffness, damping]] of Object.entries(TOKENS) as [string, [number, number]][]) {
      expect(SPRINGS[name as keyof typeof SPRINGS]).toEqual({ stiffness, damping });
    }
  });

  it("a spring from rest reaches its target and stops there", () => {
    const end = simulate(SPRINGS.settle, { value: 0, velocity: 0 }, 100);
    expect(end.at(-1)?.value).toBeCloseTo(100, 0);
    // settle overshoots a little once (letting go, DESIGN.md motion tokens) and never goes past by more than 10 %
    const peak = Math.max(...end.map((s) => s.value));
    expect(peak).toBeGreaterThan(100);
    expect(peak).toBeLessThan(110);
  });

  it("a spring keeps the finger's speed at the moment of release", () => {
    const still = stepSpring(SPRINGS.settle, { value: 0, velocity: 0 }, 100, 1 / 120);
    const thrown = stepSpring(SPRINGS.settle, { value: 0, velocity: 2000 }, 100, 1 / 120);
    // after one 8.3 ms frame the thrown card is about 2000 px/s × 8.3 ms ahead, less what damping took
    expect(thrown.value - still.value).toBeGreaterThan(12);
    expect(thrown.value - still.value).toBeLessThan(18);
  });

  it("velocity comes from the last pointer moves, in px per ms", () => {
    const v = new VelocityTracker();
    v.add(0, 0);
    v.add(10, 16);
    v.add(30, 32);
    v.add(60, 48);
    expect(v.velocity()).toBeCloseTo((60 - 10) / (48 - 16), 5);
  });

  it("a finger that stopped before letting go has no velocity", () => {
    const v = new VelocityTracker();
    v.add(0, 0);
    v.add(80, 16);
    expect(v.velocity(200)).toBe(0);
  });

  it("projection is Apple's exponential decay, not v²/2a", () => {
    expect(project(1000, 0.99)).toBeCloseTo(99, 5);
    expect(project(-500, 0.99)).toBeCloseTo(-49.5, 5);
  });

  it("the rubber band gives less the further past the end", () => {
    const a = rubberband(50, 400);
    const b = rubberband(100, 400);
    expect(a).toBeLessThan(50);
    expect(b - a).toBeLessThan(a);
    expect(rubberband(-50, 400)).toBeCloseTo(-a, 6);
  });
});
