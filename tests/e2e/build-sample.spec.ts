import { expect, test } from "@playwright/test";

// Figma's sample build (D-107) on the build page: every section the Build frames draw (298:3630), the level-32 state
// (371:1697) and the share sheet's story cards (319:904). Preview only: the sample is a draft.
test.skip(process.env.PROBUILDS_DRAFTS !== "1", "preview page");

const URL = "/builds/finisher/meta-finisher";

test("sample build: the header says it is a sample, with Figma's credit, and no Draft tag", async ({ page }) => {
  await page.goto(URL);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Meta Finisher");
  await expect(page.getByText("Sample build · values and prices not checked in game")).toBeVisible();
  await expect(page.getByText("Draft", { exact: true })).toHaveCount(0);
  await expect(page.getByTestId("version-tag")).toHaveText("FC 27 · Season 2 · Not yet checked in game");
  await expect(page.getByText("Made by — (sample) · Played for one match before it's called meta")).toBeVisible();
});

test("sample build: every drawn section shows its values, none as a dash", async ({ page }) => {
  await page.goto(URL);
  const main = page.getByRole("main");
  await expect(main.getByText("AP at level 55: 1,419 · spent 1,410 · left 9")).toBeVisible();
  await expect(main.getByText("Level 55 · 185 cm · 80 kg")).toBeVisible();
  const stats = [["PAC", "88"], ["SHO", "80"], ["PAS", "58"], ["DRI", "84"], ["DEF", "38"], ["PHY", "66"]] as const;
  for (const [code, value] of stats) {
    await expect(main.locator("dl").first().getByText(code, { exact: true }).locator("xpath=..")).toContainText(value);
  }
  await expect(page.getByTestId("all-of-it")).toHaveText("All of it at level 55Every step of the build fits, with 9 AP to spare.");
  await expect(main.getByText(/^Targets Ball Control, Composure, Reactions: one at 92, two at 90\./)).toBeVisible();
  await expect(main.getByText("Reached at level 55")).toBeVisible();
  await expect(main.getByText("Reached from level 50 with the sample prices. Counts raw values only.")).toBeVisible();
  await expect(main.getByText("Controlled Explosive")).toBeVisible();
  await expect(main.getByRole("listitem").filter({ hasText: "Finishing" })).toContainText("94");
  await expect(main.getByText(/^Draft only: PlayStyle icons are EA's art/)).toBeVisible();
  await expect(main.getByText("–", { exact: true })).toHaveCount(0);
});

test("sample build: Level down shows the drawn level-32 state, and Level up goes back to 55", async ({ page }) => {
  await page.goto(URL);
  const level = page.getByTestId("level-switch");
  await level.getByRole("button", { name: "Level down" }).click();
  await expect(level.getByLabel("Level", { exact: true })).toHaveText("32");
  await expect(level.getByText("AP at level 32: 724 · spent 724 · left 0")).toBeVisible();
  await expect(page.getByTestId("level-short")).toHaveText("At level 32 you're 695 AP short of this build. Its specialization needs level 50.");
  await level.getByRole("button", { name: "Level up" }).click();
  await expect(level.getByLabel("Level", { exact: true })).toHaveText("55");
  await expect(page.getByTestId("level-short")).toHaveCount(0);
});

test("sample build: the level slider snaps to the nearest drawn level", async ({ page }) => {
  await page.goto(URL);
  const slider = page.getByRole("slider", { name: "Your level" });
  await expect(slider).toHaveValue("55");
  await slider.fill("35");
  await expect(slider).toHaveValue("32");
  await expect(page.getByTestId("level-short")).toBeVisible();
  // The control is at least 44 px tall to touch.
  expect((await slider.boundingBox())?.height).toBeGreaterThanOrEqual(44);
});

test("sample build: the share sheet shows both story cards, the pager, Save images and the hint", async ({ page }) => {
  await page.goto(URL);
  await page.getByRole("button", { name: "Share build" }).click();
  const dialog = page.getByRole("dialog", { name: "Share build" });
  const cards = dialog.getByTestId("share-cards");
  await expect(cards.getByRole("figure", { name: "Share card 1 of 2" })).toBeVisible();
  await expect(cards.getByRole("figure", { name: "Share card 1 of 2" })).toContainText("probuilds.club/builds/finisher/meta-finisher");
  await expect(cards.getByRole("figure", { name: "Share card 2 of 2" })).toContainText("Meta Finisher · Level 55 · Finisher");
  await expect(dialog.getByText("1 of 2")).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Save images" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Copy link" })).toBeVisible();
  await expect(dialog.getByText("Saves both cards to your photos.", { exact: true })).toBeVisible();
  // Swiping to the second card moves the pager.
  await cards.evaluate((el) => el.scrollTo({ left: el.scrollWidth }));
  await expect(dialog.getByText("2 of 2")).toBeVisible();
  // The cards are drawn at 0.625 of 360 × 640.
  const box = await cards.getByRole("figure", { name: "Share card 1 of 2" }).boundingBox();
  expect(box && [Math.round(box.width), Math.round(box.height)]).toEqual([225, 400]);
});
