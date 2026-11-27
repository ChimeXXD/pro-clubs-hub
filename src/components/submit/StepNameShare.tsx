"use client";

import { useEffect, useRef, useState } from "react";
import { OverviewCard } from "@/components/builds/ShareCards";
import { Spinner } from "@/components/builds/ShareSheet";
import { Icon } from "@/components/shell/Icon";
import { ButtonLabel, buttonClass } from "@/components/ui/Button";
import type { ShareCardsView } from "@/lib/share-cards";
import { CARD } from "@/lib/share-images";
import type { SubmitDraft } from "@/lib/submit/editor";
import { StepLine } from "./controls";

// Step 4 of 4, "Name it and share" (Figma 401:3616 / 418:6420 / 418:6599; picture added 412:2989 / 418:6778 /
// 418:6957; send failed 441:8928 / 441:9162 / 441:9380; D-86, D-89). The build's name and the player's name for the
// credit, "Your Pro's face" (a screenshot that stays in this browser and goes on their card only, D-89 (4)), then
// "Your card" (the share story card, D-89 (3)), Share card and Copy link (D-86: shared at once, "Not yet checked in
// game"), and "Want it listed on ProBuilds?" with Send for listing (D-99 (1)). A send that doesn't go through shows
// Figma's red row and the button becomes Try again, keeping everything typed (D-100 (3)).
// Tablet: name, credit and face on the left (369 px), the card and its buttons on the right (353), 32 apart;
// desktop 664 and 440, 96 apart.
const FIELD = "type-body h-13 w-full rounded-md border border-input-border bg-input-bg px-4 text-text-primary placeholder:text-text-muted focus:border-2 focus:border-input-border-focused focus:px-[15px] focus:outline-none";

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
  const fileInput = useRef<HTMLInputElement>(null);
  const pick = () => fileInput.current?.click();
  return (
    <div className="flex flex-col tablet:flex-row tablet:items-start tablet:gap-8 desktop:gap-24">
      <div className="flex flex-col tablet:w-92.25 tablet:shrink-0 desktop:w-166">
        <StepLine label="Submit a build" step={4} />
        <h1 tabIndex={-1} className="type-h1 pt-3 text-text-primary outline-none">Name it and share</h1>
        <div className="flex flex-col gap-2 pt-6">
          <label htmlFor="build-name" className="type-label text-text-primary">
            Build name
          </label>
          <input id="build-name" className={FIELD} placeholder="Name your build" maxLength={40} value={draft.title} onChange={(e) => onChange({ title: e.target.value })} />
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
        <section aria-labelledby="pro-face" data-testid="pro-face" className="mt-7 flex flex-col gap-3 rounded-lg bg-bg-surface p-4">
          <h2 id="pro-face" className="type-label text-text-primary">
            Your Pro&apos;s face
          </h2>
          <div className="flex items-center gap-3.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- the player's own picture, from this browser only */}
            <img src={picture ?? "/art/probuilds-face.svg"} alt={picture ? "Your Pro's face" : ""} className="size-18 shrink-0 rounded-md bg-bg-raised object-cover" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="type-label text-text-primary">{picture ? "Your picture" : "No picture yet"}</p>
              <p className="type-caption text-text-secondary">{picture ? "On your card. Swap it any time." : "Your card uses the ProBuilds face until you add one."}</p>
            </div>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            data-testid="face-file"
            onChange={(e) => {
              onPicture(e.target.files?.[0] ?? null);
              e.target.value = "";
            }}
          />
          {picture ? (
            <div className="flex gap-2.5">
              <button type="button" className={buttonClass("secondary", "flex-1 hover:bg-action-hovered", "medium")} onClick={pick}>
                Change
              </button>
              <button type="button" className={buttonClass("secondary", "flex-1 border-transparent hover:bg-action-hovered", "medium")} onClick={() => onPicture(null)}>
                Remove
              </button>
            </div>
          ) : (
            <button type="button" data-testid="face-upload" className={buttonClass("secondary", "w-full hover:bg-action-hovered", "medium")} onClick={pick}>
              <ButtonLabel icon="plus" iconSide="left">
                Add a picture
              </ButtonLabel>
            </button>
          )}
          <p className="type-caption text-text-muted">A screenshot of your Pro&apos;s face from the game. It goes on your card only, never on the site.</p>
        </section>
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
