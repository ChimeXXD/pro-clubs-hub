// The face's link preview (Figma 430:7306, "Link preview · face · 1200×630", drawn at 600×315; D-97 (1)): what a chat
// shows when a face page's link is pasted. Made at build time with next/og (no new package); see the route at
// src/app/faces/[slug]/og.png/. Colours come from the Figma variables snapshot (docs/design/figma-variables.json, the
// source of tokens.css), dark mode, since an image can't read CSS variables.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { LoadedFace } from "./content/load.ts";
import { versionWording } from "./content/version.ts";
import { faceRecipe, plural } from "./face-page.ts";
import { KIND_LABEL } from "./faces.ts";
import { SITE_DOMAIN } from "./site.ts";

/** Twice the frame's 600 × 315, the size chats ask for. */
export const OG_SIZE = { width: 1200, height: 630 } as const;

export interface FaceOgView {
  title: string;
  tag: "Face";
  /** "Footballer · 18 steps · matching build" (430:7316). */
  facts: string;
  domain: string;
  versionTag: string;
  /**
   * The face's picture under public/ as a JPEG or PNG, or null for none. next/og's renderer can't draw WebP, the
   * format pictures are kept in (FORMAT §Face recipe), so the preview uses a .jpg or .png of the same name beside it.
   */
  picture: string | null;
  alt: string;
}

/** A .jpg or .png beside the face's first picture, when one exists under public/ (see `picture`). */
function drawablePicture(face: LoadedFace, exists: (file: string) => boolean): string | null {
  const file = face.screenshots[0]?.file;
  if (!file) return null;
  const stem = file.replace(/\.[a-z]+$/i, "");
  return [file, `${stem}.jpg`, `${stem}.png`].find((f) => /\.(?:jpe?g|png)$/i.test(f) && exists(f)) ?? null;
}

export function faceOgView(face: LoadedFace, exists: (file: string) => boolean = () => false): FaceOgView {
  const facts = `${KIND_LABEL[face.subject.kind]} · ${plural(faceRecipe(face).total, "step")} · matching build`;
  return {
    title: face.title,
    tag: "Face",
    facts,
    domain: SITE_DOMAIN,
    versionTag: versionWording(face.versionTag).tag,
    picture: drawablePicture(face, exists),
    alt: `${face.title}: ${facts}`,
  };
}

type Snapshot = { theme: Record<string, { dark: string; light: string }> };
let snapshot: Snapshot | undefined;

/** A colour token's dark value, as tokens.css has it (the snapshot is its source, D-101). */
export function tokenColour(name: string): string {
  snapshot ??= JSON.parse(readFileSync(join(process.cwd(), "docs", "design", "figma-variables.json"), "utf8")) as Snapshot;
  const value = snapshot.theme[name]?.dark;
  if (!value) throw new Error(`no colour token ${name} in the Figma variables snapshot`);
  return value;
}
