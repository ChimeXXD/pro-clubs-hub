"use client";

import type { ReactNode } from "react";
import { PILL_FILL, PILL_RING, usePill } from "./usePill";

/**
 * A row of filter chips with one lime pill that slides to the chip picked (Tab pill, motion-bookmarks #6): Faces
 * kinds, Changelog filters, Request a face kinds. `className` lays the row out (flex, gap, wrap); the pill's copy of
 * the row uses the same classes so its chips sit exactly over the real ones. `chips(pill)` draws the real chips:
 * with `pill` true they all draw unpicked and the pill draws the picked one; `ghosts` draws the copy (aria-hidden).
 */
export function PillRow({
  selected,
  className,
  chips,
  ghosts,
}: {
  selected: number | null;
  className: string;
  chips: (pill: boolean) => ReactNode;
  ghosts: ReactNode;
}) {
  const { row, ring, fill, ready } = usePill<HTMLDivElement>(selected);
  return (
    <div ref={row} className={`relative ${className}`}>
      {chips(ready)}
      {ready && (
        <>
          <div ref={ring} aria-hidden="true" className={PILL_RING} />
          <div ref={fill} aria-hidden="true" inert className={`${PILL_FILL} ${className}`}>
            {ghosts}
          </div>
        </>
      )}
    </div>
  );
}
