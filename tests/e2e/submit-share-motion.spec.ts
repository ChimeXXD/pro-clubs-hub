import { expect, type Page, test } from "@playwright/test";

// Motion on Submit's last step, Name it and share (motion-placement.pdf page 12): File drop (#27), Letter limit (#29),
// Loading to success (#19), Copy button (#20) and Fan cards (#2). Preview only (the sample is a draft).
test.skip(process.env.PROBUILDS_DRAFTS !== "1", "preview page");

const openName = async (page: Page) => {
  await page.goto("/submit?state=name");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Name it and share");
};

/** Drags a picture over "Your Pro's face" (dragenter + dragover with a file in the DataTransfer), and drops it or leaves. */
const drag = (page: Page, end: "drop" | "leave" | null) =>
  page.evaluate(async (finish) => {
    const slot = document.querySelector<HTMLElement>('[data-testid="pro-face"]')!;
    const blob = await (await fetch("/art/probuilds-face.svg")).blob();
    const dt = new DataTransfer();
    dt.items.add(new File([blob], "face.svg", { type: "image/svg+xml" }));
    const fire = (type: string, target: EventTarget = slot) => target.dispatchEvent(new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: dt }));
    fire("dragenter");
    fire("dragover");
    if (finish === "drop") fire("drop");
    if (finish === "leave") slot.dispatchEvent(new DragEvent("dragleave", { bubbles: true, cancelable: true, dataTransfer: dt, relatedTarget: document.body }));
  }, end);

const slotState = (page: Page) =>
  page.getByTestId("pro-face").evaluate((el) => ({
    over: el.hasAttribute("data-over"),
    translate: getComputedStyle(el).translate,
    transition: getComputedStyle(el).transitionProperty,
    tint: getComputedStyle(el.querySelector('[data-part="drop-tint"]')!).opacity,
    shadow: getComputedStyle(el.querySelector('[data-part="drop-shadow"]')!).opacity,
  }));

test("file drop: the slot lifts and tints while a picture is dragged over it, and settles when it leaves (#27)", async ({ page }) => {
  await openName(page);
  const rest = await slotState(page);
  expect(rest).toMatchObject({ over: false, tint: "0", shadow: "0" });
  await drag(page, null);
  await expect.poll(() => slotState(page)).toMatchObject({ over: true, translate: "0px -4px", tint: "1", shadow: "1" });
  expect((await slotState(page)).transition).toContain("transform");
  await page.getByTestId("pro-face").evaluate((el) => el.dispatchEvent(new DragEvent("dragleave", { bubbles: true, relatedTarget: document.body })));
  await expect.poll(() => slotState(page)).toMatchObject({ over: false, translate: "none", tint: "0" });
});

test("file drop: a dropped picture fades in over the mannequin; Remove fades it back out (#27)", async ({ page }) => {
  await openName(page);
  await drag(page, "drop");
  const face = page.getByTestId("pro-face");
  await expect(face).toContainText("Your pictureOn your card. Swap it any time.");
  const picture = face.locator('[data-part="picture"]');
  await expect(picture).toHaveAttribute("src", /^blob:/);
  expect(await picture.evaluate((el) => getComputedStyle(el).transitionProperty)).toBe("opacity");
  await expect(picture).toHaveCSS("opacity", "1");
  await expect(page.getByTestId("your-card").locator("img[src^='blob:']")).toHaveCount(1);
  expect((await slotState(page)).over).toBe(false);
  await face.getByRole("button", { name: "Remove" }).click();
  await expect(face).toContainText("No picture yet");
  // The picture stays drawn while it fades to the mannequin, hidden from screen readers, then leaves the page.
  await expect(picture).toHaveAttribute("aria-hidden", "true");
  await expect(picture).toHaveCount(0);
});

test("file drop with reduced motion: the slot tints but doesn't lift", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openName(page);
  await drag(page, null);
  await expect.poll(() => slotState(page)).toMatchObject({ over: true, translate: "0px", tint: "1" });
});

test("letter limit: the ring fills with the name, warns in the last 10 letters with the count, never animates (#29)", async ({ page }) => {
  await openName(page);
  const field = page.getByLabel("Build name");
  await expect(page.getByTestId("letter-limit")).toHaveCount(0);
  await field.fill("Kola's Finisher");
  const limit = page.getByTestId("letter-limit");
  const ring = limit.locator('[data-part="ring"]');
  const share = () => ring.evaluate((el) => 1 - Number(el.getAttribute("stroke-dashoffset")) / Number(el.getAttribute("stroke-dasharray")));
  expect(await share()).toBeCloseTo(15 / 40, 3);
  await expect(limit).not.toHaveAttribute("data-warn");
  await expect(limit).toHaveText("");
  await field.fill("x".repeat(29));
  await expect(limit).not.toHaveAttribute("data-warn");
  await field.fill("x".repeat(30));
  await expect(limit).toHaveAttribute("data-warn", "true");
  await expect(limit).toContainText("10");
  await expect(field).toHaveAccessibleDescription("10 letters left");
  await field.fill("x".repeat(40));
  await expect(limit).toContainText("0");
  expect(await share()).toBeCloseTo(1, 3);
  // Typing is a keyboard action: nothing in the ring animates.
  expect(await ring.evaluate((el) => [el.getAnimations().length, getComputedStyle(el).transitionDuration])).toEqual([0, "0s"]);
  // The field stops at 40.
  await field.press("End");
  await field.press("y");
  await expect(field).toHaveValue("x".repeat(40));
});

// Loading to success (#19) on Send for listing, and the Copy button (#20) on Copy link: ActionIcon in the button.
const iconOf = (page: Page, testId: string) => page.getByTestId(testId).getByTestId("action-icon");

test("send for listing: spinner while sending, a check that draws in, then Sent for listing (#19)", async ({ page }) => {
  await openName(page);
  const icon = iconOf(page, "submit-listing");
  await expect(icon).toHaveAttribute("data-state", "idle");
  const states = await page.evaluate(async () => {
    const button = document.querySelector<HTMLButtonElement>('[data-testid="submit-listing"]')!;
    const seen: string[] = [];
    const read = () => {
      const s = document.querySelector('[data-testid="submit-listing"] [data-testid="action-icon"]')?.getAttribute("data-state");
      if (s && seen.at(-1) !== s) seen.push(s);
    };
    button.click();
    const t0 = performance.now();
    while (performance.now() - t0 < 2500 && document.querySelector('[data-testid="submit-listing"]')) {
      read();
      await new Promise(requestAnimationFrame);
    }
    return seen;
  });
  expect(states).toEqual(["idle", "busy", "done"]);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sent for listing");
});

test("send for listing that fails: the button shakes and the red row shows; the build is kept (#19)", async ({ page }) => {
  await page.goto("/submit?state=name&send=fail");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Name it and share");
  const shook = await page.evaluate(async () => {
    const button = document.querySelector<HTMLButtonElement>('[data-testid="submit-listing"]')!;
    button.click();
    const t0 = performance.now();
    while (performance.now() - t0 < 3000) {
      const shake = button.getAnimations().find((a) => (a.effect as KeyframeEffect).getKeyframes().some((k) => k.translate === "-4px"));
      if (shake) return true;
      await new Promise(requestAnimationFrame);
    }
    return false;
  });
  expect(shook).toBe(true);
  await expect(page.getByTestId("send-failed")).toBeVisible();
  await expect(page.getByTestId("submit-listing")).toHaveText("Try again");
  await expect(iconOf(page, "submit-listing")).toHaveAttribute("data-state", "idle");
});

test("copy link: the copy icon turns into a check for 2 s, and the toast still says so (#20)", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await openName(page);
  await page.getByTestId("copy-link").click();
  await expect(iconOf(page, "copy-link")).toHaveAttribute("data-state", "done");
  await expect(page.getByText("Link copied. Paste it in any chat.")).toBeVisible();
  await expect(iconOf(page, "copy-link")).toHaveAttribute("data-state", "idle", { timeout: 4000 });
});

// Fan cards (#2): tapping Your card opens the share sheet and lifts the card into it, its back peeking at −4°.
const liftState = `() => {
  const card = document.querySelector('dialog[open] [data-testid="share-cards"]');
  const peek = card && card.querySelector('[data-part="peek"]');
  const anims = card ? card.getAnimations() : [];
  return {
    open: !!card,
    lift: anims.map((a) => a.effect.getKeyframes()[0].transform),
    peek: peek ? { rotate: getComputedStyle(peek).rotate, saved: peek.querySelectorAll("[data-share-card]").length, hidden: peek.getAttribute("aria-hidden") } : null,
  };
}`;
type Lift = { open: boolean; lift: string[]; peek: { rotate: string; saved: number; hidden: string | null } | null };

test("fan cards: tapping Your card lifts it into the share sheet, the back peeking out behind it (#2)", async ({ page }) => {
  await openName(page);
  const mid = (await page.evaluate(`(async () => {
    document.querySelector('[data-testid="your-card-open"]').dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
    await new Promise(requestAnimationFrame);
    await new Promise((r) => setTimeout(r, 60));
    return (${liftState})();
  })()`)) as Lift;
  expect(mid.open).toBe(true);
  expect(mid.lift).toHaveLength(1);
  expect(mid.lift[0]).toMatch(/^translate\(-?[\d.]+px, -?[\d.]+px\) scale\([\d.]+\)$/);
  expect(mid.peek).toEqual({ rotate: "-4deg", saved: 0, hidden: "true" });
  // It lands as the flip card: the copy of the back is gone, and the sheet is the same sheet Share card opens.
  await expect.poll(async () => ((await page.evaluate(`(${liftState})()`)) as Lift).peek).toBeNull();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("figure", { name: "Share card 1 of 2" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Card 1 of 2. Tap to flip" })).toBeVisible();
  await page.keyboard.press("Escape");
  // Focus goes back to Share card (the card's own button is for the pointer only).
  await expect(page.getByTestId("share-card")).toBeFocused();
  await expect(page.getByTestId("your-card-open")).toHaveAttribute("tabindex", "-1");
});

test("fan cards from the keyboard, or with reduced motion: the sheet opens without the lift", async ({ page }) => {
  await openName(page);
  // Enter on the card's button (a click with detail 0): no lift.
  await page.getByTestId("your-card-open").evaluate((el) => el.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 0 })));
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(((await page.evaluate(`(${liftState})()`)) as Lift).lift).toEqual([]);
  await page.keyboard.press("Escape");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByTestId("your-card-open").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  const reduced = (await page.evaluate(`(${liftState})()`)) as Lift;
  expect(reduced.lift).toEqual([]);
  expect(reduced.peek).toBeNull();
});
