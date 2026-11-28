import { describe, expect, it } from "vitest";
import { apShare } from "../../src/lib/build-level.ts";

// The Storage meter under the AP line (motion-bookmarks.pdf #14): spent and left as shares of the AP the level gives.
describe("apShare", () => {
  it("splits the level's AP into spent and left", () => {
    expect(apShare(1419, 1410)).toEqual({ spent: 1410 / 1419, left: 9 / 1419, over: false });
  });

  it("is all spent, nothing left, when the build uses every point", () => {
    expect(apShare(724, 724)).toEqual({ spent: 1, left: 0, over: false });
  });

  it("caps the spent bar at the whole and says it is over when the build needs more than the level gives", () => {
    expect(apShare(724, 1410)).toEqual({ spent: 1, left: 0, over: true });
  });

  it("is over when the level is short of the build, though it spends every point it has", () => {
    expect(apShare(724, 724, 695)).toEqual({ spent: 1, left: 0, over: true });
  });

  it("fills the bar as over at no AP when the build needs some", () => {
    expect(apShare(0, 10)).toEqual({ spent: 1, left: 0, over: true });
  });

  it("has nothing to split at no AP", () => {
    expect(apShare(0, 0)).toEqual({ spent: 0, left: 0, over: false });
  });
});
