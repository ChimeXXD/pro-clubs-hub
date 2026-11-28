import { expect, test } from "@playwright/test";

// The Builds page (Figma 241:556 / 279:1399 / 276:1073, D-57, D-60). Preview only for now (D-105); emblems ship since D-106.
test.skip(process.env.PROBUILDS_DRAFTS !== "1", "preview page");

test("builds: pick an archetype from the rail and see its card and facts", async ({ page }) => {
  await page.goto("/builds");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Builds");
  await expect(page.getByTestId("bottom-nav").getByRole("link", { name: "Builds" })).toHaveAttribute("aria-current", "page");
  const finisher = page.getByTestId("emblem-finisher");
  await finisher.click();
  await expect(finisher).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("emblem-shot-stopper")).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByTestId("stance-card-finisher")).toBeVisible();
  await expect(page.getByText("Mastery attributes: Finishing, Composure")).toBeVisible();
  await expect(page.getByRole("link", { name: "See Finisher builds" })).toHaveAttribute("href", "/builds/finisher");
  await expect(page).toHaveURL(/#finisher$/);
  // Each emblem is at least a 44 px target.
  const box = await finisher.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
});

test("builds: a link with #target opens on Target, and the rail scrolls it into view", async ({ page }) => {
  await page.goto("/builds#target");
  const target = page.getByTestId("emblem-target");
  await expect(target).toHaveAttribute("aria-pressed", "true");
  await expect(target).toBeInViewport();
  await expect(page.getByRole("link", { name: "See Target builds" })).toBeVisible();
});

test("builds: on Figma's 393 px phone the picked emblem sits where 241:556 draws it, and every archetype has its mastery", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/builds#finisher");
  await expect(page.getByTestId("emblem-finisher")).toHaveAttribute("aria-pressed", "true");
  // The centred box sits at 168.5 (half of 393 less half of 56); Chrome paints it from 169 at 1x, as Figma draws it.
  await expect.poll(async () => (await page.getByTestId("emblem-finisher").boundingBox())?.x).toBe(168.5);
  // The six archetypes with no source before 26 Nov now show EA's pair (Pitch Notes table, RESEARCH §10.6).
  await page.getByTestId("emblem-spark").click();
  await expect(page.getByText("Mastery attributes: Crossing, Dribbling")).toBeVisible();
});

test("builds: swiping the card moves to the next archetype", async ({ page }) => {
  await page.goto("/builds#boss");
  const stage = page.getByTestId("stance-stage");
  const box = await stage.boundingBox();
  if (!box) throw new Error("no stage");
  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + box.width * 0.7, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.45, y, { steps: 6 });
  await page.mouse.move(box.x + box.width * 0.2, y, { steps: 6 });
  await page.mouse.up();
  await expect(page.getByTestId("emblem-marauder")).toHaveAttribute("aria-pressed", "true");
});

test("builds: mid-drag only the front card follows the finger; its neighbours stay put (Chime, 28 Nov)", async ({ page }) => {
  await page.goto("/builds#boss");
  const stage = page.getByTestId("stance-stage");
  const box = await stage.boundingBox();
  if (!box) throw new Error("no stage");
  const xOf = (id: string) => page.getByTestId(`stance-card-${id}`).evaluate((el) => el.getBoundingClientRect().x);
  // The cards slide to Boss on load (250 ms); measure once they have stopped.
  await expect.poll(async () => { const a = await xOf("progressor"); await page.waitForTimeout(80); return Math.round(a) === Math.round(await xOf("progressor")); }).toBe(true);
  const before = { front: await xOf("boss"), prev: await xOf("progressor"), next: await xOf("marauder") };
  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + box.width * 0.6, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.4, y, { steps: 6 });
  expect(Math.round((await xOf("boss")) - before.front)).toBeLessThan(-40);
  expect(Math.round(await xOf("progressor"))).toBe(Math.round(before.prev));
  expect(Math.round(await xOf("marauder"))).toBe(Math.round(before.next));
  await page.mouse.up();
});

test("builds on desktop: each signature PlayStyle is centred under its badge", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/builds#boss");
  const items = page.getByRole("heading", { name: "Signature PlayStyles" }).locator("xpath=following-sibling::ul[1]/li");
  await expect(items).toHaveCount(2);
  for (const li of await items.all()) {
    const centres = await li.evaluate((el) =>
      [...el.children].map((c) => { const r = c.getBoundingClientRect(); return Math.round(r.x + r.width / 2); }),
    );
    expect(new Set(centres).size, `centres ${centres.join(", ")}`).toBe(1);
  }
});

test("builds in light mode: PlayStyle badges are tinted by brightness, so dark-drawn symbols stay visible", async ({ page }) => {
  await page.goto("/builds#shot-stopper");
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  const mode = await page.getByTestId("playstyle-art").first().evaluate((el) => getComputedStyle(el).maskMode);
  expect(mode).toBe("luminance");
});

test("builds on desktop: previous and next step through the 13, with the count", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/builds#finisher");
  await expect(page.getByText("12 of 13", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Next archetype" }).click();
  await expect(page.getByText("13 of 13", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Next archetype" })).toBeDisabled();
  await page.getByRole("button", { name: "Previous archetype" }).click();
  await expect(page.getByTestId("emblem-finisher")).toHaveAttribute("aria-pressed", "true");
  // The title starts at the 120 px edge (D-59).
  expect((await page.getByRole("heading", { level: 1 }).boundingBox())?.x).toBe(120);
});
