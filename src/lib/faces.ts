// The Faces library's rules (`/faces`, Figma 333:1139 / 345:1310 / 345:1391; D-68, D-69, D-70, D-97 (5)): one card per
// face with its kind and plain title, chips by kind with counts, and a search by name. The chips count what the
// search leaves, so a name we don't have puts every chip at 0 (Figma 372:1853).
import type { LoadedFace } from "./content/load.ts";

// "athlete" is D-68's third kind. The content types gain it with Sharon's PR #9 (on hold); until then no face has it,
// so the Athletes chip counts 0.
export type FaceKind = "footballer" | "athlete" | "musician";
export type FaceFilter = "all" | FaceKind;

const KIND_LABEL = { footballer: "Footballer", athlete: "Athlete", musician: "Musician" } as const satisfies Record<FaceKind, string>;

export const FACE_FILTERS: readonly { value: FaceFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "footballer", label: "Footballers" },
  { value: "athlete", label: "Athletes" },
  { value: "musician", label: "Musicians" },
];

/** The dashed "Missing a face?" tile at the end of the grid (D-70). */
export const SUBMIT_HREF = "/submit";
// TODO(Chime): Figma's Request a face screen (402:3451) sits in the Faces section (its bottom nav is Page=Faces) but
// no route is named anywhere; /faces/request is assumed. The page waits on Supabase (D-84, D-96), so it 404s for now.
export const REQUEST_FACE_HREF = "/faces/request";

export interface FaceCardView {
  id: string;
  /** The face page, /faces/<slug>. */
  href: string;
  /** The plain title as the file writes it (D-69). */
  title: string;
  /** The subject's name, searched with the title but not shown. */
  name: string;
  kind: FaceKind;
  kindLabel: string;
  draft: boolean;
  /** Chime's own in-game capture (D-10), or null for the empty slot. */
  picture: { src: string; alt: string } | null;
}

/**
 * One face, worded for its card. The picture is the face's first screenshot, and only when `pictureExists` finds its
 * file (under public/): a missing file shows the empty slot rather than a broken image.
 */
export function faceCardView(face: LoadedFace, pictureExists: (file: string) => boolean): FaceCardView {
  const shot = face.screenshots[0];
  return {
    id: face.id,
    href: `/faces/${face.slug}`,
    title: face.title,
    name: face.subject.name,
    kind: face.subject.kind,
    kindLabel: KIND_LABEL[face.subject.kind],
    draft: face.status === "draft",
    picture: shot && pictureExists(shot.file) ? { src: `/${shot.file}`, alt: shot.alt } : null,
  };
}

/** Lower case, accents dropped ("Mbappé" finds "mbappe"). */
const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** True when every word typed is in the face's title or name. An empty search matches everything. */
export function matchesSearch(card: FaceCardView, query: string): boolean {
  const haystack = fold(`${card.title} ${card.name}`);
  return fold(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

/** Each chip's count: the faces of that kind the search leaves. */
export function filterCounts(cards: FaceCardView[], query: string): Record<FaceFilter, number> {
  const counts: Record<FaceFilter, number> = { all: 0, footballer: 0, athlete: 0, musician: 0 };
  for (const card of cards) {
    if (!matchesSearch(card, query)) continue;
    counts.all += 1;
    counts[card.kind] += 1;
  }
  return counts;
}

/** The cards to show: the chosen kind (or all) that match the search, in the content's order. */
export function visibleFaces(cards: FaceCardView[], filter: FaceFilter, query: string): FaceCardView[] {
  return cards.filter((c) => (filter === "all" || c.kind === filter) && matchesSearch(c, query));
}
