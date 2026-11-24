import { expect, test } from "@playwright/test";

const NOTICE = "Not endorsed by or affiliated with EA or its licensors. Not endorsed by the people named.";

test("home loads with the site name and the notice (CLAUDE.md rule 3)", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ProBuilds");
  await expect(page.getByTestId("site-notice")).toHaveText(NOTICE);
});
