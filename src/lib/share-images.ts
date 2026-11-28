// "Save images" in the share sheet (D-64 (2), D-111): the two story cards become 1080 × 1920 PNGs. The cards are
// drawn at Figma's 360 × 640 (316:888, 316:973) and rendered at 3× the pixels, so the image is the same card, not a
// re-layout. The browser side (html-to-image, loaded on tap) is src/components/builds/saveShareImages.ts.

/** Figma's story card frame (316:888 "Overview", 316:973 "Attributes"). */
export const CARD = { width: 360, height: 640 } as const;
/** The story size D-64 (2) states. */
export const STORY = { width: 1080, height: 1920 } as const;
/** How many image pixels per card pixel: 1080 ÷ 360 = 1920 ÷ 640 = 3. */
export const PIXEL_RATIO = STORY.width / CARD.width;

/** The two files' names, from the build's slug: "meta-finisher-1.png", "meta-finisher-2.png". */
export function shareImageNames(slug: string): [string, string] {
  return [`${slug}-1.png`, `${slug}-2.png`];
}

/** How Save images ended: handed to the share sheet, downloaded, or the share sheet closed by the person. */
export type SaveOutcome = "shared" | "downloaded" | "cancelled";
export type SaveState = "saving" | "photos" | "downloads" | "failed";

/**
 * The cream toasts for Save images, word for word from Figma (493:9624 to 493:15977, D-114 (2)): while the images are
 * made, when they are saved (to Photos through the share sheet on a phone or iPad, to downloads on a computer) and
 * when they couldn't be made.
 */
export const SAVE_TOAST = {
  saving: { tone: "info", icon: "download", message: "Making your images…" },
  photos: { tone: "success", icon: "check-circle", message: "Both cards saved to your photos" },
  downloads: { tone: "success", icon: "check-circle", message: "Both cards saved to your downloads" },
  failed: { tone: "danger", icon: "error", message: "Couldn't save the images. Try again." },
} as const satisfies Record<SaveState, { tone: "info" | "success" | "danger"; icon: string; message: string }>;

/** The toast for how it ended; none when the person closed the share sheet (their choice, nothing was saved). */
export function saveState(outcome: SaveOutcome): SaveState | null {
  return outcome === "shared" ? "photos" : outcome === "downloaded" ? "downloads" : null;
}

type ShareNavigator = { canShare?: (data?: ShareData) => boolean; share?: (data?: ShareData) => Promise<void> };

/**
 * "share" when the device can hand these files to its share sheet (that's how an iPhone saves them to Photos),
 * "download" otherwise (desktop, and phones whose browser can't share files).
 */
export function saveMode(nav: ShareNavigator | undefined, files: File[]): "share" | "download" {
  if (typeof nav?.canShare !== "function" || typeof nav.share !== "function") return "download";
  try {
    return nav.canShare({ files }) ? "share" : "download";
  } catch {
    return "download";
  }
}

// Two work-arounds for html-to-image 1.11.13, which copies each element's computed style property by property:
// - it writes every font size as floor(size) − 0.1 px (13 px → 12.9 px), so each line is about 1 % shorter than on
//   screen and in Figma. restoreFontSizes puts the size back in the SVG it makes. The cards' sizes are whole pixels,
//   so floor(size) − 0.1 + 0.1 is the size.
// - it copies the corner shapes (corner-top-left-shape…, "superellipse(1)", the default, a round corner) too, and
//   with them set WebKit's style serialisation drops border-radius, so Safari's image loses every rounded corner.
//   styleProperties leaves the corner shapes out; unset, they are that same default.
// The size in "font-size: 12.9px" (WebKit) or the first length in "font: 600 12.9px / 18px Barlow" (Chromium).
const CUT_FONT_SIZE = /(\bfont(?:-size)?: [^;]*?)\b(\d+)\.9px/g;
const CORNER_SHAPE = /^corner-.*shape$/;

/** The SVG data URL from html-to-image's toSvg, with the font sizes it cut put back (in style attributes only). */
export function restoreFontSizes(svgDataUrl: string): string {
  const comma = svgDataUrl.indexOf(",");
  const svg = decodeURIComponent(svgDataUrl.slice(comma + 1));
  const fixed = svg.replace(/ style="[^"]*"/g, (style) => style.replace(CUT_FONT_SIZE, (_, head: string, px: string) => `${head}${Number(px) + 1}px`));
  return svgDataUrl.slice(0, comma + 1) + encodeURIComponent(fixed);
}

/** The computed-style properties for html-to-image to copy: all of them but the corner shapes. */
export function styleProperties(names: Iterable<string>): string[] {
  return Array.from(names).filter((name) => !CORNER_SHAPE.test(name));
}
