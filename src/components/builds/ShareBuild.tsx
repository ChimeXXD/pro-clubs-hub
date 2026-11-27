"use client";

import { type CSSProperties, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/shell/Icon";
import { ButtonLabel, buttonClass } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { type ShareCardsView, shareCardsAtLevel } from "@/lib/share-cards";
import { SAVE_TOAST, type SaveState, saveState } from "@/lib/share-images";
import { useChosenLevel } from "./ChosenLevel";
import { AttributesCard, OverviewCard, ScaledCard } from "./ShareCards";

// "Share build" (D-64, D-65): the lime button opens a bottom sheet on phone (Figma 319:904) and a centred dialog on
// tablet and desktop (319:2234 / 319:2952). Both show the two story cards (316:888, 316:973): on phone they swipe
// sideways with a pager under them; from tablet they sit side by side. Copy link puts the page's address on the
// clipboard, closes the sheet and shows the "Link copied" toast (319:1674). "Share via…" (phone) and the share icon
// (tablet) open the device's own share menu with the link, shown only where the browser has one; desktop has none.
// "Save images" (D-111) turns the two cards on screen into 1080 × 1920 PNGs and shares them (phone) or downloads
// them (saveShareImages.ts, which loads html-to-image only on tap). While it works the button shows Figma's spinner
// and is busy (a second tap is ignored), and the cream toast says so; then it says where they went, or that they
// couldn't be made (493:9624 to 493:15977, D-114 (2)). The cards show the level picked on the page (D-114 (3)) and
// the mode the page is in, so the images do too (D-112 (2)).
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
  const saving = useRef(false);
  const [save, setSave] = useState<{ state: SaveState; id: number } | null>(null);
  // Whether the sheet is open: a Save images result that ends after it was closed shows as a page toast instead.
  const [open, setOpen] = useState(false);
  const { level } = useChosenLevel();
  const shown = shareCardsAtLevel(share, level);
  const canShare = useSyncExternalStore(noSubscribe, hasShare, () => false);

  // The outcome toasts leave by themselves after 4 s; "Making your images…" stays until it is done.
  useEffect(() => {
    if (!save || save.state === "saving") return;
    const t = setTimeout(() => setSave(null), TOAST_MS);
    return () => clearTimeout(t);
  }, [save]);

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
  const saveImages = async () => {
    if (saving.current || !dialog.current) return;
    // The cards on screen: the phone's swipe row or the tablet and desktop pair; the other set is display: none.
    const cardNodes = Array.from(dialog.current.querySelectorAll<HTMLElement>("[data-share-card]")).filter((el) => el.getClientRects().length > 0);
    saving.current = true;
    setSave({ state: "saving", id: Date.now() });
    try {
      const { saveShareImages } = await import("./saveShareImages");
      const done = saveState(await saveShareImages(cardNodes, share.files));
      setSave(done ? { state: done, id: Date.now() } : null);
    } catch (error) {
      console.error("Save images failed", error);
      setSave({ state: "failed", id: Date.now() });
    } finally {
      saving.current = false;
    }
  };

  // The Save images toast sits over the sheet while it is open, else on the page (the sheet was closed while saving).
  const inSheet = open ? save : null;
  const onPage = !open && save && save.state !== "saving" ? save : null;

  const cards = (scale: number) => [
    <ScaledCard key="overview" scale={scale} label="Share card 1 of 2">
      <OverviewCard card={shown.overview} />
    </ScaledCard>,
    <ScaledCard key="attributes" scale={scale} label="Share card 2 of 2">
      <AttributesCard card={shown.attributes} link={shown.overview.link} footer={shown.overview.footer} />
    </ScaledCard>,
  ];

  return (
    <>
      <button ref={trigger} type="button" aria-haspopup="dialog" className={buttonClass("primary", "w-full")} onClick={() => {
          dialog.current?.showModal();
          setOpen(true);
        }}>
        Share build
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="share-build-title"
        data-testid="share-dialog"
        onClose={() => {
          setOpen(false);
          // A finished result is not shown again when the sheet reopens; one still being made follows to the page.
          setSave((s) => (s?.state === "saving" ? s : null));
          trigger.current?.focus();
        }}
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
              <button
                type="button"
                aria-busy={save?.state === "saving" || undefined}
                className={`${SECONDARY} flex-1 tablet:flex-none`}
                onClick={saveImages}
              >
                {save?.state === "saving" ? <Spinner /> : <Icon name="download" size={20} />}
                Save images
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
        {/* Always mounted, so the live region announces each message (see Toast). */}
        <Toast
          id={inSheet?.id}
          message={inSheet ? SAVE_TOAST[inSheet.state].message : null}
          tone={inSheet ? SAVE_TOAST[inSheet.state].tone : undefined}
          icon={inSheet ? SAVE_TOAST[inSheet.state].icon : undefined}
          placement="dialog"
        />
      </dialog>
      {/* One page region for "Link copied" and a Save images result that ended after the sheet closed. */}
      <Toast
        id={onPage ? onPage.id : copied}
        message={onPage ? SAVE_TOAST[onPage.state].message : copied !== 0 ? COPIED : null}
        tone={onPage ? SAVE_TOAST[onPage.state].tone : "success"}
        icon={onPage ? SAVE_TOAST[onPage.state].icon : undefined}
      />
    </>
  );
}

/** Figma's button spinner (199:351): a three-quarter ring, 22.5 px in a 20 px box, turning; slower with reduced motion. */
function Spinner() {
  const style = { "--icon": "url(/icons/spinner.svg)" } as CSSProperties;
  return (
    <span data-testid="save-spinner" aria-hidden="true" className="relative size-5 shrink-0">
      <span
        className="icon-mask absolute inset-[-6.25%] animate-[spinner-turn_0.8s_linear_infinite] motion-reduce:animate-[spinner-turn_2.4s_linear_infinite]"
        style={style}
      />
    </span>
  );
}
