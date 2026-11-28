import { describe, expect, it } from "vitest";
import { pillInset, toMs } from "@/lib/motion";

// The production CSS is minified: a token written 220ms arrives as .22s.
describe("toMs", () => {
  it("reads a CSS time in ms or s, as the minifier may rewrite it", () => {
    expect(toMs("220ms", 1)).toBe(220);
    expect(toMs(".22s", 1)).toBe(220);
    expect(toMs(" 0.51s ", 1)).toBe(510);
    expect(toMs("", 150)).toBe(150);
    expect(toMs("fast", 150)).toBe(150);
  });
});

// Shared motion maths (docs/design/motion-bookmarks.md): the sliding pill's clip.
describe("pillInset", () => {
  it("clips a layer the size of the row down to one item, rounded into a pill", () => {
    // A 300 × 48 row; the item sits 100 px in, 80 × 40, 4 px down.
    expect(pillInset({ left: 100, top: 4, width: 80, height: 40 }, { width: 300, height: 48 })).toBe(
      "inset(4px 120px 4px 100px round 9999px)",
    );
  });

  it("grows each side by a ring width, as calc() with the layer's own --pill-ring", () => {
    expect(pillInset({ left: 0, top: 0, width: 50, height: 48 }, { width: 100, height: 48 }, "var(--pill-ring)")).toBe(
      "inset(calc(0px + var(--pill-ring)) calc(50px + var(--pill-ring)) calc(0px + var(--pill-ring)) calc(0px + var(--pill-ring)) round 9999px)",
    );
  });

  it("rounds fractional chip widths to 0.01 px so the clip string stays short", () => {
    expect(pillInset({ left: 10.123456, top: 0, width: 20.5, height: 10 }, { width: 100, height: 10 })).toBe(
      "inset(0px 69.38px 0px 10.12px round 9999px)",
    );
  });
});
