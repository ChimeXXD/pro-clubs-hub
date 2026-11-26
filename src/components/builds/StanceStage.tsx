"use client";

import { type CSSProperties, type PointerEvent, useRef, useState } from "react";
import { Icon } from "@/components/shell/Icon";
import type { ArchetypeView } from "@/lib/builds";
import { StanceCard } from "./StanceCard";

// The swipeable Stance cards (D-57, D-60). The selected card is centred; its neighbours sit either side, scaled
// down, blurred and at 60%, as Figma's peeking instances do (D-56). Phone: a 380 px band, 252 px card 16 px from
// the top, neighbours 200 px wide 246.5 px off centre, cut by the screen edge. Tablet: a 350 px column, 280 px
// card, 180 px neighbours behind it 85 px off centre. Desktop: 560 px, 392 px card, 230 px neighbours 165 px off.
// A horizontal drag follows the finger and moves one card on release; a tap on a neighbour picks it. Tablet and
// desktop add previous and next buttons with "12 of 13". Cards move by transform and opacity only, 250 ms ease-out;
// reduced motion keeps only the fade.
const STAGE =
  "relative h-[380px] w-full touch-pan-y overflow-hidden select-none [--card-top:16px] [--card-w:252px] [--peek-s:0.7937] [--peek-x:246.5px] " +
  "tablet:h-[386.67px] tablet:w-[350px] tablet:overflow-visible tablet:[--card-top:0px] tablet:[--card-w:280px] tablet:[--peek-s:0.6429] tablet:[--peek-x:85px] " +
  "desktop:h-[541.33px] desktop:w-[560px] desktop:[--card-w:392px] desktop:[--peek-s:0.5867] desktop:[--peek-x:165px]";
const ARROW =
  "flex size-13 items-center justify-center rounded-sm border-[1.5px] border-border-strong text-text-primary disabled:text-action-disabled";

const SWIPE = 50; // px past which a release moves one card

export function StanceStage({
  archetypes,
  selected,
  onSelect,
}: {
  archetypes: ArchetypeView[];
  selected: number;
  onSelect: (index: number) => void;
}) {
  const [drag, setDrag] = useState(0);
  const start = useRef<{ x: number; id: number } | null>(null);
  const moved = useRef(false);
  const dragged = useRef(0); // the drag as last set, read on release (state can lag a frame behind)
  const current = archetypes[selected];
  const go = (i: number) => {
    if (i >= 0 && i < archetypes.length) onSelect(i);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || start.current) return; // one finger drives the swipe
    start.current = { x: e.clientX, id: e.pointerId };
    moved.current = false;
    dragged.current = 0;
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!start.current || start.current.id !== e.pointerId) return;
    const dx = e.clientX - start.current.x;
    if (!moved.current && Math.abs(dx) > 6) {
      moved.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    // No card past the ends: the drag gives a little and stops (a third of the finger's travel).
    const atEnd = (dx > 0 && selected === 0) || (dx < 0 && selected === archetypes.length - 1);
    if (!moved.current) return;
    dragged.current = atEnd ? dx / 3 : dx;
    setDrag(dragged.current);
  };
  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    if (!start.current || start.current.id !== e.pointerId) return;
    if (dragged.current <= -SWIPE) go(selected + 1);
    else if (dragged.current >= SWIPE) go(selected - 1);
    start.current = null;
    dragged.current = 0;
    setDrag(0);
  };
  // A press that leaves the stage before it became a drag (so before capture) ends there, or the next hover would drag.
  const onPointerLeave = (e: PointerEvent<HTMLDivElement>) => {
    if (!moved.current) onPointerEnd(e);
  };

  return (
    <div className="flex shrink-0 flex-col items-center">
      <div
        data-testid="stance-stage"
        className={STAGE}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onPointerLeave={onPointerLeave}
      >
        {archetypes.map((a, i) => {
          const offset = i - selected;
          if (Math.abs(offset) > 2) return null;
          const centre = offset === 0;
          const peek = Math.abs(offset) === 1;
          const style = {
            transform: `translateX(calc(-50% + ${offset} * var(--peek-x) + ${drag}px)) scale(${centre ? 1 : "var(--peek-s)"})`,
          } as CSSProperties;
          return (
            <div
              key={a.id}
              data-testid={`stance-card-${a.id}`}
              aria-hidden={centre ? undefined : true}
              onClick={peek ? () => !moved.current && go(i) : undefined}
              style={style}
              className={`absolute top-(--card-top) left-1/2 aspect-[252/348] w-(--card-w) ${
                drag === 0 ? "transition-[transform,opacity] duration-250 ease-out motion-reduce:transition-opacity" : ""
              } ${centre ? "z-2" : peek ? "z-1 cursor-pointer opacity-60 blur-[1.5px]" : "pointer-events-none opacity-0"}`}
            >
              <StanceCard archetype={a} eager={centre} />
            </div>
          );
        })}
        {current && (
          <p aria-live="polite" className="sr-only">
            {`${current.name}, ${current.groupLabel}`}
          </p>
        )}
      </div>
      <div className="mt-5 hidden items-center gap-[30px] tablet:flex desktop:mt-6 desktop:gap-[38px]">
        <button type="button" aria-label="Previous archetype" disabled={selected === 0} onClick={() => go(selected - 1)} className={ARROW}>
          <Icon name="chevron-left" size={24} />
        </button>
        <span className="type-caption text-text-secondary">{current ? `${current.place} of ${current.total}` : ""}</span>
        <button
          type="button"
          aria-label="Next archetype"
          disabled={selected === archetypes.length - 1}
          onClick={() => go(selected + 1)}
          className={ARROW}
        >
          <Icon name="chevron-right" size={24} />
        </button>
      </div>
    </div>
  );
}
