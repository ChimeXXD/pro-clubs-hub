// "Save images" (D-111): turns the two story cards on screen into 1080 × 1920 PNGs with html-to-image, then hands
// them to the phone's share sheet (an iPhone saves them to Photos from there) or downloads them. ShareBuild imports
// this file, and html-to-image with it, only when Save images is tapped, so neither adds to the page's first load.
//
// iPhone Safari often draws the first pass blank or without fonts and pictures: it fires the SVG image's load before
// the fonts and pictures embedded in it are decoded. So, before drawing: wait for the page's fonts and the cards'
// shown pictures to load, embed each card's fonts once, and draw the card's SVG twice: a 1× warm-up pass that is
// thrown away, then the 3× pass that is kept, which finds them decoded.
//
// html-to-image makes the SVG (toSvg); the drawing is done here rather than by its toBlob, so two of its quirks can be
// undone first (restoreFontSizes, styleProperties: see src/lib/share-images.ts).
import { getFontEmbedCSS, toSvg } from "html-to-image";
import { CARD, PIXEL_RATIO, restoreFontSizes, type SaveOutcome, saveMode, styleProperties } from "@/lib/share-images";

const IMAGE_WAIT_MS = 3000;

/** Resolves when the picture has loaded or failed, or after IMAGE_WAIT_MS. */
function loaded(img: HTMLImageElement) {
  if (img.complete) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const done = () => {
      clearTimeout(timer);
      img.removeEventListener("load", done);
      img.removeEventListener("error", done);
      resolve();
    };
    const timer = setTimeout(done, IMAGE_WAIT_MS);
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
  });
}

async function ready(cards: HTMLElement[]) {
  await document.fonts.ready;
  // Only the pictures drawn: the logo's other-theme file is display: none and, lazy, may never load (its decode()
  // never settles). A lazy picture still off screen (card 2 in the swipe row) is capped, not awaited for ever;
  // html-to-image fetches every picture itself in any case.
  const pictures = cards.flatMap((card) => Array.from(card.querySelectorAll("img"))).filter((img) => img.getClientRects().length > 0);
  await Promise.all(pictures.map(loaded));
}

/** The SVG drawn on a canvas `ratio` times the card's size, once it and everything in it is decoded. */
async function draw(svg: string, ratio: number) {
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error("Save images: the card's SVG did not load"));
    img.src = svg;
  });
  // Some WebKit versions reject decode() for an SVG image that has loaded; it is only an extra wait, so go on.
  await img.decode().catch(() => undefined);
  // One more frame, so WebKit has painted what the SVG holds before it is copied.
  await new Promise((resolve) => requestAnimationFrame(resolve));
  const canvas = document.createElement("canvas");
  canvas.width = CARD.width * ratio;
  canvas.height = CARD.height * ratio;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Save images: no 2D canvas");
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/** Each card as a 1080 × 1920 PNG, in order. */
export async function renderCards(cards: HTMLElement[]): Promise<Blob[]> {
  await ready(cards);
  const includeStyleProperties = styleProperties(getComputedStyle(document.documentElement));
  const blobs: Blob[] = [];
  for (const card of cards) {
    const fontEmbedCSS = await getFontEmbedCSS(card);
    const svg = restoreFontSizes(await toSvg(card, { width: CARD.width, height: CARD.height, fontEmbedCSS, includeStyleProperties }));
    await draw(svg, 1); // the warm-up pass (see above)
    const canvas = await draw(svg, PIXEL_RATIO);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("Save images: the browser made no PNG");
    blobs.push(blob);
  }
  return blobs;
}

function download(files: File[]) {
  for (const file of files) {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    // The download has started by then; the address only has to live that long.
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }
}

/**
 * Renders the cards and shares them where the device takes files, else downloads them, one file per name. Resolves
 * with how it ended (the toast says so); throws when the images couldn't be made.
 */
export async function saveShareImages(cards: HTMLElement[], names: readonly string[]): Promise<SaveOutcome> {
  // One card per name, or the files would be missing or misnamed.
  if (cards.length !== names.length) throw new Error(`Save images: ${cards.length} cards shown for ${names.length} files`);
  const blobs = await renderCards(cards);
  const files = blobs.map((blob, i) => new File([blob], names[i]!, { type: "image/png" }));
  if (saveMode(navigator, files) === "share") {
    try {
      await navigator.share({ files });
      return "shared";
    } catch (e) {
      // Closing the share sheet is the person's choice: nothing more to do.
      if (e instanceof DOMException && e.name === "AbortError") return "cancelled";
      // Anything else (NotAllowedError when the tap's permission ran out while drawing): download them instead.
    }
  }
  download(files);
  return "downloaded";
}
