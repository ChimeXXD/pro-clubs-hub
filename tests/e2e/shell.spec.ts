import { expect, test } from "@playwright/test";

// The frame on every page, from Figma: Top bar (205:407), Bottom nav (282:521, phone only) and Footer notice
// (205:434). Sizes are the design's: top bar 60 px on phone and 72 px from tablet; bottom nav 344 px wide,
// 24 px above the bottom; nav items 48 px; search 44 px.

test("phone: top bar with the logo, the season chip and search", async ({ page }) => {
  await page.goto("/");
  const bar = page.getByTestId("top-bar");
  expect((await bar.boundingBox())?.height).toBe(60);
  await expect(bar.getByRole("link", { name: "ProBuilds home" })).toBeVisible();
  const chip = page.getByTestId("season-chip");
  await expect(chip).toHaveText("FC 27 · Season 2");
  await expect(chip).toHaveAttribute("href", "/changelog");
  const search = bar.getByRole("link", { name: "Search" });
  await expect(search).toHaveAttribute("href", "/search");
  expect(await search.boundingBox()).toMatchObject({ width: 44, height: 44 });
  await expect(bar.getByRole("navigation", { name: "Sections" })).toBeHidden();
});

test("phone: the bottom nav floats 24 px above the bottom with Home as the current pill", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByTestId("bottom-nav");
  await expect(nav).toBeVisible();
  const box = await nav.boundingBox();
  const viewport = page.viewportSize();
  expect(box?.width).toBe(344);
  expect(Math.round((viewport?.height ?? 0) - ((box?.y ?? 0) + (box?.height ?? 0)))).toBe(24);
  const links = nav.getByRole("link");
  await expect(links).toHaveCount(5);
  for (const [i, label] of ["Home", "Faces", "Builds", "Changelog", "Submit"].entries()) {
    await expect(links.nth(i)).toHaveAccessibleName(label);
    expect((await links.nth(i).boundingBox())?.height).toBe(48);
  }
  await expect(links.nth(0)).toHaveAttribute("aria-current", "page");
  await expect(links.nth(0)).toHaveText("Home");
  await expect(links.nth(1)).not.toHaveAttribute("aria-current", "page");
});

test("phone: the footer has its links and the notice (CLAUDE.md rule 3)", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  for (const label of ["About", "Changelog", "Submit", "Takedown"]) {
    await expect(footer.getByRole("link", { name: label, exact: true })).toBeVisible();
  }
  await expect(page.getByTestId("site-notice")).toHaveText(
    "Not endorsed by or affiliated with EA or its licensors. Not endorsed by the people named.",
  );
});

test("tablet and desktop: sections move into the top bar and the bottom nav goes", async ({ page }) => {
  for (const [width, height] of [[834, 1194], [1440, 900]] as const) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    const bar = page.getByTestId("top-bar");
    expect((await bar.boundingBox())?.height).toBe(72);
    const sections = bar.getByRole("navigation", { name: "Sections" });
    await expect(sections.getByRole("link")).toHaveText(["Faces", "Builds", "Changelog", "Submit"]);
    await expect(page.getByTestId("bottom-nav")).toBeHidden();
  }
});

test("desktop: the top bar's content is 1200 px wide and centred, as in the 1440 frame", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const logo = await page.getByTestId("top-bar").getByRole("link", { name: "ProBuilds home" }).boundingBox();
  expect(logo?.x).toBe(120);
});

test("phone: nothing is wider than the screen, so the page never zooms out", async ({ page }) => {
  await page.goto("/");
  const [scrollWidth, clientWidth] = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
  expect(scrollWidth).toBe(clientWidth);
});

test("light mode: the current pill gets a thin dark ring, since lime on cream is 1.03:1 (D-37)", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const shadow = await page.getByTestId("bottom-nav").getByRole("link", { name: "Home" }).evaluate((el) => getComputedStyle(el).boxShadow);
  expect(shadow).toContain("rgb(16, 17, 19) 0px 0px 0px 1px inset");
  await page.emulateMedia({ colorScheme: "dark" });
  const none = await page.getByTestId("bottom-nav").getByRole("link", { name: "Home" }).evaluate((el) => getComputedStyle(el).boxShadow);
  expect(none).not.toContain("0px 0px 0px 1px inset");
});

test("iPad mini (744 px): the tablet top bar keeps its 40 px side padding", async ({ page }) => {
  await page.setViewportSize({ width: 744, height: 1133 });
  await page.goto("/");
  const search = await page.getByTestId("top-bar").getByRole("link", { name: "Search" }).boundingBox();
  expect(744 - ((search?.x ?? 0) + (search?.width ?? 0))).toBe(40);
});

test("every link in the frame is at least 44 × 44 px to touch (CLAUDE.md)", async ({ page }) => {
  for (const [width, height] of [[390, 844], [834, 1194]] as const) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    const small = await page.evaluate(() =>
      [...document.querySelectorAll("header a, footer a, [data-testid=bottom-nav] a")]
        .filter((a) => a.checkVisibility())
        .map((a) => {
          // The tap area is the link plus any ::before that widens it.
          const r = a.getBoundingClientRect();
          const b = getComputedStyle(a, "::before");
          const w = b.content !== "none" && b.position === "absolute" ? Math.max(r.width, parseFloat(b.width) || 0) : r.width;
          const h = b.content !== "none" && b.position === "absolute" ? Math.max(r.height, parseFloat(b.height) || 0) : r.height;
          return { name: a.textContent || a.getAttribute("aria-label"), w: Math.round(w * 10) / 10, h: Math.round(h * 10) / 10 };
        })
        .filter((t) => t.w < 44 || t.h < 44),
    );
    expect(small).toEqual([]);
  }
});

test("the live build never shows the preview bar or drafts (they belong to the preview site)", async ({ page }) => {
  test.skip(process.env.PROBUILDS_DRAFTS === "1", "this run is a preview build");
  await page.goto("/");
  await expect(page.getByTestId("preview-bar")).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
});
