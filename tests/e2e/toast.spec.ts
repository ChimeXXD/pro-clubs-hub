import { expect, type Page, test } from "@playwright/test";

// Notification stack (motion-bookmarks.pdf #30): a second toast stacks on the first (the first steps back) instead of
// replacing it, and a toast can be swiped away on a phone. Shown with the Build page's "Link copied", then a Save
// images result that ends after the sheet was closed. Preview only: the sample build is a draft.
test.skip(process.env.PROBUILDS_DRAFTS !== "1", "preview page");

const URL = "/builds/finisher/meta-finisher";

/** Opens the sheet with a share menu that waits for the test, starts Save images, then copies the link (which closes
 * the sheet). Returns a function that lets the save finish. */
async function linkCopiedThenSaved(page: Page) {
  await page.addInitScript(() => {
    let finish: () => void = () => {};
    Object.assign(window, { shareCalled: false, finishShare: () => finish() });
    Object.defineProperty(navigator, "canShare", { value: (d: ShareData) => Boolean(d.files?.length), configurable: true });
    const share = () => {
      Object.assign(window, { shareCalled: true });
      return new Promise<void>((r) => (finish = r));
    };
    Object.defineProperty(navigator, "share", { value: share, configurable: true });
  });
  await page.goto(URL);
  await page.getByRole("button", { name: "Share build" }).click();
  const dialog = page.getByRole("dialog", { name: "Share build" });
  await dialog.getByRole("button", { name: "Save images" }).click();
  await dialog.getByRole("button", { name: "Copy link" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByTestId("toast").filter({ hasText: "Link copied" })).toBeVisible();
  // Wait until the images are made and handed to the (waiting) share menu, then let it finish.
  await expect.poll(() => page.evaluate(() => (window as unknown as { shareCalled: boolean }).shareCalled), { timeout: 30_000 }).toBe(true);
  return () => page.evaluate(() => (window as unknown as { finishShare: () => void }).finishShare());
}

const look = (page: Page, text: string) =>
  page
    .getByTestId("toast")
    .filter({ hasText: text })
    .evaluate((el) => {
      const s = getComputedStyle(el);
      return { scale: s.scale, opacity: s.opacity, translate: s.translate, hidden: el.getAttribute("aria-hidden") };
    });

test("toast stack: a second toast stacks on the first, which steps back", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const finish = await linkCopiedThenSaved(page);
  // The save is still waiting: one toast.
  await page.waitForTimeout(300);
  await expect(page.getByTestId("toast")).toHaveCount(1);
  await finish();
  await expect(page.getByTestId("toast")).toHaveCount(2);
  await expect(page.getByTestId("toast").filter({ hasText: "Both cards saved to your photos" })).toBeVisible();
  // The first one steps back: 95 %, 8 px up, 60 %, hidden from screen readers (the new one is announced).
  await expect.poll(() => look(page, "Link copied")).toEqual({ scale: "0.95", opacity: "0.6", translate: "0px -8px", hidden: "true" });
  expect(await look(page, "Both cards saved")).toMatchObject({ scale: "none", opacity: "1", hidden: null });
  // Only its edge shows: its words have faded out, so two messages never show through each other.
  await expect(page.getByTestId("toast").filter({ hasText: "Link copied" }).getByText("Link copied")).toHaveCSS("opacity", "0");
  // Which properties move: opacity, translate and scale only.
  expect(await page.getByTestId("toast").first().evaluate((el) => getComputedStyle(el).transitionProperty)).toBe("opacity, translate, scale");
});

test("toast stack: swiping the front toast down dismisses it and the one behind comes forward", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const finish = await linkCopiedThenSaved(page);
  await finish();
  await expect(page.getByTestId("toast")).toHaveCount(2);
  const front = page.getByTestId("toast").filter({ hasText: "Both cards saved" });
  const box = (await front.boundingBox())!;
  // A short pull that comes back springs back.
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 10, { steps: 3 });
  await page.waitForTimeout(120);
  await page.mouse.up();
  await expect(front).toBeVisible();
  // A pull past 20 px towards the bottom edge takes it away.
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 40, { steps: 4 });
  await page.mouse.up();
  await expect(front).toHaveCount(0);
  await expect(page.getByTestId("toast")).toHaveCount(1);
  await expect.poll(() => look(page, "Link copied")).toMatchObject({ scale: "none", opacity: "1", hidden: null });
});

test("toast stack with reduced motion: the toast behind only fades back", async ({ page, context }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const finish = await linkCopiedThenSaved(page);
  await finish();
  await expect(page.getByTestId("toast")).toHaveCount(2);
  expect(await page.getByTestId("toast").first().evaluate((el) => getComputedStyle(el).transitionProperty)).toBe("opacity");
});
