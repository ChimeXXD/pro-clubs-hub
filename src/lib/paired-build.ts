// The matching build on a finished face (D-79; Figma 374:2045, "Build · 2008 Winger"): the archetype page's stat-strip
// card (D-62). A build not recorded yet shows its archetype and "not recorded yet", a dash for every key stat, and its
// signature PlayStyles+ (D-79). Values reach the card as the build file writes them; no number is made up.
import { bodyLine, creditLine, KEY_STATS, playStylePlusIcon } from "./archetype-page.ts";
import type { LoadedBuild } from "./content/load.ts";
import type { KeyStatCode, Position } from "./content/types.ts";
import { versionWording } from "./content/version.ts";

export interface PairedBuildView {
  href: string;
  title: string;
  picture: { src: string; alt: string } | null;
  positions: Position[];
  /** "Level 55 · 185 cm · 80 kg", or "Spark · not recorded yet". */
  line: string;
  keyStats: { code: string; value: string }[];
  playStylesPlus: { name: string; icon: string | null }[];
  /** Rules 4 and 5 on a real face's page; null beside Figma's sample, which draws neither (as on the archetype page). */
  versionTag: string | null;
  credit: string | null;
}

const PLACEHOLDER = "PLACEHOLDER";
/** Figma 374:2061: an em dash for a key stat nobody has recorded. */
const NO_STAT = "—";

export function pairedBuildView(build: LoadedBuild, { sample }: { sample: boolean }): PairedBuildView {
  const recorded = typeof build.level === "number";
  const plus = [...new Set([...build.playStyles.signature, ...build.playStyles.plus])].filter((name) => name !== PLACEHOLDER);
  return {
    href: `/builds/${build.archetype.id}/${build.slug}`,
    title: build.title,
    picture: build.picture ? { src: `/${build.picture.file}`, alt: build.picture.alt } : null,
    positions: build.positions,
    line: recorded ? bodyLine(build) : `${build.archetype.name} · not recorded yet`,
    keyStats: KEY_STATS.map((code) => ({ code, value: build.sample?.keyStats[code as KeyStatCode]?.toString() ?? NO_STAT })),
    playStylesPlus: plus.map((name) => ({ name, icon: playStylePlusIcon(name) })),
    versionTag: sample ? null : versionWording(build.versionTag).tag,
    credit: sample ? null : creditLine(build.credits, Boolean(build.sample)),
  };
}
