import { expect, test } from "@playwright/test";

// The theme switch, option A (Figma 499:11271 / 499:11505 / 499:11728 dark, 499:11948 / 499:12246 / 499:12545 light;
// component "Theme switch" 497:976; D-112, D-114 (1)): a sun/moon button beside search in the top bar on every page.
// Dark by default; it shows the mode you would switch to; the choice is remembered on this browser and applied before
// the first paint.
const LIGHT_BG = "rgb(247, 243, 230)"; // bg/page, light (#f7f3e6)
const DARK_BG = "rgb(1, 38, 27)"; // bg/page, dark (#01261b)
const bg = (page: import("@playwright/test").Page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

for (const path of ["/", "/about", "/changelog", "/takedown"]) {
  test(`the switch is in the top bar on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByTestId("top-bar").getByRole("button", { name: "Switch to light mode" })).toBeVisible();
  });
}

test("one tap flips to light and back; the button shows the mode you would switch to", async ({ page }) => {
  await page.goto("/");
  expect(await bg(page)).toBe(DARK_BG);
  const bar = page.getByTestId("top-bar");
  await bar.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await bg(page)).toBe(LIGHT_BG);
  await bar.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", "light");
  expect(await bg(page)).toBe(DARK_BG);
});

test("the choice is remembered on this browser and applied before the page's scripts run (no flash)", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("top-bar").getByRole("button", { name: "Switch to light mode" }).click();
  // Block every script file: only the inline one in <head> can set the theme now.
  await page.route(/\.js(\?|$)/, (route) => route.abort());
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await bg(page)).toBe(LIGHT_BG);
  // The button shows the moon and its light-mode name without any script file either.
  await expect(page.getByTestId("top-bar").getByRole("button", { name: "Switch to dark mode" })).toBeVisible();
});

test("dark by default, even on a device set to light (D-112)", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  expect(await bg(page)).toBe(DARK_BG);
});

test("phone: season, switch and search sit side by side at the right, 44 px each (499:11455)", async ({ page }) => {
  await page.goto("/");
  const bar = page.getByTestId("top-bar");
  const season = await page.getByTestId("season-chip").boundingBox();
  const theme = await bar.getByRole("button", { name: "Switch to light mode" }).boundingBox();
  const search = await bar.getByRole("link", { name: "Search" }).boundingBox();
  expect(theme).toMatchObject({ width: 44, height: 44 });
  expect(Math.round((season?.x ?? 0) + (season?.width ?? 0))).toBe(Math.round(theme?.x ?? 0));
  expect(Math.round((theme?.x ?? 0) + 44)).toBe(Math.round(search?.x ?? 0));
  const width = page.viewportSize()?.width ?? 0;
  expect(Math.round(width - ((search?.x ?? 0) + 44))).toBe(20);
});

test("tablet: the switch is 16 px after the season chip and 4 px before search (499:11705)", async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 1194 });
  await page.goto("/");
  const bar = page.getByTestId("top-bar");
  const season = await page.getByTestId("season-chip").boundingBox();
  const theme = await bar.getByRole("button", { name: "Switch to light mode" }).boundingBox();
  const search = await bar.getByRole("button", { name: "Search" }).boundingBox(); // the Command button (#25)
  expect(Math.round((theme?.x ?? 0) - ((season?.x ?? 0) + (season?.width ?? 0)))).toBe(16);
  expect(Math.round((search?.x ?? 0) - ((theme?.x ?? 0) + 44))).toBe(4);
  expect(Math.round(834 - ((search?.x ?? 0) + 44))).toBe(40);
});
