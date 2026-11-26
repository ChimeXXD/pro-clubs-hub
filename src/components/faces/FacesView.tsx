"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/shell/Icon";
import { ButtonLabel, buttonClass } from "@/components/ui/Button";
import { FilterChip } from "@/components/ui/FilterChip";
import {
  FACE_FILTERS,
  type FaceCardView,
  type FaceFilter,
  filterCounts,
  REQUEST_FACE_HREF,
  SUBMIT_HREF,
  visibleFaces,
} from "@/lib/faces";
import { FaceCard } from "./FaceCard";
import { FaceSearch } from "./FaceSearch";

// Figma "Faces library" (phone 333:1139, tablet 345:1310, desktop 345:1391; D-70 option A, the poster grid): the
// header, search and kind chips (D-68), the faces two / three / six across with the dashed "Missing a face?" tile
// last, then "Who should we make next?" (D-97 (5)). Phone stacks search over chips (the chips scroll sideways to
// the screen's edge); tablet and desktop put the chips left and the search right on one row. Nothing matching shows
// the no-results card instead of the grid and panel (372:1853 / 427:9875 / 427:9960). Figma's demo note about its
// stand-in pictures is left out: the product shows only our own captures (D-68 (4)).
// Content: 16 / 20 / 32 px on phone (top / gaps / bottom), 24 / 24 / 64 on tablet and desktop.
export function FacesView({ cards }: { cards: FaceCardView[] }) {
  const [filter, setFilter] = useState<FaceFilter>("all");
  const [query, setQuery] = useState("");
  const counts = filterCounts(cards, query);
  const shown = visibleFaces(cards, filter, query);
  // 1-based place in the full list, so a test ID names the same face under every filter.
  const place = new Map(cards.map((c, i) => [c.id, i + 1]));
  // TODO(Chime): nothing tells a screen reader that the results changed after a search or a chip. A polite live
  // region needs wording (for example how many faces show) that no design or decision gives yet.

  return (
    <main className="flex flex-col gap-5 px-5 pt-4 pb-8 tablet:gap-6 tablet:px-10 tablet:pt-6 tablet:pb-16 desktop:mx-auto desktop:w-full desktop:max-w-(--layout-content-max) desktop:px-0">
      <header className="flex flex-col gap-2">
        <h1 className="type-h1 text-text-primary">Faces</h1>
        <p className="type-body text-text-secondary tablet:max-w-[600px]">
          Lookalike and era faces, each a step-by-step recipe with a build to match.
        </p>
      </header>
      <div className="flex flex-col gap-5 tablet:flex-row-reverse tablet:items-center tablet:gap-6">
        <FaceSearch value={query} onChange={setQuery} />
        {/* A sideways-scrolling row also clips up and down: 4 px of padding (cancelled by -4 px margin) keeps each
            chip's 44 px tap area and its focus ring (2 px outline, 2 px offset); 4 px of scroll padding keeps the ring
            in view when focus scrolls a chip to the row's edge. On phone it runs to the screen's edges, as Figma's
            chips run off the frame. */}
        <div className="-mx-5 -my-1 flex scroll-px-1 gap-2 overflow-x-auto px-5 py-1 tablet:-mx-1 tablet:min-w-0 tablet:flex-1 tablet:px-1">
          {FACE_FILTERS.map((f, i) => (
            <FilterChip
              key={f.value}
              testId={`filter-chip-${i + 1}`}
              label={f.label}
              count={counts[f.value]}
              pressed={filter === f.value}
              onPress={() => setFilter(f.value)}
            />
          ))}
        </div>
      </div>
      {shown.length > 0 ? (
        <div className="flex flex-col gap-4 tablet:gap-6">
          <ul data-testid="face-grid" className="grid grid-cols-2 gap-x-3 gap-y-4 tablet:grid-cols-3 tablet:gap-x-6 tablet:gap-y-8 desktop:grid-cols-6">
            {shown.map((card) => (
              <FaceCard key={card.id} card={card} place={place.get(card.id) ?? 0} />
            ))}
            <li>
              {/* Figma "Suggest a face" (341:1316): the picture's size, a dashed border/strong outline, lime plus. */}
              <Link
                href={SUBMIT_HREF}
                data-testid="missing-face-tile"
                className="flex aspect-[4/5] flex-col justify-end gap-1.5 rounded-md border border-dashed border-border-strong p-4"
              >
                <span className="flex text-accent-text">
                  <Icon name="plus" size={24} />
                </span>
                <span className="type-label text-text-primary">Missing a face?</span>
                <span className="type-caption text-text-muted">Suggest one on Submit.</span>
              </Link>
            </li>
          </ul>
          <RequestPanel />
        </div>
      ) : (
        <NoFaces />
      )}
    </main>
  );
}

/** Figma "Request a face panel" (427:10078): stacked on phone; text and a 240 px button in one row from tablet up. */
function RequestPanel() {
  return (
    <section aria-labelledby="request-face-title" className="flex flex-col gap-3.5 rounded-lg bg-bg-surface p-5 tablet:flex-row tablet:items-center tablet:gap-6">
      <div className="flex flex-col gap-1 tablet:min-w-0 tablet:flex-1">
        <h2 id="request-face-title" className="type-h4 text-text-primary">
          Who should we make next?
        </h2>
        <p className="type-body text-text-secondary">Ask for a face, or vote for one someone already asked for.</p>
      </div>
      <Link href={REQUEST_FACE_HREF} data-testid="request-face-link" className={buttonClass("secondary", "w-full shrink-0 tablet:w-60")}>
        <ButtonLabel icon="arrow-right">Request a face</ButtonLabel>
      </Link>
    </section>
  );
}

/** Figma "Empty" (372:1935): the face icon, "No faces here yet." and Request a face (Medium), centred. */
function NoFaces() {
  return (
    <div data-testid="faces-empty" className="flex flex-col items-center gap-2.5 rounded-lg bg-bg-surface px-6 py-10 text-center">
      <span className="flex text-text-muted">
        <Icon name="faces" size={40} />
      </span>
      <h2 className="type-h3 text-text-primary">No faces here yet.</h2>
      <p className="type-body text-balance text-text-secondary">Ask for it, and vote for what we make next.</p>
      <Link href={REQUEST_FACE_HREF} className={buttonClass("secondary", "", "medium")}>
        <ButtonLabel icon="arrow-right">Request a face</ButtonLabel>
      </Link>
    </div>
  );
}
