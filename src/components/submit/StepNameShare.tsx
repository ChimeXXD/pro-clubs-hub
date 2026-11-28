"use client";

import { useEffect, useRef, useState } from "react";
import { OverviewCard } from "@/components/builds/ShareCards";
import { Spinner } from "@/components/builds/ShareSheet";
import { Icon } from "@/components/shell/Icon";
import { ButtonLabel, buttonClass } from "@/components/ui/Button";
import type { ShareCardsView } from "@/lib/share-cards";
import { CARD } from "@/lib/share-images";
import type { SubmitDraft } from "@/lib/submit/editor";
import { letterLimit } from "@/lib/submit/motion";
import { StepLine } from "./controls";
import { LetterLimit } from "./LetterLimit";
import { ProFace } from "./ProFace";

// Step 4 of 4, "Name it and share" (Figma 401:3616 / 418:6420 / 418:6599; picture added 412:2989 / 418:6778 /
// 418:6957; send failed 441:8928 / 441:9162 / 441:9380; D-86, D-89). The build's name and the player's name for the
// credit, "Your Pro's face" (a screenshot that stays in this browser and goes on their card only, D-89 (4)), then
// "Your card" (the share story card, D-89 (3)), Share card and Copy link (D-86: shared at once, "Not yet checked in
// game"), and "Want it listed on ProBuilds?" with Send for listing (D-99 (1)). A send that doesn't go through shows
// Figma's red row and the button becomes Try again, keeping everything typed (D-100 (3)).
// Tablet: name, credit and face on the left (369 px), the card and its buttons on the right (353), 32 apart;
// desktop 664 and 440, 96 apart.
const FIELD = "type-body h-13 w-full rounded-md border border-input-border bg-input-bg px-4 text-text-primary placeholder:text-text-muted focus:border-2 focus:border-input-border-focused focus:px-[15px] focus:outline-none";
const NAME_MAX = 40;

export function StepNameShare({
  draft,
  cards,
  picture,
  sending,
  failed,
  onChange,
  onPicture,
  onShare,
  onCopy,
  onSend,
}: {
  draft: SubmitDraft;
  cards: ShareCardsView;
  picture: string | null;
  sending: boolean;
  failed: boolean;
  onChange: (next: Partial<SubmitDraft>) => void;
  onPicture: (file: File | null) => void;
  onShare: (from: HTMLElement) => void;
  onCopy: () => void;
  onSend: () => void;
}) {
  return (
    <div className="flex flex-col tablet:flex-row tablet:items-start tablet:gap-8 desktop:gap-24">
      <div className="flex flex-col tablet:w-92.25 tablet:shrink-0 desktop:w-166">
        <StepLine label="Submit a build" step={4} />
        <h1 tabIndex={-1} className="type-h1 pt-3 text-text-primary outline-none">Name it and share</h1>
        <div className="flex flex-col gap-2 pt-6">
          <label htmlFor="build-name" className="type-label text-text-primary">
            Build name
          </label>
          {/* Letter limit (#29): the ring sits in the field's right edge, so the text stops short of it. */}
          <span className="relative flex">
            <input
              id="build-name"
              className={`${FIELD} pr-14 focus:pr-[55px]`}
              placeholder="Name your build"
              maxLength={NAME_MAX}
              aria-describedby={letterLimit(draft.title.length, NAME_MAX).warn ? "build-name-left" : undefined}
              value={draft.title}
              onChange={(e) => onChange({ title: e.target.value })}
            />
            <LetterLimit length={draft.title.length} max={NAME_MAX} id="build-name-left" />
          </span>
        </div>
        <div className="flex flex-col gap-2 pt-4.5">
          <label htmlFor="build-credit" className="type-label text-text-primary">
            Your name for the credit
          </label>
          <input
            id="build-credit"
            className={FIELD}
            placeholder="As you want it shown"
            maxLength={40}
            autoComplete="nickname"
            aria-describedby="build-credit-note"
            value={draft.credit}
            onChange={(e) => onChange({ credit: e.target.value })}
          />
          <p id="build-credit-note" className="type-caption text-text-muted">
            Shown on the card as “Made by …”.
          </p>
        </div>
        <ProFace picture={picture} onPicture={onPicture} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col pt-7 tablet:pt-0">
        <h2 className="type-h3 pb-3 text-text-primary">Your card</h2>
        <YourCard card={cards.overview} />
        <div className="flex flex-col gap-3 pt-7">
          <button type="button" data-testid="share-card" aria-haspopup="dialog" className={buttonClass("primary", "w-full")} onClick={(e) => onShare(e.currentTarget)}>
            <ButtonLabel icon="share" iconSide="left">
              Share card
            </ButtonLabel>
          </button>
          <button type="button" data-testid="copy-link" className={buttonClass("secondary", "w-full hover:bg-action-hovered")} onClick={onCopy}>
            <ButtonLabel icon="copy" iconSide="left">
              Copy link
            </ButtonLabel>
          </button>
        </div>
        <section aria-labelledby="listing" className="mt-6 flex flex-col gap-2.5 rounded-lg bg-bg-surface p-4">
          <h2 id="listing" className="type-label text-text-primary">
            Want it listed on ProBuilds?
          </h2>
          <p className="type-caption text-text-secondary">Chime plays it in game first. Until then it&apos;s yours to share, marked “Not yet checked in game”.</p>
          {failed && (
            <p role="alert" data-testid="send-failed" className="type-caption flex items-center gap-2.5 rounded-md bg-status-danger-bg py-3 pr-3.5 pl-3 text-text-primary">
              <span className="flex text-status-danger">
                <Icon name="error" size={20} />
              </span>
              <span className="min-w-0 flex-1">Couldn&apos;t send. Check your connection and try again. Your build is still here.</span>
            </p>
          )}
          <button
            type="button"
            data-testid="submit-listing"
            aria-busy={sending || undefined}
            disabled={sending}
            className={buttonClass("secondary", "w-full border-transparent hover:bg-action-hovered")}
            onClick={onSend}
          >
            {failed ? "Try again" : "Send for listing"}
            {sending ? <Spinner /> : <Icon name="arrow-right" size={20} />}
          </button>
        </section>
      </div>
    </div>
  );
}

/** The overview story card at the column's width (353 px on phone and tablet, 440 on desktop), in a 20 px frame. */
function YourCard({ card }: { card: ShareCardsView["overview"] }) {
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
      className="relative w-full overflow-hidden rounded-[20px] bg-bg-page"
      style={{ height: CARD.height * scale }}
    >
      <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${scale})` }}>
        <OverviewCard card={card} page={null} />
      </div>
      {/* Figma's 1 px border/strong stroke sits inside the frame, over the card, which fills the whole frame. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-border-strong ring-inset" />
    </div>
  );
}
