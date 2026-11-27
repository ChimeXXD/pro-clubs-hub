# Link preview audit against Figma (27 Nov 2026, D-107)

Figma file hyFx4Audhn4F9KxL9bRCLD, page "Design screens". Frames: "Link preview · 1200×630 (drawn at 600×315)" 319:885 (section "Phase 1 · Builds"); the same drawing again as 430:7325 in "Phase 5 · About & Takedown" (identical), beside a face preview 430:7306 (out of scope: the face page isn't built). Figma draws no generic ProBuilds preview.

New, built for this audit (D-64 (3), D-99 (2)). The images are made at build time with Next's built-in `next/og` (no new package) by one static route, `src/app/og/[image]/route.preview.tsx`, which `output: "export"` writes to `out/og/<name>.png`: one per build page (`build-<archetype>-<slug>.png`) and `shared-build.png` for every shared link. Preview only, like the pages that use them (D-105); probuilds.club has neither yet. The build page and `/b` name their image in Open Graph and X card tags (`summary_large_image`, 1200 × 630), as absolute links: the preview deployment's own address on the preview (Cloudflare's `CF_PAGES_URL`), else probuilds.club.

Fonts: next/og reads TTF, OTF or WOFF, not the woff2 next/font serves, so Barlow Medium, Barlow SemiBold and Barlow Condensed ExtraBold are committed as TTF from Google's font repository with their SIL Open Font License (`src/lib/og/fonts`, 322 KB, used at build time only, never sent to browsers). Colours are read from `src/styles/tokens.css` (dark values), so the image uses tokens only.

Compared as our 1200 × 630 PNG scaled to 600 × 315 against Figma's 600 × 315 screenshot (Figma's MCP renders this frame at 1x only).

1. Layout at 2×: the mannequin filling the left 630 px square; the text column 570 px wide, 44 / 48 / 40 px padding; the logo (mark 33 × 32, 8 px gap, wordmark); the Meta pick tag (lime, Barlow SemiBold 28 / 48, 18 px sides); 16 px; the name (Barlow Condensed ExtraBold 88 / 84, caps); 16 px; "Finisher · ST · CF" and "Level 55 · 185 cm · 80 kg" (Barlow Medium 32 / 44, text/secondary); then "probuilds.club" (SemiBold 28 / 40, accent/text) and the version tag (Medium 24 / 32, text/muted) at the foot. **Built.**
2. The words come from the build: its badge, name, archetype and positions, level, height and weight, and version tag, so each build page has its own image. A Recommended build gets the card's neutral Recommended tag (Figma draws only Meta pick). **Built.**
3. A build's own in-game picture isn't used yet (no build has one; D-41); every image shows the mannequin, as 319:885 does. TODO for when pictures arrive.
4. Shared builds: one generic image, since a picture per unlisted build needs a server (D-99 (2)). Figma draws none, so it is 319:885's layout with the shared page's own words (439:8847): "Shared build" as the name, "Shared by a player · not on ProBuilds' lists yet" as the line, probuilds.club, and no tag or version tag (they differ from link to link). **Question for Chime:** draw the generic image, or approve this one.

| Section (600 × 315) | Diff |
| --- | --- |
| Face (left square) | 0.2 |
| Logo | 0.8 |
| Tag, name and lines | 3.9 |
| Domain and version tag | 2.8 |
| Whole image | 1.5 |

The middle band's residual is text anti-aliasing (next/og's renderer against Figma's) on the large name; positions match.
