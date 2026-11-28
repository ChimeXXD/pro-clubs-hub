// Fan cards (motion-bookmarks.pdf #2, D-117 (4)): tapping "Your card" lifts it from the page into the share sheet,
// where it lands as the flip card, while the card's back peeks out behind it at −4° so the player sees it has two sides.
// Purpose: spatial consistency (the card in the sheet is the one on the page) and explanation (it has a back).
// Choreography (choreograph): the card is the lead, 240 ms --ease-out from the page card's place and size to its own,
// by transform from its top left corner. The back is decoration: a copy of the sheet card's back, behind the front,
// tilted −4° for most of the flight and tucked in square as the card lands, then removed. The sheet's surface and
// controls are support: the sheet is put at its place at once (its own slide is finished, so two things don't travel)
// and fades in over --dur-fast; the card fades with it, so it reads as lifting out of the dimmed page.
// Called only for a pointer's tap and without reduced motion; otherwise the sheet opens as it always does.
import { ms, token } from "@/lib/motion";
import { type Box, liftFrom } from "@/lib/submit/motion";

// About 240 ms (D-117 (4)); no token has that length.
export const LIFT_MS = 240;

export function liftIntoSheet(source: HTMLElement) {
  const dialog = document.querySelector<HTMLDialogElement>('dialog[data-testid="share-dialog"][open]');
  const card = dialog?.querySelector<HTMLElement>('[data-testid="share-cards"]');
  if (!dialog || !card) return;
  // Reading the style starts the sheet's own entrance (a CSS transition from @starting-style); finishing it puts the
  // sheet where it lands, so the card's target can be measured.
  // A card left turned over the last time the sheet was open is turning back to its front (FlipCard's transition):
  // that is finished too, so the lift starts from the front and the peek isn't drawn over a turning card.
  void getComputedStyle(dialog).translate;
  for (const a of dialog.getAnimations()) a.finish();
  for (const a of card.getAnimations({ subtree: true })) a.finish();
  const from: Box = source.getBoundingClientRect();
  const to: Box = card.getBoundingClientRect();

  const ease = token("--ease-out", "cubic-bezier(0.23, 1, 0.32, 1)");
  const back = peekingBack(card);
  card.animate([{ transform: liftFrom(from, to), transformOrigin: "0 0" }, { transform: "none", transformOrigin: "0 0" }], { duration: LIFT_MS, easing: ease });
  dialog.animate([{ opacity: 0 }, { opacity: 1 }], { duration: ms("--dur-fast", 150), easing: "linear" });
  if (back) {
    // Held at −4° for the first 60 % of the flight, then tucked in square on the ease-out as the card lands.
    const peek = back.animate([{ rotate: "-4deg" }, { rotate: "-4deg", offset: 0.6, easing: ease }, { rotate: "0deg" }], { duration: LIFT_MS });
    peek.finished.then(
      () => back.remove(),
      () => back.remove(),
    );
  }
}

/** A drawing-only copy of the card's back face, laid flat behind the front (the real back stays turned away). */
function peekingBack(card: HTMLElement): HTMLElement | null {
  const face = card.querySelector<HTMLElement>('figure[aria-label="Share card 2 of 2"]');
  if (!face) return null;
  const copy = face.cloneNode(true) as HTMLElement;
  copy.removeAttribute("aria-label");
  copy.setAttribute("aria-hidden", "true");
  copy.dataset.part = "peek";
  // Save images draws the cards marked data-share-card: the copy must never be one of them.
  copy.querySelectorAll("[data-share-card]").forEach((el) => el.removeAttribute("data-share-card"));
  copy.style.transform = "none";
  copy.style.backfaceVisibility = "visible";
  copy.style.pointerEvents = "none";
  card.insertBefore(copy, card.firstChild);
  return copy;
}
