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
