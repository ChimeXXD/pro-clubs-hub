import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChangelogView } from "@/components/changelog/ChangelogView";
import type { ChangelogItem } from "@/lib/changelog";

// The entry list as the Figma Changelog shows it (383:3158). Rendered on the server, as the static export does.
const items: ChangelogItem[] = [
  {
    id: "2026-11-10-title-update-1-2-0", date: "2026-11-10", kind: "title-update", season: 2, title: "Title Update 1.2.0",
    changes: ["First change.", "Second change."], source: { title: "EA, FC 27 Title Update 1.2.0", url: "https://ea.com/a" }, updated: [],
  },
  {
    id: "2026-10-22-archetype-update", date: "2026-10-22", kind: "archetype-update", season: 2, title: "Archetype costs re-priced, every build reset",
    changes: ["A change."], source: { title: "EA, archetypes update", url: "https://ea.com/b" }, updated: [],
  },
  {
    id: "2026-09-25-launch", date: "2026-09-25", kind: "season", season: 1, title: "FC 27 launches; Clubs moves into The Grounds",
    changes: ["A change."], source: { title: "EA, launch", url: "https://ea.com/c" }, updated: [],
  },
];
const html = renderToStaticMarkup(createElement(ChangelogView, { items, currentSeason: 2 }));

describe("ChangelogView", () => {
  it("groups by season with the current one tagged Now", () => {
    expect(html.match(/<h2[^>]*>Season \d<\/h2>/g)).toEqual(["<h2 class=\"type-h3 text-text-primary\">Season 2</h2>", "<h2 class=\"type-h3 text-text-primary\">Season 1</h2>"]);
    expect(html.match(/>Now</g)).toHaveLength(1);
  });

  it("shows every entry, newest open, with its date, kind and title", () => {
    expect(html.match(/data-testid="changelog-entry-\d"/g)).toEqual([1, 2, 3].map((n) => `data-testid="changelog-entry-${n}"`));
    expect(html.match(/<details[^>]*open/g)).toHaveLength(1);
    expect(html).toContain(">10<");
    expect(html).toContain(">NOV<");
    expect(html).toContain("Title update");
    expect(html).toContain("Archetype costs re-priced, every build reset");
  });

  it("lists the changes, links the EA source in a new tab, and says what we updated", () => {
    expect(html).toContain("First change.");
    expect(html).toMatch(/<a[^>]*href="https:\/\/ea.com\/a"[^>]*target="_blank"[^>]*rel="noopener noreferrer"[^>]*>/);
    expect(html).toContain("No faces or builds changed.");
  });

  it("offers the five filters with All pressed", () => {
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(html).toMatch(/aria-pressed="true"[^>]*>All</);
    expect(html.match(/data-testid="filter-chip-\d"/g)).toEqual([1, 2, 3, 4, 5].map((n) => `data-testid="filter-chip-${n}"`));
  });

  it("shows nothing but the page's frame when no entry is published yet", () => {
    const empty = renderToStaticMarkup(createElement(ChangelogView, { items: [], currentSeason: 2 }));
    expect(empty).not.toContain("aria-pressed");
    expect(empty).not.toContain("changelog-entry");
  });
});
