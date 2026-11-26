// The two story cards in the share sheet (Figma "Share card 1 of 2 · Overview" 316:888 and "2 of 2 · Attributes"
// 316:973, D-64): one card with who the build is, one with every attribute. Worded from the build page's own view so
// the cards never say something the page doesn't.
import type { AttributeGroupView } from "./build-page.ts";
import type { LoadedBuild } from "./content/load.ts";
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
  };
  attributes: {
    /** "Meta Finisher · Level 55 · Finisher". */
    subtitle: string;
    masteryNote: string | null;
    /** Two columns: Pace, Shooting, Passing; then Dribbling, Defending, Physical (and Goalkeeping). */
    columns: AttributeGroupView[][];
  };
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
      subtitle: `${input.title} · Level ${build.level} · ${input.archetype.name}`,
      // The Mastery +2 attributes reach it by level 55 (RESEARCH §10.6), the same for every archetype.
      masteryNote: mastery ? `+2 is Mastery: levelling ${mastery} to 55 adds it. Not included in the values.` : null,
      columns: [input.attributeGroups.slice(0, half), input.attributeGroups.slice(half)],
    },
  };
}
