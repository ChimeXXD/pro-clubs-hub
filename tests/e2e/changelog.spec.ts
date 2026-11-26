import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

// The Changelog (Figma 383:3158 / 390:2540 / 390:2700). It lists exactly the published files in content/changelog.
const dir = join(process.cwd(), "content", "changelog");
// A preview build (D-104) also lists drafts; withdrawn entries never show.
const shown = new Set(process.env.PROBUILDS_DRAFTS === "1" ? ["published", "draft"] : ["published"]);
const published = readdirSync(dir).filter((f) => shown.has(JSON.parse(readFileSync(join(dir, f), "utf8")).status)).length;

test("the changelog page: title, line, the season card, and every published entry", async ({ page }) => {
  await page.goto("/changelog");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Changelog");
  await expect(page.getByText("What changed in FC 27 Clubs, with EA's notes as the source.")).toBeVisible();
  await expect(page.getByText("Season 3 starts Thu 3 Dec")).toBeVisible();
  await expect(page.locator('[data-testid^="changelog-entry-"]')).toHaveCount(published);
  await expect(page.getByTestId("bottom-nav").getByRole("link", { name: "Changelog" })).toHaveAttribute("aria-current", "page");
});

test("desktop: the header sits in the 352 px side column", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/changelog");
  const h1 = await page.getByRole("heading", { level: 1 }).boundingBox();
  expect(h1).toMatchObject({ x: 120, width: 352 });
});

test("the filter chips keep a 44 px tap area inside their scrolling row", async ({ page }) => {
  await page.goto("/changelog");
  const chips = page.locator('[data-testid^="filter-chip-"]');
  if ((await chips.count()) === 0) return; // no published entries yet, so no filters (checked in the render test)
  const box = await chips.first().boundingBox();
  if (!box) throw new Error("no chip box");
  // A tap 2 px above the 40 px pill still lands on the chip.
  const point: [number, number] = [box.x + box.width / 2, box.y - 1.5];
  const hit = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.closest("button")?.textContent ?? null, point);
  expect(hit).toBe("All");
});
