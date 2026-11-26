import { expect, test } from "@playwright/test";

// The archetype page (Figma 288:1031 / 290:796 / 290:1084, D-62): one static page per archetype. Preview only
// (D-105): the builds are drafts. Emblems ship since D-106. Spark has one draft; Finisher has Figma's sample (D-107).
test.skip(process.env.PROBUILDS_DRAFTS !== "1", "preview page");

test("archetype: See Finisher builds opens the Finisher page, and the breadcrumb goes back to it", async ({ page }) => {
  await page.goto("/builds#finisher");
  await page.getByRole("link", { name: "See Finisher builds" }).click();
  await expect(page).toHaveURL(/\/builds\/finisher$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Finisher");
  await expect(page.getByText("Forward · 1 build", { exact: true })).toBeVisible();
  await expect(page.getByTestId("build-card-meta-finisher")).toBeVisible();
  await expect(page.getByRole("img", { name: "Finisher" })).toBeVisible();
  await expect(page.getByTestId("bottom-nav").getByRole("link", { name: "Builds" })).toHaveAttribute("aria-current", "page");
  const crumb = page.getByRole("navigation", { name: "Breadcrumb" });
  await expect(crumb.getByText("Finisher")).toHaveAttribute("aria-current", "page");
  await crumb.getByRole("link", { name: "Builds" }).click();
  await expect(page).toHaveURL(/\/builds#finisher$/);
  await expect(page.getByTestId("emblem-finisher")).toHaveAttribute("aria-pressed", "true");
});

test("archetype: the draft build's card shows its values as written, its version tag and credit", async ({ page }) => {
  await page.goto("/builds/spark");
  await expect(page.getByText("Forward · 1 build", { exact: true })).toBeVisible();
  const card = page.getByTestId("build-card-spark-2008-winger");
  await expect(card).toHaveAttribute("href", "/builds/spark/spark-2008-winger");
  await expect(card.getByRole("heading", { level: 2 })).toHaveText("PLACEHOLDER");
  await expect(card.getByText("Draft", { exact: true })).toBeVisible();
  await expect(card.getByText("Level PLACEHOLDER · PLACEHOLDER cm · PLACEHOLDER kg")).toBeVisible();
  await expect(card.getByText("FC 27 · Season 2 · Not yet checked in game")).toBeVisible();
  await expect(card.getByText("Made by Chime in game")).toBeVisible();
  for (const code of ["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"]) await expect(card.getByText(code, { exact: true })).toBeVisible();
  await expect(card.getByText("Trickster")).toBeVisible();
  // The badges and the default face load.
  for (const img of await card.locator("img").all()) expect(await img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  // Phone is one column: no gap, so no Submit tile.
  await expect(page.getByTestId("submit-tile")).toBeHidden();
});

test("archetype on tablet: two across, the Submit tile fills the gap beside the one build", async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 1100 });
  await page.goto("/builds/spark");
  const card = await page.getByTestId("build-card-spark-2008-winger").boundingBox();
  const tile = page.getByTestId("submit-tile");
  await expect(tile).toBeVisible();
  await expect(tile).toHaveAttribute("href", "/submit");
  const box = await tile.boundingBox();
  expect(card && box && Math.round(box.x - (card.x + card.width))).toBe(24);
  expect(card && box && Math.round(box.height)).toBe(Math.round(card?.height ?? 0));
});

test("archetype on desktop: the 1200 px column starts at 120, and the tile spans the two empty cells", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/builds/spark");
  expect((await page.getByRole("navigation", { name: "Breadcrumb" }).boundingBox())?.x).toBe(120);
  const card = await page.getByTestId("build-card-spark-2008-winger").boundingBox();
  const tile = await page.getByTestId("submit-tile").boundingBox();
  expect(card?.width).toBe(384);
  expect(tile?.width).toBe(792);
});

test("archetype: every archetype has its page, and an unknown one is the 404", async ({ page, request }) => {
  for (const id of ["shot-stopper", "sweeper-keeper", "progressor", "boss", "marauder", "disruptor", "recycler", "maestro", "creator", "spark", "magician", "finisher", "target"]) {
    expect((await request.get(`/builds/${id}`)).status(), id).toBe(200);
  }
  expect((await page.goto("/builds/no-such-archetype"))?.status()).toBe(404);
});
