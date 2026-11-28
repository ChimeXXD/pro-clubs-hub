import { expect, test } from "@playwright/test";

// The 404 (Figma 420:4819 / 423:4713 / 423:4836): the replay card (D-93), no search (D-95).

test("an unknown address shows the 404 with its way back to faces and builds", async ({ page }) => {
  const res = await page.goto("/no-such-page");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Over the bar");
  await expect(page.getByText("That link went high. The page may have moved, or what was on it has been taken down.")).toBeVisible();
  await expect(page.getByRole("main").getByRole("link", { name: "Faces" })).toHaveAttribute("href", "/faces");
  await expect(page.getByRole("main").getByRole("link", { name: "Builds" })).toHaveAttribute("href", "/builds");
  await expect(page.getByRole("searchbox")).toHaveCount(0);
});

test("the shot plays once on arrival (0.6 s) and again on Replay", async ({ page }) => {
  await page.goto("/no-such-page");
  const ball = page.getByTestId("replay-ball");
  const running = () => ball.evaluate((el) => el.getAnimations().map((a) => ({ state: a.playState, duration: a.effect?.getTiming().duration })));
  expect((await running())[0]?.duration).toBe(600);
  await expect.poll(async () => (await running()).every((a) => a.state === "finished"), { timeout: 2000 }).toBe(true);
  await page.getByRole("button", { name: "Replay" }).click();
  await expect.poll(async () => (await running()).some((a) => a.state === "running")).toBe(true);
});

test("with reduced motion the last frame shows and Replay is hidden (D-93)", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/no-such-page");
  expect(await page.getByTestId("replay-ball").evaluate((el) => el.getAnimations().length)).toBe(0);
  await expect(page.getByRole("button", { name: "Replay" })).toBeHidden();
});

test("tablet and desktop: copy on the left, the card on the right (370 / 600 px)", async ({ page }) => {
  for (const [width, height, x, w] of [[834, 712, 424, 370], [1440, 891, 720, 600]] as const) {
    await page.setViewportSize({ width, height });
    await page.goto("/no-such-page");
    expect(await page.getByTestId("replay-card").boundingBox()).toMatchObject({ x, width: w });
  }
});
