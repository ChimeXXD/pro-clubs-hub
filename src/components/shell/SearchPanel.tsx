"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { resultsLine, type searchResults } from "@/lib/search";

// Command palette (motion-bookmarks #26), desktop only: what the top bar's search finds, in a panel 8 px under the
// field (DESIGN.md: menus open 8 px under their trigger on a computer), grouped Faces and Builds with their counts as
// the Search page groups them. One highlight shape marks the row in hand (DESIGN.md: "one shape that springs from row
// to row"): ↑ and ↓ move it at once (nothing animates on keyboard input: a palette is used many times a day), a
// pointer glides it over --dur-fast. The panel itself appears with the typing, so it doesn't animate either.
// TODO(Chime): no frame draws this panel; it is the Search page's groups as rows (title and kind or line), for your OK.
export interface PanelItem {
  href: string;
  title: string;
  meta: string;
}

export function panelItems(results: ReturnType<typeof searchResults>): { faces: PanelItem[]; builds: PanelItem[] } {
  return {
    faces: results.faces.map((f) => ({ href: f.href, title: f.title, meta: f.kindLabel })),
    builds: results.builds.map((b) => ({ href: b.href, title: b.title, meta: b.line })),
  };
}

export function SearchPanel({
  query,
  groups,
  active,
  glide,
  onHover,
  onPick,
}: {
  query: string;
  groups: { faces: PanelItem[]; builds: PanelItem[] };
  active: number;
  /** The highlight moved by a pointer (it glides) rather than a key (it jumps). */
  glide: boolean;
  onHover: (index: number) => void;
  /** A row was clicked: the field closes even when the row is the page already open. */
  onPick: () => void;
}) {
  const list = useRef<HTMLDivElement>(null);
  const shape = useRef<HTMLDivElement>(null);
  const total = groups.faces.length + groups.builds.length;

  useLayoutEffect(() => {
    const row = list.current?.querySelector<HTMLElement>(`[data-row="${active}"]`);
    const el = shape.current;
    if (!el) return;
    el.style.visibility = row ? "" : "hidden";
    if (!row) return;
    el.style.transitionDuration = glide ? "" : "0ms";
    el.style.transform = `translateY(${row.offsetTop}px)`;
    el.style.height = `${row.offsetHeight}px`;
    // A long list scrolls inside the panel: keep the row a key moved to in view.
    if (!glide) row.scrollIntoView({ block: "nearest" });
    // A new query can change the rows (and the group headers above them) while the row in hand stays 0.
  }, [active, glide, total, query]);

  let n = -1;
  const group = (id: string, title: string, items: PanelItem[]) =>
    items.length > 0 && (
      <div role="group" aria-labelledby={`${id}-title`} className="flex flex-col">
        <p id={`${id}-title`} className="type-caption flex gap-1.5 px-3 pt-2 pb-1 text-text-muted">
          <span className="text-text-secondary">{title}</span>
          {items.length}
        </p>
        {items.map((item) => {
          const i = ++n;
          return (
            <Link
              key={item.href}
              id={`top-search-option-${i}`}
              href={item.href}
              role="option"
              aria-selected={i === active}
              data-row={i}
              tabIndex={-1}
              onClick={onPick}
              onPointerMove={() => i !== active && onHover(i)}
              className="relative flex min-h-13 flex-col justify-center rounded-sm px-3 py-1.5"
            >
              <span className="type-label text-text-primary">{item.title}</span>
              <span className="type-caption text-text-muted">{item.meta}</span>
            </Link>
          );
        })}
      </div>
    );

  return (
    <div
      data-testid="top-search-panel"
      className="absolute top-[calc(100%+10px)] right-0 z-20 w-[360px] rounded-md border border-border-subtle bg-bg-raised p-2 shadow-elevation-3"
    >
      <p role="status" className="type-caption px-3 pt-1 pb-1 text-text-muted">
        {resultsLine(groups, query)}
      </p>
      {total > 0 && (
        <div ref={list} id="top-search-results" role="listbox" aria-label="Search results" className="relative flex max-h-[min(480px,calc(100dvh-160px))] flex-col overflow-y-auto overscroll-contain">
          <div
            ref={shape}
            data-testid="top-search-highlight"
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 rounded-sm bg-action-selected transition-transform duration-(--dur-fast) ease-(--ease-out) motion-reduce:transition-none"
          />
          {group("top-search-faces", "Faces", groups.faces)}
          {group("top-search-builds", "Builds", groups.builds)}
        </div>
      )}
    </div>
  );
}
