import { expect, test } from "@playwright/test";

// Link previews (Figma 319:885, D-64 (3), D-99 (2)): 1200 × 630 PNGs made at build time with next/og, one per build
// page and one generic image for shared builds, named in each page's Open Graph and X card tags. Preview only, like
// the pages (D-105).
test.skip(process.env.PROBUILDS_DRAFTS !== "1", "preview pages");

const pngSize = (bytes: Buffer) => [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];

test("the build and shared-build preview images are 1200 × 630 PNGs", async ({ request }) => {
  for (const path of ["/og/build-finisher-meta-finisher.png", "/og/build-finisher-tall-finisher.png", "/og/shared-build.png"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"]).toBe("image/png");
    expect(pngSize(await response.body()), path).toEqual([1200, 630]);
  }
});

test("a build page names its own preview; a shared build names the generic one", async ({ page }) => {
  const image = async (path: string) => {
    await page.goto(path);
    return {
      og: await page.locator('meta[property="og:image"]').getAttribute("content"),
      width: await page.locator('meta[property="og:image:width"]').getAttribute("content"),
      card: await page.locator('meta[name="twitter:card"]').getAttribute("content"),
    };
  };
  const build = await image("/builds/finisher/meta-finisher");
  expect(build.og).toMatch(/^https?:\/\/[^/]+\/og\/build-finisher-meta-finisher\.png$/);
  expect(build.width).toBe("1200");
  expect(build.card).toBe("summary_large_image");
  expect((await image("/b/k7x2m9")).og).toMatch(/\/og\/shared-build\.png$/);
});
