// The build page's rules (`/builds/[archetype]/[build]`, Figma 298:3630 / 306:794 / 306:1286; D-63). Values reach
// the page as the build file writes them: a draft's "PLACEHOLDER" stays "PLACEHOLDER", and nothing here works out
// a game number the file doesn't hold (CLAUDE.md). The level switch, AP and "All of it at level N" need each
// archetype's attribute prices (O-14) and the level engine (Sharon's PR #7), so they aren't here (D-43).
import { buildCardView, type BuildCardView, playStylePlusIcon } from "./archetype-page.ts";
import { GROUPS, playStyleSlug } from "./builds.ts";
import { ATTRIBUTE_GROUPS } from "./content/attributes.ts";
import type { LoadedBuild } from "./content/load.ts";
import type { Archetype, ArchetypeFile } from "./content/types.ts";

// Copy from the Figma frames, word for word.
export const RAW_VALUES_NOTE = "Raw values, as with Attribute totals off: masteries, height and weight and Amps aren't added.";
export const PICTURE_CAPTION = "No picture yet, so it shows the ProBuilds face.";
const PLAYED_NOTE = "Played for one match before it's called meta";
const UNCHECKED_NOTE =
  "Not yet checked in game: we read this build from the creator's video. It becomes a Meta pick only after Chime or Sharon makes it and plays a match with it.";

/** The regular PlayStyle badges in public/art/playstyles (Figma PlayStyle/…, Tier=PlayStyle; EA's art, D-39). */
// TODO(Chime): 11 regular badges aren't exported yet (Chip Shot, Power Shot, Dead Ball, Acrobatic, Gamechanger,
// Tiki Taka, Block, Slide Tackle, Long Throw, Far Throw, 1v1 Close Down); those show their name with no badge.
const REGULAR_BADGES = new Set([
  "1v1-close-down", "acrobatic", "aerial-fortress", "anticipate", "block", "bruiser", "chip-shot", "cross-claimer",
  "dead-ball", "deflector", "enforcer", "far-reach", "far-throw", "finesse-shot", "first-touch", "footwork",
  "gamechanger", "incisive-pass", "intercept", "inventive", "jockey", "long-ball-pass", "long-throw", "low-driven-shot",
  "pinged-pass", "power-shot", "precision-header", "press-proven", "quick-step", "rapid", "relentless", "slide-tackle",
  "technical", "tiki-taka", "trickster", "whipped-pass",
]);

const isNumber = (v: unknown): v is number => typeof v === "number";

export interface AttributeGroupView {
  code: string;
  name: string;
  /** The group's rating (the gauge). Null: how the six key stats are worked out is still open (A-18). */
  value: number | null;
  attributes: { name: string; value: number | string; mastery: boolean; percent: number }[];
}

export interface SpecializationView {
  name: string;
  /** "Chip Shot+", or null when the archetype file doesn't list this specialization. */
  plus: string | null;
  icon: string | null;
  /** The build's raw value beside each unlock target (RESEARCH §10.4: raw values only). */
  targets: { attribute: string; value: number | string | null; target: number | null }[];
  /** The build's own level when its raw values meet every target, else null. */
  reachedAt: number | null;
}

export interface BuildPageView extends Omit<BuildCardView, "credit" | "playStylesPlus"> {
  archetype: { id: string; name: string; groupLabel: string };
  checked: boolean;
  /** "Made by Chime in game · Played for one match before it's called meta". */
  credit: string | null;
  /** A streamer's video the build was read from (D-66). */
  reference: { name: string; url: string | null } | null;
  uncheckedNote: string | null;
  specialization: SpecializationView | null;
  facts: { term: string; value: string; label?: string }[];
  playStylesPlus: { name: string; icon: string | null; signature: boolean }[];
  playStyles: { name: string; icon: string | null }[];
  mastery: { note: string; source: { label: string; url: string } | null } | null;
  attributeGroups: AttributeGroupView[];
}

/** One page per shown build: its archetype's id and its slug. */
export function pageBuilds(builds: LoadedBuild[]): { archetype: string; build: string }[] {
  return builds.map((b) => ({ archetype: b.archetype.id, build: b.slug }));
}

/** 185 → `6'1" · 185 cm`: height in both units on a full list (DESIGN.md §Type). A unit conversion, not a game number. */
export function heightLine(cm: number): string {
  if (!isNumber(cm)) return `${cm} cm`;
  const inches = Math.round(cm / 2.54);
  return `${Math.floor(inches / 12)}'${inches % 12}" · ${cm} cm`;
}

/** 80 → "176 lb · 80 kg". */
export function weightLine(kg: number): string {
  return isNumber(kg) ? `${Math.round(kg / 0.45359237)} lb · ${kg} kg` : `${kg} kg`;
}

/** 4 → "★★★★", read out as "4 stars". */
export function stars(count: number): { text: string; label: string } {
  if (!isNumber(count)) return { text: String(count), label: String(count) };
  return { text: "★".repeat(count), label: `${count} ${count === 1 ? "star" : "stars"}` };
}

/** The regular PlayStyle badge, or null for a placeholder or a badge not exported yet. */
export function playStyleBadge(name: string): string | null {
  const slug = playStyleSlug(name);
  return REGULAR_BADGES.has(slug) ? `/art/playstyles/${slug}.webp` : null;
}

/** The build's attributes in the game's six groups (D-63), plus goalkeeping; groups it has none in are left out. */
export function attributeGroups(attributes: LoadedBuild["attributes"], mastery: readonly string[]): AttributeGroupView[] {
  const byName = new Map(attributes.map((a) => [a.name, a.value]));
  return ATTRIBUTE_GROUPS.flatMap((g) => {
    const rows = (g.attributes as readonly string[]).flatMap((name) => {
      const value = byName.get(name);
      if (value === undefined) return [];
      return [{ name, value, mastery: mastery.includes(name), percent: isNumber(value) ? value : 0 }];
    });
    // TODO(Chime): the group gauges show the six key stats, and how those are worked out is still open (A-18).
    return rows.length > 0 ? [{ code: g.code, name: g.name, value: null, attributes: rows }] : [];
  });
}

/**
 * The line under ATTRIBUTES (D-63 (4)), the design's wording with the archetype's mastery attributes. The levels
 * are EA's (Pitch Notes) and game footage's (RESEARCH §10.6), the same for every archetype.
 */
export function masteryNote(archetype: Archetype, sources: ArchetypeFile["sources"]): BuildPageView["mastery"] {
  const mastery = archetype.masteryAttributes;
  if (!mastery || mastery.attributes.length === 0) return null;
  const names = mastery.attributes.join(" and ");
  const source = sources.find((s) => mastery.sourceIds.includes(s.id));
  return {
    note: `Mastery +2: levelling ${archetype.name} adds +1 to ${names} at level 10 and +1 more by level 55, on every ${archetype.name} build. Not included in the values below.`,
    // TODO(Chime): only EA's source is in content; the footage for levels 30 and 55 (Leski, 22 Oct) isn't linked.
    // The design's short label is for EA's Pitch Notes only; any other source is named by its own title.
    source: source ? { label: source.id === "ea-grounds-deep-dive" ? "EA Pitch Notes" : source.title, url: source.url } : null,
  };
}

/** The build's specialization, its PlayStyle+ and unlock targets from the archetype file (A-18, RESEARCH §10.4). */
export function specializationView(build: LoadedBuild): SpecializationView | null {
  if (build.specialization === null) return null;
  const known = build.archetype.specializations?.find((s) => s.name === build.specialization);
  if (!known) return { name: String(build.specialization), plus: null, icon: null, targets: [], reachedAt: null };
  const byName = new Map(build.attributes.map((a) => [a.name, a.value]));
  const targets = (known.targets ?? []).map((t) => ({ attribute: t.attribute, value: byName.get(t.attribute) ?? null, target: t.value }));
  const reached =
    targets.length > 0 && targets.every((t) => isNumber(t.value) && isNumber(t.target) && t.value >= t.target) && isNumber(build.level);
  return {
    name: known.name,
    plus: `${known.playStyle}+`,
    icon: playStylePlusIcon(known.playStyle),
    targets,
    reachedAt: reached ? build.level : null,
  };
}

const ACCELERATE = { explosive: "Explosive", controlled: "Controlled", lengthy: "Lengthy" } as const;

function facts(build: LoadedBuild): BuildPageView["facts"] {
  const accelerate = build.body.accelerate;
  const skill = stars(build.skillMoves);
  const weak = stars(build.weakFoot);
  return [
    { term: "Built at level", value: String(build.level) },
    { term: "Height", value: heightLine(build.body.heightCm) },
    { term: "Weight", value: weightLine(build.body.weightKg) },
    ...(accelerate === null ? [] : [{ term: "AcceleRATE", value: ACCELERATE[accelerate] ?? String(accelerate) }]),
    { term: "Skill moves", value: skill.text, label: skill.label },
    { term: "Weak foot", value: weak.text, label: weak.label },
  ];
}

/** One build, worded for its page. */
export function buildPageView(build: LoadedBuild, sources: ArchetypeFile["sources"], currentSeason?: number): BuildPageView {
  const card = buildCardView(build, currentSeason);
  const reference = build.credits.find((c) => c.role === "reference");
  const credit = [card.credit, build.badge === "meta" ? PLAYED_NOTE : null].filter(Boolean).join(" · ") || null;
  const signature = new Set(build.playStyles.signature);
  return {
    ...card,
    archetype: {
      id: build.archetype.id,
      name: build.archetype.name,
      groupLabel: GROUPS.find((g) => g.group === build.archetype.positionGroup)?.label ?? build.archetype.positionGroup,
    },
    checked: build.versionTag.verifiedOn !== null,
    credit,
    reference: reference ? { name: reference.name, url: reference.url } : null,
    uncheckedNote: reference && build.versionTag.verifiedOn === null ? UNCHECKED_NOTE : null,
    specialization: specializationView(build),
    facts: facts(build),
    playStylesPlus: card.playStylesPlus.map((p) => ({ ...p, signature: signature.has(p.name) })),
    playStyles: build.playStyles.regular.map((name) => ({ name, icon: playStyleBadge(name) })),
    mastery: masteryNote(build.archetype, sources),
    attributeGroups: attributeGroups(build.attributes, build.archetype.masteryAttributes?.attributes ?? []),
  };
}
