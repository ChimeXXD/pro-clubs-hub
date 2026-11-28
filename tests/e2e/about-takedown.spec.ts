import { expect, test } from "@playwright/test";

// About (Figma 416:3589 / 418:3457 / 418:3567) and Takedown (417:3706 / 418:3678 / 418:3784), option C (D-91).

test("about: title, the answered questions open, and the notice card", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("About ProBuilds");
  await expect(page.getByText("The short answers. Free, always.")).toBeVisible();
  const first = page.getByRole("group").filter({ hasText: "What is ProBuilds?" });
  await expect(first.getByText(/^Faces and builds for EA SPORTS FC 27 Clubs\./)).toBeVisible();
  await expect(page.getByText(/^Chime and Sharon, in game, on their own consoles\./)).toBeVisible();
  await expect(page.getByText("Not EA, not the people named")).toBeVisible();
  // Closing a question hides its answer; the row stays a 44 px target.
  const summary = first.locator("summary");
  expect((await summary.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  await summary.click();
  await expect(first.getByText(/^Faces and builds/)).toBeHidden();
  // No section is current, so the bottom nav shows no pill.
  await expect(page.getByTestId("bottom-nav").locator("[aria-current=page]")).toHaveCount(0);
});

test("about on desktop: the questions sit in the right column", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1015 });
  await page.goto("/about");
  expect((await page.getByRole("heading", { level: 1 }).boundingBox())?.x).toBe(120);
  const q = await page.getByRole("group").first().boundingBox();
  expect(q?.x).toBe(616);
  expect(q?.width).toBe(704);
});

test("takedown: the 72-hour promise, three steps, and a way to email", async ({ page }) => {
  await page.goto("/takedown");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Takedown");
  await expect(page.getByTestId("takedown-promise")).toHaveText("72 hours");
  const steps = page.getByRole("list", { name: "What happens" }).getByRole("listitem");
  await expect(steps).toHaveCount(3);
  await expect(steps.nth(0)).toContainText("You email us");
  await expect(steps.nth(2)).toContainText("Off its page, every list and every link, within 72 hours");
  await expect(page.getByTestId("takedown-email")).toHaveAttribute("href", "mailto:takedown@probuilds.club");
  await expect(page.getByText("Withdrawn means gone: it isn't built, listed or linked again.")).toBeVisible();
});

test("takedown: Copy puts the address on the clipboard and says so in a toast", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/takedown");
  await page.getByRole("button", { name: "Copy" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("takedown@probuilds.club");
  await expect(page.getByRole("status")).toHaveText("Email copied");
});

test("takedown on desktop: the email card is the 440 px right column", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/takedown");
  const card = await page.getByTestId("takedown-card").boundingBox();
  expect(card).toMatchObject({ x: 880, width: 440 });
});

test("about: the six questions Figma draws closed show on the preview only, closed (416:3589, O-22 (3))", async ({ page }) => {
  await page.goto("/about");
  const unanswered = page.getByRole("group").filter({ hasText: "Are you part of EA?" });
  if (process.env.PROBUILDS_DRAFTS === "1") {
    await expect(page.getByRole("group")).toHaveCount(8);
    await expect(unanswered).not.toHaveAttribute("open");
  } else {
    await expect(page.getByRole("group")).toHaveCount(2);
  }
});
