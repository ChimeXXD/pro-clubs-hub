import { expect, type Page, test } from "@playwright/test";

// Motion on the Build page's summary column (motion-bookmarks.pdf / motion-placement.pdf): the Number stepper (#12)
// on "Your level". Preview only: the sample build is a draft.
test.skip(process.env.PROBUILDS_DRAFTS !== "1", "preview page");

const URL = "/builds/finisher/meta-finisher";

/** The animation names on the level number's spans: the arriving value first, then the leaving one if any. */
const levelRoll = (page: Page) =>
  page
    .getByTestId("level-switch")
    .getByLabel("Level", { exact: true })
    .locator(":scope > span > span")
    .evaluateAll((els) => els.map((e) => getComputedStyle(e).animationName));

/** Taps a stepper button (a pointer click, detail 1) and reads the level's animation names on the next frame, in the
 * page, so the 140 ms leaving value is still there to read however slow the test runner is. */
const tapAndRead = (page: Page, name: "Level down" | "Level up") =>
  page
    .getByTestId("level-switch")
    .evaluate(async (root, label) => {
      root.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
      await new Promise(requestAnimationFrame);
      return [...root.querySelectorAll('output[aria-label="Level"] > span > span')].map((e) => getComputedStyle(e).animationName);
    }, name);

test("number stepper: a tap rolls the level, the new value in from above when it falls", async ({ page }) => {
  await page.goto(URL);
  expect(await tapAndRead(page, "Level down")).toEqual(["roll-in-down", "roll-out-down"]);
  await expect(page.getByTestId("level-switch").getByLabel("Level", { exact: true })).toHaveText("32");
  await page.getByTestId("level-switch").getByRole("button", { name: "Level up" }).click();
  await page.waitForTimeout(200);
  await page.getByTestId("level-switch").getByRole("button", { name: "Level down" }).click();
  expect((await levelRoll(page))[0]).toBe("roll-in-down");
});

test("number stepper: a tap faster than the roll, or a key press, sets the number at once", async ({ page }) => {
  await page.goto(URL);
  const level = page.getByTestId("level-switch");
  // Two pointer taps 40 ms apart, both in the page so the runner's round trips can't stretch the gap: the second one
  // doesn't roll.
  await level.evaluate(async (root) => {
    const tap = (label: string) =>
      root.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
    tap("Level down");
    await new Promise((r) => setTimeout(r, 40));
    tap("Level up");
  });
  expect(await levelRoll(page)).toEqual(["none"]);
  await expect(level.getByLabel("Level", { exact: true })).toHaveText("55");
  // From the keyboard: no roll.
  await page.waitForTimeout(200);
  await level.getByRole("button", { name: "Level down" }).focus();
  await page.keyboard.press("Enter");
  await expect(level.getByLabel("Level", { exact: true })).toHaveText("32");
  expect(await levelRoll(page)).toEqual(["none"]);
  await page.getByRole("slider", { name: "Your level" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(level.getByLabel("Level", { exact: true })).toHaveText("55");
  expect(await levelRoll(page)).toEqual(["none"]);
});

test("number stepper with reduced motion: the numbers crossfade", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(URL);
  expect(await tapAndRead(page, "Level down")).toEqual(["fade-in", "fade-out"]);
});
