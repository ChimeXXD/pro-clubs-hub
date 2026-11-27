# Face link preview audit against Figma (27 Nov 2026, D-107)

Figma file hyFx4Audhn4F9KxL9bRCLD, page "Design screens", section "Phase 5 · About & Takedown": "Link preview · face · 1200×630 (drawn at 600×315)" 430:7306 (D-97 (1)). Read with the Plugin API (read only) and exported at 2× (1200 × 630) for the comparison.

Built: `src/app/faces/[slug]/og.png/route.preview.tsx` (a static route: `force-static` with `generateStaticParams`, so `output: "export"` writes `out/faces/<slug>/og.png` once per face at build time), `src/lib/face-og.ts`, `src/lib/og-fonts.ts`, and Open Graph and Twitter tags in the face page's metadata. It uses Next's built-in `next/og` ImageResponse; no new package. Preview only, like the face pages (D-105). Status: **fixed** = as Figma draws it; **not fixed** = still different, with the reason.

1. Left: the in-game face as a 630 px square, cover-cropped (Figma's image fill, the stand-in f95eb7ae…). Right, 48 px in (44 top, 40 bottom): the logo (16 px tall in the frame, on-dark files), the lime "Face" tag (Barlow SemiBold 14/24), the name in capitals (Barlow Condensed ExtraBold 44/42), "Footballer · 18 steps · matching build" (Barlow Medium 16/22, secondary), then at the foot probuilds.club (Barlow SemiBold 14/20, lime) over the version tag (Barlow Medium 12/16, muted); every size doubled. **Fixed** (new).
2. The facts line is worked out: the kind, the recipe's step count (Figma's sample: 18) and "matching build"; the version tag is the one wording function (A-08).
3. Colours come from `docs/design/figma-variables.json`, the snapshot `tokens.css` is generated from (D-101), dark values: an image can't read CSS variables, and `src/` may not hold colours (check-tokens).
4. Fonts: next/og reads TrueType, not the WOFF2 the pages use, so the build asks Google Fonts for TrueType Barlow 500 / 600 and Barlow Condensed 800, only the characters the previews use, one request per weight for all faces. next/font/google already needs the network at build for the pages; no visitor's browser asks Google.
5. next/og's renderer can't draw WebP, the format face pictures are kept in (FORMAT §Face recipe). **Not as specified:** the preview uses a .jpg or .png of the same name beside the picture when one exists, else the bg/surface square. For the five sample faces the stand-ins' original JPEGs are committed beside their WebPs (`public/sample/faces/*.jpg`, removed from the live build with the rest of `sample/`, D-108). *Question for Chime:* keep a JPEG beside each real face picture, or approve `sharp` (already installed by Next, not declared) to convert at build.
6. The page names the image with an absolute address: the preview deployment's own (`CF_PAGES_URL`), else https://probuilds.club; `og:image` 1200 × 630 with its alt text, `twitter:card` summary_large_image.

## Measurements

Mean absolute RGB difference, Figma's 2× export (1200 × 630) against `out/faces/cristiano-ronaldo-2008/og.png`:

| Region | Difference |
| --- | --- |
| Whole image | 1.55 |
| Picture (630 × 630) | 0.47 |
| Text column (570 × 630) | 2.75 |
| Whole image at 600 × 315 | 1.62 |

The text column's 2.75 is the two renderers setting Barlow (resvg against Figma); the layout matches line for line.
