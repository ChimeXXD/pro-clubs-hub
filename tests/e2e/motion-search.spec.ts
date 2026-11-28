import { expect, type Locator, type Page, test } from "@playwright/test";

// Command button (motion-bookmarks #25, tablet and desktop) and Command palette (#26, desktop). Preview only: the
// Search page and the index the panel searches are Figma's samples (D-105). Each test sets its own viewport.
test.skip(process.env.PROBUILDS_DRAFTS !== "1", "preview page");

const transitions = (el: Locator) =>
  el.evaluate((node) =>
    node
      .getAnimations()
      .filter((a): a is CSSTransition => a instanceof CSSTransition)
      .map((a) => a.transitionProperty),
  );
const settle = (page: Page) => page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => null))));
const openSearch = async (page: Page) => {
  await page.getByTestId("top-bar").getByRole("button", { name: "Search" }).click();
  return page.getByTestId("top-search");
};

test("tablet: the search icon widens into a field in place by clip-path; Enter goes to Search", async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 1194 });
  await page.goto("/");
  const trigger = page.getByTestId("top-bar").getByRole("button", { name: "Search" });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  const form = await openSearch(page);
  // Only the clip moves on the way in: the field is opaque from the first frame, so the chip behind never shows.
  expect(await transitions(form)).toEqual(["clip-path"]);
  await expect(page.getByTestId("top-search-input")).toBeFocused();
  await settle(page);
  // The whole field shows, full size from the start (only the clip moved), its icon where the button's was.
  expect(await form.evaluate((el) => getComputedStyle(el).clipPath)).toBe("inset(0px round 8px)");
  const [box, button] = [await form.boundingBox(), await trigger.boundingBox()];
  expect(box?.width).toBe(320);
  expect(box && button && Math.abs(box.x + box.width - (button.x + button.width))).toBeLessThan(1);
  await page.getByTestId("top-search-input").fill("Ronaldo");
  await expect(page.getByTestId("top-search-panel")).toHaveCount(0); // tablet keeps the Search page
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/search\?q=Ronaldo$/);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  // From the Search page itself, a new search shows its results.
  await openSearch(page);
  await page.getByTestId("top-search-input").fill("Neymar");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/search\?q=Neymar$/);
  await expect(page.getByTestId("search-count")).toHaveText("2 results for “Neymar”");
});

test("Esc closes it at once (nothing animates on keyboard input); a click elsewhere closes it eased", async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 1194 });
  await page.goto("/");
  const form = await openSearch(page);
  await settle(page);
  await page.keyboard.press("Escape");
  expect(await form.evaluate((el) => getComputedStyle(el).transitionDuration)).toBe("0s");
  await expect(form).toBeHidden();
  await expect(page.getByTestId("top-bar").getByRole("button", { name: "Search" })).toBeFocused();

  await openSearch(page);
  await settle(page);
  await page.mouse.click(400, 600);
  expect(await transitions(form)).toEqual(expect.arrayContaining(["clip-path"]));
  await expect(form).toBeHidden();
});

test("reduced motion: the field fades in, nothing widens", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 834, height: 1194 });
  await page.goto("/");
  const form = await openSearch(page);
  const moving = await transitions(form);
  expect(moving).toContain("opacity");
  expect(moving).not.toContain("clip-path");
});

test("desktop: results open in a panel under the field; ↓ moves one highlight at once, a pointer glides it; Enter opens", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await openSearch(page);
  await page.getByTestId("top-search-input").fill("Ronaldo");
  const panel = page.getByTestId("top-search-panel");
  await expect(panel.getByRole("status")).toHaveText("2 results for “Ronaldo”");
  const options = panel.getByRole("option");
  await expect(options).toHaveCount(2);
  await expect(options.nth(0)).toHaveAttribute("aria-selected", "true");
  // 8 px under the field (DESIGN.md: menus open 8 px under their trigger on a computer).
  const [field, box] = [await page.getByTestId("top-search").boundingBox(), await panel.boundingBox()];
  expect(field && box && Math.round(box.y - (field.y + field.height))).toBe(8);
  const highlight = page.getByTestId("top-search-highlight");
  await page.keyboard.press("ArrowDown");
  await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");
  expect(await transitions(highlight)).toEqual([]); // keyboard: it jumps
  const second = await options.nth(1).boundingBox();
  const shape = await highlight.boundingBox();
  expect(second && shape && Math.abs(second.y - shape.y)).toBeLessThan(1);
  await options.nth(0).hover();
  await expect(options.nth(0)).toHaveAttribute("aria-selected", "true");
  expect(await transitions(highlight)).toContain("transform"); // pointer: it glides
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/faces\/cristiano-ronaldo-2008\/?$/);
});
