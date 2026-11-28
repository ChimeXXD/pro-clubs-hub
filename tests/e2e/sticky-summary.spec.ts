import { expect, test } from "@playwright/test";

// D-115: on desktop the Build and face pages keep their summary column in view while the long column scrolls, but
// only when the column fits the window; a taller column stays in the flow so its bottom is never hidden.
test.skip(process.env.PROBUILDS_DRAFTS !== "1", "preview pages");

const position = (page: import("@playwright/test").Page, selector: string) =>
  page.locator(selector).first().evaluate((el) => getComputedStyle(el).position);

for (const [name, url, selector] of [
  ["build", "/builds/finisher/meta-finisher", "main div.desktop\\:w-100"],
  ["face", "/faces/cristiano-ronaldo-2008", '[data-testid="face-summary"]'],
] as const) {
  test(`${name} page: the summary column sticks when it fits a 1440 × 900 window`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url);
    await expect.poll(() => position(page, selector)).toBe("sticky");
  });

  test(`${name} page: the summary column scrolls with the page when the window is too short`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 600 });
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    expect(await position(page, selector)).toBe("static");
  });

  test(`${name} page: no sticky column on a phone`, async ({ page }) => {
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    expect(await position(page, selector)).toBe("static");
  });
}
