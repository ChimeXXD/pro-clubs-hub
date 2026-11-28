import { expect, type Page, test } from "@playwright/test";

// Expand card (motion-bookmarks #22): a Changelog entry opening in place grows from its row and its body fades in.
// The entries are drafts until published, so this runs on the preview (D-104). Chromium doesn't list transitions on
// ::details-content in getAnimations(), so the growth is read from the entry's height, frame by frame.
test.skip(process.env.PROBUILDS_DRAFTS !== "1", "the changelog's entries are drafts");

/** Toggle the first closed entry and sample its height and its body's opacity on every frame for 350 ms. */
const sample = (page: Page, open: boolean) =>
  page.evaluate(
    ({ open }) =>
      new Promise<{ t: number; h: number; o: number }[]>((done) => {
        const el = document.querySelector(open ? 'details[data-testid^="changelog-entry-"]:not([open])' : "details[open]") as HTMLDetailsElement;
        const body = el.querySelector('[data-testid="entry-body"]') as HTMLElement;
        const out: { t: number; h: number; o: number }[] = [];
        const t0 = performance.now();
        el.open = open;
        const tick = () => {
          out.push({ t: performance.now() - t0, h: el.getBoundingClientRect().height, o: parseFloat(getComputedStyle(body).opacity) });
          if (performance.now() - t0 < 350) requestAnimationFrame(tick);
          else done(out);
        };
        requestAnimationFrame(tick);
      }),
    { open },
  );

test("an entry opens in place: it grows from the row and its body fades in; closing is quicker", async ({ page }) => {
  await page.goto("/changelog");
  await page.locator("[data-hydrated]").waitFor({ state: "attached" });
  const opening = await sample(page, true);
  const end = opening[opening.length - 1]!;
  const first = opening[0]!;
  // Growing, not jumping: the first frame is well short of the end, and it gets there inside ~250 ms.
  expect(first.h).toBeLessThan(end.h * 0.6);
  expect(opening.filter((s) => s.h > first.h && s.h < end.h - 1).length).toBeGreaterThanOrEqual(3);
  const grown = opening.find((s) => s.h >= end.h - 1)!;
  expect(grown.t).toBeLessThan(260);
  // The body fades in with it.
  expect(first.o).toBeLessThan(1);
  expect(end.o).toBe(1);
  // Only the grid row's size and opacity are transitioned: the rest is laid out once, not per frame.
  const props = await page.locator("details[open]").first().evaluate((el) => getComputedStyle(el, "::details-content").transitionProperty);
  expect(props).toBe("grid-template-rows, content-visibility");

  const closing = await sample(page, false);
  const shut = closing.find((s) => s.h <= closing[closing.length - 1]!.h + 1)!;
  expect(closing[0]!.h).toBeGreaterThan(shut.h + 40);
  expect(shut.t).toBeLessThan(grown.t); // quicker than opening (150 ms against 220 ms)
});

test("the entry that starts open just appears with the page: no fade the reader didn't ask for", async ({ page }) => {
  await page.goto("/changelog");
  await page.locator("[data-hydrated]").waitFor({ state: "attached" });
  const body = page.locator("details[open]").first().getByTestId("entry-body");
  await expect(body).toBeVisible();
  expect(await body.evaluate((el) => el.getAnimations().length)).toBe(0);
  await expect(body).toHaveCSS("opacity", "1");
});

test("reduced motion: nothing grows, the body still fades in", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/changelog");
  await page.locator("[data-hydrated]").waitFor({ state: "attached" });
  const opening = await sample(page, true);
  const end = opening[opening.length - 1]!;
  expect(opening[0]!.h).toBe(end.h);
  expect(opening[0]!.o).toBeLessThan(1);
});
