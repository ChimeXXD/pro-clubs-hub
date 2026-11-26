// The changelog page's rules (Figma Changelog 383:3158 / 390:2540 / 390:2700; FORMAT §Changelog).
import type { ChangelogKind, IsoDate } from "./content/types.ts";
import { formatDay } from "./content/version.ts";

/** One entry as the page shows it: plain data, so a client component can filter it. */
export interface ChangelogItem {
  id: string;
  /** Shown only on the preview site, with a Draft tag. */
  draft?: boolean;
  date: IsoDate;
  kind: ChangelogKind;
  season: number;
  title: string;
  changes: string[];
  source: { title: string; url: string };
  /** Names of the faces and builds we changed because of it. */
  updated: string[];
}

export const KIND_LABEL: Record<ChangelogKind, string> = {
  "title-update": "Title update",
  "archetype-update": "Archetype update",
  season: "Season",
  site: "Site", // TODO(Chime): no design entry shows the site kind; this follows its filter chip.
};

export type Filter = "all" | ChangelogKind;

export const FILTERS: readonly { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "title-update", label: "Title updates" },
  { value: "archetype-update", label: "Archetypes" },
  { value: "season", label: "Seasons" },
  { value: "site", label: "Site" },
];

/** "2026-11-10" → { day: "10", month: "NOV" }, the entry's date block. Throws on a malformed date, as formatDay does. */
export function dayAndMonth(date: IsoDate): { day: string; month: string } {
  const [day = "", month = ""] = formatDay(date).split(" ");
  return { day, month: month.toUpperCase() };
}

export interface SeasonGroup {
  season: number;
  entries: ChangelogItem[];
}

/** Entries grouped by season, newest season first; each group keeps the order it was given (newest first). */
export function groupBySeason(entries: readonly ChangelogItem[]): SeasonGroup[] {
  const groups = new Map<number, ChangelogItem[]>();
  for (const e of entries) groups.set(e.season, [...(groups.get(e.season) ?? []), e]);
  return [...groups].sort(([a], [b]) => b - a).map(([season, list]) => ({ season, entries: list }));
}

/** The groups with only the entries a filter keeps; seasons left empty go. */
export function visibleGroups(groups: readonly SeasonGroup[], filter: Filter): SeasonGroup[] {
  if (filter === "all") return [...groups];
  return groups
    .map((g) => ({ season: g.season, entries: g.entries.filter((e) => e.kind === filter) }))
    .filter((g) => g.entries.length > 0);
}

/** The "We updated" line. The empty case is the design's copy. */
export function weUpdated(names: readonly string[]): string {
  // TODO(Chime): the design shows only the empty case; a list of names is the obvious reading of "We updated".
  return names.length === 0 ? "No faces or builds changed." : `${names.join(", ")}.`;
}
