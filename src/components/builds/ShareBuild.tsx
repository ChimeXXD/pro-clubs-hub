"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/shell/Icon";
import { ButtonLabel, buttonClass } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import type { ShareCardsView } from "@/lib/share-cards";
import { AttributesCard, OverviewCard, ScaledCard } from "./ShareCards";

// "Share build" (D-64, D-65): the lime button opens a bottom sheet on phone (Figma 319:904) and a centred dialog on
// tablet and desktop (319:2234 / 319:2952). Both show the two story cards (316:888, 316:973): on phone they swipe
// sideways with a pager under them; from tablet they sit side by side. Copy link puts the page's address on the
// clipboard, closes the sheet and shows the "Link copied" toast (319:1674). "Share via…" (phone) and the share icon
// (tablet) open the device's own share menu with the link, shown only where the browser has one; desktop has none.
// TODO(Chime): "Save images" needs the cards made into image files. That needs a renderer (an HTML-to-image library
// or a build-time tool), a new dependency that needs Chime's OK, so the button does nothing yet.
// A native <dialog> opened with showModal(): focus moves in, Escape closes it, the page behind is inert, and focus
// returns to the Share build button. The sheet slides up and the dialog grows in, ease-out under 300 ms; with
// reduced motion both only fade.
const TOAST_MS = 4000;
const COPIED = "Link copied. Paste it in any chat.";
// Whether the browser has a share menu: fixed for the page's life, and false in the static HTML.
const noSubscribe = () => () => {};
const hasShare = () => typeof navigator.share === "function";
const ICON_BUTTON = "flex shrink-0 items-center justify-center rounded-sm transition-colors duration-150 hover:bg-action-hovered";
const SECONDARY = buttonClass("secondary", "hover:bg-action-hovered");

export function ShareBuild({ title, share }: { title: string; share: ShareCardsView }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(0);
  const [card, setCard] = useState(0);
  const canShare = useSyncExternalStore(noSubscribe, hasShare, () => false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(0), TOAST_MS);
    return () => clearTimeout(t);
  }, [copied]);

  // The page's own address, without a fragment or query.
  const pageUrl = () => `${window.location.origin}${window.location.pathname}`;
  const close = () => dialog.current?.close();

  const copyLink = async () => {
    // The clipboard is missing outside a secure context and can be refused; the sheet then stays open, no toast.
    try {
      await navigator.clipboard.writeText(pageUrl());
      close();
      setCopied(Date.now());
    } catch {
      setCopied(0);
    }
  };
  const shareVia = async () => {
    try {
      await navigator.share({ title, url: pageUrl() });
    } catch {
      // Dismissed, or refused: nothing to undo.
    }
  };
  // TODO(Chime): save both cards as images once a renderer is approved (see above).
  const saveImages = () => {};

  const cards = (scale: number) => [
    <ScaledCard key="overview" scale={scale} label="Share card 1 of 2">
      <OverviewCard card={share.overview} />
    </ScaledCard>,
    <ScaledCard key="attributes" scale={scale} label="Share card 2 of 2">
      <AttributesCard card={share.attributes} link={share.overview.link} footer={share.overview.footer} />
    </ScaledCard>,
  ];

  return (
    <>
      <button ref={trigger} type="button" aria-haspopup="dialog" className={buttonClass("primary", "w-full")} onClick={() => dialog.current?.showModal()}>
        Share build
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="share-build-title"
        data-testid="share-dialog"
        onClose={() => trigger.current?.focus()}
        // A click on the backdrop lands on the dialog itself (its content fills it); that closes it.
        onClick={(e) => e.target === dialog.current && close()}
        className="mt-auto mb-0 w-full max-w-none rounded-t-xl border-0 bg-bg-raised p-0 text-text-primary shadow-elevation-3 transition-[translate,scale,opacity] duration-250 ease-[cubic-bezier(0.32,0.72,0,1)] backdrop:bg-system-backdrop starting:open:translate-y-full tablet:m-auto tablet:w-[616px] tablet:max-w-[calc(100%-48px)] tablet:rounded-xl tablet:ease-out tablet:starting:open:translate-y-0 tablet:starting:open:scale-[0.96] tablet:starting:open:opacity-0 motion-reduce:starting:open:translate-y-0 motion-reduce:starting:open:scale-100 motion-reduce:starting:open:opacity-0"
      >
        <div className="flex flex-col gap-4 px-5 pt-3.5 pb-[calc(46px+env(safe-area-inset-bottom))] tablet:gap-5 tablet:px-7 tablet:pt-6 tablet:pb-7">
          <span aria-hidden="true" className="mx-auto h-1 w-10 rounded-[2px] bg-text-muted tablet:hidden" />
          <div className="flex items-center justify-between">
            {/* Figma sets the title at the top of the 52 px row from tablet (319:2703), centred in the 44 px row on phone. */}
            <h2 id="share-build-title" className="type-h3 text-text-primary tablet:self-start">
              Share build
            </h2>
            <button type="button" aria-label="Close" className={`${ICON_BUTTON} size-11 tablet:size-13`} onClick={close}>
              <span className="flex tablet:hidden">
                <Icon name="close" size={20} />
              </span>
              <span className="hidden tablet:flex">
                <Icon name="close" size={24} />
              </span>
            </button>
          </div>
          {/* Phone: the cards swipe sideways, out to the sheet's edge, and the pager follows them. */}
          <div className="flex flex-col gap-4 tablet:hidden">
            <div
              data-testid="share-cards"
              className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 [scrollbar-width:none]"
              // Past half of the way it can scroll, the second card is the one in view.
              onScroll={(e) => {
                const el = e.currentTarget;
                setCard(el.scrollLeft > (el.scrollWidth - el.clientWidth) / 2 ? 1 : 0);
              }}
            >
              {cards(0.625).map((c) => (
                <div key={c.key} className="snap-start">
                  {c}
                </div>
              ))}
            </div>
            <div className="flex h-5 items-center gap-2" aria-hidden="true">
              {[0, 1].map((i) => (
                <span key={i} className={`rounded-full ${i === card ? "size-2 bg-text-primary" : "size-1.5 bg-text-muted"}`} />
              ))}
              <span className="type-caption text-text-secondary">{`${card + 1} of 2`}</span>
            </div>
          </div>
          <div className="hidden gap-5 tablet:flex">{cards(0.75)}</div>
          <div className="flex flex-col gap-2 tablet:flex-row tablet:justify-center tablet:gap-3">
            <div className="flex gap-2 tablet:contents">
              <button type="button" className={`${SECONDARY} flex-1 tablet:flex-none`} onClick={saveImages}>
                <ButtonLabel icon="download" iconSide="left">
                  Save images
                </ButtonLabel>
              </button>
              <button type="button" className={`${SECONDARY} flex-1 tablet:flex-none`} onClick={copyLink}>
                <ButtonLabel icon="copy" iconSide="left">
                  Copy link
                </ButtonLabel>
              </button>
            </div>
            {canShare && (
              <>
                <button type="button" className={`${SECONDARY} tablet:hidden`} onClick={shareVia}>
                  <ButtonLabel icon="share" iconSide="left">
                    Share via…
                  </ButtonLabel>
                </button>
                <button
                  type="button"
                  aria-label="Share via…"
                  className={`${ICON_BUTTON} hidden size-13 border-[1.5px] border-border-strong tablet:flex desktop:hidden`}
                  onClick={shareVia}
                >
                  <Icon name="share" size={24} />
                </button>
              </>
            )}
          </div>
          <p className="type-caption text-text-muted tablet:text-center">
            <span className="tablet:hidden">Saves both cards to your photos.</span>
            <span className="hidden tablet:inline desktop:hidden">Saves both cards to your photos. The last button opens your device&apos;s share menu.</span>
            <span className="hidden desktop:inline">Saves both cards as images. Copy link to paste the build page anywhere.</span>
          </p>
        </div>
      </dialog>
      <Toast id={copied} message={copied !== 0 ? COPIED : null} />
    </>
  );
}
