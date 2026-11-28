import { readFile } from "node:fs/promises";
import { expect, type Download, type Page, test } from "@playwright/test";

// "Save images" in the share sheet (D-64 (2), D-111): both story cards as 1080 × 1920 PNGs, named from the build's
// slug; downloaded where the browser can't share files, handed to the share sheet where it can (an iPhone).
// Preview only: the sample build is a draft.
test.skip(process.env.PROBUILDS_DRAFTS !== "1", "preview page");

const URL = "/builds/finisher/meta-finisher";
const NAMES = ["meta-finisher-1.png", "meta-finisher-2.png"];
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/** A PNG's width and height from its IHDR chunk, or null when the bytes aren't a PNG. */
function pngSize(bytes: Buffer) {
  if (!PNG_SIGNATURE.every((b, i) => bytes[i] === b) || bytes.toString("ascii", 12, 16) !== "IHDR") return null;
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
}

async function openSheet(page: Page) {
  await page.goto(URL);
  await page.getByRole("button", { name: "Share build" }).click();
  return page.getByRole("dialog", { name: "Share build" });
}

test("Save images downloads both cards as 1080 × 1920 PNGs where the browser can't share files", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "canShare", { value: () => false, configurable: true }));
  const dialog = await openSheet(page);
  const downloads: Download[] = [];
  page.on("download", (d) => downloads.push(d));
  await dialog.getByRole("button", { name: "Save images" }).click();
  await expect.poll(() => downloads.length, { timeout: 30_000 }).toBe(2);
  expect(downloads.map((d) => d.suggestedFilename())).toEqual(NAMES);
  for (const d of downloads) {
    expect(pngSize(await readFile(await d.path()))).toEqual([1080, 1920]);
  }
  // The sheet stays open and the button is ready again.
  await expect(dialog.getByRole("button", { name: "Save images" })).not.toHaveAttribute("aria-busy");
});

test("Save images hands both PNGs to the share sheet where the browser can share files", async ({ page }) => {
  await page.addInitScript(() => {
    const shared: ShareData[] = [];
    Object.assign(window, { shared });
    Object.defineProperty(navigator, "canShare", { value: (data: ShareData) => Boolean(data.files?.length), configurable: true });
    Object.defineProperty(navigator, "share", { value: async (data: ShareData) => void shared.push(data), configurable: true });
  });
  const dialog = await openSheet(page);
  await dialog.getByRole("button", { name: "Save images" }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { shared: ShareData[] }).shared.length), { timeout: 30_000 }).toBe(1);
  const files = await page.evaluate(async () => {
    const [data] = (window as unknown as { shared: ShareData[] }).shared;
    return Promise.all(
      (data?.files ?? []).map(async (f) => {
        const bitmap = await createImageBitmap(f);
        return { name: f.name, type: f.type, size: [bitmap.width, bitmap.height], keys: Object.keys(data ?? {}) };
      }),
    );
  });
  expect(files).toEqual(NAMES.map((name) => ({ name, type: "image/png", size: [1080, 1920], keys: ["files"] })));
});

// D-114 (2): the cream toast tells how Save images went (493:9624 to 493:15977), over the open sheet or dialog.
test("Save images: 'Making your images…' with the button's spinner, then 'Both cards saved to your downloads'", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "canShare", { value: () => false, configurable: true }));
  const dialog = await openSheet(page);
  const save = dialog.getByRole("button", { name: "Save images" });
  const toast = dialog.getByRole("status");
  await save.click();
  await expect(toast).toHaveText("Making your images…");
  await expect(save).toHaveAttribute("aria-busy", "true");
  await expect(save.getByTestId("save-spinner")).toBeVisible();
  await expect(toast).toHaveText("Both cards saved to your downloads", { timeout: 30_000 });
  await expect(save).not.toHaveAttribute("aria-busy");
  await expect(save.getByTestId("save-spinner")).toHaveCount(0);
  // Phone: 34 px from the top, over the sheet (493:9624), once its 200 ms entrance has settled.
  await expect.poll(async () => Math.round((await toast.locator("div").first().boundingBox())?.y ?? 0)).toBe(34);
});

test("Save images: handed to the share sheet, the toast says the photos", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "canShare", { value: (data: ShareData) => Boolean(data.files?.length), configurable: true });
    Object.defineProperty(navigator, "share", { value: async () => undefined, configurable: true });
  });
  const dialog = await openSheet(page);
  await dialog.getByRole("button", { name: "Save images" }).click();
  await expect(dialog.getByRole("status")).toHaveText("Both cards saved to your photos", { timeout: 30_000 });
});

test("Save images: closing the share sheet saves nothing and says nothing", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "canShare", { value: () => true, configurable: true });
    Object.defineProperty(navigator, "share", { value: async () => { throw new DOMException("closed", "AbortError"); }, configurable: true });
  });
  const dialog = await openSheet(page);
  const save = dialog.getByRole("button", { name: "Save images" });
  await save.click();
  await expect(save).not.toHaveAttribute("aria-busy", { timeout: 30_000 });
  await expect(dialog.getByRole("status")).toHaveText("");
});

test("Save images: when the images can't be made, 'Couldn't save the images. Try again.' and the button is ready", async ({ page }) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.toBlob = function (callback: BlobCallback) { callback(null); };
  });
  const dialog = await openSheet(page);
  const save = dialog.getByRole("button", { name: "Save images" });
  await save.click();
  await expect(dialog.getByRole("status")).toHaveText("Couldn't save the images. Try again.", { timeout: 30_000 });
  await expect(save).not.toHaveAttribute("aria-busy");
});

test("Save images toasts sit 40 px from the bottom on tablet and 24 px on desktop, below the dialog", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "canShare", { value: () => false, configurable: true }));
  for (const [width, height, gap] of [[834, 1194, 40], [1440, 900, 24]] as const) {
    await page.setViewportSize({ width, height });
    const dialog = await openSheet(page);
    await dialog.getByRole("button", { name: "Save images" }).click();
    const pill = dialog.getByRole("status").locator("div").first();
    await expect(pill).toHaveText("Both cards saved to your downloads", { timeout: 30_000 });
    await expect.poll(async () => {
      const box = await pill.boundingBox();
      return box && Math.round(height - (box.y + box.height));
    }).toBe(gap);
  }
});

// D-114 (3): the cards show the level picked on the page; nothing else changes (492:9586, 492:9695).
test("the share cards show the level picked with the level switch", async ({ page }) => {
  await page.goto(URL);
  await page.getByTestId("level-switch").getByRole("button", { name: "Level down" }).click();
  await page.getByRole("button", { name: "Share build" }).click();
  const cards = page.getByRole("dialog", { name: "Share build" }).getByTestId("share-cards");
  await expect(cards.getByRole("figure", { name: "Share card 1 of 2" })).toContainText("Level32");
  await expect(cards.getByRole("figure", { name: "Share card 2 of 2" })).toContainText("Meta Finisher · Level 32 · Finisher");
});

// D-112 (2), D-114 (4): in light mode the cards are light, and EA's white PlayStyle icons are tinted text/primary.
test("light mode: white PlayStyle icons are tinted deep gold on the page and the cards; the saved images are light", async ({ page }) => {
  await page.addInitScript(() => {
    const shared: ShareData[] = [];
    Object.assign(window, { shared });
    Object.defineProperty(navigator, "canShare", { value: () => true, configurable: true });
    Object.defineProperty(navigator, "share", { value: async (data: ShareData) => void shared.push(data), configurable: true });
  });
  const dialog = await openSheet(page);
  // Light mode as the theme switch sets it (D-112), after the page has loaded.
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  const tint = (loc: ReturnType<Page["locator"]>) =>
    loc.evaluate((el) => ({ mask: getComputedStyle(el).maskImage, colour: getComputedStyle(el).backgroundColor }));
  const onPage = await tint(page.getByRole("main").getByTestId("playstyle-art").first());
  const onCard = await tint(dialog.getByTestId("playstyle-art").first());
  for (const t of [onPage, onCard]) {
    expect(t.mask).toContain("/art/playstyles/");
    // Deep gold, playstyle/badge (D-116; it was text/primary under D-114 (4)).
    expect(t.colour).toBe("rgb(176, 125, 18)");
  }
  await dialog.getByRole("button", { name: "Save images" }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { shared: ShareData[] }).shared.length), { timeout: 30_000 }).toBe(1);
  const corner = await page.evaluate(async () => {
    const file = (window as unknown as { shared: ShareData[] }).shared[0]?.files?.[0];
    const bitmap = await createImageBitmap(file as File);
    const canvas = new OffscreenCanvas(4, 4);
    const context = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
    context.drawImage(bitmap, 30, 300, 4, 4, 0, 0, 4, 4);
    return Array.from(context.getImageData(0, 0, 1, 1).data.slice(0, 3));
  });
  expect(corner).toEqual([247, 243, 230]); // bg/page in light mode
});

test("dark mode: the white PlayStyle icons are EA's art as is", async ({ page }) => {
  const dialog = await openSheet(page);
  const art = await dialog.getByTestId("playstyle-art").first().evaluate((el) => ({ mask: getComputedStyle(el).maskImage, image: getComputedStyle(el).backgroundImage }));
  expect(art.mask).toBe("none");
  expect(art.image).toContain("/art/playstyles/");
});

test("Save images: closed while saving, the result shows on the page, and not again when the sheet reopens", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "canShare", { value: () => false, configurable: true }));
  const dialog = await openSheet(page);
  await dialog.getByRole("button", { name: "Save images" }).click();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  // The page's own region (outside the closed dialog) shows it.
  await expect(page.locator("[role=status]:not(dialog [role=status])").getByText("Both cards saved to your downloads")).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Share build" }).click();
  await expect(dialog.getByRole("status")).toHaveText("");
});
