// What Submit a build sends and shares. The build is a document as docs/FORMAT.md §Build describes it, a draft
// with no sample figures, checked by the same validator as every content file (CLAUDE.md rule 6) before it leaves
// the browser; Supabase stores it for Chime's review (D-99 (1)) or under a short link (D-99 (2)), and /b/ checks
// it again when it is opened. The player's card is the share story card (D-89 (3)), filled from the editor.
import { playStylePlusIcon } from "../archetype-page.ts";
import { playStyleBadge } from "../build-page.ts";
import { GROUPS } from "../builds.ts";
import type { ArchetypeFile } from "../content/types.ts";
import { validateBuild } from "../content/validate.ts";
import { versionWording } from "../content/version.ts";
import type { ShareCardsView } from "../share-cards.ts";
import { shareImageNames } from "../share-images.ts";
import { sharedContext } from "../shared-build.ts";
import { CURRENT_SEASON, NOTICE, SITE_DOMAIN } from "../site.ts";
import {
  bodyChanges,
  chosenSpecialization,
  EDITOR_GROUPS,
  groupAverage,
  plusOptions,
  regularOf,
  slugOf,
  type SubmitDraft,
  titleOf,
} from "./editor.ts";

/** The credit when the player leaves their name empty, after D-100's "Shared by a player". */
const NO_NAME = "a player";

const archetypeOf = (draft: SubmitDraft, file: ArchetypeFile) => {
  const archetype = file.archetypes.find((a) => a.id === draft.archetype);
  if (!archetype) throw new Error(`unknown archetype ${draft.archetype}`);
  return archetype;
};

/** The build document, and anything the validator finds wrong with it (empty when it can be sent). */
export function toSubmission(draft: SubmitDraft, file: ArchetypeFile, today: string) {
  const archetype = archetypeOf(draft, file);
  const title = titleOf(draft, archetype);
  const slug = slugOf(title);
  const signatures = archetype.signaturePlayStyles.map((s) => s.name);
  const document: Record<string, unknown> = {
    schemaVersion: 1,
    id: slug,
    slug,
    status: "draft",
    title,
    archetype: archetype.id,
    positions: draft.positions,
    summary: "Sent from Submit a build.",
    badge: null,
    level: draft.level,
    picture: null,
    // The AcceleRATE rule isn't checked in game yet (RESEARCH §10.3), so a player's build doesn't claim one.
    body: { heightCm: draft.heightCm, weightKg: draft.weightKg, accelerate: null },
    attributes: draft.attributes.map((a) => ({ name: a.name, value: a.value })),
    playStyles: {
      // The signatures kept; the one a specialization replaces is left out (D-87, D-99 (3)).
      signature: draft.plus.filter((p) => signatures.includes(p)),
      plus: draft.plus.filter((p) => !signatures.includes(p)),
      regular: regularOf(draft),
    },
    specialization: chosenSpecialization(draft.plus, archetype),
    skillMoves: draft.skillMoves,
    weakFoot: draft.weakFoot,
    spend: null,
    version: 1,
    versionTag: { game: "fc27", season: CURRENT_SEASON, verifiedOn: null, verifiedBy: null, platform: null },
    credits: [{ role: "made-by", name: draft.credit.trim() || NO_NAME, url: null, creatorId: null }],
    sources: [],
    history: [{ version: 1, date: today, note: "Sent from Submit a build." }],
    createdAt: today,
    updatedAt: today,
  };
  // The validator refuses a value over 99 (checkAttributes), as it does in every content file.
  return { document, problems: validateBuild("submission", document, sharedContext(file)) };
}

/**
 * The two story cards for the player's build (Figma 401:3616's "Your card", 413:3113's share sheet): the made
 * short link once there is one, else the link Figma draws from the name; "Made by you." until a name is typed.
 */
export function submitShareCards(
  draft: SubmitDraft,
  file: ArchetypeFile,
  { link, picture }: { link: string | null; picture: string | null },
): ShareCardsView {
  const archetype = archetypeOf(draft, file);
  const title = titleOf(draft, archetype);
  const group = GROUPS.find((g) => g.group === archetype.positionGroup)?.label ?? "";
  const body = bodyChanges(draft);
  const plus = plusOptions(archetype);
  const groups = EDITOR_GROUPS.map((g) => ({
    code: g.code,
    name: g.name,
    value: groupAverage(draft.attributes, g.code),
    attributes: (g.attributes as readonly string[]).map((name) => {
      const value = draft.attributes.find((a) => a.name === name)?.value ?? 0;
      const delta = body?.changes.find((c) => c.attribute === name)?.delta;
      return { name, value, mastery: false, percent: value, ...(delta === undefined ? {} : { body: delta }) };
    }),
  }));
  const credit = draft.credit.trim();
  return {
    overview: {
      badge: null,
      title,
      archetype: { id: archetype.id, name: archetype.name },
      archetypeLine: `${archetype.name} · ${group}`,
      positions: draft.positions,
      level: String(draft.level),
      height: `${draft.heightCm} cm`,
      weight: `${draft.weightKg} kg`,
      versionTag: versionWording({ game: "fc27", season: CURRENT_SEASON, verifiedOn: null, verifiedBy: null, platform: null }).tag,
      plus: draft.plus.map((name) => ({ name, icon: plus.some((o) => o.name === name) ? playStylePlusIcon(name) : null })),
      regular: regularOf(draft).map((name) => ({ name, icon: playStyleBadge(name) })),
      link: `${SITE_DOMAIN}/b/${link ?? slugOf(title)}`,
      footer: `Made by ${credit || "you"}. ${NOTICE}`,
      picture,
    },
    attributes: {
      subtitle: [title, `Level ${draft.level}`, body?.accelerate].filter(Boolean).join(" · "),
      masteryNote: null,
      bodyNote: body ? `is height and weight (${draft.heightCm} cm, ${draft.weightKg} kg): added in a match. Not included in the values.` : null,
      strongNames: true,
      columns: [groups.slice(0, 3), groups.slice(3)],
    },
    files: shareImageNames(slugOf(title)),
  };
}
