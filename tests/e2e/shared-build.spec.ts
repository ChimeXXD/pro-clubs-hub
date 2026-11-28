import { expect, test } from "@playwright/test";

// A player's shared build at /b/<id> (Figma 439:8847, D-99 (2), D-100): one static page that loads the build in the
// browser; Cloudflare (and scripts/serve-out.mjs) rewrite /b/* to it. Preview only (D-105): with no Supabase project
// yet, the preview opens Figma's sample at /b/k7x2m9 and any other id is a link that doesn't work.
test.skip(process.env.PROBUILDS_DRAFTS !== "1", "preview page");

test("shared build: /b/k7x2m9 opens Figma's sample with the shared header, and keeps its address", async ({ page }) => {
  await page.goto("/b/k7x2m9");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("My Finisher");
  await expect(page).toHaveURL(/\/b\/k7x2m9$/);
  const crumb = page.getByRole("navigation", { name: "Breadcrumb" });
  await expect(crumb.getByRole("link", { name: "Builds" })).toHaveAttribute("href", "/builds");
  await expect(crumb.getByText("Shared build")).toHaveAttribute("aria-current", "page");
  const main = page.getByRole("main");
  await expect(main.getByText("Shared build", { exact: true }).nth(0)).toBeVisible();
  await expect(main.getByText("Shared by a player · not on ProBuilds' lists yet")).toBeVisible();
  await expect(page.getByTestId("version-tag")).toHaveText("FC 27 · Season 2 · Not yet checked in game");
  await expect(main.getByText("Shared from Submit a build")).toBeVisible();
  await expect(page.getByTestId("shared-note")).toHaveText("A player shared this build. It goes on ProBuilds' lists only after Chime plays it in game.");
  await expect(main.getByRole("link", { name: "Make your own build" })).toHaveAttribute("href", "/submit");
  await expect(main.getByText("Meta pick")).toHaveCount(0);
  // No tab is lit in the nav (D-100 (1)).
  await expect(page.getByTestId("bottom-nav").locator("[aria-current=page]")).toHaveCount(0);
  // The story cards carry the short link.
  await page.getByRole("button", { name: "Share build" }).click();
  await expect(page.getByRole("dialog").getByRole("figure", { name: "Share card 1 of 2" })).toContainText("probuilds.club/b/k7x2m9");
});

test("shared build: Figma's order, the note over Share build over Make your own build, 20 px apart (439:8862)", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/b/k7x2m9");
  const note = await page.getByTestId("shared-note").boundingBox();
  const share = await page.getByRole("button", { name: "Share build" }).boundingBox();
  const own = await page.getByRole("link", { name: "Make your own build" }).boundingBox();
  expect(note && share && Math.round(share.y - (note.y + note.height))).toBe(20);
  expect(share && own && [Math.round(own.y - (share.y + share.height)), Math.round(own.height), Math.round(own.width)]).toEqual([20, 52, 353]);
});

test("shared build: an id with no build is the link that doesn't work, with Browse builds and Make your own", async ({ page }) => {
  for (const path of ["/b/zz9zz9", "/b", "/b/not-an-id"]) {
    await page.goto(path);
    const missing = page.getByTestId("shared-build-missing");
    await expect(missing.getByRole("heading", { level: 1 })).toHaveText("This build link doesn't work");
    await expect(missing.getByText("It may have been removed, or the link was copied wrong. Ask whoever sent it for a new one.")).toBeVisible();
    await expect(missing.getByText("Build not found")).toBeVisible();
    await expect(missing.getByRole("link", { name: "Browse builds" })).toHaveAttribute("href", "/builds");
    await expect(missing.getByRole("link", { name: "Make your own" })).toHaveAttribute("href", "/submit");
  }
});

test("shared build missing: phone stacks the card over the copy, desktop puts it right (440:8514, 440:8734)", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/b/zz9zz9");
  await page.addStyleTag({ content: "[data-testid=preview-bar]{display:none!important}" });
  const card = page.getByTestId("shared-build-missing").locator("> div").first();
  await expect.poll(async () => (await card.boundingBox())?.y).toBe(100);
  expect((await card.boundingBox())?.height).toBe(240);
  expect((await page.getByRole("heading", { level: 1 }).boundingBox())?.y).toBe(364);
  await page.setViewportSize({ width: 1440, height: 900 });
  const box = await card.boundingBox();
  expect(box && [box.x, box.y, box.width, box.height]).toEqual([800, 144, 520, 290]);
});
