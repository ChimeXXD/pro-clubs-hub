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

// Exposure slider (#16): a tick per level with a taller one where the specialization unlocks; the knob and the fill
// settle on the level by transform (one small overshoot), at once from the keyboard; a haptic tick where supported.
const knobX = (page: Page) =>
  page.getByTestId("level-knob").evaluate((el) => {
    const r = el.firstElementChild!.getBoundingClientRect();
    const track = el.parentElement!.getBoundingClientRect();
    return (r.left + r.width / 2 - track.left) / track.width;
  });

test("exposure slider: a tick for every level and a taller one at the specialization (level 50)", async ({ page }) => {
  await page.goto(URL);
  // The moving knob never widens the page (a transformed box counts towards the scroll area).
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(await page.evaluate(() => document.documentElement.clientWidth));
  // 55 ticks, one per level at level / 55 of the track (as the knob sits): the first at level 1, the last at the end.
  const ticks = await page.getByTestId("level-ticks").evaluate((el) => {
    const t = el.getBoundingClientRect();
    return [...el.children].map((c) => {
      const r = c.getBoundingClientRect();
      return { x: (r.left - t.left) / t.width, w: r.width, h: r.height, special: c.getAttribute("data-testid") === "level-tick-special" };
    });
  });
  expect(ticks).toHaveLength(55);
  ticks.forEach((tick, i) => expect(tick.x).toBeCloseTo((i + 1) / 55, 3));
  expect(ticks.every((tick) => tick.w === 1)).toBe(true);
  // Only the specialization's tick (level 50) is taller.
  expect(ticks.filter((tick) => tick.special).map((tick) => [ticks.indexOf(tick) + 1, tick.h])).toEqual([[50, 8]]);
  expect(ticks.filter((tick) => !tick.special).every((tick) => tick.h === 4)).toBe(true);
});

test("exposure slider: the knob settles on the new level by transform, with one small overshoot", async ({ page }) => {
  await page.goto(URL);
  expect(await knobX(page)).toBeCloseTo(1, 2);
  const knob = page.getByTestId("level-knob");
  expect(await knob.evaluate((el) => [getComputedStyle(el).transitionProperty, getComputedStyle(el).transitionTimingFunction.slice(0, 7)])).toEqual(["transform, translate, scale, rotate", "linear("]);
  const frames = await page.getByTestId("level-switch").evaluate(async (root) => {
    const carrier = root.querySelector('[data-testid="level-knob"]')!;
    const k = carrier.firstElementChild!;
    const x = () => { const r = k.getBoundingClientRect(); const t = carrier.parentElement!.getBoundingClientRect(); return (r.left + r.width / 2 - t.left) / t.width; };
    root.querySelector<HTMLButtonElement>('button[aria-label="Level down"]')!.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
    const out: number[] = [];
    const t0 = performance.now();
    while (performance.now() - t0 < 600) { await new Promise(requestAnimationFrame); out.push(x()); }
    return out;
  });
  const target = 32 / 55;
  expect(frames.at(-1)).toBeCloseTo(target, 2);
  // It travelled (frames between the two levels) and overshot a little past 32 before settling.
  expect(frames.filter((f) => f < 0.95 && f > target + 0.02).length).toBeGreaterThan(2);
  expect(Math.min(...frames)).toBeLessThan(target - 0.005);
  expect(Math.min(...frames)).toBeGreaterThan(target - 0.1);
  // The fill ends under the knob's travel the same way (it moves with it).
  expect(await page.getByTestId("level-fill").evaluate((el) => getComputedStyle(el).transitionProperty)).toBe("transform, translate, scale, rotate");
});

test("exposure slider: arrow keys move the knob at once; reduced motion never animates it", async ({ page }) => {
  await page.goto(URL);
  const knob = page.getByTestId("level-knob");
  await page.getByRole("slider", { name: "Your level" }).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByTestId("level-switch").getByLabel("Level", { exact: true })).toHaveText("32");
  expect(await knob.evaluate((el) => getComputedStyle(el).transitionProperty)).toBe("none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  expect(await knob.evaluate((el) => getComputedStyle(el).transitionProperty)).toBe("none");
});

test("exposure slider: dragging across a detent gives a light haptic tick where the device can", async ({ page }) => {
  await page.addInitScript(() => {
    const calls: unknown[] = [];
    Object.assign(window, { vibrations: calls });
    Object.defineProperty(navigator, "vibrate", { value: (p: unknown) => (calls.push(p), true), configurable: true });
  });
  await page.goto(URL);
  const slider = page.getByRole("slider", { name: "Your level" });
  const box = (await slider.boundingBox())!;
  await page.mouse.move(box.x + box.width - 16, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height / 2, { steps: 6 });
  await page.mouse.up();
  await expect(page.getByTestId("level-switch").getByLabel("Level", { exact: true })).toHaveText("32");
  expect(await page.evaluate(() => (window as unknown as { vibrations: unknown[] }).vibrations)).toEqual([5]);
});

// Stat card (#13) and Storage meter (#14): the AP numbers roll with the level, numbers that didn't change stay still,
// and the bar under the AP line splits spent and left by scaleX.
const meter = (page: Page) =>
  page.getByTestId("ap-meter").evaluate((el) =>
    [...el.children].map((c) => ({ part: c.getAttribute("data-part"), scale: new DOMMatrixReadOnly(getComputedStyle(c).transform).a, transition: getComputedStyle(c).transitionProperty })),
  );

test("stat card: the AP numbers roll to their new values; the key stats, unchanged, stay still", async ({ page }) => {
  await page.goto(URL);
  const names = await page.getByTestId("level-switch").evaluate(async (root) => {
    root.querySelector<HTMLButtonElement>('button[aria-label="Level down"]')!.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
    await new Promise(requestAnimationFrame);
    return [...root.querySelectorAll("p b > span")].map((n) => [...n.children].map((c) => getComputedStyle(c).animationName));
  });
  // 1,419 → 724, 1,410 → 724, 9 → 0: all fall, so each arrives from above.
  expect(names).toEqual([["roll-in-down", "roll-out-down"], ["roll-in-down", "roll-out-down"], ["roll-in-down", "roll-out-down"]]);
  await expect(page.getByTestId("level-switch").getByText("AP at level 32: 724 · spent 724 · left 0")).toBeVisible();
  const stats = await page.getByRole("main").locator("dl").first().locator("dd > span > span").evaluateAll((els) => els.map((e) => getComputedStyle(e).animationName));
  expect(stats).toEqual(["none", "none", "none", "none", "none", "none"]);
});

test("storage meter: spent from the left and left over from the right, by scaleX, following the level", async ({ page }) => {
  await page.goto(URL);
  const before = await meter(page);
  expect(before.map((m) => m.part)).toEqual(["spent", "left"]);
  expect(before[0]!.scale).toBeCloseTo(1410 / 1419, 3);
  expect(before[1]!.scale).toBeCloseTo(9 / 1419, 3);
  expect(before.map((m) => m.transition)).toEqual(["transform, translate, scale, rotate", "transform, translate, scale, rotate"]);
  await page.getByTestId("level-switch").getByRole("button", { name: "Level down" }).click();
  await expect.poll(async () => (await meter(page)).map((m) => Math.round(m.scale * 1000) / 1000)).toEqual([1, 0]);
  // Level 32 is 695 AP short of the build: the spent bar turns to the danger colour.
  await expect(page.getByTestId("ap-meter").locator('[data-part="spent"]')).toHaveClass(/bg-status-danger/);
  // From the keyboard, and with reduced motion, the bar changes at once.
  await page.getByRole("slider", { name: "Your level" }).focus();
  await page.keyboard.press("ArrowRight");
  expect((await meter(page)).map((m) => m.transition)).toEqual(["none", "none"]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  expect((await meter(page)).map((m) => m.transition)).toEqual(["none", "none"]);
});
