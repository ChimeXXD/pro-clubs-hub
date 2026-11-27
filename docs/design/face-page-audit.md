# Face page audit against Figma (27 Nov 2026, D-107)

Figma file hyFx4Audhn4F9KxL9bRCLD, page "Design screens", section "Phase 2 · Faces". Frames read with get_metadata, get_design_context, the Plugin API (read only) and get_screenshot:

| State | Phone 393 | Tablet 834 | Desktop 1440 |
| --- | --- | --- | --- |
| Not started (step 1, preset) | 353:1410 | 427:8649 | 427:8767 |
| Step 2 (Skin) | 353:1524 | 355:1469 | 355:1582 |
| In progress (continue from step 9) | 353:1648 | 427:8885 | 427:9010 |
| Finished → matching build | 372:1984 | 427:9135 | 427:9285 |
| Updated, ticks reset | 372:2108 | 427:9435 | 427:9557 |

Built new (`/faces/[slug]`, `page.preview.tsx`, preview only, D-105) for Figma's five sample faces. The frames draw 2008 Ronaldo; the other four sample faces use the same sample recipe with their own title, kind, picture and tutorial. Status: **fixed** = as Figma draws it; **not fixed** = still different, with the reason.

## Sample data (D-107)

1. The frames draw a recipe of 18 steps in seven sections (Preset 1 value, Skin 4, Head 3, Face 2, Hair 4, Sculpt 24 values on 12 screens, Visual Age 1; the bar's segment names) and three of its screens: step 1 (Head › Presets, Preset 147), step 2 (Customize › Skin: Complexion 8, Skin Surface 33, Scarring None, Lip Makeup 54) and step 9 (Sculpt › Shape › Skeletal, Eyes · Eyelid Upper: Down ← → Up 62, Narrow ← → Widen 48), with their hints and "Next:" lines. They are copied into each sample face as `sample.recipe` (new, optional, drafts only; FORMAT §Face recipe, validator and tests). **Fixed.**
2. Steps 3 to 8 and 10 to 18 are drawn nowhere, and the format cannot hold Figma's counts without making values up (which 21 sculpt sliders sit on which 10 screens). **Not fixed, by design:** the walk goes from one drawn screen to the next (1 → 2 → 9 → done), marking the steps between as done, the way the Build page's level switch snaps between the two levels Figma draws (build-page-audit item 14). The bar, labels and counts are Figma's. *Question for Chime.*
3. The limits callout's text, "The game can't do this exactly: the hairline sits a little higher than the real one.", is the sample limit on all five sample faces. **Fixed** (2008 Ronaldo's `limits` was `"PLACEHOLDER"`).
4. The tutorial: "How to create CRISTIANO RONALDO in EA FC27", "Xaiiros · Tap to play". Each sample face embeds the video its stand-in picture came from (faces-demo SOURCES), its title read from YouTube's own oEmbed; the credits that named those creators as "reference" are now "tutorial", as the credit line draws "Tutorial by Xaiiros". **Fixed.**
5. The matching build (374:2045) reads "2008 WINGER". The paired build, `content/builds/spark-2008-winger.json`, still has `"title": "PLACEHOLDER"`, so the card shows PLACEHOLDER. **Not fixed:** that file is the Builds lane's (and five of its unit tests assert the placeholder). Proposed: set its title to "2008 Winger".
6. The four other sample faces were never made in game: their credit line reads "Made by — (sample)", as on the sample build (faces-library-audit item 18). 2008 Ronaldo keeps "Made by Chime in game", as drawn.

## Title block

7. The frames draw no version tag on the face page. CLAUDE.md rule 4 and D-69 (3) require it. **Not fixed, by rule:** the Design System's Version tag (203:264, Status=not checked: warning icon, status/warning) sits under the name, as the build page puts it. The block is 24 px taller (162 against 138), which is the title score below; without the tag the block scores 6.8–9.0 (5.4–7.1 one pixel up). *Question for Chime:* draw it in Figma or move it.
8. Kind, plain title (H1, D-69), credit line (Made by in secondary, a muted "·", "Tutorial by Xaiiros" underlined in text/primary, linking the video), sample note. **Fixed** (new).
9. Chrome sets Barlow about 1 px lower than Figma in the same line boxes (as build-page-audit item 40). **Not fixed:** renderer.

## Picture

10. Phone: full width, 480 px, Figma's stand-in (the same image as the library card, hash f95eb7ae…), cover-cropped; the sheet's 28 px rounded top with its 40 × 4 handle over the foot; the "360°" badge 16 px from the top, 20 px from the right. Tablet and desktop: a 4:5 card (300 × 375, 400 × 500), 16 px corners, the badge 16 px in. **Fixed** (new). Icon/rotate-360 exported from the Design System (352:817).
11. The sample faces have no turn frames, so the picture doesn't turn yet. The drag turntable is built for a face with `turn` (D-35; 8 px per frame, frames loaded on first touch), untested against real frames. The badge shows on a face with frames and on Figma's samples, which draw it.

## Progress

12. "Step 1 of 18 · Preset" / "All 18 steps done" (Label/Default) with "All steps" in lime; the bar: seven 6 px segments, 4 px apart, weighed by their values; done sections lime, the current one filled up to and including its current screen (Sculpt's 4th of 12 is a third, 67.49 of 202.46 px). **Fixed** (new).
13. On tablet and desktop the frames copy the phone's fill widths into wider segments: Preset's 8.44 px fill in a 10 or 18.26 px segment (step 1), Sculpt's 67.49 px in a 438 px segment (desktop step 9). **Not fixed:** the fill stays proportional (D-73); it is why progress scores 3.65 at desktop step 9.
14. "All steps" opens a list no frame draws. **Built from the Design System:** the Sheet (205:366) on phone, a centred dialog from tablet (as Share build), one Step row (203:311) per drawn screen: tick (28 px, 44 px tap area), "Step N", the screen's title and its value or "N values"; done rows dim, the current one is highlighted. Ticking a row marks it and the steps before it done. *Question for Chime.*

## Step card

15. bg/surface, 1 px border/subtle, 20 px corners, 18 px in, 12 px apart: "In the game" and the path, the title (H3), the value rows (divider above, label Label/Default secondary, value Number/Large lime), the hint, Back (52 px; disabled fill and icon on step 1, 1.5 px border/strong after) and "Done, next". **Fixed** (new).
16. A Skin Tone or Visual Age value has no number (FORMAT §Value): drawn as the Value chip's track (203:284) at the knob's place. No frame draws one; real faces only.
17. "Next: …" under the card: the frames' wording; on a recorded face it is worked out from the next screen ("Customize › Head · 3 values", "Sculpt › Chin · Chin · 1 slider"), and the last step reads "Next: Set up the matching build". Chrome sets it 1 px lower (scores 3.7–9.0, 0.9–2.1 one pixel up). **Fixed**; the offset is the renderer.

## States

18. In progress: the "Continuing from step 9" row with Start over (bg/surface, 12 px corners, 10 / 14 px in) above the progress, after a reload. It goes as soon as the player moves. **Fixed** (new).
19. Updated: the info Toast (372:2198), cream pill in the page's flow, "This face was updated. Your ticks start fresh." Figma draws it 357 px wide in a 353 px column. **Fixed:** the pill may run up to 20 px into the gutter, so it stays on one line at 393 and wraps at 360; from tablet it fills the column (414, 736) as drawn. Older ticks (`face:<id>:v<older>`) are removed.
20. Finished: the Done card (check-circle 32 px in accent/text, "Face done", the line, Start over and Back to faces), then "Set up the matching build" and the build card (D-79). **Fixed** (new).
21. Figma's Done card buttons are 156 / 153 px (186.5 / 183.5, 347.5 / 344.5), both Fill; "Back to faces" overflows its 24 px padding at 153 px. **Not fixed exactly:** two equal halves, labels on one line, 12 px padding so they fit on a 360 px phone. 1.5 px difference each.
22. The matching build card follows 374:2045 (mannequin, name, chips, "Spark · not recorded yet", "—" for each stat, the signature PlayStyles+ Trickster and Rapid). Beside a sample face it has no version tag or credit (as drawn, and as the sample archetype cards); a real face's card carries both (rules 4, 5). **Fixed** apart from item 5.

## Tutorial

23. "Tutorial" (H3) and the Embed facade (203:346): bg/raised, 12 px corners, the 201 px poster with the 56 px play icon, title and "<channel> · Tap to play". Nothing loads from YouTube until the tap; then the poster becomes the youtube-nocookie.com player (16:9). **Fixed** (new); the playing state isn't drawn.

## Shell

24. The top bar and footer score 3.97 and 5.22 on phone: the shell's own differences, audited in unit 5 (shell-audit.md).

## Measurements

Mean absolute RGB difference per section, Figma frame against Chromium at 1x, dark mode, the preview bar and the floating bottom nav hidden. Each section is cropped at its own box in each image (Figma's from the frame's node, ours from the DOM), so a taller block above doesn't shift the ones below. In brackets: the best score within ±2 px, where it is at least 0.3 lower.

| State | Section | 393 | 834 | 1440 |
| --- | --- | --- | --- | --- |
| start | topbar | 3.97 | 3.04 | 1.76 |
| start | picture | 1.53 | 1.83 | 1.63 |
| start | breadcrumb | – | 24.93 (8.33) | 24.93 (8.33) |
| start | title (with the version tag) | 13.12 | 14.73 | 12.41 |
| start | title without the version tag | 7.65 (6.06) | 9.00 (7.12) | 6.76 (5.35) |
| start | progress | 2.07 | 1.78 | 1.27 |
| start | card | 2.52 | 2.17 | 1.30 |
| start | next | 8.54 (1.89) | 7.28 (1.62) | 4.10 (0.91) |
| start | limits | 1.13 | 1.24 | 1.06 |
| start | tutorial | 0.88 | 0.70 | 0.39 |
| start | footer | 5.22 (4.84) | 1.99 | 1.15 |
| step 2 | progress | 2.02 | 1.98 | 2.17 |
| step 2 | card | 1.60 | 1.37 | 0.77 |
| step 2 | next | 9.03 (2.09) | 7.70 (1.78) | 4.33 (1.00) |
| in progress | resume | 1.95 | 1.67 | 0.94 |
| in progress | progress | 2.43 | 2.63 | 3.65 |
| in progress | card | 2.24 | 1.92 | 1.08 |
| in progress | next | 7.72 (1.96) | 6.58 (1.67) | 3.70 (0.94) |
| finished | progress | 2.09 | 1.62 | 0.98 |
| finished | done card | 1.57 | 1.39 | 0.93 |
| finished | matching build | 4.95 | 4.20 | 2.38 |
| reset | toast | 2.30 | 1.99 | 1.12 |
| reset | progress | 2.73 | 2.40 | 1.92 |
| reset | card | 2.52 | 2.17 | 1.30 |

Sections the same in every state (picture, title, limits, tutorial, footer, top bar) are listed once. Above 3: the title (item 7, the version tag), the breadcrumb (19 px of small text: Figma rounds each text box up to a whole pixel, so "/" and the name sit about 1 px further left; 8.33 at the best offset), "Next:" (one line of small text 1 px lower; ≤ 2.1 at the best offset), the matching build (item 5, PLACEHOLDER for "2008 WINGER"), desktop progress at step 9 (item 13) and the shell (item 24).

After the theme switch (theme-switch-audit.md) and the rebase onto main, every other section measures the same. The top bar now has the sun/moon button these frames (drawn before D-114) don't, so against them it scores 7.02 / 6.88 / 3.99 at 393 / 834 / 1440; against the theme switch frames, which are the current design, 4.24 / 3.06 / 1.77.
