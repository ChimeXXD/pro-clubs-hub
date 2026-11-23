// Version-tag wording, from one function (A-08, D-05). The strings are FORMAT §Version tag's:
// "FC 27 · Season 2 · verified 19 Nov 2026", "FC 27 · Season 2 · not yet checked in game", and for a
// season older than the current one, "Made for Season 2. Values may have changed since."
// The full line for unchecked content, not "Not yet checked in game" alone (D-45). The current season
// is the one setting in site.ts unless a caller passes another.
import { CURRENT_SEASON } from "../site.ts";
import type { Game, IsoDate, VersionTag } from "./types.ts";

const GAME_NAME: Record<Game, string> = { fc27: "FC 27" };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface VersionWording {
  /** The tag line every build and face shows. */
  tag: string;
  /** False when verifiedOn is null: the tag then says "not yet checked in game" (CLAUDE.md rule 4). */
  checked: boolean;
  /** The older-season warning, or null when the content is for the current season. */
  olderSeason: string | null;
}

export function versionWording(version: VersionTag, currentSeason: number = CURRENT_SEASON): VersionWording {
  const day = version.verifiedOn;
  return {
    tag: `${GAME_NAME[version.game]} · Season ${version.season} · ${day === null ? "not yet checked in game" : `verified ${formatDay(day)}`}`,
    checked: day !== null,
    olderSeason: version.season < currentSeason ? `Made for Season ${version.season}. Values may have changed since.` : null,
  };
}

/** "2026-12-03" → "3 Dec 2026". Read from the text, not a Date, so no time zone can shift the day. */
export function formatDay(day: IsoDate): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  const month = match ? MONTHS[Number(match[2]) - 1] : undefined;
  if (!match || !month) throw new Error(`not a date like 2026-11-20: ${JSON.stringify(day)}`);
  return `${Number(match[3])} ${month} ${match[1]}`;
}
