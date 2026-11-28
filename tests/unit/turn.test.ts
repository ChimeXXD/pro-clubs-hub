import { describe, expect, it } from "vitest";
import { VelocityTracker } from "@/lib/motion";
import { flingAt, flingTarget, PX_PER_FRAME } from "@/lib/turn";

// The turntable's flick (Scrubber, motion-bookmarks #18): the drag tracks 1:1; let go moving and the head keeps
// turning, slowing as a scroll does, and stops on a whole frame. The finger's speed is the shared VelocityTracker's.
describe("the release speed the turntable reads (VelocityTracker, px/ms × 1000)", () => {
  it("is the speed over the last pointer moves, and 0 when the finger stopped before letting go", () => {
    const speed = new VelocityTracker();
    [0, 10, 30].forEach((x, i) => speed.add(x, i * 10));
    expect(speed.velocity(20) * 1000).toBe(1500);
    expect(flingTarget(30, speed.velocity(200) * 1000)).toBe(30);
  });

  it("is negative leftwards, and 0 with one sample", () => {
    const left = new VelocityTracker();
    [30, 0].forEach((x, i) => left.add(x, i * 20));
    expect(left.velocity(20) * 1000).toBe(-1500);
    const one = new VelocityTracker();
    one.add(5, 0);
    expect(one.velocity(0)).toBe(0);
  });
});

describe("flingTarget", () => {
  it("projects the flick forward (Apple's decay, rate 0.99) and lands on a whole frame", () => {
    // 1,500 px/s projects 148.5 px; from 3 px that is 151.5 px, the nearest frame boundary is 152 (19 frames).
    expect(flingTarget(3, 1500)).toBe(152);
    expect(flingTarget(3, 1500) % PX_PER_FRAME).toBe(0);
    expect(flingTarget(-3, -1500)).toBe(-152);
  });

  it("a wild reading (two samples ms apart) turns the head once round at most", () => {
    expect(flingTarget(0, 15_000)).toBe(288);
    expect(flingTarget(0, -15_000)).toBe(-288);
  });

  it("a slow release doesn't fling: the head stays on the frame the finger left it on", () => {
    expect(flingTarget(13, 50)).toBe(13);
    expect(flingTarget(13, -199)).toBe(13);
  });
});

describe("flingAt", () => {
  it("starts where the finger let go, slows down, and reaches the target", () => {
    expect(flingAt(0, 152, 0)).toBe(0);
    const early = flingAt(0, 152, 50);
    const later = flingAt(0, 152, 100);
    expect(early).toBeGreaterThan(152 / 3); // fast at first: the finger's own speed carries on
    expect(later - early).toBeLessThan(early); // then slower
    expect(flingAt(0, 152, 2000)).toBe(152);
  });
});
