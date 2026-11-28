// The build page's level switch and the sample's figures around it (Figma "Section - Your level" 298:3669, the
// level-32 state 371:1697, "All of it at level 55" 298:3734; D-43, D-107). Only the sample build has them: a recorded
// build needs each archetype's attribute prices (O-14) and the level engine (Sharon's PR #7) to work them out, so
// for now the switch moves between the levels the sample draws and nowhere else.
import { LEVEL_MAX } from "./content/attributes.ts";
import type { LoadedBuild } from "./content/load.ts";

// Copy from the Figma frames, word for word.
export const SAMPLE_LABEL = "Sample build · values and prices not checked in game";
export const SAMPLE_FOOTNOTE =
  "Draft only: PlayStyle icons are EA's art, archetype emblems are Pro Clubs HQ's tracings and the stances are Chime's screenshots. None of them ships as is.";

export interface LevelState {
  level: number;
  /** "1,419": the AP the level gives, spent and left, as the AP line shows them. */
  ap: string;
  spent: string;
  left: string;
  /** Spent and left as shares of the level's AP, for the bar under the AP line (Storage meter, #14). */
  share: ApShare;
  /** "At level 32 you're 695 AP short of this build. …", or null when the whole build fits. */
  callout: string | null;
}

export interface LevelsView {
  /** The drawn levels, lowest first. */
  states: LevelState[];
  /** The build's own level, where the switch starts. */
  initial: number;
  /** The end of the track. */
  max: number;
  /** The level the specialization unlocks at, marked with a taller tick on the track; null when not recorded. */
  specializationAt: number | null;
}

const count = (n: number) => n.toLocaleString("en-US");

export interface ApShare {
  /** 0–1: the spent part of the bar (at most the whole bar). */
  spent: number;
  /** 0–1: the part left over. */
  left: number;
  /** The build needs more AP than the level gives (the level is short of it, or spends more than it has). */
  over: boolean;
}

/**
 * Spent and left as shares of the AP a level gives (the Storage meter under the AP line, motion-bookmarks.pdf #14).
 * `short` is the level's AP short of the build (null when it all fits): a short level spends all it has, so spent alone
 * never shows it.
 */
export function apShare(ap: number, spent: number, short: number | null = null): ApShare {
  const over = (short !== null && short > 0) || spent > ap;
  if (ap <= 0) return { spent: over ? 1 : 0, left: 0, over };
  return { spent: Math.min(spent / ap, 1), left: Math.max(ap - spent, 0) / ap, over };
}

/** The sample's drawn levels, or null for a build without them (every recorded build, for now). */
export function levelsView(build: LoadedBuild): LevelsView | null {
  const sample = build.sample;
  // A sample drawn only as an archetype card has no levels (Tall and Quick Finisher): no switch, as no frame draws it.
  if (!sample || sample.levels.length === 0 || typeof build.level !== "number") return null;
  const reachedFrom = sample.specialization?.reachedFrom;
  const states = [...sample.levels]
    .sort((a, b) => a.level - b.level)
    .map((l) => ({
      level: l.level,
      ap: count(l.ap),
      spent: count(l.spent),
      left: count(l.ap - l.spent),
      share: apShare(l.ap, l.spent, l.apShort),
      callout:
        l.apShort === null
          ? null
          : `At level ${l.level} you're ${count(l.apShort)} AP short of this build.${reachedFrom ? ` Its specialization needs level ${reachedFrom}.` : ""}`,
    }));
  return { states, initial: build.level, max: LEVEL_MAX, specializationAt: reachedFrom ?? null };
}

/** "All of it at level 55 · Every step of the build fits, with 9 AP to spare." at the build's own level. */
export function allOfItView(build: LoadedBuild): { heading: string; text: string } | null {
  const own = build.sample?.levels.find((l) => l.level === build.level);
  if (!own || own.apShort !== null) return null;
  const left = own.ap - own.spent;
  return { heading: `All of it at level ${own.level}`, text: `Every step of the build fits, with ${count(left)} AP to spare.` };
}

/** The drawn level nearest to where the slider was let go; the higher one on a tie. */
export function nearestLevel(levels: readonly number[], value: number): number {
  return levels.reduce((best, l) => (Math.abs(l - value) <= Math.abs(best - value) ? l : best), levels[0] ?? value);
}

/** The next drawn level down (−1) or up (+1), staying put at either end. */
export function stepLevel(levels: readonly number[], current: number, direction: -1 | 1): number {
  const sorted = [...levels].sort((a, b) => a - b);
  const next = direction < 0 ? sorted.filter((l) => l < current).at(-1) : sorted.find((l) => l > current);
  return next ?? current;
}
