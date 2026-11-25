import { expect, test } from "@playwright/test";

// The Builds page (Figma 241:556 / 279:1399 / 276:1073, D-57, D-60). Preview only until its emblems can ship (D-105).
test.skip(process.env.PROBUILDS_DRAFTS !== "1", "preview page");

test("builds: pick an archetype from the rail and see its card and facts", async ({ page }) => {
  await page.goto("/builds");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Builds");
  await expect(page.getByTestId("bottom-nav").getByRole("link", { name: "Builds" })).toHaveAttribute("aria-current", "page");
  const finisher = page.getByTestId("emblem-finisher");
  await finisher.click();
  await expect(finisher).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("emblem-shot-stopper")).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByTestId("stance-card-finisher")).toBeVisible();
  await expect(page.getByText("Mastery attributes: Finishing, Composure")).toBeVisible();
  await expect(page.getByRole("link", { name: "See Finisher builds" })).toHaveAttribute("href", "/builds/finisher");
  await expect(page).toHaveURL(/#finisher$/);
  // Each emblem is at least a 44 px target.
  const box = await finisher.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
});

test("builds: a link with #target opens on Target, and the rail scrolls it into view", async ({ page }) => {
  await page.goto("/builds#target");
  const target = page.getByTestId("emblem-target");
  await expect(target).toHaveAttribute("aria-pressed", "true");
  await expect(target).toBeInViewport();
  await expect(page.getByRole("link", { name: "See Target builds" })).toBeVisible();
});

test("builds: swiping the card moves to the next archetype", async ({ page }) => {
  await page.goto("/builds#boss");
  const stage = page.getByTestId("stance-stage");
  const box = await stage.boundingBox();
  if (!box) throw new Error("no stage");
  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + box.width * 0.7, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.45, y, { steps: 6 });
  await page.mouse.move(box.x + box.width * 0.2, y, { steps: 6 });
  await page.mouse.up();
  await expect(page.getByTestId("emblem-marauder")).toHaveAttribute("aria-pressed", "true");
});

test("builds on desktop: previous and next step through the 13, with the count", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/builds#finisher");
  await expect(page.getByText("12 of 13", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Next archetype" }).click();
  await expect(page.getByText("13 of 13", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Next archetype" })).toBeDisabled();
  await page.getByRole("button", { name: "Previous archetype" }).click();
  await expect(page.getByTestId("emblem-finisher")).toHaveAttribute("aria-pressed", "true");
  // The title starts at the 120 px edge (D-59).
  expect((await page.getByRole("heading", { level: 1 }).boundingBox())?.x).toBe(120);
});
