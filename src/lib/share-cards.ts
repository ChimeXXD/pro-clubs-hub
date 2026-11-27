// The two story cards in the share sheet (Figma "Share card 1 of 2 · Overview" 316:888 and "2 of 2 · Attributes"
// 316:973, D-64): one card with who the build is, one with every attribute. Worded from the build page's own view so
// the cards never say something the page doesn't.
import type { AttributeGroupView } from "./build-page.ts";
import type { LoadedBuild } from "./content/load.ts";
import { shareImageNames } from "./share-images.ts";
import { NOTICE, SITE_DOMAIN } from "./site.ts";

export interface ShareCardsView {
  overview: {
    badge: string | null;
    title: string;
    archetype: { id: string; name: string };
    /** "Finisher · Forward". */
    archetypeLine: string;
    positions: string[];
    level: string;
    height: string;
    weight: string;
    versionTag: string;
    plus: { name: string; icon: string | null }[];
    regular: { name: string; icon: string | null }[];
    /** "probuilds.club/builds/finisher/meta-finisher". */
    link: string;
    /** "Made by — (sample). Not endorsed by …": the maker and the notice (rule 3). */
    footer: string;
    /** A player's own picture on their own card (Submit a build, D-89 (2), (4)); else the ProBuilds face. */
    picture?: string | null;
  };
  attributes: {
    /** "Meta Finisher · Level 55 · Finisher". */
    subtitle: string;
    masteryNote: string | null;
    /** Submit a build's line after "±": what height and weight add in a match (Figma 413:3113, D-90 (3)). */
    bodyNote?: string | null;
    /** Submit a build's card draws the attribute names in text/primary (413:3113); the build page's in secondary. */
    strongNames?: boolean;
    /** Two columns: Pace, Shooting, Passing; then Dribbling, Defending, Physical (and Goalkeeping). */
    columns: AttributeGroupView[][];
  };
  /** "Save images" file names, one per card: "meta-finisher-1.png", "meta-finisher-2.png". */
  files: [string, string];
}

interface CardInput {
  title: string;
  badge: string | null;
  href: string;
  archetype: { id: string; name: string; groupLabel: string };
  positions: string[];
  versionTag: string;
  maker: string | null;
  playStylesPlus: { name: string; icon: string | null }[];
  regularBadges: { name: string; icon: string | null }[];
  attributeGroups: AttributeGroupView[];
}

/** "Meta Finisher · Level 55 · Finisher", under ATTRIBUTES on card 2. */
const attributesSubtitle = (title: string, level: string, archetype: string) => `${title} · Level ${level} · ${archetype}`;

/**
 * The cards at the level picked with the level switch (Figma 492:9586, 492:9695, D-114 (3)): only the level changes,
 * on card 1's LEVEL and card 2's subtitle. The attributes stay as built until each archetype's prices are known
 * (O-14). With no level picked, or the build's own, the cards as built.
 */
export function shareCardsAtLevel(view: ShareCardsView, level: number | null): ShareCardsView {
  if (level === null || String(level) === view.overview.level) return view;
  const at = String(level);
  return {
    ...view,
    overview: { ...view.overview, level: at },
    attributes: { ...view.attributes, subtitle: attributesSubtitle(view.overview.title, at, view.overview.archetype.name) },
  };
}

/** One build, worded for its two share cards. */
export function shareCardsView(build: LoadedBuild, input: CardInput): ShareCardsView {
  const half = Math.ceil(input.attributeGroups.length / 2);
  const mastery = build.archetype.masteryAttributes?.attributes.length ? build.archetype.name : null;
  return {
    overview: {
      badge: input.badge,
      title: input.title,
      archetype: { id: input.archetype.id, name: input.archetype.name },
      archetypeLine: `${input.archetype.name} · ${input.archetype.groupLabel}`,
      positions: input.positions,
      level: String(build.level),
      height: `${build.body.heightCm} cm`,
      weight: `${build.body.weightKg} kg`,
      versionTag: input.versionTag,
      plus: input.playStylesPlus,
      regular: input.regularBadges,
      link: `${SITE_DOMAIN}${input.href}`,
      footer: [input.maker ? `${input.maker}.` : null, NOTICE].filter(Boolean).join(" "),
    },
    attributes: {
      subtitle: attributesSubtitle(input.title, String(build.level), input.archetype.name),
      // The Mastery +2 attributes reach it by level 55 (RESEARCH §10.6), the same for every archetype.
      masteryNote: mastery ? `+2 is Mastery: levelling ${mastery} to 55 adds it. Not included in the values.` : null,
      columns: [input.attributeGroups.slice(0, half), input.attributeGroups.slice(half)],
    },
    files: shareImageNames(build.slug),
  };
}
