// AP by archetype level (RESEARCH §10.1, A-10), ported from Chime's prototype (mockup/builds-v2/level.js).
// Season 2. Re-check on Thu 3 Dec: a higher cap means new rows here.
export const MIN_LEVEL = 1;
export const MAX_LEVEL = 55;

const START = 100;
const MILESTONES: Record<number, number> = { 5: 19, 10: 38, 15: 25, 20: 44, 25: 38, 30: 63, 35: 38, 40: 50, 45: 44, 50: 63, 55: 50 };
const grant = (level: number) => MILESTONES[level] ?? (level < 5 ? 9 : level < 10 ? 10 : level < 20 ? 13 : level < 25 ? 19 : 25);

const TOTALS = [0, START];
for (let level = 2; level <= MAX_LEVEL; level++) TOTALS[level] = (TOTALS[level - 1] ?? 0) + grant(level);

/** All the AP an archetype has at a level. */
export function apAtLevel(level: number): number {
  const total = level >= MIN_LEVEL ? TOTALS[level] : undefined;
  if (total === undefined) throw new Error(`level must be a whole number from ${MIN_LEVEL} to ${MAX_LEVEL}, got ${level}`);
  return total;
}

/** How much less AP `level` has than the level a build was made at. Needs no prices. */
export const apShort = (level: number, buildLevel: number) => Math.max(0, apAtLevel(buildLevel) - apAtLevel(level));
