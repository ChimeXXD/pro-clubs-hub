import { expect, test } from "@playwright/test";

// The build page (Figma 298:3630 / 306:794 / 306:1286, D-63): one static page per build. Preview only (D-105): the
// one build is a draft, its values "PLACEHOLDER" as written.
test.skip(process.env.PROBUILDS_DRAFTS !== "1", "preview page");

const URL = "/builds/spark/spark-2008-winger";

test("build: the archetype page's card opens the build page, and the breadcrumb goes back", async ({ page }) => {
  await page.goto("/builds/spark");
  await page.getByTestId("build-card-spark-2008-winger").click();
  await expect(page).toHaveURL(new RegExp(`${URL}$`));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("2008 Winger");
  await expect(page.getByTestId("bottom-nav").getByRole("link", { name: "Builds" })).toHaveAttribute("aria-current", "page");
  const crumb = page.getByRole("navigation", { name: "Breadcrumb" });
  await expect(crumb.getByText("2008 Winger")).toHaveAttribute("aria-current", "page");
  await crumb.getByRole("link", { name: "Spark" }).click();
  await expect(page).toHaveURL(/\/builds\/spark$/);
});

test("build: the draft shows its version tag in words, its credit and every section, values as written", async ({ page }) => {
  await page.goto(URL);
  await expect(page.getByText("Draft", { exact: true })).toBeVisible();
  await expect(page.getByTestId("version-tag")).toHaveText("FC 27 · Season 2 · Not yet checked in game");
  await expect(page.getByText("Made by Chime in game", { exact: true })).toBeVisible();
  await expect(page.getByText("Level PLACEHOLDER · PLACEHOLDER cm · PLACEHOLDER kg")).toBeVisible();
  await expect(page.getByText("No picture yet, so it shows the ProBuilds face")).toBeVisible();
  for (const code of ["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"]) await expect(page.getByText(code, { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Specialization" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "PlayStyles+" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "PlayStyles", exact: true })).toBeVisible();
  await expect(page.getByText("Trickster").filter({ visible: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Attributes" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pace" })).toBeVisible();
  await expect(page.getByRole("listitem").filter({ hasText: "Acceleration" })).toContainText("PLACEHOLDER");
  // The face and the PlayStyle badges load (the share cards' images load lazily once the sheet opens).
  for (const img of await page.locator("main img").filter({ visible: true }).all()) expect(await img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
});

test("build: Share build opens the sheet; Copy link puts the page's address on the clipboard and says so", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(URL);
  const share = page.getByRole("button", { name: "Share build" });
  await share.click();
  const dialog = page.getByRole("dialog", { name: "Share build" });
  await expect(dialog).toBeVisible();
  // Focus moves into the sheet, and it sits at the bottom of the screen on phone.
  await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
  const bottom = async () => {
    const box = await dialog.boundingBox();
    return box && Math.round(box.y + box.height);
  };
  await expect.poll(bottom).toBe(page.viewportSize()?.height);
  await dialog.getByRole("button", { name: "Copy link" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(page.url());
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("status")).toHaveText("Link copied. Paste it in any chat.");
  await expect(share).toBeFocused();
});

test("build: Escape closes the share sheet and focus returns to Share build", async ({ page }) => {
  await page.goto(URL);
  const share = page.getByRole("button", { name: "Share build" });
  await share.click();
  await expect(page.getByRole("dialog", { name: "Share build" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Share build" })).toBeHidden();
  await expect(share).toBeFocused();
});

test("build on tablet: the summary is the 300 px left column, the share dialog is centred", async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 1100 });
  await page.goto(URL);
  const share = await page.getByRole("button", { name: "Share build" }).boundingBox();
  expect(share).toMatchObject({ x: 40, width: 300 });
  const raw = await page.getByText(/^Raw values, as with Attribute totals off/).filter({ visible: true }).boundingBox();
  expect(raw?.x).toBe(380);
  await page.getByRole("button", { name: "Share build" }).click();
  const dialog = page.getByRole("dialog", { name: "Share build" });
  await expect.poll(async () => {
    const box = await dialog.boundingBox();
    return box && [Math.round(box.x + box.width / 2), Math.round(box.width)];
  }).toEqual([417, 616]);
});

test("build on desktop: the 400 px summary and the details 64 px from it in the 1200 px column", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(URL);
  expect((await page.getByRole("navigation", { name: "Breadcrumb" }).boundingBox())?.x).toBe(120);
  expect(await page.getByRole("button", { name: "Share build" }).boundingBox()).toMatchObject({ x: 120, width: 400 });
  expect((await page.getByRole("heading", { name: "Attributes" }).boundingBox())?.x).toBe(584);
});

test("build: an unknown build is the 404", async ({ page }) => {
  expect((await page.goto("/builds/spark/no-such-build"))?.status()).toBe(404);
});
