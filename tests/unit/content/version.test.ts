import { describe, expect, it } from "vitest";
import { formatDay, versionWording } from "@/lib/content/version";
import type { VersionTag } from "@/lib/content/types";

// The strings are FORMAT §Version tag's, word for word (A-08: one function, tested).
const tag = (change: Partial<VersionTag> = {}): VersionTag => ({
  game: "fc27",
  season: 2,
  verifiedOn: "2026-11-19",
  verifiedBy: "Chime",
  platform: "ps5",
  ...change,
});

describe("versionWording", () => {
  it("says the game, season and day it was verified", () => {
    expect(versionWording(tag(), 2)).toEqual({
      tag: "FC 27 · Season 2 · verified 19 Nov 2026",
      checked: true,
      olderSeason: null,
    });
  });

  it("says in words when it's not yet checked in game", () => {
    expect(versionWording(tag({ verifiedOn: null, verifiedBy: null }), 2)).toEqual({
      tag: "FC 27 · Season 2 · not yet checked in game",
      checked: false,
      olderSeason: null,
    });
  });

  it("warns when the content was made for an older season than the current one", () => {
    expect(versionWording(tag(), 3).olderSeason).toBe("Made for Season 2. Values may have changed since.");
  });

  it("warns about an older season on unchecked content too", () => {
    const wording = versionWording(tag({ season: 1, verifiedOn: null }), 3);
    expect(wording.tag).toBe("FC 27 · Season 1 · not yet checked in game");
    expect(wording.olderSeason).toBe("Made for Season 1. Values may have changed since.");
  });

  it("doesn't warn on the current season", () => {
    expect(versionWording(tag({ season: 3 }), 3).olderSeason).toBeNull();
  });
});

describe("formatDay", () => {
  it("writes a day as the tag does, without a leading zero", () => {
    expect(formatDay("2026-12-03")).toBe("3 Dec 2026");
    expect(formatDay("2027-01-14")).toBe("14 Jan 2027");
  });

  it("names every month", () => {
    const months = Array.from({ length: 12 }, (_, i) => formatDay(`2026-${String(i + 1).padStart(2, "0")}-01`).split(" ")[1]);
    expect(months).toEqual(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
  });

  it("refuses a value that isn't a date like 2026-11-20", () => {
    expect(() => formatDay("19 Nov 2026")).toThrow('not a date like 2026-11-20: "19 Nov 2026"');
    expect(() => formatDay("2026-13-01")).toThrow('not a date like 2026-11-20: "2026-13-01"');
  });
});
