"use client";

import type { ReactNode } from "react";

// The Share build card that turns over (D-117, D-118; Figma "Build · share card flips", front 549:11147 / 549:11841 /
// 549:12532, back 549:13222 / 549:13916 / 549:14607): the Overview on the front, the Attributes on the back. A tap,
// click, Enter or Space turns it over: rotateY 180° over 400 ms, ease-out. Reduced motion swaps the sides with a fade.
// Both faces stay in the page, so Save images still makes both images and screen readers read both. Sizes are the
// 360 × 640 cards scaled by --s: 0.625 on phone (225 × 400), 0.8625 from tablet (311 × 552), 0.75 on screens under
// 830 px tall (270 × 480), where the larger card would push the dialog off the screen.
export function FlipCard({ front, back, side, onFlip }: { front: ReactNode; back: ReactNode; side: 0 | 1; onFlip: () => void }) {
  const flipped = side === 1;
  return (
    // The faces are figures screen readers read in full; a transparent button over them turns the card (a button's own
    // contents aren't read out, so it can't hold the cards).
    <div
      data-testid="share-cards"
      className="relative mx-auto h-[calc(640px*var(--s))] w-[calc(360px*var(--s))] shrink-0 [--s:0.625] [perspective:1400px] tablet:[--s:0.8625] tablet:short:[--s:0.75]"
    >
      <div
        className={`relative size-full transition-transform duration-400 ease-out [transform-style:preserve-3d] motion-reduce:transform-none motion-reduce:transition-none ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <Face label="Share card 1 of 2" shown={!flipped}>
          {front}
        </Face>
        <Face label="Share card 2 of 2" shown={flipped} back>
          {back}
        </Face>
      </div>
      <button
        type="button"
        aria-pressed={flipped}
        aria-label={`Card ${side + 1} of 2. Tap to flip`}
        onClick={onFlip}
        className="absolute inset-0 cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
      />
    </div>
  );
}

function Face({ label, shown, back = false, children }: { label: string; shown: boolean; back?: boolean; children: ReactNode }) {
  return (
    <figure
      aria-label={label}
      className={`absolute inset-0 m-0 overflow-hidden rounded-md shadow-[0_8px_24px_0_var(--color-system-backdrop)] [backface-visibility:hidden] motion-reduce:transition-opacity motion-reduce:duration-200 ${
        back ? "[transform:rotateY(180deg)] motion-reduce:transform-none" : ""
      } ${shown ? "" : "motion-reduce:opacity-0"}`}
    >
      <div className="absolute top-0 left-0 origin-top-left [transform:scale(var(--s))]">{children}</div>
    </figure>
  );
}
