import { expect, type Page, test } from "@playwright/test";

// Motion on Submit a build (motion-bookmarks.pdf, motion-placement.pdf pages 10 to 12). Preview only: the editor opens
// on Figma's sample, a draft (D-105).
test.skip(process.env.PROBUILDS_DRAFTS !== "1", "preview page");

/** Clicks a button with a pointer (detail 1) or as Enter does (detail 0), in the page, and reads `read` on the next
 * frame, so a 140 ms roll is still there to see however slow the test runner is. */
const clickAndRead = <T,>(page: Page, selector: string, read: string, detail = 1) =>
  page.evaluate(
    async ([sel, fn, d]) => {
      document.querySelector<HTMLElement>(sel)!.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: d }));
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      return new Function(`return (${fn})()`)() as T;
    },
    [selector, read, detail] as const,
  );

const stepRoll = `() => [...document.querySelectorAll('[data-testid="step-count"] > span > span')].map((e) => getComputedStyle(e).animationName)`;

test("step progress: the step's number rolls up going forward, down going back; a key press doesn't roll (#9)", async ({ page }) => {
  await page.goto("/submit");
  await expect(page.getByTestId("step-count")).toHaveText("1 of 4");
  // Nothing rolls on the first step shown.
  expect(await page.evaluate(`(${stepRoll})()`)).toEqual(["none"]);
  expect(await clickAndRead<string[]>(page, '[data-testid="submit-next"]', stepRoll)).toEqual(["roll-in-up", "roll-out-up"]);
  await expect(page.getByTestId("step-count")).toHaveText("2 of 4");
  await page.waitForTimeout(200);
  expect(await clickAndRead<string[]>(page, '[data-testid="submit-actions"] button:first-child', stepRoll)).toEqual(["roll-in-down", "roll-out-down"]);
  await expect(page.getByTestId("step-count")).toHaveText("1 of 4");
  await page.waitForTimeout(200);
  expect(await clickAndRead<string[]>(page, '[data-testid="submit-next"]', stepRoll, 0)).toEqual(["none"]);
  await expect(page.getByTestId("step-count")).toHaveText("2 of 4");
});

test("step progress with reduced motion: the number crossfades", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/submit");
  expect(await clickAndRead<string[]>(page, '[data-testid="submit-next"]', stepRoll)).toEqual(["fade-in", "fade-out"]);
});

// Segmented control (#7): the lime pill is the chips' lime copy clipped to the picked chip; the clip travels on the
// fade spring; the new group's tiles fade and rise in, 0 / 45 / 80 ms apart.
const pillState = `() => {
  const pill = document.querySelector('[data-testid="group-pill"]');
  const row = pill.parentElement;
  const picked = row.querySelector('[data-testid="submit-group"][aria-pressed="true"]');
  const s = getComputedStyle(pill);
  const inset = s.clipPath.match(/[\\d.]+px/g).map(parseFloat);
  return {
    picked: picked.textContent,
    clip: inset.slice(0, 4),
    box: [picked.offsetTop, row.clientWidth - picked.offsetLeft - picked.offsetWidth, row.clientHeight - picked.offsetTop - picked.offsetHeight, picked.offsetLeft],
    transition: s.transitionProperty === "none" ? "none" : s.transitionProperty + " " + s.transitionDuration,
    tiles: [...document.querySelectorAll('[data-testid="archetype-tile"]')].map((t) => getComputedStyle(t).animationName + " " + getComputedStyle(t).animationDelay),
  };
}`;
type Pill = { picked: string; clip: number[]; box: number[]; transition: string; tiles: string[] };
const readPill = (page: Page) => page.evaluate(`(${pillState})()`) as Promise<Pill>;
/** Opens /submit once the script has placed the pill (the static page draws the picked chip lime by itself). */
const openStart = async (page: Page) => {
  await page.goto("/submit");
  await expect(page.getByTestId("group-pill")).not.toHaveCSS("clip-path", "none");
};

test("segmented control: the pill sits on the picked group and travels to the next one; the tiles rise in (#7)", async ({ page }) => {
  await openStart(page);
  const first = await readPill(page);
  expect(first.picked).toBe("Forward");
  expect(first.clip).toEqual(first.box);
  // The first view doesn't animate the tiles.
  expect(first.tiles.every((t) => t.startsWith("none"))).toBe(true);
  // From Keeper to Defender (the same row at 390 and 360): Keeper first, from the keyboard (at once).
  await clickAndRead(page, '[data-group="goalkeeper"]', "() => 0", 0);
  const start = await readPill(page);
  expect(start.picked).toBe("Keeper");
  const mid = await clickAndRead<Pill>(page, '[data-group="defender"]', pillState);
  expect(mid.picked).toBe("Defender");
  expect(mid.transition).toBe("clip-path 0.32s");
  // Two frames in, the pill is on its way: every edge between where it was (Keeper) and where it goes (Defender).
  mid.clip.forEach((edge, i) => expect(Math.min(start.box[i]!, mid.box[i]!) - 2 < edge && edge < Math.max(start.box[i]!, mid.box[i]!) + 2).toBe(true));
  expect(mid.clip.some((edge, i) => Math.abs(edge - mid.box[i]!) > 10)).toBe(true);
  expect(mid.tiles).toEqual(["fade-rise 0s", "fade-rise 0.045s", "fade-rise 0.08s"]);
  await expect
    .poll(async () => {
      const p = await readPill(page);
      return p.clip.map(Math.round).join() === p.box.map(Math.round).join();
    })
    .toBe(true);
  await expect(page.getByTestId("submit-group").and(page.locator("[aria-pressed=true]"))).toHaveText("Defender");
});

test("segmented control from the keyboard, and with reduced motion: the pill moves at once, the tiles don't rise", async ({ page }) => {
  await openStart(page);
  const key = await clickAndRead<Pill>(page, '[data-group="midfielder"]', pillState, 0);
  expect(key.transition).toBe("none");
  expect(key.clip).toEqual(key.box);
  expect(key.tiles.every((t) => t.startsWith("none"))).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.getByTestId("group-pill")).not.toHaveCSS("clip-path", "none");
  const reduced = await clickAndRead<Pill>(page, '[data-group="goalkeeper"]', pillState);
  expect(reduced.transition).toBe("none");
  expect(reduced.tiles).toEqual(["fade-in 0s", "fade-in 0s"]);
});

test("segmented control at 360 px: a pick on the other row of chips doesn't slide across both rows", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStart(page);
  // Forward wraps to the second row at 360 px.
  const cross = await clickAndRead<Pill>(page, '[data-group="defender"]', pillState);
  expect(cross.box[0]).toBe(0);
  expect(cross.transition).toBe("none");
  expect(cross.clip).toEqual(cross.box);
  // The tiles still rise in: the pick came from a pointer.
  expect(cross.tiles[0]).toBe("fade-rise 0s");
});

// Number stepper (#12): the level and every attribute roll on a tap of − / +; a key press, or a tap faster than the
// 140 ms roll, sets the number at once.
const rollOf = (testId: string) => `() => [...document.querySelectorAll('[data-testid="${testId}"] > span > span')].map((e) => getComputedStyle(e).animationName)`;
/** Two pointer taps `gap` ms apart, in the page, then the roll's animation names on the next frame. */
const doubleTap = (page: Page, selector: string, read: string, gap = 40) =>
  page.evaluate(
    async ([sel, fn, g]) => {
      const tap = () => document.querySelector<HTMLElement>(sel)!.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
      tap();
      await new Promise((r) => setTimeout(r, g));
      tap();
      await new Promise(requestAnimationFrame);
      return new Function(`return (${fn})()`)() as string[];
    },
    [selector, read, gap] as const,
  );

test("number stepper: the level rolls up on +, down on −; fast taps and key presses don't roll (#12)", async ({ page }) => {
  await openStart(page);
  await expect(page.getByTestId("level-number")).toHaveText("44");
  expect(await clickAndRead<string[]>(page, 'button[aria-label="Level up"]', rollOf("level-number"))).toEqual(["roll-in-up", "roll-out-up"]);
  await expect(page.getByTestId("level-number")).toHaveText("45");
  await page.waitForTimeout(200);
  expect(await clickAndRead<string[]>(page, 'button[aria-label="Level down"]', rollOf("level-number"))).toEqual(["roll-in-down", "roll-out-down"]);
  await page.waitForTimeout(200);
  expect(await doubleTap(page, 'button[aria-label="Level up"]', rollOf("level-number"))).toEqual(["none"]);
  await expect(page.getByTestId("level-number")).toHaveText("46");
  await page.waitForTimeout(200);
  expect(await clickAndRead<string[]>(page, 'button[aria-label="Level up"]', rollOf("level-number"), 0)).toEqual(["none"]);
  await expect(page.getByTestId("level-number")).toHaveText("47");
  await expect(page.getByTestId("submit-ap")).toContainText("Level 48 adds");
});

test("number stepper: an attribute's number rolls in its box; typing shows the field itself (#12)", async ({ page }) => {
  await page.goto("/submit?state=attributes");
  const row = page.getByTestId("attribute-row").filter({ hasText: "Acceleration" });
  await expect(row.getByTestId("attribute-value")).toHaveText("88");
  const sel = '[data-testid="attribute-row"]:has(#attr-acceleration)';
  expect(await clickAndRead<string[]>(page, `${sel} button[aria-label="Acceleration up"]`, `() => [...document.querySelectorAll('${sel} [data-testid="attribute-value"] > span > span')].map((e) => getComputedStyle(e).animationName)`)).toEqual([
    "roll-in-up",
    "roll-out-up",
  ]);
  await expect(page.getByRole("textbox", { name: "Acceleration", exact: true })).toHaveValue("89");
  await expect(row.getByTestId("attribute-value")).toHaveText("89");
  // The field's own text is see-through under the rolling number; typing hides the number and shows the field's.
  await expect(page.getByRole("textbox", { name: "Acceleration", exact: true })).toHaveCSS("color", "rgba(0, 0, 0, 0)");
  await page.getByRole("textbox", { name: "Acceleration", exact: true }).click();
  await expect(row.getByTestId("attribute-value")).toHaveCount(0);
  await expect(page.getByRole("textbox", { name: "Acceleration", exact: true })).not.toHaveCSS("color", "rgba(0, 0, 0, 0)");
  await page.getByRole("textbox", { name: "Acceleration", exact: true }).fill("90");
  await page.getByRole("textbox", { name: "Acceleration", exact: true }).blur();
  await expect(row.getByTestId("attribute-value")).toHaveText("90");
  expect(await doubleTap(page, `${sel} button[aria-label="Acceleration down"]`, `() => [...document.querySelectorAll('${sel} [data-testid="attribute-value"] > span > span')].map((e) => getComputedStyle(e).animationName)`)).toEqual(["none"]);
  await expect(row.getByTestId("attribute-value")).toHaveText("88");
});

// Exposure slider (#16): the level's track has a tick for every level; the knob and the fill settle on the level by
// transform with the settle spring; a key press moves them at once; a drag across a level gives a haptic tick.
const knob = (page: Page, slider: string) => page.locator(`div:has(> input[aria-label="${slider}"]) [data-part="knob"]`);
/** The slider's box, scrolled to the middle of the screen (clear of the sticky actions bar) for a mouse drag. */
const sliderBox = async (page: Page, name: string) => {
  const slider = page.getByRole("slider", { name });
  await slider.evaluate((el) => el.scrollIntoView({ block: "center" }));
  return (await slider.boundingBox())!;
};

test("exposure slider: 55 level ticks; the knob and fill settle by transform; keys move them at once (#16)", async ({ page }) => {
  await openStart(page);
  const track = page.locator('div:has(> input[aria-label="Level"])');
  const ticks = await track.locator('[data-part="ticks"]').evaluate((el) => {
    const t = el.getBoundingClientRect();
    return [...el.children].map((c) => (c.getBoundingClientRect().left - t.left) / t.width);
  });
  expect(ticks).toHaveLength(55);
  ticks.forEach((x, i) => expect(x).toBeCloseTo((i + 1) / 55, 2));
  // The page never scrolls sideways because of the knob.
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(await page.evaluate(() => document.documentElement.clientWidth));
  await page.getByRole("button", { name: "Level up" }).click();
  const k = knob(page, "Level");
  expect(await k.evaluate((el) => [getComputedStyle(el).transitionProperty, getComputedStyle(el).transitionTimingFunction.slice(0, 7)])).toEqual(["transform, translate, scale, rotate", "linear("]);
  expect(await track.locator('[data-part="fill"]').evaluate((el) => getComputedStyle(el).transitionProperty)).toBe("transform, translate, scale, rotate");
  // It lands at 45 / 55 of the track, the fill scaled to the same share.
  await expect.poll(() => k.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).e / el.parentElement!.clientWidth)).toBeCloseTo(45 / 55, 3);
  await expect.poll(() => track.locator('[data-part="fill"]').evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).a)).toBeCloseTo(45 / 55, 3);
  await page.getByRole("slider", { name: "Level" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("level-number")).toHaveText("46");
  expect(await k.evaluate((el) => getComputedStyle(el).transitionProperty)).toBe("none");
});

test("exposure slider: dragging across levels gives a light haptic tick per level where the phone can", async ({ page }) => {
  await page.addInitScript(() => {
    const calls: unknown[] = [];
    Object.assign(window, { vibrations: calls });
    Object.defineProperty(navigator, "vibrate", { value: (p: unknown) => (calls.push(p), true), configurable: true });
  });
  await openStart(page);
  const box = await sliderBox(page, "Level");
  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + 10 + (box.width - 20) * (44 / 55), y);
  await page.mouse.down();
  await page.mouse.move(box.x + 10 + (box.width - 20) * (40 / 55), y, { steps: 8 });
  await page.mouse.up();
  const level = Number(await page.getByTestId("level-number").textContent());
  expect(level).toBeLessThan(44);
  const calls = await page.evaluate(() => (window as unknown as { vibrations: unknown[] }).vibrations);
  expect(calls.length).toBeGreaterThan(0);
  expect(calls.every((c) => c === 5)).toBe(true);
});

// Range slider (#15): held, the knob grows 1.1× and a bubble with the value rides on it (follow spring); a key press
// shows neither and moves the knob at once.
test("range slider: holding the height knob grows it and shows the value on it; keys don't (#15)", async ({ page }) => {
  await openStart(page);
  const height = page.locator('div:has(> input[aria-label="Height"])');
  const dot = height.locator('[data-part="knob-dot"]');
  const bubble = height.locator('[data-part="bubble"]');
  await expect(bubble).toHaveCSS("opacity", "0");
  const box = await sliderBox(page, "Height");
  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + 10 + (box.width - 20) * (20 / 25), y);
  await page.mouse.down();
  await expect(dot).toHaveCSS("scale", "1.1");
  await expect(bubble).toHaveCSS("opacity", "1");
  await page.mouse.move(box.x + 10 + (box.width - 20) * (15 / 25), y, { steps: 5 });
  await expect(bubble).toHaveText(/^1\d\d cm$/);
  expect(await knob(page, "Height").evaluate((el) => getComputedStyle(el).transitionTimingFunction.slice(0, 7))).toBe("linear(");
  await page.mouse.up();
  await expect(dot).toHaveCSS("scale", "none");
  await expect(bubble).toHaveCSS("opacity", "0");
  // From the keyboard: no bubble, no grow, no glide.
  await page.getByRole("slider", { name: "Height" }).focus();
  await page.keyboard.press("ArrowRight");
  expect(await knob(page, "Height").evaluate((el) => getComputedStyle(el).transitionProperty)).toBe("none");
  await expect(bubble).toHaveCSS("opacity", "0");
});

test("range slider with reduced motion: the bubble only fades, the knob doesn't grow or glide", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openStart(page);
  const height = page.locator('div:has(> input[aria-label="Height"])');
  const box = await sliderBox(page, "Height");
  await page.mouse.move(box.x + 10 + (box.width - 20) * (20 / 25), box.y + box.height / 2);
  await page.mouse.down();
  await expect(height.locator('[data-part="bubble"]')).toHaveCSS("opacity", "1");
  await expect(height.locator('[data-part="knob-dot"]')).toHaveCSS("scale", "1");
  expect(await knob(page, "Height").evaluate((el) => getComputedStyle(el).transitionProperty)).toBe("none");
  await page.mouse.up();
});
