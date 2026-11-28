import { expect, type Page, test } from "@playwright/test";

// Motion on Submit's Attributes step (motion-placement.pdf page 11): the Storage meter (#14) and the Star rating (#17).
// Preview only (the editor opens on Figma's sample, a draft).
test.skip(process.env.PROBUILDS_DRAFTS !== "1", "preview page");

const openAttributes = async (page: Page) => {
  await page.goto("/submit?state=attributes");
  await expect(page.getByTestId("ap-counter")).toBeVisible();
};

test("storage meter: the AP counter's bar is the share spent, drawn by scaleX, never by width (#14)", async ({ page }) => {
  await openAttributes(page);
  const bar = page.getByTestId("ap-meter-spent");
  const read = () =>
    bar.evaluate((el) => {
      const s = getComputedStyle(el);
      return { scale: new DOMMatrixReadOnly(s.transform).a, width: el.getBoundingClientRect().width / el.parentElement!.clientWidth, origin: s.transformOrigin.split(" ")[0], transition: s.transitionProperty };
    });
  const m = await read();
  // 1,011 spent of 1,062 at level 44 (Figma's sample).
  expect(m.scale).toBeCloseTo(1011 / 1062, 3);
  expect(m.width).toBeCloseTo(1011 / 1062, 2);
  expect(m.origin).toBe("0px");
  expect(m.transition).toBe("transform, translate, scale, rotate");
  await expect(bar).toHaveClass(/bg-accent-fill/);
  // The level is set on step 1: back there, a lower level fills the bar (the spend is capped at what the level gives).
  await page.getByRole("button", { name: "Back" }).click();
  for (let i = 0; i < 6; i++) await page.getByRole("button", { name: "Level down" }).click();
  await page.getByTestId("submit-next").click();
  await expect.poll(async () => (await read()).scale).toBeCloseTo(1, 3);
});

// Star rating (#17).
// The stars are drawn twice (a side column on desktop, after the groups on phone): the one on screen.
const GROUP = `[...document.querySelectorAll('[role="radiogroup"][aria-label="Skill Moves"]')].find((g) => g.offsetParent !== null)`;
const starState = `() => [...${GROUP}.querySelectorAll('[data-part="lit"]')].map((l) => ({ opacity: l.style.opacity, delay: getComputedStyle(l).transitionDelay, transition: getComputedStyle(l).transitionProperty }))`;
const tapStar = (page: Page, n: number, detail = 1) =>
  page.evaluate(
    async ([star, d, fn, g]) => {
      const group = new Function(`return ${g}`)() as HTMLElement;
      const button = group.querySelectorAll("button")[star - 1]!;
      button.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: d }));
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      const pops = button.querySelector('[data-part="star"]')!.getAnimations().map((a) => (a.effect as KeyframeEffect).getKeyframes().map((k) => Number(k.scale)));
      return { stars: new Function(`return (${fn})()`)() as { opacity: string; delay: string; transition: string }[], pops };
    },
    [n, detail, starState, GROUP] as const,
  );

test("star rating: the picked star pops; the stars before it fill left to right, 30 ms apart (#17)", async ({ page }) => {
  await openAttributes(page);
  // The sample has 4 Skill Moves. Tap 1: stars 2 to 4 go out together, star 1 pops.
  const down = await tapStar(page, 1);
  expect(down.stars.map((s) => s.opacity)).toEqual(["1", "0", "0", "0", "0"]);
  expect(down.stars.slice(1, 4).map((s) => s.delay)).toEqual(["0s", "0s", "0s"]);
  expect(down.pops).toHaveLength(1);
  expect(Math.max(...down.pops[0]!)).toBeCloseTo(1.15, 2);
  expect(down.pops[0]!.at(0)).toBe(1);
  expect(down.pops[0]!.at(-1)).toBe(1);
  await page.waitForTimeout(600);
  // Tap 5: stars 2, 3, 4 fill at 0, 30 and 60 ms; star 5 lights at once, under the finger, and pops.
  const up = await tapStar(page, 5);
  expect(up.stars.map((s) => s.opacity)).toEqual(["1", "1", "1", "1", "1"]);
  expect(up.stars.map((s) => s.delay)).toEqual(["0s", "0s", "0.03s", "0.06s", "0s"]);
  expect(up.stars.every((s) => s.transition === "opacity")).toBe(true);
  expect(up.pops).toHaveLength(1);
  await expect(page.getByRole("radiogroup", { name: "Skill Moves" }).getByRole("radio", { checked: true })).toHaveAccessibleName("5 stars");
});

test("star rating from the keyboard: the stars change at once, no pop; reduced motion: no pop, no wave", async ({ page }) => {
  await openAttributes(page);
  const key = await tapStar(page, 2, 0);
  expect(key.pops).toHaveLength(0);
  expect(key.stars.every((s) => s.transition === "all")).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.getByTestId("ap-counter")).toBeVisible();
  const reduced = await tapStar(page, 5);
  expect(reduced.pops).toHaveLength(0);
  expect(reduced.stars.every((s) => s.delay === "0s" && s.transition === "opacity")).toBe(true);
});

test("star rating on a computer: hovering previews the count at half strength; touch never does (#17)", async ({ browser, page }, info) => {
  // A desktop browser (a mouse that hovers), since the phone profiles report touch.
  const desk = await browser.newContext({ baseURL: info.project.use.baseURL, viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false });
  try {
    const p = await desk.newPage();
    await openAttributes(p);
    // Settled first (fonts in, the sample state's focus done), so nothing moves out from under the mouse.
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    const lit = p.getByRole("radiogroup", { name: "Skill Moves" }).locator('[data-part="lit"]');
    const read = () => lit.evaluateAll((els) => els.map((e) => (e as HTMLElement).style.opacity));
    // The sample has 4: hovering star 2 dims 3 and 4 to half; hovering 5 shows the fifth at half.
    await p.getByRole("radiogroup", { name: "Skill Moves" }).getByRole("radio", { name: "2 stars" }).hover();
    await expect.poll(read).toEqual(["1", "1", "0.5", "0.5", "0"]);
    await p.getByRole("radiogroup", { name: "Skill Moves" }).getByRole("radio", { name: "5 stars" }).hover();
    await expect.poll(read).toEqual(["1", "1", "1", "1", "0.5"]);
    await p.mouse.move(0, 0);
    await expect.poll(read).toEqual(["1", "1", "1", "1", "0"]);
  } finally {
    // Closed even when a check fails, so no browser context is left open.
    await desk.close();
  }
  // On the phone (touch), a tap leaves no preview behind.
  await openAttributes(page);
  await page.getByRole("radiogroup", { name: "Skill Moves" }).getByRole("radio", { name: "2 stars" }).tap();
  const phone = await page.getByRole("radiogroup", { name: "Skill Moves" }).locator('[data-part="lit"]').evaluateAll((els) => els.map((e) => (e as HTMLElement).style.opacity));
  expect(phone).toEqual(["1", "1", "0", "0", "0"]);
});
