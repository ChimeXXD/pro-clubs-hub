import { expect, test } from "@playwright/test";

// The face's link preview (Figma 430:7306; D-97 (1)): a static 1200 × 630 PNG made at build time with next/og, named in
// the face page's Open Graph and Twitter tags. Preview only, like the face pages (D-105).
test.skip(process.env.PROBUILDS_DRAFTS !== "1", "preview page");

test("each face page names its own 1200 × 630 link preview, and the file is a PNG of that size", async ({ page, request }) => {
  await page.goto("/faces/cristiano-ronaldo-2008");
  const og = page.locator('meta[property="og:image"]');
  await expect(og).toHaveAttribute("content", /\/faces\/cristiano-ronaldo-2008\/og\.png$/);
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  const res = await request.get("/faces/cristiano-ronaldo-2008/og.png");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toBe("image/png");
  const png = await res.body();
  // PNG signature, then the IHDR chunk's width and height.
  expect(png.subarray(1, 4).toString()).toBe("PNG");
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
});
