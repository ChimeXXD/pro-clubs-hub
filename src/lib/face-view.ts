// Everything the face page shows around its steps (Figma 353:1410 / 427:8649 / 427:8767; D-71, D-74): the picture
// with the 360° badge, kind and plain title (D-69), the version tag (rule 4), the credit line (rule 5), Figma's sample
// note, the limits callout, the tutorial facade (rule 5) and the matching build for the finished state (D-79).
import type { LoadedFace } from "./content/load.ts";
import { versionWording } from "./content/version.ts";
import { type Recipe, faceRecipe } from "./face-page.ts";
import { KIND_LABEL } from "./faces.ts";
import { type PairedBuildView, pairedBuildView } from "./paired-build.ts";

/** Figma 353:1442: the sample's marker in place of the Draft tag (D-113). */
export const SAMPLE_NOTE = "Sample recipe: values are placeholders until Chime records this face.";
/** UI-BRIEF §5, as the Limits callout draws it. */
export const LIMIT_PREFIX = "The game can't do this exactly: ";

export interface FacePageView {
  slug: string;
  title: string;
  kindLabel: string;
  picture: { src: string; alt: string } | null;
  /** The turntable's frames (D-35), or null. */
  turn: { folder: string; frames: number } | null;
  /** The "360°" badge: on a face you can turn, and on Figma's samples, which draw it. */
  rotate: boolean;
  versionTag: string;
  checked: boolean;
  olderSeason: string | null;
  /** "Made by Chime in game"; Figma's other samples weren't made in game: "Made by — (sample)". */
  madeBy: string;
  tutorial: { label: string; url: string | null } | null;
  sampleNote: string | null;
  limits: string[];
  embed: { videoId: string; title: string; channelLine: string } | null;
  recipe: Recipe;
  paired: PairedBuildView;
  storage: { id: string; version: number };
}

export function facePageView(face: LoadedFace, pictureExists: (file: string) => boolean): FacePageView {
  const version = versionWording(face.versionTag);
  const sample = face.sample !== undefined;
  const shot = face.screenshots[0];
  const makers = face.credits.filter((c) => c.role === "made-by").map((c) => c.name);
  // "— (sample)" is the library audit's maker for a sample nobody made (item 18); it was never made in game.
  const inGame = !makers.every((name) => name.endsWith("(sample)"));
  const tutorial = face.credits.find((c) => c.role === "tutorial");
  const embed = face.embeds[0];
  return {
    slug: face.slug,
    title: face.title,
    kindLabel: KIND_LABEL[face.subject.kind],
    picture: shot && pictureExists(shot.file) ? { src: `/${shot.file}`, alt: shot.alt } : null,
    turn: face.turn ? { folder: face.turn.folder, frames: face.turn.frames } : null,
    rotate: face.turn !== null || sample,
    versionTag: version.tag,
    checked: version.checked,
    olderSeason: version.olderSeason,
    madeBy: `Made by ${makers.join(" and ")}${inGame ? " in game" : ""}`,
    tutorial: tutorial ? { label: `Tutorial by ${tutorial.name}`, url: tutorial.url } : null,
    sampleNote: face.sample?.recipe ? SAMPLE_NOTE : null,
    limits: face.limits.map((limit) => `${LIMIT_PREFIX}${limit}`),
    embed: embed ? { videoId: embed.videoId, title: embed.title, channelLine: `${embed.channel} · Tap to play` } : null,
    recipe: faceRecipe(face),
    paired: pairedBuildView(face.pairedBuild, { sample }),
    storage: { id: face.id, version: face.version },
  };
}
