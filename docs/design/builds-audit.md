# Builds and archetype pages audit against Figma (26 Nov 2026, D-107)

Figma file hyFx4Audhn4F9KxL9bRCLD, page "Design screens", section "Phase 1 · Builds". Frames read with get_design_context, get_metadata, get_screenshot and the Plugin API (read only):

| Screen | Phone 393 | Tablet 834 | Desktop 1440 |
| --- | --- | --- | --- |
| Builds (`/builds`), Finisher picked | 241:556 | 279:1399 | 276:1073 |
| Archetype (`/builds/finisher`) | 288:1031 | 290:796 | 290:1084 |

Figma draws no other state of either screen. It draws one archetype, Finisher (Magician and Target peek beside it on the Builds page); the other 12 use the same frames with their own facts. The only other builds Figma draws outside the Build frames are Home's "Meta Maestro" and "Meta Boss" cards (Home frames, out of scope here).

Status: **fixed** = now as Figma draws it; **not fixed** = still different, with the reason. Pixel diffs are the mean absolute difference per RGB channel (0 to 255) of each section, cropped at the same size from the Figma screenshot and from Chrome at 1x, dark mode, bottom nav and preview bar hidden.

## Builds page (`/builds`)

Compared with the page as built in a611c7d.

1. Phone (241:556) is the only Builds frame in Figma's Phone type mode (Typography = Phone, Tokens = Phone); tablet and desktop use the default Desktop mode. Code uses one size per text style (D-103), so on phone: the title is 48/46 where Figma draws 34/32, the intro 17/26 where it draws 16/24 (the header is 124 px tall, Figma's 108, and everything under it sits 16 px lower), and the Stance card's name 28/30 where it draws 24/26. **Not fixed** (D-103). Measured: with those three values put back to Figma's Phone ones in the browser, the header goes from 20.5 to 2.1 and the Stance stage from 3.9 to 2.9, and no other section changes. That is the only phone difference besides item 2.
2. Phone rail: the picked emblem sat at x 168, Figma 169. The row centres the emblem on 196.5 px, and Figma rounds the half pixel the other way. **Fixed** (the scroll is rounded down); rail 5.5 → 1.7.
3. Six archetypes (Disruptor, Recycler, Maestro, Creator, Spark, Magician) had no mastery attributes in `content/archetypes/fc27.json`, so the line Figma draws under the PlayStyles ("Mastery attributes: …", phone) and the "Mastery attributes" tile (tablet, desktop) were left out for them. **Fixed** from EA's own Pitch Notes table (source `ea-grounds-deep-dive`, read into RESEARCH §10.6 on 25 Nov, not found by the first search): Stamina, Interceptions; Def. Awareness, Short Passing; Reactions, Ball Control; FK Accuracy, Vision; Crossing, Dribbling; Curve, Acceleration, in EA's order. Creator's "Free Kick Accuracy" uses the attribute list's name, FK Accuracy. No value is made up; Chime can check them in game.
4. Tablet rail 3.4: the emblem art sits at Figma's fractional 27.43 px; Chrome and Figma anti-alias the art and the "Forward" label differently. Same geometry (checked node by node: 48 px circles 6 apart, art 27.43 px, label 10 px under). **Not fixed:** a renderer difference.
5. Top bar (phone 4.0, tablet 3.1) and footer (phone 5.2): Figma rounds each text box up to a whole pixel, so the footer links drift up to 3 px right of Chrome's by "Takedown", and text anti-aliasing differs. Shared shell components (D-102), the same on every page; see the faces audit, items 4 and 16. **Not fixed.**
6. Everything else matched already: the rail's groups and lime ring, the Stance cards and their blurred neighbours, the signature PlayStyles, the facts column, "See Finisher builds", the sources line, "12 of 13" and the arrows. No change.

| Section | 393 before → after | 834 before → after | 1440 before → after |
| --- | --- | --- | --- |
| Top bar | 4.0 → 4.0 (item 5) | 3.1 → 3.1 | 1.8 → 1.8 |
| Header | 20.5 → 20.5 (item 1; 2.1 with Phone type) | 0.3 → 0.3 | 0.2 → 0.2 |
| Emblem rail | 5.5 → 1.7 | 3.4 → 3.4 (item 4) | 2.7 → 2.7 |
| Stance cards | 3.9 → 3.9 (item 1; 2.9 with Phone type) | 2.4 → 2.4 | 2.3 → 2.3 |
| Facts | 2.9 → 2.9 | 2.7 → 2.7 | 2.1 → 2.1 |
| Footer | 5.2 → 5.2 (item 5) | 2.0 → 2.0 | 1.2 → 1.2 |

## Archetype page (`/builds/finisher`)

Compared with the page as built in a611c7d, which had one Finisher card (the Meta Finisher sample).

7. Figma draws three Finisher builds; the code had one. **Fixed:** "Tall Finisher" (Recommended, ST, Level 55 · 193 cm · 88 kg, 80 / 90 / 66 / 78 / 42 / 88, Low Driven Shot and Precision Header) and "Quick Finisher" (no tag, ST CF, Level 55 · 173 cm · 72 kg, 94 / 88 / 74 / 89 / 34 / 66, First Touch and Rapid) are sample drafts (`content/builds/tall-finisher.json`, `quick-finisher.json`), copied from 288:1136 and 288:1174. Only what the card draws is filled in; their build pages, which no frame draws, show `PLACEHOLDER` for the rest and no level switch (a sample may now have no drawn levels; validator, type and FORMAT updated). The header reads "Forward · 3 builds".
8. "Sample values: not real builds yet" (Label/Caption, text/muted) between the header and the cards, 20 px (phone) or 24 px (tablet, desktop) from each. Missing. **Built:** shown once when the list holds a sample.
9. Figma's sample cards have no Draft tag, version tag or credit line; the code showed all three. **Fixed** for samples (D-113): the note marks them. A recorded build's card keeps its version tag and credit (rules 4, 5); no frame draws that card (question for Chime). With every card a sample, the card is three subgrid rows, not four, so no empty 14 px row is left under the PlayStyles+.
10. The Meta pick tag is 24 px tall on phone (288:1100, card 266 px) and 26 px on tablet and desktop (290:952, 290:1240, text 3 px down, like the bordered Recommended tag). The code drew 24 everywhere. **Fixed** per breakpoint (3 px padding from tablet). Tablet Meta card 5.5 → 4.3.
11. Desktop (290:1084) draws Quick Finisher 254 px tall beside two 268 px cards, its header 76 px. **Not fixed:** D-62 (3) gives every card in a row one header height, so it is 268 here, with its face and name centred in the 90 px header row, as on the tablet row where all three share it. This is the whole of desktop row1's 6.8 (Meta and Tall alone: 4.1; Quick 17.0). Figma's frame should be changed to 268 (question for Chime; Figma is read only for this work).
12. Text inside the cards (key stats, names, PlayStyles+) draws about 1 px differently in Chrome and Figma (the build page audit's item 40); a pixel search finds the stat row best at no offset and the PlayStyles+ row 1 px lower in Chrome. **Not fixed:** a renderer difference. It is what keeps each card near 4.
13. Everything else matched already: breadcrumb (Builds text/secondary, "/" text/muted, Finisher text/primary), 56 px emblem 14 px from the title, the grid (phone one column 12 apart, tablet two of 365 px 24 apart, desktop three of 384 px), the stat strip, the mannequin face and the Submit tile beside Quick Finisher on tablet (254 px). No change.

| Section | 393 before → after | 834 before → after | 1440 before → after |
| --- | --- | --- | --- |
| Top bar | 4.0 (item 5) | 3.1 | 1.8 |
| Header (with the sample note) | — → 3.1 | — → 1.3 | — → 0.7 |
| Cards, row 1 | Meta 4.1, Tall 4.2, Quick 3.5 | Meta 5.5 → 4.3, Tall 4.5 | 6.8 (item 11; Meta + Tall 4.1) |
| Cards, row 2 (Quick + Submit tile) | | 1.9 | |
| Footer | 5.2 (item 5) | 2.0 | 2.7 |

"Before" is blank where the section did not exist: with one card and no note the page could not be compared section by section.
