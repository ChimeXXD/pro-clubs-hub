"use client";

import { type MouseEvent, useEffect, useRef, useState } from "react";
import { OverviewCard } from "@/components/builds/ShareCards";
import type { ShareCardsView } from "@/lib/share-cards";
import { CARD } from "@/lib/share-images";

/**
 * "Your card" (Figma 401:3616): the overview story card at the column's width (353 px on phone and tablet, 440 on
 * desktop), in a 20 px frame. Tapping it opens the share sheet, as Share card does, and lifts the card into it (Fan
 * cards, #2: liftCard.ts); a transparent button over the card takes the tap, so screen readers still read the card.
 * That button is for the pointer only (out of the tab order, hidden from screen readers): the Share card button just
 * under the card is the same action for the keyboard, so there aren't two "Share card" stops in a row.
 * On a computer it rises 2 px under the pointer, and it presses in to 98 % (--dur-fast, ease-out) so the tap is felt.
 */
export function YourCard({ card, onOpen }: { card: ShareCardsView["overview"]; onOpen: (button: HTMLElement, card: HTMLElement, e: MouseEvent) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(353 / CARD.width);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / CARD.width);
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={box}
      data-testid="your-card"
      className="relative w-full overflow-hidden rounded-[20px] bg-bg-page transition-transform duration-(--dur-fast) ease-(--ease-out) has-[>button:active]:scale-[0.98] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:has-[>button:hover]:-translate-y-0.5"
      style={{ height: CARD.height * scale }}
    >
      <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${scale})` }}>
        <OverviewCard card={card} page={null} />
      </div>
      {/* Figma's 1 px border/strong stroke sits inside the frame, over the card, which fills the whole frame. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-border-strong ring-inset" />
      <button
        type="button"
        data-testid="your-card-open"
        tabIndex={-1}
        aria-hidden="true"
        onClick={(e) => box.current && onOpen(e.currentTarget, box.current, e)}
        className="absolute inset-0 cursor-pointer rounded-[20px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring"
      />
    </div>
  );
}
