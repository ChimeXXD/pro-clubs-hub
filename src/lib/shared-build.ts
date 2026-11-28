// A player's shared build (D-99 (2), D-100 (1)): saved in Supabase under a short id and opened at probuilds.club/b/<id>
// by one static page, which loads it in the browser (Cloudflare Pages rewrites /b/* to /b, public/_redirects).
// The page is the Build page with the shared header Figma draws (439:8847 / 439:9404 / 439:9925): a neutral
// "Shared build" tag, "Shared by a player · not on ProBuilds' lists yet", the player's build name and credit, the note
// that Chime plays it before it is listed, Share build and Make your own build. A link that doesn't load is the
// "link doesn't work" state (440:8514 / 440:8634 / 440:8734).
// What Supabase returns is never trusted (CLAUDE.md rule 6): it must be a build document as FORMAT §Build describes,
// with "status": "draft" (it isn't on ProBuilds' lists) and no sample figures, and pass the same validator as content.
import { buildPageView, type BuildPageView } from "./build-page.ts";
import { isObj } from "./content/check.ts";
import type { LoadedBuild } from "./content/load.ts";
import type { ArchetypeFile, Build } from "./content/types.ts";
import { type Context, validateBuild } from "./content/validate.ts";
import { SITE_DOMAIN } from "./site.ts";
import { rpc, type SupabaseConfig } from "./supabase/client.ts";

/** The id Figma's example link uses (D-99 (2)): on the preview it opens Figma's sample shared build. */
export const SAMPLE_SHARE_ID = "k7x2m9";

const SHARE_ID = /^[a-z0-9]{6}$/;

/** Six lower-case letters and digits, as the database makes them (docs/supabase-schema.sql). */
export const isShareId = (id: string) => SHARE_ID.test(id);

/** "/b/k7x2m9" → "k7x2m9"; any other path, or a malformed id, → null. */
export function shareIdFromPath(path: string): string | null {
  const id = /^\/b\/([^/]+)\/?$/.exec(path)?.[1];
  return id && isShareId(id) ? id : null;
}

// Copy from Figma 439:8847, word for word.
export const SHARED = {
  tag: "Shared build",
  line: "Shared by a player · not on ProBuilds' lists yet",
  note: "A player shared this build. It goes on ProBuilds' lists only after Chime plays it in game.",
  credit: "shared from Submit a build",
  makeYourOwn: { label: "Make your own build", href: "/submit" },
} as const;

/** Figma's sample shared build (439:8847): the Meta Finisher sample as a player's "My Finisher", with no badge. */
export function sampleSharedBuild(meta: LoadedBuild): LoadedBuild {
  return { ...meta, id: "my-finisher", slug: "my-finisher", title: "My Finisher", badge: null };
}

/** A loaded build as the document Supabase stores (FORMAT §Build): the archetype by id, credits without creators. */
export function toBuildDocument(build: LoadedBuild): Record<string, unknown> {
  const credits = build.credits.map((credit) => Object.fromEntries(Object.entries(credit).filter(([key]) => key !== "creator")));
  return JSON.parse(JSON.stringify({ ...build, archetype: build.archetype.id, credits })) as Record<string, unknown>;
}

/** The validator's context for a shared build: the archetypes, and nothing else to link to. */
export function sharedContext(file: ArchetypeFile): Context {
  return {
    archetypeIds: new Set(file.archetypes.map((a) => a.id)),
    creatorIds: new Set(),
    buildIds: new Set(),
    faceIds: new Set(),
    specializations: new Map(file.archetypes.flatMap((a) => (a.specializations ? [[a.id, new Set(a.specializations.map((s) => s.name))]] : []))),
  };
}

/** True when "PLACEHOLDER" stands anywhere in the value: a draft lets it through the validator (FORMAT §Placeholder). */
const hasPlaceholder = (v: unknown): boolean =>
  v === "PLACEHOLDER" || (Array.isArray(v) ? v.some(hasPlaceholder) : isObj(v) && Object.values(v).some(hasPlaceholder));

/**
 * The document as a build, or null when it isn't a valid shared build. A player's build has no badge and isn't
 * checked in game, whatever the document says: only Chime sets those (D-30), and the page would word them as fact.
 */
export function asSharedBuild(data: unknown, file: ArchetypeFile): LoadedBuild | null {
  if (!isObj(data) || data.status !== "draft" || "sample" in data || hasPlaceholder(data)) return null;
  if (validateBuild("shared", data, sharedContext(file)).length > 0) return null;
  const build = data as unknown as Build;
  const archetype = file.archetypes.find((a) => a.id === build.archetype);
  if (!archetype) return null;
  return {
    ...build,
    badge: null,
    // A shared build shows the ProBuilds mannequin (D-100 (1)): a player's document can't point at our pictures.
    picture: null,
    versionTag: { ...build.versionTag, verifiedOn: null, verifiedBy: null },
    archetype,
    credits: build.credits.map((c) => ({ ...c, creator: null })),
  };
}

/** Loads /b/<id>'s build through the shared_build function; null for a bad id, no build, no client or a failure. */
export async function fetchSharedBuild(
  id: string,
  { config, archetypeFile, fetch: fetchImpl = fetch }: { config: SupabaseConfig | null; archetypeFile: ArchetypeFile; fetch?: typeof fetch },
): Promise<LoadedBuild | null> {
  if (!config || !isShareId(id)) return null;
  try {
    const data = await rpc(config, "shared_build", { share_id: id }, { method: "GET" }, fetchImpl);
    return asSharedBuild(data, archetypeFile);
  } catch (error) {
    // TODO(Chime): Figma draws no "couldn't load" state for a shared link; a failure shows "This build link doesn't work"
    console.warn("Shared build didn't load", error);
    return null;
  }
}

/** The Build page's view for a shared build (Figma 439:8847): its link is probuilds.club/b/<id>. */
export function sharedBuildPageView(build: LoadedBuild, sources: ArchetypeFile["sources"], id: string, currentSeason?: number): BuildPageView {
  const view = buildPageView(build, sources, currentSeason);
  return {
    ...view,
    badge: null,
    draft: false,
    sampleLabel: null,
    shared: { tag: SHARED.tag, line: SHARED.line, makeYourOwn: SHARED.makeYourOwn },
    credit: view.credit ? `${view.credit} · ${SHARED.credit}` : SHARED.credit.charAt(0).toUpperCase() + SHARED.credit.slice(1),
    uncheckedNote: SHARED.note,
    share: { ...view.share, overview: { ...view.share.overview, badge: null, link: `${SITE_DOMAIN}/b/${id}` } },
  };
}
