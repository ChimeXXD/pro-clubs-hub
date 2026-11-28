import { expect, type Locator, type Page, test } from "@playwright/test";

// Copy button (motion-bookmarks.pdf #20) on Takedown's Copy and the share sheet's Copy link, and Loading to success
// (#19) on Save images: the icon answers in place and comes back, the button keeps its width, a failure shakes.

const layers = (button: Locator) =>
  button.getByTestId("action-icon").evaluate((el) => ({
    state: el.getAttribute("data-state"),
    opacity: [...el.children].map((c) => getComputedStyle(c).opacity),
    transition: getComputedStyle(el.children[0]!).transitionProperty,
  }));

test("copy button: Takedown's Copy turns its icon into a check for 2 s, then back", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.clock.install();
  await page.goto("/takedown");
  const copy = page.getByRole("button", { name: "Copy" });
  const width = (await copy.boundingBox())!.width;
  expect((await layers(copy)).transition).toBe("opacity, scale");
  await copy.click();
  await expect.poll(async () => (await layers(copy)).state).toBe("done");
  await page.clock.runFor(400);
  await expect.poll(async () => (await layers(copy)).opacity).toEqual(["0", "1"]);
  expect((await copy.boundingBox())!.width).toBe(width);
  // The toast still says it, for screen readers too.
  await expect(page.getByRole("status")).toHaveText("Email copied");
  await page.clock.runFor(2000);
  await expect.poll(async () => (await layers(copy)).state).toBe("idle");
});

test("copy button with reduced motion: the icons only crossfade", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/takedown");
  expect((await layers(page.getByRole("button", { name: "Copy" }))).transition).toBe("opacity");
});

test.describe("share sheet", () => {
  test.skip(process.env.PROBUILDS_DRAFTS !== "1", "preview page");
  const URL = "/builds/finisher/meta-finisher";

  async function openSheet(page: Page) {
    await page.goto(URL);
    await page.getByRole("button", { name: "Share build" }).click();
    return page.getByRole("dialog", { name: "Share build" });
  }

  test("loading to success: Save images goes spinner, then a check that draws in, then back to its icon", async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(navigator, "canShare", { value: () => false, configurable: true }));
    const dialog = await openSheet(page);
    const save = dialog.getByRole("button", { name: "Save images" });
    const width = (await save.boundingBox())!.width;
    await save.click();
    await expect(save.getByTestId("save-spinner")).toBeVisible();
    await expect.poll(async () => (await layers(save)).state, { timeout: 30_000 }).toBe("done");
    // The check is drawn in from the left (clip-path), and the button kept its width throughout.
    expect(await save.getByTestId("action-icon").evaluate((el) => getComputedStyle(el.lastElementChild!).animationName)).toBe("check-in");
    expect((await save.boundingBox())!.width).toBe(width);
    await expect.poll(async () => (await layers(save)).state, { timeout: 3000 }).toBe("idle");
  });

  test("loading to success: when the images can't be made the button shakes 4 px", async ({ page }) => {
    await page.addInitScript(() => {
      HTMLCanvasElement.prototype.toBlob = function (callback: BlobCallback) { callback(null); };
      const shakes: unknown[] = [];
      Object.assign(window, { shakes });
      const animate = Element.prototype.animate;
      Element.prototype.animate = function (keyframes, options) {
        if (this instanceof HTMLButtonElement) shakes.push(keyframes);
        return animate.call(this, keyframes, options);
      };
    });
    const dialog = await openSheet(page);
    await dialog.getByRole("button", { name: "Save images" }).click();
    await expect(dialog.getByRole("status")).toHaveText("Couldn't save the images. Try again.", { timeout: 30_000 });
    const shakes = await page.evaluate(() => (window as unknown as { shakes: { translate: string }[][] }).shakes);
    expect(shakes.map((k) => k.map((f) => f.translate))).toEqual([["0", "-4px", "4px", "-4px", "4px", "0"]]);
  });

  test("loading to success with reduced motion: no shake", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => {
      HTMLCanvasElement.prototype.toBlob = function (callback: BlobCallback) { callback(null); };
      const shakes: unknown[] = [];
      Object.assign(window, { shakes });
      const animate = Element.prototype.animate;
      Element.prototype.animate = function (keyframes, options) {
        if (this instanceof HTMLButtonElement) shakes.push(keyframes);
        return animate.call(this, keyframes, options);
      };
    });
    const dialog = await openSheet(page);
    await dialog.getByRole("button", { name: "Save images" }).click();
    await expect(dialog.getByRole("status")).toHaveText("Couldn't save the images. Try again.", { timeout: 30_000 });
    expect(await page.evaluate(() => (window as unknown as { shakes: unknown[] }).shakes)).toEqual([]);
  });

  test("copy button: Copy link's icon is a check after copying (the sheet closes, the toast says it)", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const dialog = await openSheet(page);
    await dialog.getByRole("button", { name: "Copy link" }).click();
    await expect(dialog).toBeHidden();
    await page.getByRole("button", { name: "Share build" }).click();
    expect((await layers(dialog.getByRole("button", { name: "Copy link" }))).state).toBe("done");
  });
});
