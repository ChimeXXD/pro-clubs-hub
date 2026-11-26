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
