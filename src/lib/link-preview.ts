// Link previews (Figma 319:885 "Link preview · 1200×630 (drawn at 600×315)", D-64 (3)): the picture a chat shows
// when a build page is pasted. One image per build page, made at build time (src/app/og/[image]/route.preview.tsx);
// shared builds (/b/<id>) all get one generic image, since a picture per unlisted build needs a server (D-99 (2)).
import { BADGE_LABEL, bodyLine } from "./archetype-page.ts";
import type { LoadedBuild } from "./content/load.ts";
import type { Badge } from "./content/types.ts";
import { versionWording } from "./content/version.ts";
import { SHARED } from "./shared-build.ts";
import { SITE_DOMAIN } from "./site.ts";

export interface LinkPreview {
  badge: (typeof BADGE_LABEL)[Badge] | null;
  title: string;
  lines: string[];
  /** "probuilds.club". */
  domain: string;
  versionTag: string | null;
}

/** Figma's image size: 1200 × 630, drawn at half size. */
export const PREVIEW_SIZE = { width: 1200, height: 630 } as const;

/** A build's preview, worded as Figma draws Meta Finisher's: name, archetype and positions, level and body. */
export function buildPreview(build: LoadedBuild): LinkPreview {
  return {
    badge: build.badge ? BADGE_LABEL[build.badge] : null,
    title: String(build.title),
    lines: [[build.archetype.name, ...build.positions].join(" · "), bodyLine(build)],
    domain: SITE_DOMAIN,
    versionTag: versionWording(build.versionTag).tag,
  };
}

/**
 * The generic image for shared builds. Figma draws none (question for Chime): this is 319:885's layout with the
 * shared page's own words (439:8847) and no version tag, which differs from link to link.
 */
export const SHARED_PREVIEW: LinkPreview = {
  badge: null,
  title: SHARED.tag,
  lines: [SHARED.line],
  domain: SITE_DOMAIN,
  versionTag: null,
};

/** "/og/build-finisher-meta-finisher.png": one file per build page. */
export const buildPreviewPath = (build: LoadedBuild) => `/og/build-${build.archetype.id}-${build.slug}.png`;
export const sharedPreviewPath = "/og/shared-build.png";

/**
 * The Open Graph and X card metadata for a page with this image, with the base address that makes its link absolute
 * (chat apps can't load a relative one). Set per page so the shared layout stays untouched.
 */
export function previewImages(path: string, alt: string, env: Record<string, string | undefined> = process.env) {
  return {
    metadataBase: new URL(siteOrigin(env)),
    openGraph: { images: [{ url: path, width: PREVIEW_SIZE.width, height: PREVIEW_SIZE.height, alt }] },
    twitter: { card: "summary_large_image" as const, images: [path] },
  };
}

/**
 * The address the images are served from, for absolute og:image links: a preview build's own deployment
 * (Cloudflare Pages names it in CF_PAGES_URL), else probuilds.club (D-53).
 */
export function siteOrigin(env: Record<string, string | undefined>): string {
  if (env.CF_PAGES_URL && env.CF_PAGES_BRANCH !== "main") return env.CF_PAGES_URL.replace(/\/+$/, "");
  return `https://${SITE_DOMAIN}`;
}
