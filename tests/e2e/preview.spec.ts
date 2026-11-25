import { expect, test } from "@playwright/test";

// Runs only on a preview build (npm run test:e2e:preview, D-104): the bar, noindex and draft tags show.
test.skip(process.env.PROBUILDS_DRAFTS !== "1", "needs a preview build");

test("the preview build says it is a preview, stays out of search, and tags drafts", async ({ page }) => {
  await page.goto("/changelog");
  await expect(page.getByTestId("preview-bar")).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  await expect(page.getByText("Draft", { exact: true }).first()).toBeVisible();
});
