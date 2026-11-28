import { describe, expect, it } from "vitest";
import { letterLimit, liftFrom, popFrames, skipsMotion, starDelays } from "../../../src/lib/submit/motion.ts";

// Submit a build's motion rules (motion-bookmarks.pdf #2, #12, #17, #29).
describe("submit motion", () => {
  it("skips a roll for a key press or a change faster than the 140 ms roll (#12)", () => {
    expect(skipsMotion(1000, -Infinity, false)).toBe(false);
    expect(skipsMotion(1000, 900, false)).toBe(true);
    expect(skipsMotion(1000, 860, false)).toBe(false);
    expect(skipsMotion(1000, -Infinity, true)).toBe(true);
  });

  it("stars: the picked one lights at once, the ones before it fill left to right 30 ms apart (#17)", () => {
    // From 1 star to 5: stars 2, 3, 4 at 0, 30, 60 ms; star 5 (picked) at once; star 1 doesn't change.
    expect(starDelays(5, 1)).toEqual([null, 0, 30, 60, 0]);
    // From 0 to 3: 1 and 2 fill, 3 at once.
    expect(starDelays(3, 0)).toEqual([0, 30, 0, null, null]);
    // Going down, the stars that go out go together; the picked one was already lit.
    expect(starDelays(2, 5)).toEqual([null, null, 0, 0, 0]);
    // The same star again: nothing changes.
    expect(starDelays(4, 4)).toEqual([null, null, null, null, null]);
  });

  it("the picked star pops 1 → 1.15 → 1 on the pop spring, and ends at rest (#17)", () => {
    const frames = popFrames();
    expect(frames[0]).toBe(1);
    expect(frames.at(-1)).toBe(1);
    expect(Math.max(...frames)).toBeCloseTo(1.15, 5);
    // The spring swings back below 1 once (a pop, not a plain grow), but never shrinks the star much.
    expect(Math.min(...frames)).toBeLessThan(0.99);
    expect(Math.min(...frames)).toBeGreaterThan(0.9);
    // It peaks fast (within about 70 ms at 120 fps) and is over in about half a second.
    expect(frames.indexOf(Math.max(...frames))).toBeLessThan(9);
    expect(frames.length / 120).toBeLessThan(0.6);
  });

  it("letter limit: the ring fills with the length, warns in the last 10, shows nothing when empty (#29)", () => {
    expect(letterLimit(0, 40)).toEqual({ show: false, fill: 0, warn: false, left: 40 });
    expect(letterLimit(20, 40)).toEqual({ show: true, fill: 0.5, warn: false, left: 20 });
    expect(letterLimit(29, 40).warn).toBe(false);
    expect(letterLimit(30, 40)).toEqual({ show: true, fill: 0.75, warn: true, left: 10 });
    expect(letterLimit(40, 40)).toEqual({ show: true, fill: 1, warn: true, left: 0 });
    // Pasted past the limit (maxLength stops typing, not every path in): never below 0, never over full.
    expect(letterLimit(45, 40)).toEqual({ show: true, fill: 1, warn: true, left: 0 });
  });

  it("fan cards: the sheet's card starts over Your card, scaled from its top left corner (#2)", () => {
    const from = { left: 20, top: 900, width: 353, height: 627.6 };
    const to = { left: 82.5, top: 120, width: 225, height: 400 };
    expect(liftFrom(from, to)).toBe("translate(-62.5px, 780px) scale(1.5689)");
    expect(liftFrom(to, to)).toBe("translate(0px, 0px) scale(1)");
  });
});
