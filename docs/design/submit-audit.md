# Submit a build audit against Figma (27 Nov 2026, D-107)

Figma file hyFx4Audhn4F9KxL9bRCLD, page "Design screens", section "Phase 4 · Changelog & Submit" (197:256). Frames read with get_metadata, get_screenshot and the Plugin API (read only); components from the Design System panel "Components · Submit a build, requests, 404" (431:843).

| State | Phone 393 | Tablet 834 | Desktop 1440 |
| --- | --- | --- | --- |
| Start (1 of 4) | 400:3219 | 418:3972 | 418:4161 |
| Attributes (2 of 4) | 399:3121 | 418:4526 | 418:5198 |
| Attributes · error | 428:5513 | 428:6137 | 428:6770 |
| PlayStyles (3 of 4) | 406:3024 | 418:5876 | 418:6127 |
| Name and share (4 of 4) | 401:3616 | 418:6420 | 418:6599 |
| Name and share · picture added | 412:2989 | 418:6778 | 418:6957 |
| Share card tapped | 413:3113 | 418:7348 | 418:8464 |
| Sent for listing | 429:5828 | 429:6034 | 429:6146 |
| Send for listing failed | 441:8928 | 441:9162 | 441:9380 |

New page, built for this audit. `/submit` is one client-side editor (`src/components/submit/`), preview only (`src/app/submit/page.preview.tsx`, D-105) until the Supabase project exists (D-96) and the attribute prices are recorded (O-14). Its rules are in `src/lib/submit/editor.ts` (D-85 to D-90), the document it sends in `document.ts` (FORMAT §Build, checked by the content validator, CLAUDE.md rule 6) and the two calls in `send.ts`: "Send for listing" calls `submit_build`, Share card and Copy link call `create_shared_build` (D-99 (1), (2); `docs/supabase-schema.sql`, tested in PGlite 0.5.17 with pgcrypto: anon can call the functions and nothing else, a bad document and the 11th send in an hour are refused).

**Preview states.** The editor opens on Figma's sample build (D-107). `/submit?state=` opens each state Figma draws: `start`, `attributes` (Finishing being typed in), `attributes-error` (Finishing 100), `playstyles` (slot 2 open), `name`, `share` (the sheet open), `sent`, `send-failed`. With no Supabase settings the preview uses a stand-in: sends and links work after 0.6 s; `&send=fail` or `&share=fail` makes them fail. The stand-in exists only when drafts are on and no database is set, so probuilds.club can never say a send worked when it didn't (it shows the failure row). The picture-added state is reached by adding a picture; Figma's stand-in picture (a 480 px JPEG of an unnamed player from an unknown source) is not committed (rule 1, D-108 covers the faces library's stand-ins only), so the measurement used a crop of Figma's own render, kept outside the repo.

Status: **built** = as Figma draws it; **sample** = Figma's figure, shown because the real one isn't known; **not fixed** = still different, with the reason. Pixel diffs are the mean absolute difference per RGB channel (0 to 255), Chrome at 1x, dark, preview bar hidden; phone frames are captured at the page's full height so the bottom nav and the sticky actions bar sit where Figma draws them. Heights: ours / Figma.

## Shared by every state

1. Top bar: the theme button (sun) is in every top bar since D-114 (lane B), not in these frames, and the current section ("Submit") is cream on tablet and desktop where Figma draws all four links alike. **Not fixed** (shell, out of this unit; it is why every "top" band is 4 to 7).
2. Footer and bottom nav: the same as every page. Phone bands that end in the footer or nav move by the page's 1 to 4 px height difference, which is most of their number.
3. Numbers use the type tokens' tabular figures, so "185 cm" and "1,062" are 1 to 3 px wider than Figma's (Figma's Number styles draw proportional "1"s). **Not fixed** (the token, used site wide).

## Start (1 of 4)

4. Step line "Submit a build · 1 of 4", H1 "Your build", the Body/Large line, then Archetype (Keeper, Defender, Midfielder, Forward chips, Chip Size=small; the group's tiles), Positions ("Tap all you play"), Level and Height and weight, 28 px apart (32 under the line on desktop). **Built.**
5. Archetype tile (205:330): emblem in a 40 px page-coloured circle, H4 name, the two signature PlayStyles. Selected: action/selected with a 2 px lime ring. Figma's strokes sit outside the layout, so the tiles keep 154 px (an inset ring, not a border). **Built.** Tablet four in a row, desktop two in the 568 px column.
6. Forward positions ST CF LW RW CAM LM RM, as drawn; at least one stays picked. Keeper GK; Defender CB LB RB LWB RWB CDM; Midfielder CDM CM CAM LM RM. **Built; the other groups' lists aren't drawn** (question).
7. Level card: "44 of 55", − / + (48 px, bg/raised), the slider (knob at 44 ÷ 55), "1,062 AP to spend" and "Level 45 adds 44 more." from RESEARCH §10.1 (real, D-85 (1)). At 55 the second line is left out (not drawn). **Built.**
8. Height and weight (component 431:1129): value, feet or pounds, − / + (44 px), a slider over the archetype's range with its middle marked, the range under it. **Built.** Ranges are Chime's in-game readings (RESEARCH §10.3). Figma prints the Finisher's minimum as 164 cm (FCClub); the game's 5'5" is 165 cm, used here (question).
9. "What your body changes" (Acceleration −2, Agility −2, Strength +2), its note, AcceleRATE "Controlled" and "Explosive needs 182 cm or less…". **Sample**: shown only at the sample's Finisher, 185 cm, 80 kg; any other body hides the box, since no effects or AcceleRATE rule are checked in game yet (RESEARCH §10.3, D-90). Not drawn: a body without figures (question).
10. Actions: phone a bar stuck to the bottom (bg/page, divider, 12 / 20 / 28 px), Attributes full width; tablet 280 px and desktop 320 px on the right. The bottom nav and its 96 px space are hidden on steps 1 to 3, as Figma hides them. **Built.**

| Section | 393 | 834 | 1440 |
| --- | --- | --- | --- |
| Top bar | 7.0 (item 1) | 6.8 (item 1) | 4.0 |
| Header | 2.9 | 1.5 | 0.9 |
| Archetype | 3.1 | 4.4 | (columns) 1.7 |
| Positions | 3.7 | 2.5 | (columns) |
| Level | 0.8 | 0.4 | (columns) |
| Height and weight | 5.5 (item 3, 164 → 165) | 3.3 | (columns) |
| Actions | 7.2 (2 px lower, item 2) | 1.2 | 1.7 |
| Footer | 8.5 (item 2) | 2.9 | 1.4 |
| Height | 2040 / 2038 | 1877 / 1875 | 1537 / 1535 |

## Attributes (2 of 4) and its error state

11. Sticky header (phone full width with a divider; tablet in the content with its divider; desktop the 360 px side column, no divider): "Finisher · Level 44 · Attributes · 2 of 4", the AP counter (431:1035) and six group jumps (44 px pills; the current one raised with a lime ring). **Built.**
12. AP counter "51 AP left · 1,011 spent · 1,062 at level 44" with the bar at 1,011 ÷ 1,062. **Sample** (D-85 (3)): the total is real (§10.1), the spend is Figma's 1,011 since no prices are known (O-14); it never shows below 0 (at a level that gives less than 1,011 the spend is capped at the level's AP).
13. The tip (info icon, "Type each number as Edit Attributes shows it. After two digits you jump to the next one.") and the six groups, phone one column, tablet and desktop two (Pace, Passing, Defending; Shooting, Dribbling, Physical). Each group's number is the average of its values, rounded: Figma's 87, 83, 68, 85, 46, 74 are exactly that, and it follows the values. **Built.**
14. Attribute row (431:1050): name, − / value / +, the slider at value ÷ 99. Typing rings the box lime and says "Typing · next: Shot Power"; two digits move to the next attribute (except "10", which may be the start of 100). Height and weight's rows say "−2 from height and weight · 86 in a match" (red for −, lime for +; sample, item 9). Over 99: red 2 px box and number, "Attributes go up to 99.", the knob at the end, PlayStyles disabled (action/disabled-bg, action/disabled). **Built.**
15. Skill Moves and Weak Foot (four of five stars, lime and border/strong), a radio group. Phone and tablet under the groups, desktop in the side column. **Built.**
16. On phone the groups are in Figma's order but focus order runs by column (Pace, Passing, Defending, then Shooting…), since one set of fields serves both layouts. Typing still moves in Figma's order (item 14). **Not fixed** (question if it matters).

| Section | 393 | 834 | 1440 |
| --- | --- | --- | --- |
| Top bar | 7.0 | 6.8 | 4.0 |
| Sticky header | 2.9 | 2.5 | (side) 0.7 |
| Tip and first group / tip | 2.4 | 6.9 → 4.0 | (side) |
| Groups | 0.9 (error 1.0) | 5.0 → 0.9 | 0.7 (error 0.7) |
| Stars | 2.0 | 0.3 | (side) |
| Actions | 0.8 | 0.9 | 0.5 |
| Footer | 8.1 | 1.3 | 0.7 |
| Height | 3728 / 3728 | 2568 / 2568 | 2205 / 2205 |

Tablet first measured without the divider under the sticky header, which Figma draws there (not on desktop); added, it moved every row below it by 1 px into place (6.9 → 4.0, 5.0 → 0.9). The tip's remaining 4.0 is its text, drawn about 1 px higher in Chrome.

## PlayStyles (3 of 4)

17. Sticky counts "2 of 2 PlayStyle+" (lime) and "5 PlayStyles" (v1's boxes, D-88). **Built.**
18. PlayStyle+ slots (431:964): the gold badge, chevron, "Low Driven Shot+ / Signature", "Chip Shot+ / Finisher+" (lime). Tapping a slot opens the list (bg/raised): the archetype's signatures and its specializations' PlayStyle+, the other slot's left out, the picked one on bg/surface with a lime tick. Picking a specialization replaces a signature; only one is active (D-87). **Built.** Figma lists Chip Shot, Gamechanger, Relentless (Finisher+, Hunter, Presser), which is by PlayStyle name, not the archetype file's order (Finisher+, Presser, Hunter); built by name.
19. Chips by category (431:950): off (border/strong, art at 60 %), on (raised, 1.5 px cream ring, lime tick), plus (bg/surface, lime "Chip Shot+", not a button). Figma draws Dead Ball's art at full opacity while every other off chip is at 60 %; built at 60 %. **Built.**
20. Desktop: the counts and slots in a 400 px column, the chips beside it, 64 px apart. **Built.**

| Section | 393 | 834 | 1440 |
| --- | --- | --- | --- |
| Top bar | 7.0 | 6.8 | 4.0 |
| Counts | 2.1 | 0.7 | (side) 4.6 |
| Slots and list | 1.9 | 0.8 | (side) |
| Chips | 4.3 | 4.9 | (with side) |
| Actions | 1.5 | 0.6 | 0.5 |
| Footer | 5.5 | 1.3 | 0.8 |
| Height | 1913 / 1913 | 1707 / 1707 | 1129 / 1129 |

Chips: the badges are EA's webp art at 26 px, resampled differently by Chrome and Figma, and each label sits 1 px higher; no position differs.

## Name it and share (4 of 4), picture added, send failed

21. Step line, H1 "Name it and share", Build name ("Name your build") and "Your name for the credit" ("As you want it shown", "Shown on the card as “Made by …”."): 52 px fields, 12 px corners, Body text (17 px, so iOS doesn't zoom). **Built.**
22. "Your Pro's face": the ProBuilds face, "No picture yet / Your card uses the ProBuilds face until you add one.", Add a picture; with a picture "Your picture / On your card. Swap it any time.", Change and Remove; the note under. The picture is read in the browser and never uploaded: it goes on the card and the saved images only, and a shared link shows the ProBuilds face (D-89 (4)). **Built.**
23. "Your card": the overview story card scaled to the column (353 px, 440 on desktop) in a 20 px frame with a 1 px border/strong stroke drawn inside; no "1 / 2". Filled from the editor: the name ("Your Finisher" until one is typed), archetype, positions, level, height, weight, "FC 27 · Season 2 · Not yet checked in game", PlayStyle+, PlayStyles, the link and "Made by you." ("Made by <name>." once typed) and the notice. **Built.**
24. The card's link reads `probuilds.club/b/your-finisher` (Figma's) until a link is made; Share card or Copy link make it (`create_shared_build`) and the card then shows `probuilds.club/b/<id>`. A slug link never exists on the site (D-99 (2) ids are six characters): question.
25. Share card (primary, share icon) opens the share sheet (item 27); Copy link (secondary) makes the link and shows "Link copied. Paste it in any chat." **Built.** If the link can't be made, a red toast says "Couldn't send. Check your connection and try again." (Figma draws no failure for sharing; question).
26. "Want it listed on ProBuilds?" with Send for listing (ghost, arrow). A failure adds Figma's row (status/danger-bg, error icon, "Couldn't send. Check your connection and try again. Your build is still here.") and the button reads Try again; everything typed stays. While sending the button is busy and shows the spinner (not drawn). **Built.**

| Section | 393 | 834 | 1440 |
| --- | --- | --- | --- |
| Top bar | 7.0 | 6.8 | 4.0 |
| Fields (phone) / header, fields, card top | 1.0 | 3.0 | 1.9 |
| Pro's face | 3.1 (picture 3.2) | (with card) 4.7 | (with card) 3.6 |
| Your card | 7.6 (picture 7.8) | (with face) | (with face) |
| Actions | 2.9 | 1.1 | 0.9 |
| Listing (failed) | 2.3 (2.9) | 0.7 (1.2) | 0.8 (1.2) |
| Footer, nav | 4.8, 14.8 | 2.3 | 1.3 |
| Height | 1985 / 1989 | 1441 / 1445 | 1596 / 1599 |

The card's 7.6 is the story card's own residual (build-page-audit items 40 to 44: its small text sits 1 px higher in Chrome), magnified by the 0.98 scale; the phone nav band is offset 4 px by the page height.

## Share card tapped

27. The Build page's sheet and dialog (319:904 / 319:2234 / 319:2952), now `ShareSheet.tsx` shared by both pages: the two cards, Save images, Copy link, Share via… (phone) or the share icon (tablet), the caption. The attributes card names the build's AcceleRATE in its subtitle ("Your Finisher · Level 44 · Controlled", sample), says "± is height and weight (185 cm, 80 kg): added in a match. Not included in the values." with a lime ±, and marks Acceleration −2, Agility −2 (red) and Strength +2 (lime); names are text/primary on this card (413:3113), secondary on the Build page's (316:973). **Built.** Measured with a share menu present (headless Chrome has none, so Share via… would be missing) and focus off the close button.

| Section | 393 | 834 | 1440 |
| --- | --- | --- | --- |
| Page behind | 1.5 | 1.0, 0.4 | 1.2, 0.7 |
| Sheet / dialog head | 0.4 | 0.6 | 0.3 |
| Cards | 9.8 | 5.3 | 3.7 |
| Actions | 2.6 | 3.5 | 2.5 |

Cards: the same story-card residual as item 23, at 0.625 and 0.75.

## Sent for listing

28. The tick in a 60 px status/success-bg circle, "Sent for listing", the line, the queue card (1 in lime, 2 and 3 in border/strong; dividers between), Share card and Submit another build (which starts a new build). Phone stacks the queue before the buttons; tablet and desktop put the buttons under the line (28 px) and the queue on the right. **Built.**

| Section | 393 | 834 | 1440 |
| --- | --- | --- | --- |
| Top bar | 7.0 | 6.8 | 4.0 |
| Done, queue, buttons | 3.5, 3.0, 2.3 | 2.7 | 1.7 |
| Footer | 7.9 (with nav) | 2.5 | 1.5 |
| Height | 1059 / 1059 | page shorter than the 900 px window / 749 | as tablet / 721 |

## Missing data and rules not yet in Figma

- Attribute prices (O-14): "AP left" uses the sample's spend (item 12). The live counter turns on when prices exist (D-85 (3)).
- Height and weight effects and the AcceleRATE rule (RESEARCH §10.3): sample only (item 9).
- Starting values per archetype (§10.3): a new build starts from Figma's sample, which is fine on the preview only.
- Keeper builds: Figma's editor draws the six outfield groups and no Goalkeeping PlayStyles; a keeper build gets the outfield editor (question).
