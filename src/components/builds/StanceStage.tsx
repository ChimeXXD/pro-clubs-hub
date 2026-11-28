"use client";

import type { CSSProperties } from "react";
import { Icon } from "@/components/shell/Icon";
import type { ArchetypeView } from "@/lib/builds";
import { StanceCard } from "./StanceCard";
import { slot, useSwipeDeck } from "./useSwipeDeck";

// The swipeable Stance cards (D-57, D-60). The selected card is centred; its neighbours sit either side, scaled
// down, blurred and at 60%, as Figma's peeking instances do (D-56). Phone: a 380 px band, 252 px card 16 px from
// the top, neighbours 200 px wide 246.5 px off centre, cut by the screen edge. Tablet: a 350 px column, 280 px
// card, 180 px neighbours behind it 85 px off centre. Desktop: 560 px, 392 px card, 230 px neighbours 165 px off.
// A horizontal drag is the Swipe deck (useSwipeDeck: only the front card moves, D-116; a flick throws it, the next
// card settles in with the settle spring); a tap on a neighbour picks it. Tablet and desktop add previous and next
// buttons with "12 of 13". A change from a tap, an arrow or the rail moves the cards by transform and opacity,
// 250 ms --ease-out, with no bounce (no force was applied); reduced motion keeps only the fade.
const STAGE =
  "relative h-[380px] w-full touch-pan-y overflow-hidden select-none [--card-top:16px] [--card-w:252px] [--peek-s:0.7937] [--peek-x:246.5px] " +
  "tablet:h-[386.67px] tablet:w-[350px] tablet:overflow-visible tablet:[--card-top:0px] tablet:[--card-w:280px] tablet:[--peek-s:0.6429] tablet:[--peek-x:85px] " +
  "desktop:h-[541.33px] desktop:w-[560px] desktop:[--card-w:392px] desktop:[--peek-s:0.5867] desktop:[--peek-x:165px]";
const ARROW =
  "flex size-13 items-center justify-center rounded-sm border-[1.5px] border-border-strong text-text-primary disabled:text-action-disabled";

export function StanceStage({
  archetypes,
  selected,
  onSelect,
}: {
  archetypes: ArchetypeView[];
  selected: number;
  onSelect: (index: number) => void;
}) {
  const current = archetypes[selected];
  const go = (i: number) => {
    if (i >= 0 && i < archetypes.length) onSelect(i);
  };
  const { stage, cardRef, settling, dragged, handlers } = useSwipeDeck({ selected, count: archetypes.length, onSelect: go });

  return (
    <div className="flex shrink-0 flex-col items-center">
      <div ref={stage} data-testid="stance-stage" className={STAGE} {...handlers}>
        {archetypes.map((a, i) => {
          const offset = i - selected;
          if (Math.abs(offset) > 2) return null;
          const centre = offset === 0;
          const peek = Math.abs(offset) === 1;
          const style = { transform: slot(offset) } as CSSProperties;
          // The card a throw brought to the front lands with the settle spring (one small overshoot).
          const settle = centre && settling === i;
          return (
            <div
              key={a.id}
              ref={cardRef(i)}
              data-testid={`stance-card-${a.id}`}
              aria-hidden={centre ? undefined : true}
              onClick={peek ? () => !dragged() && go(i) : undefined}
              style={style}
              className={`absolute top-(--card-top) left-1/2 aspect-[252/348] w-(--card-w) transition-[transform,opacity] motion-reduce:transition-opacity ${
                settle ? "duration-(--spring-settle-ms) ease-(--spring-settle)" : "duration-250 ease-(--ease-out)"
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
