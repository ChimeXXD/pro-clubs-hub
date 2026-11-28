import { describe, expect, it } from "vitest";
import { dayAndMonth, FILTERS, groupBySeason, KIND_LABEL, visibleGroups, weUpdated, type ChangelogItem } from "@/lib/changelog";

// The changelog page's rules, from the Figma Changelog frames (383:3158 / 390:2540 / 390:2700) and FORMAT §Changelog.
const item = (change: Partial<ChangelogItem>): ChangelogItem => ({
  id: "x",
  date: "2026-11-10",
  kind: "title-update",
  season: 2,
  title: "Title Update 1.2.0",
  changes: ["A change."],
  source: { title: "EA, FC 27 Title Update 1.2.0", url: "https://ea.com/x" },
  updated: [],
  ...change,
});

describe("changelog", () => {
  it("labels each kind as the design does", () => {
    expect(KIND_LABEL).toEqual({ "title-update": "Title update", "archetype-update": "Archetype update", season: "Season", site: "Site" });
  });

  it("offers the design's five filters in order", () => {
    expect(FILTERS.map((f) => f.label)).toEqual(["All", "Title updates", "Archetypes", "Seasons", "Site"]);
  });

  it("splits a date into the day and the short month in capitals", () => {
    expect(dayAndMonth("2026-11-10")).toEqual({ day: "10", month: "NOV" });
    expect(dayAndMonth("2026-09-05")).toEqual({ day: "5", month: "SEP" });
    expect(() => dayAndMonth("2026-13-05")).toThrow();
  });

  it("groups entries by season, newest season first, keeping the given order inside", () => {
    const groups = groupBySeason([
      item({ id: "a", season: 2, date: "2026-11-10" }),
      item({ id: "b", season: 2, date: "2026-10-22" }),
      item({ id: "c", season: 1, date: "2026-09-25" }),
    ]);
    expect(groups.map((g) => [g.season, g.entries.map((e) => e.id)])).toEqual([[2, ["a", "b"]], [1, ["c"]]]);
  });

  it("filters by kind and drops seasons left empty", () => {
    const groups = groupBySeason([item({ id: "a", kind: "title-update" }), item({ id: "c", season: 1, kind: "season" })]);
    expect(visibleGroups(groups, "season").map((g) => g.season)).toEqual([1]);
    expect(visibleGroups(groups, "all")).toHaveLength(2);
  });

  it("says no faces or builds changed when nothing was affected, as the design does", () => {
    expect(weUpdated([])).toBe("No faces or builds changed");
    expect(weUpdated(["Meta Finisher", "2008 Ronaldo"])).toBe("Meta Finisher, 2008 Ronaldo");
  });
});
