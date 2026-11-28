import { expect, type Locator, test } from "@playwright/test";

// Request a face's motion (motion-bookmarks #21 Like burst, #28 Ghost suggestion, #29 Letter limit, #19 Loading to
// success; #6 Tab pill is in motion-pill.spec.ts). Preview only: the stand-in list and sending (D-105).
test.skip(process.env.PROBUILDS_DRAFTS !== "1", "preview page");

/** Each running animation in `root`: its CSS name ("transition" for a CSS transition, null for a Web Animation). */
const animations = (root: Locator) =>
  root.evaluate((el) =>
    el.getAnimations({ subtree: true }).map((a) => ({
      name: a instanceof CSSAnimation ? a.animationName : a instanceof CSSTransition ? "transition" : null,
      props: [...new Set((a.effect as KeyframeEffect).getKeyframes().flatMap((k) => Object.keys(k)))].filter(
        (p) => !["offset", "easing", "composite", "computedOffset"].includes(p),
      ),
    })),
  );

test("a vote: the arrow pops, six dots burst out and fade, the count rolls up", async ({ page }) => {
  await page.goto("/faces/request");
  const kanye = page.getByRole("button", { name: /^Vote for Kanye West/ });
  await kanye.click();
  const moving = await animations(kanye);
  const web = moving.filter((a) => a.name === null);
  expect(web.filter((a) => a.props.join() === "transform")).toHaveLength(1); // the arrow
  expect(web.filter((a) => a.props.sort().join() === "opacity,transform")).toHaveLength(6); // the dots
  expect(moving.map((a) => a.name)).toEqual(expect.arrayContaining(["roll-in-up", "roll-out-up"]));
  await expect(kanye).toHaveText("168");
});

test("a vote from the keyboard counts without the burst (nothing animates on keyboard input)", async ({ page }) => {
  await page.goto("/faces/request");
  const burna = page.getByRole("button", { name: /^Vote for Burna Boy/ });
  await burna.focus();
  await page.keyboard.press("Enter");
  expect((await animations(burna)).filter((a) => a.name === null)).toHaveLength(0);
  await expect(burna).toHaveText("97");
});

test("reduced motion: no burst, the count crossfades", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/faces/request");
  const bolt = page.getByRole("button", { name: /^Vote for Usain Bolt/ });
  await bolt.click();
  const moving = await animations(bolt);
  expect(moving.filter((a) => a.name === null)).toHaveLength(0);
  expect(moving.map((a) => a.name)).toEqual(expect.arrayContaining(["fade-in", "fade-out"]));
});

test("a vote that fails rolls the count back down", async ({ page }) => {
  await page.goto("/faces/request?vote=fail");
  const burna = page.getByRole("button", { name: /^Vote for Burna Boy/ });
  await burna.click();
  await expect(page.getByText("Your vote didn't go through. Try again.")).toBeVisible();
  await expect.poll(async () => (await animations(burna)).map((a) => a.name)).toContain("roll-in-down");
  await expect(burna).toHaveText("96");
});

test("ghost suggestion: the rest of a name already asked for shows muted; Tab takes it, → too", async ({ page }) => {
  await page.goto("/faces/request");
  const field = page.getByLabel("Who do you want?");
  await field.fill("Kan");
  const ghost = page.getByTestId("name-ghost");
  // The typed part is there but invisible (it holds the place); the rest is muted.
  await expect(ghost.locator("span").first()).toHaveText("Kan");
  await expect(ghost.locator("span").first()).toHaveCSS("visibility", "hidden");
  await expect(ghost.locator("span").last()).toHaveText("ye West");
  await expect(ghost.locator("span").last()).toHaveClass(/text-text-muted/);
  await expect(ghost).toHaveAttribute("aria-hidden", "true");
  await field.press("Tab");
  await expect(field).toHaveValue("Kanye West");
  await expect(field).toBeFocused();
  await expect(ghost).toHaveCount(0);
  // Typed words that aren't the start of the name: the Vote row still finds it, but there is no ghost to take.
  await field.fill("West");
  await expect(page.getByTestId("already-asked")).toBeVisible();
  await expect(ghost).toHaveCount(0);
  await field.fill("burna");
  await field.press("ArrowRight");
  await expect(field).toHaveValue("Burna Boy");
});

test("letter limit: past half of the 80 the ring shows; in the last 10 it turns amber and says what's left", async ({ page }) => {
  await page.goto("/faces/request");
  const field = page.getByLabel("Who do you want?");
  await expect(field).toHaveAttribute("maxlength", "80");
  await field.fill("2006 Ronaldinho");
  await expect(page.getByTestId("name-limit")).toHaveCount(0);
  await field.fill("Ronaldinho Gaúcho, Barcelona 2006, long hair and headband");
  const limit = page.getByTestId("name-limit");
  await expect(limit).toBeVisible();
  await expect(limit).toHaveText("");
  await field.fill("Ronaldinho Gaúcho, Barcelona 2006, long hair, headband and the Champions League kit");
  await expect(field).toHaveValue(/^.{80}$/u);
  await expect(limit).toHaveText("0");
  const [warn, colour] = await Promise.all([
    page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-status-warning")),
    limit.evaluate((el) => getComputedStyle(el).color),
  ]);
  expect(warn).toBeTruthy();
  expect(colour).not.toBe(await page.getByTestId("request-form").locator("p.text-text-muted").first().evaluate((el) => getComputedStyle(el).color));
  await expect(limit).toHaveAttribute("aria-hidden", "true"); // no screen-reader wording decided yet
  // Each key changes it at once: nothing in the field animates.
  expect(await animations(page.getByTestId("request-form"))).toEqual([]);
});

test("sent: the card's check draws in; a failed request shakes the button 4 px", async ({ page }) => {
  await page.goto("/faces/request");
  await page.getByLabel("Who do you want?").fill("2010 Messi");
  await page.getByRole("button", { name: "Request" }).click();
  await expect(page.getByTestId("request-sent")).toBeVisible();
  const check = await page.getByTestId("sent-check").evaluate((el) => getComputedStyle(el).animationName);
  expect(check).toBe("check-in");

  await page.goto("/faces/request?request=fail");
  await page.getByLabel("Who do you want?").fill("2010 Messi");
  await page.getByRole("button", { name: "Request" }).click();
  const retry = page.getByRole("button", { name: "Try again" });
  await expect(retry).toBeVisible();
  expect(await retry.evaluate((el) => getComputedStyle(el).animationName)).toBe("shake");
});
