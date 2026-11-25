# Progress

Newest first. Each entry: what changed, what was checked, what wasn't verified, what's next.

## Faces library: demo faces aligned to one rule (Wed 25 Nov 2026)

- **Chime:** the pictures aren't centred the same way (Michael Jackson especially); "everything is exactly in the same format".
- **Measured** with Apple Vision face landmarks (script in the session scratchpad): before, eye midpoints ranged x 293–319, y 220–269 and eye distance 106–135 px on 600 px crops (MJ 27% larger and right of centre, Ronaldo higher).
- **Rule:** eye midpoint centred, eye line 45% down, eyes 24% of the width apart (the largest size MJ's crop allows without the creator's panel or watermark). After: x 299–301, y 268–271, distance 144–146 px.
- **Figma:** the 12 slots in A, B and C re-uploaded (FILL, untransformed, so the 4:5 and 96 × 120 slots crop the sides evenly). Renders of all three checked.
- **Trade-off:** faces are larger than before; the tops of the hair sit close to the edge.
- **Ronaldo swapped** at Chime's request for Xaiiros's video (https://youtu.be/SHmX5Z8BxFs, frame at 25 s; the chest watermark, reference inset and menu panel kept out of frame), cropped to the same rule: eyes (299, 270), 143 px apart. The demo note now credits Xaiiros and CodeName Max.

## Faces library: four real-looking demo faces, kind filters (Wed 25 Nov 2026)

- **Chime:** use YouTube frames of 2008 Ronaldo, Michael Jackson, LeBron James and Lamine Yamal, cropped like the pro's face; chips All, Footballers, Athletes, Musicians; drop the era chips. Recorded as D-68.
- **Frames:** found the creators' FC 27 tutorials on YouTube in Chrome, drew the frame at 15 s to a page canvas, cropped a square around the head (creator watermark, captions, menu panels and club crests kept out of frame, not edited out), saved with the screenshot tool, trimmed with ffmpeg. All four from CodeName Max (the studio framing matched the pro's shot best; JaxStash's MJ was turned and had sculpt highlights). Files and links: git-ignored `reference/faces-demo/` with `SOURCES.md`. No video downloaded.
- **Figma (options A 333:1139, B 333:1199, C 333:1257):** the 12 picture slots got the four crops (upload_assets, FILL); cards now Cristiano Ronaldo (Footballer · 2008), Lamine Yamal (Footballer), LeBron James (Athlete), Michael Jackson (Musician); chips All 4, Footballers 2, Athletes 1, Musicians 1; B and C gained an Athletes shelf/group; the note credits CodeName Max. The placeholder row moved to y 2247 and Phases 3–5 down 398 px; no overlaps.
- **Checked:** every slot has an image fill; renders of all three at 0.75×.
- **Not done:** `athlete` in the content format and validator (code, tests first).
- **Next:** Chime picks A, B or C.

## Faces library: demo face in, phone menu button out (Wed 25 Nov 2026)

- **Chime (screen recording):** "Why is there a hamburger icon here when we already have the navbar?" and "can we put a demo face… use this face" (the pro's face from the Meta Finisher share cards).
- **Top bar, phone (205:375):** the Menu button (205:385) is removed; the season chip moves to the right edge, 20 px in. Every phone screen updates through the component. Recorded as D-67; PLAN Phase 3 "menu sheet" dropped.
- **Faces library options A, B and C:** all 12 picture slots now show the pro's in-game face (the link preview's image, scale FILL) in place of "Face coming soon" and the big era. The sample note reads "Demo: Chime's own pro stands in for every in-game capture" and wraps to two lines; the bottom nav was re-pinned after the frames grew 20 px.
- **Kept:** the empty-slot versions are on Archive (336:2059, 336:2124, 336:2195) for the "no capture yet" state.
- **Open risk:** D-42 bars a stand-in face next to a real person's name in drafts or the product. The demo is in Figma only, labelled, and goes nowhere near the repo; each real card will show its own recreation.
- **Checked:** renders of all three at 0.75× and the Top bar at 2×; the note fits; the nav sits inside its space on all three.
- **Next:** Chime picks A, B or C.

## Faces library: three options for Chime to pick (Wed 25 Nov 2026)

- **Chime:** "work on the next page… create three variants of the page for me to choose from." The next page not yet designed is the Faces library (Phase 2). Phase 1's three build states are still to design; the toast and bottom-nav picks are still open.
- **Where:** Design screens → Phase 2 · Faces, row "Faces library · 3 options (pick one)": A 333:1139, B 333:1199, C 333:1257 (phone 390). The six placeholder frames moved to a row below; Phases 3–5 moved down 1,703 px (no overlaps).
- **Shared:** Top bar, "Faces" title, intro, sample note, Search field, filter chips with counts (All 4, Footballers 3, Musicians 1, 2000s 2, 2010s 1), Footer notice, Bottom nav (Page=Faces, fixed).
- **Options:**
  - A · Poster grid: two columns of 4:5 cards; the empty picture slot shows "Face coming soon" and the era (or surname) in Number/XL; then kind and era, "Inspired by …", "Not yet checked in game"; a dashed "Missing a face?" tile. (Letterboxd, Moonly)
  - B · Shelves: a heading per kind with a swipeable rail of 216 × 270 cards, era in Display; "Missing a face?" closes the Musicians rail. (Calm, Hatch)
  - C · List by kind: grouped lists on a surface card; each row a 96 × 120 slot, name, kind and era, status, chevron. (Oura, IMDb)
- **Sample content:** Cristiano Ronaldo 2008, 2017 and 2007, Kanye West (O-05, CLAUDE.md). No picture: no recreation exists, and D-10/D-42 rule out stand-ins; the slot is where Chime's in-game capture goes. Kanye has no era on record, so his slot shows his surname.
- **Checked:** renders of all three at 1.5×; audit: text 14 px or more, Barlow only, fills and strokes bound to tokens, no overflow (C's name text fixed after the audit).
- **Copy (drafts):** intro "Lookalike and era faces, each a step-by-step recipe with a build to match.", "Search faces by name", "Sample cards: no face is recorded in game yet", "Missing a face?" / "Suggest one on Submit.", "See all", era chips "2000s" / "2010s".
- **Next:** Chime picks A, B or C; then the empty-filter state, then tablet 834 and desktop 1440 (D-58).

## Share sheet on phone refined; toast and bottom nav options (Wed 25 Nov 2026)

- **Chime (screen recording):** tablet and desktop share dialogs and the link preview approved. Phone sheet: the action buttons look odd next to the tablet's, and card 1 sits centred with empty space on its left. The "link copied" toast and the bottom nav are bland: three options each.
- **References (Mobbin, iOS):** share sheets from Linktree, Lovi, Me+ and Polarsteps; "copied" feedback from Phantom, World App, Notion, Xbox, Crypto.com and Netflix; floating tab bars from Ladder, WHOOP, Comet, Opal, Moonly, Apple Fitness and Tide Guide.
- **Phone share sheet (319:904), before → after:**
  - Actions: three 52 px outlined icon tiles with labels under them → DS Button secondary large, the tablet's buttons: "Save images" and "Copy link" side by side (172.5 px each), "Share via…" full width under them. The tablet's three in one row needs 402 px; the phone has 353.
  - Cards: card 1 at x 64 (centred) → x 0, aligned with the title; card 2 follows 12 px later and runs to the screen edge.
  - Pager: centred → left-aligned.
  - Hint: centred, "Saves both cards… More opens your phone's share menu." → left-aligned, "Saves both cards to your photos."
  - Close button: large 52 → medium 44, title row centred (the ✕ sat below the title's middle); sheet top padding 20 → 14, so the sheet is 740 px and starts below the breadcrumb instead of cutting through it.
  - Old version on Archive (327:1434).
- **Options board (Design System page, 329:404), not yet picked:**
  - Toast A cream pill; B dark bar with a lime tick tile and two lines; C no toast, Copy link turns lime "Copied" in the open sheet.
  - Bottom nav A Submit split out as a lime circle; B lime active tab with Button/Small uppercase label on darker glass; C every tab labelled, current tab on a raised tile with a lime icon.
  - Why the current toast reads badly: same bg/raised as the nav, 12 px above it, muted status/success tick.
- **Checked:** renders of the sheet at 1.5–2× and the board; toast icons at 3×. Audit over the new nodes: no text under 14 px, Barlow only, every fill and stroke bound to a token, nothing overflowing (option B labels re-linked to Button/Small after the audit flagged them).
- **Copy (drafts):** "Share via…", "Copied", "Link copied" / "Paste it in any chat." split over two lines in toast B.
- **Next:** Chime picks one toast and one nav; then update the Toast and Bottom nav components and every screen that uses them.

## Sharon's PRs reviewed; streamer builds approved (D-66) (Wed 25 Nov 2026)

- **Chime:** approved PR #5 (builds from streamers' videos): "We don't have to be waiting for their reply. We publish their build and we credit them by putting the link of the video."
- **Done:** PR #5 approved with a reply to Sharon and squash-merged (6696926). D-66 recorded; O-17 closed. Pointers to D-66 added in CLAUDE.md rules 5 and 9, `content/README.md` rule 4 and SPEC flow 5.
- **Reviewed, not merged:** #6 (build, face and archetype formats, A-18) and #7 (level engine, draft, builds on #6). Both CI green. Both line up with D-30, D-34, D-35, D-41 to D-44, D-62 and D-63; #7's AP totals match RESEARCH §10.1. Chime approved: #6 squash-merged (26533d1) with answers to Sharon's four questions; #7 told to update from main. #3 and #4 (Pitchside) closed. All 5 checks pass on main after the merge.
- **Not checked:** #6 and #7 weren't run locally (CI ran them). Attribute spellings and the fifth GK attribute need Chime's Edit Attributes screen.
- **Next (Chime, on the console):** attribute spellings and GK Kicking on Edit Attributes; AcceleRATE names; whether Edit Attributes shows a price you can't afford (#7). Then review #7 once Sharon updates it.

## Share build: link preview and share sheet on every size (Wed 25 Nov 2026)

- **Chime:** approved the two story cards; asked for the link preview and the share sheet (D-65).
- **Design System:** new Icon/download (318:414). Drawn on a 24 px grid at a 1.5 px stroke, centred, with region fills stripped; it uses the text/primary token.
- **Phase 1 rows:**
  - "Share build · sheet and dialogs":
    - Phone sheet (319:904): the DS Sheet, detached and refilled with a title and close button, the two cards at 62.5 % with the next one peeking, a "1 of 2" pager, three round actions (Save images, Copy link, More) and a hint.
    - Phone link copied (319:1674): DS Toast (success), "Link copied. Paste it in any chat.", 12 px above the nav.
    - Tablet dialog (319:2234) and desktop dialog (319:2952): both cards at 75 %, Button secondary "Save images" and "Copy link", plus the share icon button on tablet only.
  - "Share build · story cards and link preview": card 1 (316:888), card 2 (316:973), link preview (319:885), plus an export note.
- **Archived:** the old toast placeholder (197:226) and the emptied section shell (316:1119).
- **Moved:** Phases 2–5 down 2,262 px; Phase 1 widened to 3,660 px.
- **Checked:** renders of the phone sheet, toast, tablet and desktop dialogs and the link preview. The first sheet render hid the close button (the title filled the row); fixed. No overlaps on the page.
- **Copy (drafts):** "Share build", "Saves both cards to your photos…", "Link copied. Paste it in any chat."

## Share build: two story cards instead of one crowded card (Wed 25 Nov 2026)

- **Chime:** the references didn't help; make the information organized, not clustered, with a free hand.
- **Design:** "Share build: two story cards" (316:1119, x 4111 y 580). Each card is 360 × 640, exported at 3× (1080 × 1920); stories play as a sequence.
  - **Card 1 · Overview (316:888):**
    - Logo and "1 / 2".
    - A 104 px face beside the Meta pick tag, the name (34 px) and "Finisher · Forward" with the emblem.
    - Three label-over-value facts between hairlines: Positions (ST CF chips), Level 55, Height 6'1" 185 cm.
    - The version line.
    - PlayStyles+ (2) and PlayStyles (6), each a titled section with a two-column list of 22 px icons and 14 px names.
    - Footer: link, credit and notice.
    - Content 610 of 640 px.
  - **Card 2 · Attributes (316:973):**
    - Logo and "2 / 2"; "ATTRIBUTES" with "Meta Finisher · Level 55 · Finisher".
    - One line explaining +2 Mastery.
    - Six groups in two columns: group name and a score chip over a hairline, 18 px rows, Mastery +2 marked.
    - The same footer.
    - Content 634 of 640 px.
- **Archived:** the three one-card options (309:1558).
- **Stopped:** the board server.
- **Checked:** a 2× render of both cards (temp board deleted); no overlaps on Design screens.
- **Next:** Chime's OK; then the link preview (1200 × 630) and the share sheet screen.

## Share image: references on the board (Wed 25 Nov 2026)

- **Chime:** the share image is "so close that there's no space. It looks overwhelming". Find references for downloadable share cards on Mobbin and elsewhere, put them on the board, and let them pick.
- **Board** (git-ignored `reference/board/`):
  - New group "Share build" with two sections, "1 · A share image with room to breathe" (15 refs) and "2 · The share sheet around it" (3 refs).
  - Data in `refs-share.js`; images in `img/share-card/`.
- **Sources:**
  - Mobbin: Spotify Wrapped, Beli, Brink, Duolingo, Marriott, Future Pro, pushr, Hevy, Bevel, Strava, MD Vinyl, Polarsteps, Runna.
  - Other sites: two Sofascore cards, NBA 2K27's official Community Builds sheet, two Dribbble football stats concepts.
  - Left out: a spreadsheet table and a badge chart (as crowded as our problem).
- **Recommendation on the board:** split the build into two or three swipeable cards (Bevel, Strava), each laid out like Sofascore's (one hero number, tall ruled rows). Card 1 is the face, facts and PlayStyles; card 2 is the attributes in grouped columns.
- **Server:** the board server (port 4310) is running for Chime's picks; stop it after reading `notes.json`.

## Share image: PlayStyles in, the six-stat row out (Wed 25 Nov 2026)

- **Chime:**
  - Remove the PAC/SHO/PAS/DRI/DEF/PHY row; the group scores next to PACE, SHOOTING and the other groups already show those six numbers.
  - The image showed only the PlayStyles+; show the PlayStyles too.
- **Changes, before → after (all three options):**
  - Six-stat strip → removed.
  - PlayStyles+ row (2 icons) → a "PlayStyles" block: a heading with "2 PlayStyles+ · 6 PlayStyles" and a two-column list. Low Driven Shot+ and First Touch+ come first with gold icons; then Finesse Shot, Power Shot, Rapid, Quick Step, Precision Header and Acrobatic.
  - A: the logo at the top → removed (the footer keeps it).
  - B: face hero 150 → 122 px.
  - C: version line moved under the hero; card padding 14/12 → 12/10; plain PlayStyle icons on 18 px dark tiles (white icons vanished on the cream card).
- **Checked:** a 2× board of all three and a 2.5× close-up of C's PlayStyles (temporary boards deleted). All three fit in 640 px.

## Share build and the share image, three options (Wed 25 Nov 2026)

- **Chime:** Copy build → Share build: a rendered image of the whole build to download and send, plus a link to the page (D-64). Picked a story image plus a link preview, showing everything.
- **Figma:**
  - "Copy build" → "Share build" on phone, tablet and desktop build pages.
  - The toast placeholder is renamed "share sheet and link copied".
  - New section "Options · Share image, story 1080×1920 (pick one)" (309:1558), drawn at 360 × 640 and exported at 3×:
    - A · Stat sheet (309:868): logo, face 76 px, tag, name, positions and level, version line, stat strip, PlayStyles+, attributes in two columns, footer with link, credit and notice.
    - B · Face poster (309:1099): the in-game face full width, fading into the page under the name.
    - C · Light spec card (309:1331): Light theme mode, the details in a bordered card on cream.
  - References: Runna and Slopes share sheets, the pliability photo card, Mimo's story card.
- **Review before showing:**
  - First render problems, all fixed:
    - Attribute bars read as underlines and hit the numbers; removed, so rows are name and value only.
    - A's logo and version line collided.
    - B's last rows were cut off.
    - C's lime text was unreadable on cream; accent text now uses accent/text.
    - C's version line was cut off.
    - C's wordmark disappeared on cream; recoloured to text/primary.
  - All three fit inside 640 px (content ends at 624 of 624).
  - Checked A at a full 1080 × 1920 render and B and C at 2×.
- **Type:** attribute rows use 13 px at the 360 scale (39 px in the image, about 14 px when shown full-screen on a 393 px phone).
- **Open:**
  - The lime mark in C's logo is faint on cream.
  - The link preview is designed after the pick.

## Build page on iPad and desktop (Wed 25 Nov 2026)

- **Chime:** approved the refined build page; asked for iPad and desktop (D-63).
- **Phase 1, row "Build · Meta Finisher":**
  - Phone 298:3630.
  - Tablet 306:794: a 300 px summary column beside the details, 40 px gap.
  - Desktop 306:1286: a 400 px summary column beside 736 px of details, 64 px gap. Body details and PlayStyles are in three columns, the attribute groups in two.
  - The four state placeholders moved to their own row, "Build states"; Phases 2–5 moved down 1,135 px.
- **Fixed while reviewing:**
  - The desktop attribute groups first came out 2,288 px wide (wrap container hugging); now they are two 348 px columns, with bars and values re-laid.
  - The sample note and the AP line wrapped into the title and the slider on tablet. Their fixed-height boxes are now auto layout on all three sizes.
  - The gap above Copy build was 2/22/42 px across sizes; now 20 px everywhere.
  - Two stretched label boxes on desktop shrank back to their text.
- **Checked:** full renders of desktop and tablet; 2× renders of the phone and tablet tops. The audit on all three finds no text under 14 px and nothing past the side edges (20 / 40 / 120). No overlaps in Phase 1 or on the page.
- **Next:** the build states (specialization not reached, not yet checked, older season, copied toast), phone first.

## Build page: picture block and Mastery made clear (Wed 25 Nov 2026)

- **Chime:** "What does the mastery mean close to finishing and composure?" and "the picture next to the finisher is not aligned properly… find a way to present that information properly."
- **Mastery (from docs/RESEARCH.md §10.6):** levelling an archetype adds +1 to its two mastery attributes at level 10 and +1 more to each by level 55, on every build of that archetype. EA's Pitch Notes state level 10; levels 30 and 55 are seen in game footage (22 Oct). Build values are raw and exclude it.
- **Changes, before → after:**
  - Picture block: a 128 × 243 portrait beside a floating emblem, FINISHER, chips and a stats box → the archetype page's build-card header: a 112 px face beside the emblem, "Finisher / Forward", ST CF chips and "Level 55 · 6'1" · 185 cm", then the six stats in one ruled row and the picture caption.
  - Mastery pill: lime "Mastery" (unexplained; lime is reserved by D-50) → a neutral raised pill "Mastery +2", centred on the attribute name.
  - New line under ATTRIBUTES explains Mastery +2, with its sources.
- **Checked:**
  - 2.5× renders of the picture block and the Shooting group, plus a full render.
  - Audit: no text under 14 px, nothing past the 20 px edges.
  - One script picked the wrong "Composure" (the specialization list) and moved both pills about 1,000–1,700 px up; that was caught on the next render and undone.

## Build page: the original refined, not replaced (Wed 25 Nov 2026)

- **Chime:** none of the three variants work ("why are we using the archetype stance card for the build section?"). Keep the original Meta Finisher phone screen and refine it.
- **Done:**
  - Variants A–C are archived (294:1627).
  - The original is archived as "before refine" (184:209).
  - The refined page (298:3630) is in its Phase 1 slot as "Build · Meta Finisher · phone 390".
- **Changes, before → after:**
  - Header: captured copy → Top bar component (phone).
  - Footer: captured copy → Footer notice component (phone); the draft note stays above it.
  - Left edge: 16 px (and 32 px for the panels, details and lists, 36 for "Your level") → 20 px for every block (D-59).
  - Picture: old full-body in-game crop (face mask, club crest showing) → the in-game face close-up used on the archetype page cards. Caption "…in the Finisher stance, from the game." → "Chime's own pro, from the game."
  - Text: 11–13 px (stat labels, sample note, tag, details labels, Mastery, AP line) → 14 px minimum; 85 texts now on DS text styles (Label/Caption, Label/Default, Body/Default, Heading/H1, Number/Medium, Button/Large). Condensed headings (Your level, Finisher, Attributes, group names, values) keep their original condensed caps.
  - Sample note: outlined pill (overflowed at 14 px) → plain muted caption, as on the archetype page.
  - Stats beside the picture: fixed 185 px panel (gap on the right) → fills its column, label and value on one baseline.
  - Copy build: 361 px (ran 8 px past the edge) → full content width.
  - Level slider: ran past the right edge → track from edge to edge, knob ends on the edge.
  - Specialization rows: 12 px further in than the paragraph and ending short → aligned to the paragraph, values on the right edge.
  - Attributes: groups at 32 px, bars ending 24 px short → full width, bars scaled to keep their proportions.
  - Mastery pills: clipped at 14 px → widened to fit.
- **Checked:** five full renders and two 2.5× renders of the top half (temporary boards deleted). The audit finds no text under 14 px and nothing past the 20 px edges. No overlaps in Phase 1.
- **Still raw:** 60 texts keep raw styling on purpose (condensed headings and numbers that have no matching DS style, mixed-weight lines such as the AP line).

## Build page: three variants (Wed 25 Nov 2026)

- **Chime asked:** three variants of the build page (`/builds/finisher/meta-finisher`).
- **New section:** "Options · Build page (pick one)" (294:1627, x 4111 y 580). All three carry the same content: the tag, name, positions, level, height, six key stats, Copy build, your level and AP, "all of it at level 55", specialization, body and skills, PlayStyles+, PlayStyles and attributes.
  - **A · Stance card beside the numbers** (294:768). From the F1 Leclerc driver card and the NFL player header. It is the current page in order, with the old in-game crop (it showed a club crest) replaced by the Finisher Stance card.
  - **B · Face hero and tabs** (294:1257). From the MLS and Premier League player pages. The in-game face fades into the page under the name, then the stat strip and Copy build, then tabs (Overview, Attributes, PlayStyles), with Overview shown.
  - **C · Big card and folding sections** (294:1444). From Alan's character profile and F1's expandable details. A full-size Stance card is centred over the name, then the stat strip, Copy build and level. Specialization is open; Body and skills, PlayStyles and Attributes are folded with one-line summaries.
- **Reused:** the level, specialization, body, PlayStyles and attributes blocks are copies from the approved Meta Finisher capture (184:209).
- **Review before showing, problems found and fixed:**
  - The copied Attributes block collapsed to 103 px.
  - The level slider ran past the edge and "Your level" was indented 16 px.
  - A's level and height line was cut off.
  - C's open section repeated "Specialization" inside a second panel.
  - C's Attributes summary was cut off.
  - B had a wide gap between the version and sample lines.
  - 59 copied text runs were 11–13 px; they are now 14 px.
  - The two Mastery pills clipped "Mastery" until they were widened; checked on a 3× temp board, then deleted.
- **Still open:**
  - The copied blocks still use raw text, not our text styles; they get rebuilt on styles once a variant is picked.
  - A's Stance card at 160 px renders its "Forward" plate text at 9 px (card art, scaled).

## Archetype page is option B, on phone, tablet and desktop (Wed 25 Nov 2026)

- **Chime:** picked option B (stat strip) (D-62).
- **Phase 1, row "Archetype · Finisher":**
  - Phone (288:1031): option B.
  - Tablet (290:796): two columns of 365 px; the gap after Quick Finisher holds a "Submit a build" tile.
  - Desktop (290:1084): three columns of 384 px.
  - The row "Build · Meta Finisher and its states" moved down 475 px, and Phases 2–5 moved down 572 px.
- **Archive:** options A and C, their notes and the old "To design" placeholder (197:218) are in section 288:858 on the Archive page.
- **Review:**
  - The first desktop render had stat rows at different heights, because Quick Finisher has no tag and Recommended is 2 px taller than Meta pick. Tags are now 26 px and card headers share the row's height; all stat rows sit at y 121.
  - The audit over all three frames found no small or unstyled text, no unbound fills and no overflow. No overlaps in Phase 1 or on the page.
- **Next:** the Build page (Meta Finisher) and its states, phone first.

## Archetype page: full build cards, three options (Wed 25 Nov 2026)

- **Chime's ask:** each build in the Finisher list needs more than its name, archetype and position. Use the Old Gold build card (Builds new style, Finisher screen 110:2, the build cards only, not its header): a Meta pick or Recommended tag, the face, positions, level, height, key attributes and PlayStyles+. That is option A; then two more styles.
- **New section on Design screens:** "Options · Archetype page build cards (pick one)" (288:858, x 4111 y 580).
  - A · Old Gold build card (288:859): a 104 px face, the tag, name, position chips, "Level 55 · height", a 3 × 2 stat grid, PlayStyles+ icons.
  - B · Stat strip (288:1031): a 76 px face with tag, name, chips, level and height; the six stats in one ruled row; PlayStyles+ with names.
  - C · Two-up cards (288:1212): the face on top with the tag on it, then name, chips, level, height, the stats as label over value, PlayStyles+ icons. The fourth slot is "Submit a build".
- **Content:**
  - Values are the Old Gold draft's samples (Meta / Tall / Quick Finisher), labelled "Sample values: not real builds yet".
  - Faces are Chime's in-game screenshots.
  - The tags reuse the approved Meta pick style (accent fill); Recommended is a raised pill with a strong border.
  - PlayStyle+ icons are the DS PlayStyle sets, Tier=PlayStyle+.
- **Review before showing:**
  - Problems found and fixed: in C the stat numbers overlapped their labels; in B the PlayStyles+ names ran off the card; the fixed nav hid the third card in the static frames (phone frames now show the nav at the page end, over the 96 px space, including Builds 241:556 and Meta Finisher 184:209); C's faces were 1 px wider than the card and their crop was too high.
  - The audit script now reports no small or unstyled text, no unbound fills and no overflow.
- **Archive:** the face-only options section 270:525 moved to the Archive page.
- **Unclear:** Chime also said "boots and fit"; not added, asked.

## Bottom nav fixed after review (Wed 25 Nov 2026)

- **Chime:** "most of the icons are cropped out… Review what you have done before you submit it to me."
- **Cause:** `figma.flatten` had moved each glyph of the four new icons to the top-left of its 24 px frame, which clipped it. I only looked at a 1× render and missed it.
- **Fixed:**
  - Icon/home, face, card and list are redrawn on a 24 px grid at the icon set's 1.5 px stroke (they were 1.9 px, heavier than plus, menu and search) and centred in the frame.
  - The Faces icon is now a head and shoulders; the old one read as a medal.
  - The flattened shape data brought its own black fill from the SVG, which overrode the token colours. That is stripped; the icons are text/primary, inactive nav icons text/secondary, and the active pill icon text/inverse.
  - Every Bottom nav variant is now a fixed 344 px with even spacing (it was 313–344), so the bar no longer changes width between pages.
  - The nav is recentred on the five phone frames (x 25).
  - The new icon labels in the Icons sheet use the label style and the sheet's 140 px row step.
- **Checked:**
  - A temporary 3× board of all five variants and a 5× board of the icons with frame outlines, deleted afterwards.
  - An audit script over Nav item, Bottom nav and the four icons: no clipped glyphs, unbound fills, text under 14 px, unstyled text or overlaps in section 05.
  - The Builds phone render and the Icons sheet render.
- **Known:** in the static phone frames the fixed nav covers whatever sits behind it at y 758 (on Builds, the PlayStyle names). That is how a fixed bar behaves while scrolling; the 96 px space after the footer keeps the end of the page clear.

## Phone bottom nav, after Old Gold (Tue 24 Nov 2026, late)

- **Request:** Chime asked for the floating bottom nav from the Old Gold phone draft (D-61).
- **Design System:**
  - Icons: Icon/home 282:333, Icon/face 282:343, Icon/card 282:355 and Icon/list 282:365, redrawn from the Old Gold nav's SVGs with outlined glyphs bound to text/primary.
  - "Nav item" set 282:390 (Active/Inactive, Icon swap, Label text).
  - "Bottom nav" set 282:521 (Page=Home/Faces/Builds/Changelog/Submit, 313–344 px wide, 60 tall).
- **Placed:** Page=Builds on Builds phone 241:556, Meta Finisher phone 184:209 (now hugs its height) and the three Archetype phone options. Each nav is fixed in place (numberOfFixedChildren 1) at y 758 inside the first 852 px viewport, with a 96 px space after the footer.
- **Checked:** renders of the Bottom nav set and the Builds phone; no overlaps in section 05.
- **Open:**
  - The nav's width changes a little from page to page because the active label differs ("Changelog" is the longest).
  - The phone top bar still has its menu button, which now partly duplicates the nav (About and Takedown are only in the footer).

## Builds desktop is option B, and tablet follows it (Tue 24 Nov 2026, late)

- Chime picked desktop option B and asked for the same layout on iPad (D-60).
- **Phase 1, row "Builds · 13 archetypes":**
  - Phone: 241:556.
  - Tablet: 279:1399, new. It uses tablet top bar and footer variants and the tablet rail. The 280 px card with 180 px neighbours sits in a 350 px column; the facts take 364 px, with tiles stacked and the button full width.
  - Desktop: 276:1073, option B.
- **Archive:** section 276:737 now holds options A and C plus the replaced centred tablet (275:378) and desktop (275:632).
- **Checked:** the first tablet render showed the stacked fact tiles squashed to 30 px tall. They now hug their content (90 px each). Phase 1 render checked.
- **Next:** Chime picks the Archetype page option (section 270:525), then its tablet and desktop versions.

## Builds header alignment and spaced rail (Tue 24 Nov 2026, late)

- **Why:** Chime asked why the title was centred on tablet and desktop but left-aligned on phone. I had centred it to sit over the centred card, and that wasn't a rule. It is now left-aligned at every size (D-59).
- **Rail and header:** the desktop emblem rail now spans the full 1200 px column (24 px between emblems, about 51 px between groups); on tablet it spans the full 754 px. This applies to tablet 275:378, desktop 275:632 and options A, B and C (276:741, 276:1073, 276:1348).
- **Edges:** the padding was 48 px on the desktop top bar and footer and 32 px on tablet. It is now 120 px and 40 px, so the logo, title, content and footer share one left edge.
- **Checked:** renders of desktop 275:632, option B and tablet; the logo, title, rail and footer line up at x 120 on desktop and x 40 on tablet.

## Builds desktop: three ways to fill the space (Tue 24 Nov 2026, late)

**Chime:** the desktop Builds page has too much empty space; find a way to fill it.

**Done:** new section on Design screens, "Options · Builds desktop 1440, fill the space (pick one)" (276:737, x 4111, y 2015). Phone and tablet are unchanged.
- **A · Five-card row** (276:741), from Artlist's character studio and FC 27's archetype row.
  - Spark and Shot Stopper are added as faded outer cards. The row loops: after Target comes Shot Stopper.
  - The arrows move under the card with "12 of 13".
- **B · Big card beside the facts** (276:1073), from Higgsfield's character page and OpenSea's item page.
  - The left column has the Finisher card at 392 px, with blurred neighbours behind it and the arrows.
  - The right column has a kicker, FINISHER in Display, "Not yet checked in game", and the Signature PlayStyles with "Since launch" and "Since Season 2". It also has two fact tiles (Mastery attributes; AP cost changes, 22 Oct: 6 up · 4 down), the button and the sources.
  - All facts come from `content/archetypes/fc27.json`.
- **C · All 13 cards by position** (276:1348), from MLS's roster and Premier League's squad.
  - There is no rail and no carousel: one row per group (Keeper, Defender, Midfielder, Forward), each with a count.
  - Each card is 212 px with its two signature PlayStyles underneath, taken from fc27.json.
  - The Finisher card shows a hover state: a lime ring and "See Finisher builds →".

**Checked:**
- Renders of all three.
- No overlaps on Design screens.
- C's rows fit inside the 1200 px content width.

**Open points for Chime:**
- B shows FINISHER twice: on the card's plate and as the panel title.
- In C, the plate text on the 212 px cards drops below 14 px. It is card art, but small.

**Next:** Chime picks A, B or C for desktop (tablet may follow the pick), and picks the Archetype page option.

## Builds page on tablet and desktop; Phase 1 organised by screen (Tue 24 Nov 2026, late)

**Chime's direction:** every finished section also gets desktop and iPad designs, and the file gets organised (D-58).

**Done:**
- **New variants:** Top bar and Footer notice now have a `Breakpoint=tablet` variant (273:635 and 273:654: 834 wide, 32 px padding, desktop nav). Design System section 05 grew to fit, and section 06 plus the screenshots below it moved down 278 px.
- **Builds · 13 archetypes · tablet 834** (275:378):
  - The header is centred.
  - All 13 emblems are visible: 48 px circles with 28 px emblems, under group labels.
  - The Finisher Stance card is at 290 px, with Magician and Target (214 px, blurred) fully visible beside it.
  - The PlayStyles, mastery attributes and a 360 px button come after the card.
- **Builds · 13 archetypes · desktop 1440** (275:632): the same layout, with these differences:
  - 64 px emblem circles.
  - Centre card at 353 px and neighbour cards at 252 px.
  - Previous and next icon buttons (Icon button secondary large, chevron-left and chevron-right).
- **Phase 1 · Builds is now one row per screen:**
  - Builds: phone, tablet, desktop.
  - Archetype · Finisher: the phone placeholder.
  - Build · Meta Finisher and its states.
  - The section's description now states the rule. Phases 2–5 moved down 2664 px to make room.

**Checked:** renders of both new screens and of the whole Phase 1 section. The desktop emblems were too small inside their circles, so they were scaled up to 36 px. No sections overlap on Design screens or on the Design System page.

**Not checked:** how the stage behaves at widths between the breakpoints. The code build needs a rule for that.

**Next:** Chime picks the Archetype page option (A/B/C, section 270:525), then that screen gets its tablet and desktop versions.

## Archetype page redirected: builds with in-game faces (Tue 24 Nov 2026, late)

**Chime's direction:** "all these examples you gave me is not in the direction". Tapping an archetype opens a page of its builds. Each build shows a close-up in-game face (not the full-body stance), the build name, its positions and the archetype. At least three Finisher builds; three options to pick from.

**Done:**
- The A–C options section (266:222) moved to the Archive page and was renamed "rejected 24 Nov: not the direction".
- New section on Design screens: "Options · Archetype page with face builds (pick one)" (270:525). All three use the same page header (breadcrumb, Finisher emblem, FINISHER, "Forward · 3 builds") so only the build list differs.
  - A · Face rows (270:222), from Premier League's squad list and NFL's roster: 92 px face tile, then name, archetype and position chips.
  - B · Two-up face cards (270:323), from MLS's roster and DAZN's squad: a square face on top and the text below. The fourth slot is a "Submit a build" tile.
  - C · Wide face cards (270:424), from NFL's team cards and X's Top 100: positions, name and archetype on the left; the face on the right fades into the card.
- Faces are square crops of Chime's in-game screenshots (`reference/stances-ai/face-refs`: front, three-quarter, side), cropped above the club crest and name.

**Checked:** two screenshots of the section. The first showed the about heading unreadable on the light section (fixed with the explicit Light mode), the submit tile shorter than the cards, and C's text sitting high. All three are fixed.

**Not real yet:**
- "Box Poacher", "Pace Finisher" and their positions are samples; only Meta Finisher exists.
- All three faces are Chime's pro until each build has its own face screenshot.

**Next:** Chime picks A, B or C. Then move the pick into Phase 1 (replace placeholder 197:218) and archive the rest.

## Builds page set (E); Archetype page: three options (Tue 24 Nov 2026, night)

**Builds page:**
- Chime picked option E and the game's group names (D-57). SPEC's `/builds` row was updated to match.
- Option E (241:556) replaced the "To design" placeholder in "Phase 1 · Builds" and is named "Builds · 13 archetypes · phone 390".
- The Builds options section and the stance-card options section are on the Archive page.

**Archetype page (`/builds/finisher`):**
- **References (Mobbin, iOS):** F1 driver page (Lando Norris), Gymshark athlete page, F1 Leclerc page, Premier League and NBA player pages. Also Chime's 23 Nov pick, DAZN's portrait cards with the facts beside the picture.
- **Built** (Design screens → "Options · Archetype page (pick one)" 266:222). All three use option E's top bar and footer, Finisher's honeycomb pattern and stance, E's Signature PlayStyles block, the Build card (Meta Finisher) and a secondary button:
  - **A · Immersive hero** (266:223): the pattern and stance fill the top and fade into the page, with FINISHER in Display, two fact tiles, then the sources.
  - **B · Card beside the facts** (266:430): the Stance card (160 wide) beside label and value facts, then the Signature PlayStyles and the sources.
  - **C · Banner and ruled rows** (266:628): a 236-tall banner with the stance cropped at the waist and the name on the left, then hairline label and value rows.
- **Data,** all from `content/archetypes/fc27.json`:
  - signature PlayStyles;
  - mastery attributes (Finishing, Composure);
  - AP cost changes on 22 Oct (6 up, 4 down);
  - "not yet checked in game" (`verifiedInGame: false`);
  - the four sources.
  - Typical positions are null, so they're left out. Finisher has one build, so each option shows it plus a "Submit a build" prompt (draft copy).
- **Fixed before showing:** B's fact rows cut off their values (they now hug the text), and B's Group row repeated the card's plate (removed).
- **Checked:** renders of all three.
- **Not checked:**
  - The Meta Finisher card says "verified 19 Nov 2026" while the archetype facts say "not yet checked". These are different things, but they could confuse.
  - The hero fade gradient uses bg/page's raw colour, because a gradient stop can't be bound to a variable.

**Next:** Chime picks A, B or C. Then the build page.

## Stance card 3C picked; 13 patterns, one per archetype (Tue 24 Nov 2026, night)

Chime picked 3C (honeycomb) and asked for a different pattern for each of the 13 archetypes, in the same style.

**Built:**
- **Generator:** `reference/card-patterns/archetypes.py` (git-ignored) renders all 13 in the 3C style. The ridges, engraved lines, bevel, light, streaks, glow, vignette and fade are shared; only the panel shape changes. Each shape is tied to the role:

  | Archetype | Pattern |
  | --- | --- |
  | Shot Stopper | brick wall |
  | Sweeper Keeper | herringbone (footwork) |
  | Progressor | forward arrows |
  | Boss | armour plates with studs |
  | Marauder | slanted runs |
  | Disruptor | broken triangles |
  | Recycler | discs |
  | Maestro | octagon floor |
  | Creator | tumbling blocks |
  | Spark | zigzag |
  | Magician | eight-point stars |
  | Finisher | honeycomb |
  | Target | rings round the chest |

- **Component** "Stance card" (258:585, 13 variants, `Archetype=<Name>`), in Design System → 06 Game assets → "Stance card · 13" (258:227). Each variant has:
  - the pattern;
  - the inner frame line;
  - the stance at one shared scale, with feet just under the plate (the kneeling Shot Stopper at 80% because it was drawn large);
  - a frosted name plate with the emblem, the name and the game's group name.
  - The plate was tightened (emblem 36 → 28, gap 10 → 8, padding 12 → 10) so "SWEEPER KEEPER" fits. Measured: 0 px to spare on that one, 29 px or more on the rest.
- **Option E** (241:556) now uses instances: Finisher in the centre, Magician and Target rescaled, blurred 3 and at 60%. The duplicate name under the card is hidden.
- 3A and 3B are on the Archive page. 3C stays in its section, marked as picked.

**Checked:**
- a render of all 13 variants and of option E;
- the name widths, measured;
- no section overlaps.

**Next:**
- Chime reviews the 13 patterns.
- Then B vs D for the Builds page, and whether the build cards use this card.

## Stance card: designed backgrounds (3A–3C) (Tue 24 Nov 2026, night)

Chime: the cards are still bland and nothing like the references. Card 3 is closest. Add blur or fade, give the background a real pattern, and study FC 27's card background.

**Studied (FC 27 card at full resolution):**
- The background is large hexagon panels, recessed between raised ridges, with an engraved line inside each ridge.
- Soft diagonal light bands run across the whole card, with sharp light streaks in the corners.
- The player is cropped big, and the bottom plate cuts the legs.

**Built:**
- **Backgrounds:** drawn by our own generator (git-ignored `reference/card-patterns/gen.py`, 756 × 1044, 3× the hero card). Each has a pattern, diagonal light, a lime-tinted glow behind the chest, a vignette and a fade into the plate.
  - 3A · Goal net: hexagonal netting that bulges where the ball hits.
  - 3B · Floodlit pitch: mowing bands in perspective under floodlight beams.
  - 3C · Honeycomb: bevelled panels and light streaks, closest to FC 27, in our green.
- **Figma** (section 252:447): 3A 255:832, 3B 255:1046, 3C 255:1260. Each is card 3's frame with:
  - the pattern as an image layer;
  - a bigger stance whose head breaks the frame line;
  - a frosted name plate (green 950 at 72%, background blur 14) over the lower legs;
  - the cards either side blurred (3) and dimmed (60%).
- Cards 1–3 are on the Archive page with Chime's reasons.

**Rule change:** gradients, blur and fades are used here because Chime asked for them. They are on the card art only, not in the UI.

**Checked:** a render of each card in Figma.

**Next:** Chime picks 3A, 3B or 3C, or a mix.

## Stance card: references and three options (Tue 24 Nov 2026, night)

Chime: the card is bland because the stances have no background; design our own card in the spirit of the EA FC card.

**References:** 11 references on the local board (`reference/board/`, section "Stance card", file `refs-cards.js`): Chime's FC 27 screenshot plus 10 from Mobbin. Chime marked "Like parts" on Paramount+ UFC, NFL team leaders, NFL player header and Fanatics Live. The board server was stopped afterwards.

**Built (Figma, Design screens → section "Options · Stance card (pick one)" 252:447):** three copies of option E, with only the stance cards changed:
- **1 · Facets** (252:448), after Paramount+: two flat diamonds in green 800/700 on green 900 behind the player, with the name and group centred under the figure.
- **2 · Pitch lines** (252:649), after NFL's cards: a faint halfway line, centre circle and spot in green 700 on green 800, with the emblem, name and group top left and the player bottom right.
- **3 · Collectible frame** (252:873), after Fanatics Live and NFL: an inner frame line the head breaks over, and a green 950 name plate (emblem, name, group) the player stands on.

In all three the name is on the card, so the Name block under the card is hidden. There are no gradients or textures, and all colours come from variables (primitives for the green tones).

**Also fixed:** the headings in both options sections were cream on a cream section. They are now set to Light mode.

**Checked:** a render of the whole section.

**Next:** Chime picks a card. That card goes into option E and the build cards. Chime still needs to pick B or D for the Builds page.

## Stances complete: all 13 in Figma, option E uses them (Tue 24 Nov 2026, night)

Chime added `11. magician.png` and `12 finisher.png`.

**Checked:** both are 1024 × 1536 with real transparency, the same face and the same red kit as the other 11. The poses are right: Magician has a fist raised and Finisher volleys at chest height. Nothing is cut off at the edges.

**Built (Figma):**
- Design System → Stances (245:227): all 13 slots are filled, and the title is now "Archetype stances · 13". The note points to D-55 and the stripe risk.
- Builds option E (241:556): the Magician, Finisher and Target cards show the AI stances instead of the in-game crops. Each card is a bg/raised surface with the image set to Fit.
- A render of option E was checked.

**Next:**
- Chime picks between B and D for the Builds page, or D's cards with a stance.
- Confirm the group names (the game's or SPEC's).
- Then the Archetype page (Finisher) gets three options.

## Stances round 1 in the design system (Tue 24 Nov 2026, night)

Chime made the stances in ChatGPT and saved them to `reference/stances-ai/out/` (git-ignored).

**Checked (Claude, every file):**
- 12 files, 1024 × 1536. The face matches the pro's turntable frames in all of them.
- `10. spark.png` and `11. finisher.png` are the same file (same MD5), and the pose is Spark's sole roll. **Finisher is missing.**
- **Magician is missing.**
- The kit is red, not the brief's off-white and green, with three white stripes on the shoulders (they read as Adidas's mark). Chime chose to keep them as made (D-55). This is an open risk to recheck before launch.
- `8. maestro.png` and `9. creator.png` had a checkerboard painted in instead of transparency. Claude removed it with a flood fill from the edges; the clean copies are in `reference/stances-ai/clean/`. The ball and hair edges were checked at zoom.
- Figure height varies from 71% (Sweeper Keeper, lunging) to 98%. The kneeling Shot Stopper is drawn larger than the standing poses.

**Built (Figma, Design System → 06 Game assets → "Stances" 245:227):** 13 slots in rail order. 11 are filled; Magician and Finisher show "Not made yet". Section 221:308 was grown and "In use" moved down; there are no overlaps.

**Not done:** option E. Its visible stances are Magician, Finisher and Target, and two of those three are missing. Build cards are unchanged until Chime picks B or D.

**Next:**
- Chime makes Finisher (volley) and Magician (fist raised) in the same ChatGPT chat, using the prompts in `reference/stances-ai/PROMPTS.md`.
- Then Claude puts the stances into option E and fills the two empty slots.
- Chime picks between B and D.

## Phase 1 · Builds page: three options for Chime (Tue 24 Nov 2026, night)

Chime: start Phase 1 page by page; three layout options for the Builds page; Chime picks, then it moves into the design.

**References (Mobbin, iOS):**
- Apple Sports "Browse Sports": a grid of round emblems.
- stoic.: rich list rows.
- FotMob, theScore, DAZN and MLS lineups: players placed on a pitch by line.

**Built (Figma, Design screens → section "Options · Builds page (pick one)", phone 393, Dark, Phone modes):**
- A · Emblem grid: four groups with headers and counts; four columns, so every group fits on one row.
- B · List: emblem, name, the two signature PlayStyle glyphs with their names, and a chevron, on hairline rows.
- C · Pitch: the groups placed by line (Attack top, Keeper bottom) on a pitch drawn with hairlines.
- All three use the design system's top bar, footer notice, Archetype emblems and PlayStyle glyphs, with every colour on theme variables.

**Data:** archetype names, the four groups (SPEC: Keeper, Defence, Midfield, Attack) and the signature PlayStyles come from `content/archetypes/fc27.json`. Positions and build counts are left out because they aren't recorded yet. "Pick your archetype to see its builds." is draft copy.

**Checked:** a Figma screenshot of each option. These fixes were made before showing them:
- A wrapped to two per row, then 3 + 1; it's now four columns.
- The group counts were misaligned.
- C's centre circle collided with the names, and its halfway line was invisible.
- C's cells were stuck at 10 px tall.

**Added at Chime's request: two more options**
- **D** · The Old Gold picker (from "Previous · Builds new style") rebuilt in the green system:
  - "Pick your archetype" header;
  - EA's group names with a count and a hairline;
  - two-column archetype cards: emblem ring, name, signature PlayStyle badges and names;
  - each pair of cards is the same height.
- **E** · After FC 27's archetype screen (Chime imported 13 in-game shots, 238:1708–1720):
  - a sideways emblem rail grouped Keeper / Defender / Midfielder / Forward, with Finisher selected by a lime ring;
  - Chime's Finisher stance as a swipeable card, with Magician and Target peeking at the sides;
  - name and group, signature PlayStyle badges, mastery attributes from fc27.json, and a secondary "See Finisher builds" button.
- Not shippable as is: the stance crops include EA card art, the club crest and the level. The Progressor screenshot shows the Maestro card, so there is no Progressor stance.
- Open: A–C use SPEC's group names (Keeper, Defence, Midfield, Attack); D and E use the game's (Keeper, Defender, Midfielder, Forward).

**Chime's feedback:**
- D and B are liked, because they show each archetype's PlayStyles.
- C is out: users might not know the pitch is tappable.
- A is out: too basic, no PlayStyles.
- E is liked, but not its in-game crops.
- A and C moved to Archive as proposals.

**Stances, decided (D-54):**
- AI-generated images of Chime's own pro, in a plain kit with no logos, made by Chime in ChatGPT (Go plan).
- Claude can't run ChatGPT for them: there is no connector, the API is paid, and automating the site breaks OpenAI's terms.
- Prompt pack: `reference/stances-ai/PROMPTS.md` (git-ignored). It has a character sheet from four turntable frames (copied to `face-refs/`), then 13 pose prompts. Poses follow Chime's in-game cards; Progressor's is our own, because its shot shows the Maestro card. Outputs go to `reference/stances-ai/out/<slug>.png`.

**Next:**
- Chime generates the 13 stances.
- Claude checks them, crops them to one card size and puts them into option E and the build cards.
- Chime picks between B and D, or combines them (possibly D's cards with a stance). The pick moves into "Phase 1 · Builds"; the others go to Archive as proposals. Then the Archetype page (Finisher) gets three options the same way.

## Figma file organised like Sinima, plus a cover (Tue 24 Nov 2026, late evening)

Chime: organise the file like their Sinima draft (2WxAK7rxGC6t4Wkd5IQ6p2) and make a cover like its thumbnail.

**Changed (Figma only)**
- Pages now follow Sinima's order and names:
  - Main pages: Cover, Design screens, Design System, Storyboard (new, empty, for the launch video), Archive.
  - Then, between dividers: Logo Options; Reference · Pro Clubs assets; the "Previous · …" pages (The Grid by Sharon, Builds new style, Old Gold, Volt, Pitch, Floodlight, Derby, Light mode).
- Logo rounds 1–4 moved from their own pages into sections on Logo Options, under the main logo ("Round N · rejected 24 Nov"). Every node was moved, not copied, and the four empty pages were removed.
- The Archive frame was renamed in Sinima's style ("Superseded 24 Nov · Meta Finisher A · …").
- Cover: a 1920 × 1080 "Thumbnail" frame laid out like Sinima's:
  - background: chalk cream with a soft green glow;
  - lockup: the app icon tile (rounded, with a shadow) next to the PROBUILDS wordmark in its on-light colours;
  - "Web App" in Barlow Light 64;
  - two tilted pills, FACES (lime) and BUILDS (green), where Sinima has its cities;
  - "November 2026" and "Prepared for ProBuilds".
  - Colours are bound to the primitive variables.

**Checked**
- Figma screenshot of the cover, compared with Sinima's thumbnail: same layering (glow under a centred column, shadowed icon tile, tilted shadowed pills).
- The page list was read back after the move: 19 pages, nothing left on the removed pages.

**Cover redone in our own style.** Chime: "don't just copy what they designed… design the thumbnail in our own style".
- The Sinima-style cover moved to Archive as "Superseded 24 Nov · Cover in Sinima's style".
- The new Thumbnail (233:8):
  - background: pitch green;
  - top: the PROBUILDS lockup on dark, with "FC 27 · Season 2" at the right;
  - left: "FACES & BUILDS" in Barlow Condensed ExtraBold 190, with "Lookalike faces and meta builds for Pro Clubs" under it;
  - right: three Score ring instances from the design system (PAC 88, SHO 80, DRI 84, the Meta Finisher screen's sample values);
  - bottom: a hairline, then "Web app · Design file · probuilds.club · November 2026".
  - No glow, no pills; lime only on the gauges.
- Bug found and fixed while building it: the Score ring's number had lost its link to the `Value` property during the evening rebuild, so changing Value did nothing. It's re-linked, and a scan of every component found no other text property without a link.

**Not done**
- The plugin API can't set the file thumbnail: Chime right-clicks the Thumbnail frame and chooses "Set as thumbnail".
- Chime: "FACES and BUILDS doesn't make sense… it's supposed to be a thumbnail for Pro Clubs." The headline is gone, and the cover now leads with the brand, in the same style:
  - the PROBUILDS lockup at 150 px, with "For EA SPORTS FC 27 Pro Clubs" under it;
  - the gauges at 160 px;
  - top row: "Web app · Design file" and "FC 27 · Season 2";
  - footer: "probuilds.club" and "November 2026".

## Component audit and game assets in the design system (Tue 24 Nov 2026, evening)

Chime: the Score ring and Limits callout were not done well; audit every component. Then: put the FC assets (archetype emblems, the 36 PlayStyles) into the design system. All work in Figma (file hyFx4…, page Design system); no code changed.

**Fixed in 05 · Components**
- Score ring: drawn as pie slices with the number off-centre. Rebuilt as a 270° gauge open at the bottom (ellipse arcs with inner radius 100 % and round caps; still editable with Figma's Arc handle), value centred, label tucked into the gap, new "Show label" toggle. Sizes 72 and 48.
- Limits callout: fixed 60 px height cut its text off. Now grows with its text, on the raised surface the Meta Finisher screen uses for panels, amber warning icon aligned to the first line.
- Same root cause elsewhere (frames that hug their content collapsed): Step row's done tick (18 px instead of 28, now a lime circle), the emblem circles on Build card and Archetype tile (narrow pills, now 44 and 40 px circles), Button loading spinner (pie slice, now a round-capped arc on all 24 loading variants).
- Overflow: Build card's credit line sat outside the card; Embed facade's title row and Search field's error text were clipped. All hug their content now.
- Build card: "Meta pick" was an eyebrow above the title (UI8 guide: no eyebrows); now a tag beside the title, same style as Mastery.
- Credit line: "Tutorial by creator" was lime; lime stays for Copy build, slider, chips and score rings (version B), so it is cream and underlined. It and the other single components now sit on dark backdrops (they were on the beige canvas, unreadable).
- Icons sheet: title in Brygada and labels in Inter 13 px; now Barlow text styles, 14 px minimum, colours on variables.
- Toast and Face card had 6 unlinked border colours; Toast variants overlapped by 4 px; Archetype tile's selected state was 2 px taller (strokes counted in layout).
- Overview: 05's description ran over its divider; counts updated and 06 added.

**Added: 06 · Game assets**
- 36 PlayStyle component sets, `PlayStyle/<Category>/<Name>`, in EA's six categories (Shooting 8, Passing 6, Defending 6, Ball control 5, Physical 5, Goalkeeper 6), each with `Tier` = PlayStyle | PlayStyle+ | Glyph (108 components). Images reused from the Reference page (EA's art: badges via EasySBC, glyphs via FUT.GG). Glyphs are alpha masks over `text/primary`, so they follow the theme.
- 13 Archetype emblem components, `Archetype/<Name>`, vectors coloured `text/primary`. Marked as stand-ins in the sheet and every description: they are Pro Clubs HQ's tracings and can't ship (D-39).
- PlayStyle item component (badge, name, optional "Signature" in accent/text, as on the Meta Finisher screen); Build card and Archetype tile got an `Emblem` swap property with the 13 emblems as preferred values.

**Checked**
- Figma screenshots of every changed component and both new sheets. A script over all of 05 and 06: no text under 14 px, every text on a text style, every colour bound to a variable, nothing overflowing its parent, no overlapping variants, only Barlow and Barlow Condensed.

**Not verified / open**
- PlayStyle categories follow the order EasySBC lists them in (which matches EA's FC 26 groups); not checked against FC 27's own menu.
- Sections 00–04 (the documentation sheets) were in Inter and Brygada with 188 labels under 14 px. Chime picked "Convert all": 521 texts moved to the Barlow text styles; the two hero titles became Barlow Condensed at their size; the 66 step and hex labels in Colour › Scales were re-spaced (they overlapped at 14 px); "12 text styles" corrected to 15. Checked by script: no text overlaps or overflows in any section, nothing under 14 px, Barlow only. 31 display texts (heroes, 01–06 numbers, spacing values, two type specimens) keep sizes outside the type scale on purpose.
- Chime to look at the components in Figma, including the 7 that get_screenshot used to fail on (they render now).

## Rename to ProBuilds everywhere (Tue 24 Nov 2026, later)

**Changed (D-52)**
- GitHub repo renamed `ChimeXXD/probuilds` (`gh repo rename`); local remote updated; description says ProBuilds. Branch protection unchanged (required check `test`, code-owner review).
- Every file in the repo: site name `ProBuilds` (`src/lib/site.ts`), `REPO` `ChimeXXD/probuilds`, package name `probuilds`, README, CLAUDE.md, DESIGN.md, docs, mockups, e2e and unit tests. Older entries say "the working title" where they named it. Sitemap PDF re-printed from its HTML (12 pages, A4 landscape, as before).
- Claude's project memory notes updated (Figma note renamed `figma-probuilds-file.md`).

**Checked**
- `grep -i` for every spelling of the old name over tracked and untracked files: none left except the stray chat log `2026-11-21-064551-…txt` (untracked; Chime to decide).
- `npm run build`: `out/index.html` title is ProBuilds; no old name in `out/`. Playwright home test passes at 390 and 360. Gate: types, lint, unit, content, build-budget-e2e all pass.

- Cloudflare: old Pages project deleted (Chime's OK); new project `probuilds` from `ChimeXXD/probuilds` (npm run build, out, main). First "Save and Deploy" gave "An unknown error occurred" and created nothing; the second worked. Deploy of e361212 succeeded. Fetched from outside (Firecrawl): / → 200 ProBuilds, /does-not-exist → 404 with the notice. From the Mac the address timed out for 15+ minutes (network, not the site). Old address no longer resolves.
- Stray chat log deleted (Chime's OK). CI on e361212 green on the renamed repo. Code review (medium): no bugs, nothing changed.

- Domain (D-53): Chime bought probuilds.club at Porkbun. Claude added it to Cloudflare (Free), removed Porkbun's 4 parking records, set Cloudflare's nameservers at Porkbun (the first save didn't stick; the second did, confirmed by whois and by a.nic.club), attached probuilds.club and www to the Pages project, and set up takedown@probuilds.club → Chime's Gmail (Email Routing; Gmail was already a verified destination). Checked: Firecrawl (maxAge 0) gets 200 with h1 ProBuilds and the notice on both; curl from the Mac 200; MX records public. O-13 closed.

**Not done yet**
- Chime opens https://probuilds.club on the iPhone and sends a test email to takedown@probuilds.club.
- Rename the local folder to `ProBuilds` and move Claude's memory folder with it (last step; restart Claude Code in the new folder).

## Name, logo, colours and design system Phase 0 (Tue 24 Nov 2026)

Long design session with Chime, all in the Figma file hyFx4Audhn4F9KxL9bRCLD (Chime renames it ProBuilds by hand, the API can't).

**Decided**
- **Name: ProBuilds** (D-47 → D-48 → D-49 → D-50). ClubsHub, then the working title again, then ProBuilds.club; final: the brand is **ProBuilds**, the web address **probuilds.club** (free on 24 Nov; $4.12 first year at Porkbun, then $15.96/yr, over the $10 budget). Risk: probuilds.net is an established League of Legends builds site.
- **Logo: Sharon's "Touchline" mark** (corner flag + lime slash) with the wordmark PROBUILDS (Brygada 1918 SemiBold, -10%, outlined). Four rounds of new logos (rounds 1–4, about 50 concepts) were rejected and kept on Archive pages.
- **Foundations after UI8's Osnova UI (structure) and Rayum (dark look)** (D-51): type is Barlow Condensed (headings, numbers) + Barlow (text), Brygada only in the logo; body 17 px, nothing under 14 px.
- **First screen:** Meta Finisher phone, version B (lime only for Copy build, slider, chips, score rings; bars cream). Version A archived.
- **Design phases** (PLAN.md): 0 Components · 1 Builds · 2 Faces · 3 Home & frame · 4 Changelog & Submit · 5 About & Takedown; phone 390 first, then 834 and 1440; Chime approves each phase.

**Built in Figma**
- Pages: Logo · Design system · Design · divider · Reference · Assets · divider · Archive (logo rounds 1–4, Sharon's Grid, old colour drafts, Meta Finisher A).
- Logo page: components, 10 guide sheets, 16 SVG exports (`probuilds-*.svg`), all PROBUILDS.
- Design system page, one page in sections: 00 Overview · 01 Colour (6 sheets) · 02 Typography · 03 Spacing & layout · 04 Radius & elevation · 05 Components.
- Variables: Colour · Primitives (81), Colour · Theme (38, Dark default + Light, Osnova-style state tokens), Tokens (spacing, layout, radius; Desktop/Tablet/Phone), Typography (26; same modes). 15 text styles (incl. Button/*), 3 elevation styles. All 18 text/background pairs pass WCAG AA.
- Phase 0 components: 24 icons (Emerald Outlined, UI8), 21 components, 154 variants (Button 72, Icon button 36, Chip, Tabs, Search field, Version tag, Credit line, Value chip, Step row, Attribute bar, Score ring, Limits callout, Embed facade, Build card, Face card, Archetype tile, Toast, Sheet, Top bar, Footer notice).
- Design page: one section per phase with a labelled placeholder per screen and state (28); Meta Finisher B in Phase 1.

**Checked**
- Screenshots of every logo and colour sheet and most components; contrast computed with the WCAG formula.

**Not verified**
- get_screenshot fails on 7 components (Build card, Archetype tile, Sheet, Version tag, Score ring, Limits callout, Tab item) although Figma's own export renders them: Chime to look at those in Figma.
- Rayum could not be read through the Figma API (file too large); only its previews were used.
- No trademark search for ProBuilds; probuilds.club not bought yet.
- Nothing in code changed: `src/styles/tokens.css`, `CLAUDE.md` and `DESIGN.md` still describe the old name, Figma file and type. They need updating before Phase 2 (build).

**Next**
- Chime reviews Phase 0 components; then Phase 1 · Builds screens (Builds index, Archetype Finisher, Meta Finisher states) from the components.

## Submissions through issue forms, one season setting, full unchecked tag (Mon 23 Nov 2026, afternoon)

Chime picked the recommended option on the core lane's three open questions (D-45).

**Changed**
- "Submit for review" now opens a GitHub issue form, `.github/ISSUE_TEMPLATE/submit-face.yml` or `submit-build.yml`, with the JSON prefilled in its `json` field (`render: json`, so it lands in a code block). Over 6,500 characters it opens the empty form (`{ prefilled: false }`) for the page's Copy JSON; a title too long for a link falls back to the form alone. The forms add the labels `submission` plus `face` or `build`, which now exist on the repo. The face form has a required "In-game captures" field to drag screenshots and the turn clip into (A-16). `readIssueBody` also reads JSON pasted with its own fence.
- `CURRENT_SEASON = 2` in `src/lib/site.ts`, `versionWording`'s default. Change it by hand on Thu 3 Dec.
- Unchecked content keeps FORMAT's full line, "FC 27 · Season 2 · not yet checked in game"; SPEC flows 5 and 6 updated; D-45 recorded; P1-8 evidence updated.

**Checked**
- Tests first (red, then green): 71 unit tests, lint, typecheck and build pass. Code review (medium, fix): 7 findings, 5 fixed (fallback link length, template path in the test, missing labels, captures field, nested fence); hard-coded season test dropped.

**Not verified**
- That GitHub prefills a `render: json` textarea from the query parameter; the forms only take effect once on `main`. Try one submission link after the push.
- Form copy is draft: the intro line follows the sitemap ("Chime reviews every submission before it goes live"); the field labels and descriptions are new and need Chime's OK. Issue titles "Face: …" / "Build: …" are still TODO(Chime).

## Core lane: loader, version wording, issue URL (Mon 23 Nov 2026, evening)

Phase 1's three remaining core-lane units, each test-first (red, then green), committed one at a time.

**Changed**
- `src/lib/content/load.ts` (7f279b6, 87b43dc): reads content/, validates it, keeps only published builds, faces and changelog entries, and resolves archetype, `pairedBuild`, creators and changelog `affects` (newest entry first). The build fails, naming file and field, when published content links to a draft or withdrawn file (D-10), on a missing build, archetype or creator, on two files with one id, and on broken JSON. `scripts/validate-content.mjs` now runs the loader, so prebuild and CI enforce the links too. Fixtures: a whole good content tree plus one overlay folder per bad case in `tests/unit/fixtures/content/`.
- `src/lib/content/version.ts` (6b0f1d8): FORMAT's exact tag lines ("FC 27 · Season 2 · verified 19 Nov 2026", "… · not yet checked in game") and the older-season warning. The current season is a parameter; the repo doesn't store it yet.
- `src/lib/submit/toIssueUrl.ts` (15735d7): an issue URL on `ChimeXXD/probuilds` (`REPO` in `src/lib/site.ts`) with the submission as compact JSON in a json code block, so @names and #12 ping and link nothing. No `labels` parameter: GitHub returns 404 for anyone who can't label issues. Over 6,500 characters it returns "too-long" instead of cutting, for Copy JSON. `readIssueBody` reads the JSON back.

**Checked**
- `npm run lint`, `typecheck`, `test` (66 tests: loader 16, version 8, submit 12) and `build` pass after each unit and after the review.
- The URL limit was measured with curl on 23 Nov while signed out: up to 6,986 characters redirected to login, 7,026 and up failed with 500, and 8,166 and up with 414.
- Code review (medium, fix) found 5 issues. 3 were fixed: duplicate ids no longer replace each other silently, the link loop doesn't re-sort, and `verifiedOn` is tested once. 2 were left: the "is missing" message is hidden behind validation errors, and the bad fixtures are full copies of good ones.

**Not verified**
- No page uses the loader, the wording or the issue link yet (Phase 2). The URL limit for signed-in visitors wasn't measured. The small fixture face is already 3,195 characters, so many full faces will probably need Copy JSON.
- TODO and open questions for Chime: the issue title wording ("Face: …", "Build: …" stand in); submission labels need an issue template in `.github/ISSUE_TEMPLATE/`; where the current season lives; FORMAT's "not yet checked in game" tag line against SPEC and A-08's "Not yet checked in game".

## Stances off the picker, pictures aligned, cut corners and textures gone (Mon 23 Nov 2026, later)

Chime: stances belong in the build section, not on "Pick your archetype"; the Finisher pictures weren't aligned on phone; the whole draft read as AI slop. Fixed in `mockup/builds-v2/`, then recaptured; Chime plans a full redesign after this.

**Changed**
- Picker: stances removed; each tile is the emblem ring, name and Signature PlayStyles on a plain surface (min height 168 → 196 phone, 210 → 236 desktop).
- Finisher header: the stance and the emblem overlapping its corner replaced by the big emblem ring alone, so the stance isn't shown four times on one page. "EA's inspiration: Alex Morgan" no longer sits beside a picture.
- Build cards: the picture was a full-height left column (116 px phone, 168 desktop) cropped differently per card, with a "Chime's in-game pro" tag wrapping over it. Now a fixed 104 × 130 (desktop 128 × 160) portrait inside the card padding, top-aligned with the badges, zoomed to head and shoulders with the face centred (`stanceFocus` in `data.js`, Finisher 0.61). Tags removed; one line under "4 builds": "Pictures: Chime's own pro in the Finisher stance, from the game."
- Build page: the portrait no longer pokes 48 px out of the top of its panel (bgrid margin 64 → 16); 128 × 160 phone, 152 × 190 desktop; same credit line, singular.
- Everywhere: cut corners (page-coloured triangles) → 14 px radius (8 on the button and portraits); diagonal stripe texture and gold glow on the page removed; gold gradient rule → 1 px hairline; hero gradient → plain surface; Copy build gradient → solid accent; emblem ring gradient → plain.
- Copy: "(sample)" after every build name removed (the page's sample label covers it); the build page's two sample pills merged into "Sample build · values and prices not checked in game"; "(D-30)" and "(D-39)" no longer shown; footer note shortened to one line.
- Data: Shot Stopper's Season 2 signature Deflector → Footwork (RESEARCH §9: EA swapped it on 22 Oct).
- Figma (59:2): all eight screens recaptured into their cells: phone 109:2, 110:2, 111:2, 112:2; desktop 113:2, 114:2, 115:2, 116:2 (old 96:2–103:2 removed). No image re-crop needed: the portraits no longer use `object-fit`.

**Checked**
- 393 and 1440 in headless Chromium: no visible overflow (the only flags are the zoomed pictures inside their clipped boxes), every emblem, icon and stance loads, no errors. Figma screenshots of the phone Finisher and build screens match the browser.

**Not verified**
- On Chime's iPhone. The level switch wasn't re-tested live (its markup didn't change). Stance focus is measured for Finisher only.

## Chime's in-game stances replace the stand-in faces (Mon 23 Nov 2026)

**Changed**
- `mockup/builds-v2/` now shows Chime's own pro, cropped from 13 PS5 screenshots of the Archetypes screen (`Screenshots/Stance/`, git-ignored) to git-ignored `reference/assets/stances/<id>.png`. One rectangle (native x 370–664, y 825–1550) clears the card frame, crest, flag, LEVEL badge, PlayStyle icons, Amp slots and name strip on every card; the card's own background (bronze pattern, or the gold hex on the levelled Maestro and Finisher cards) can't be avoided and stays.
- Picker: each tile's top band shows its stance, fading into the tile, with the emblem in front; no text sits on a picture. Progressor has no stance: its screenshot shows the Maestro card. Finisher header, the three generic Finisher cards (one shared stance for now) and the build hero at levels 55 and 32 use the Finisher stance; the 2008 Ronaldo-inspired card keeps its empty slot (D-42). Old stand-in crops deleted. Tag "Chime's in-game pro"; footer "Chime's in-game pro, one stance per archetype · reference only in this draft."
- Group labels follow the game: Keeper, Defender, Midfielder, Forward (tiles, kickers, breadcrumbs). Finisher header adds "EA's inspiration: Alex Morgan" as plain text.
- Figma (59:2): all eight screens recaptured into their cells: phone 96:2, 97:2, 98:2, 99:2; desktop 100:2, 101:2, 102:2, 103:2. The capture centres `object-fit` images, so the 36 stance fills were re-cropped in Figma to the browser's top alignment.

**Checked**
- 393 and 1440: no overflow, every stance and icon loads, no errors; routes and the level switch still pass live. Figma read-back: 12 stances on each picker, 4 on each Finisher screen, 1 per build screen, no old group words or stand-in tags, sizes equal to the browser. Code review (medium, fix): 9 findings, 3 fixed (tile hover seam via `@property`, tile emblem hidden from screen readers, decision reference).

**Not verified**
- On Chime's iPhone. The pro wears a face mask on every card, so no stance shows the face.

## Level switch and specialization on the sample build (Sun 22 Nov 2026, evening)

**Changed**
- D-43 in `mockup/builds-v2/`: the Meta Finisher page has a "Your level" switch (slider 1–55, −/+ steppers, a typed box), sticky under the header so it stays reachable while the attributes scroll (one 140 px bar on phone; the raw-values note sits just below it so only the controls stick). It spends the level's AP in the build's stored spend order, point by point, and stops at the first point the AP can't buy. Rows show the value at that level, solid, over the level-55 target as a ghost bar ("84 / 91"); the six summary stats (group averages, our simplification) update too. "Not affordable yet" lists the next three steps with the AP each still needs. The specialization panel shows Finisher+ (Chip Shot+), its three targets, its status at the chosen level and the level it's reached from. New `level.js` holds the maths and the live update; `index.html` is interactive.
- AP per level is §10.1's table (reproduces every row total). Prices and starting values are flat made-up samples, labelled "Sample prices and starting values · not yet checked in game". Which Finisher+ target is the 92 one isn't recorded, so the sample counts all three at 92.
- Motion: the gestures skill set the slider rules (1:1 tracking with no transition while dragging, 44 px hit area, `touch-action: pan-y`); only a stepper press eases the bars (150 ms ease-out, none under reduced motion).
- Figma (59:2): build screens replaced at level 55 (phone 89:2, desktop 91:2) and a level-32 state added beside them (phone 90:2, desktop 92:2); both sheets grew to fit.

**Checked**
- Live in `index.html` at 390×844 (touch): drag lands on the level under the finger with no transition, steppers ease 150 ms (0 under reduced motion), typed 0 → 1 and 99 → 55, the bar stays at top 0 while scrolling, every control is at least 44 px, no errors. At 32: 724 AP, 719 spent, 5 left; Reactions 86 → 90 needs 31 AP more; specialization not reached (Ball Control 85, Composure 90, Reactions 86 of 92), reached from 50.
- Contrast on every new text pair is 6.34:1 or more; slider thumb and fill at least 6.17:1. Code review (medium, fix): 9 findings, 7 fixed (quieter live regions, native thumb sized to the drawn one, per-build work cached, unknown attribute throws, card level, shared stat grid, range text from MIN/MAX).

**Not verified**
- On Chime's iPhone. Every price, starting value and star price is a sample; the specialization's "reached from" level depends on them.

## Faces on every build (Sun 22 Nov 2026, late afternoon)

**Changed**
- Chime loved the new Builds style but found it flat without pictures; D-41: every build shows a face. In `mockup/builds-v2/`: each Finisher card has a portrait beside its stats (Meta, Tall and Quick Finisher each a different face), a fourth card "2008 Ronaldo-inspired (sample)" with "Inspired by" wording and a dimmed slot tagged "Stand-in · in-game recreation goes here", and the sample build's hero has a large face on a cut-corner panel that overlaps the card panel, after FUT.GG's detail page. The picker keeps emblems only: three stand-in faces can't cover 13 tiles without repeating, and the 393 tiles are already full.
- Stand-in faces are crops of the three avatars in EA's Clubs Grounds screenshot (no other screenshot had a usable face), written to git-ignored `reference/assets/faces-standin/` and loaded like the icons. Each is tagged "Stand-in face"; the footer says what they are and that Chime's and Sharon's in-game faces replace them. Crops stop above club, sponsor and kit logos.
- Figma page "Builds · new style (Old Gold)" (59:2) recaptured: phone sheet 74:2, desktop sheet 75:2.
- Chime then chose an empty slot for player-named builds: the "2008 Ronaldo-inspired" card now shows only the Finisher emblem and "Face coming soon" in its portrait box, no avatar or silhouette (D-10); the grey stand-in crop was deleted. Finisher screens recaptured in place (phone 78:2, desktop 79:2). Code review (medium, fix): 5 findings, 3 fixed (decorative emblem hidden from screen readers, archetype passed explicitly, no face file now means a slot); D-41 still describes the dimmed stand-in and needs a superseding entry.

**Checked**
- 393 and 1440: no overflow, every face, emblem and icon loads, no page errors; tag text on its dark pill stays above 9:1 even over a white patch of photo.
- `index.html` clicked through live in a browser: picker (13 tiles) → Spark (its own page, 0 builds) → back → Finisher (4 builds, 4 tagged faces) → Meta Finisher; an unknown slug falls back to the picker; no errors or warnings.
- Code review (medium, fix): 8 findings, 3 fixed by the review (per-card test IDs, escaped "inspired by" name, a dead rule), 3 more by hand (the slot comment now says what it shows, no shadow on the cut-corner face, the stat grid is `statgrid` not `face`).
- Figma read-back: screen heights equal the browser, no overflow, 4 faces on the Finisher screen and 1 on the build screen, every stand-in tag present as text.

**Not verified**
- On Chime's iPhone. Whether a generic avatar beside a real player's name reads as that player (see the Ronaldo card); the "Ronaldo-inspired" card still opens the Meta Finisher sample page.

## Builds in a new style, with the game's icons (Sun 22 Nov 2026, afternoon)

**Changed**
- Chime asked for a new page combining archetype and builds (D-33) in a different style, Old Gold, using the archetype emblems and PlayStyle icons (D-39). New `mockup/builds-v2/` (the first draft is untouched): `/builds` (13 emblem tiles in four groups, each with its two Signature PlayStyle icons), `/builds/finisher` (emblem hero, Signature PlayStyles, mastery, Season 2 cost changes, 3 build cards with Meta pick and "Most copied after launch") and a demo Finisher build (FUT.GG-style attribute groups with gauges and bars, PlayStyles+ and PlayStyles with icons, Copy build). `index.html` is clickable; `sheet.html?w=phone|desktop` is the Figma sheet.
- Style: FUT.GG's player stats page for structure, FC 27's Clubs menus for the emblem rings and cut corners, sports editorial for the type scale. Archetype facts come from `fc27.json`; every build number is a labelled sample.
- Icons load from `reference/assets/` (git-ignored) and are never committed. The archetype emblems there are Pro Clubs HQ's tracings, not EA's files.
- Figma: page "Builds · new style (Old Gold)" (59:2), phone sheet 68:2 above desktop sheet 69:2. Code review (medium, fix): 10 findings, 6 fixed (each archetype tile now opens its own archetype page, emblem fetch failures no longer hang the sheet, icons next to their printed name are alt="", footer credits the emblems to Pro Clubs HQ, badge helper reused); skipped: one sample build page only, flat-colour corner notches, 44 px targets and token-only colours apply to `src/`.

**Checked**
- Browser at 393 and 1440: no element wider than its frame, every emblem and icon loaded, no page errors, Barlow loaded. Contrast on every new pair (the card-face tint lowered to 16% so its labels reach 4.9:1).
- Figma read-back: 6 screens, no layer outside its frame, editable Barlow / Barlow Condensed text, emblems as vectors, 42 icon images per sheet, screen heights equal to the browser.

**Not verified**
- Not seen on Chime's iPhone (L-01). New copy for Chime's OK: "Pick your archetype", the two ledes, "Every Finisher build, the Meta pick first."

## Planning: builds by archetype, face preview, modes (Sun 22 Nov 2026)

**Changed**
- Chime, as a Clubs player: the separate Archetypes pages made no sense; builds are picked by archetype. D-33: one Builds section (`/builds` → `/builds/[archetype]` → `/builds/[archetype]/[build]`), no `/archetypes`. D-38: the four groups are the position path, no position filter.
- D-34: "Meta pick" (Chime's, after one match) at launch; "Most copied" from Copy-button counts after launch, never merged.
- D-35: face preview is a turntable cut from one in-game turn, plus a 3D rebuild tested from the same clip for comparison. D-36: faces are made in game by Chime and Sharon, never taken from YouTube (rule 5). O-16 opened: creators sending their own faces after launch.
- D-37: light and dark mode both, following the device, with a switch; selected items get a dark ring in light mode.
- SPEC routes, PLAN, CLAUDE.md layout and the sitemap brief (v4, still 12 pages) updated to match.

**Checked**
- Sitemap PDF re-rendered and read back: 12 pages (`pdfinfo`), every section within its page at print width, pages 2, 4 and 9 looked at.

**Not verified**
- GoatCounter events and API (D-34) not yet checked against its docs. Whether the head turns at an even speed with the stick held fully over (needs Chime's test clip).

**Next**
- Redesign the draft's Builds screens for D-33; turntable script and 3D test once the clip is in `reference/`; `load.ts` (paused).

## Light mode for the five colours (Sun 22 Nov 2026)

**Changed**
- Chime asked to see the light mode. `mockup/draft/themes.css` gains a light block per colour (`data-mode="light"`): each keeps its accent fill and ink; surfaces, text, muted, warning and danger are new, plus a darker `--accent-text` and a new `--accent-line` token (selected borders, slider, progress and stat bars), because the bright accents fail as text and as borders on white. The tab bar shadow became a token (`--shadow-float`). Dark mode is unchanged (`--accent-line` = `--accent` there).
- Prototype: a Dark / Light switch next to the colour switcher (remembered per browser). `frames.html` and `desktop.html` take `?theme=<id>&mode=light` and name the colour in the sheet title.
- Figma: new page "Light mode" (34:2) in https://www.figma.com/design/hyFx4Audhn4F9KxL9bRCLD: one column per colour, phone sheet (21 frames at 393) above desktop sheet (11 at 1440), captured as editable layers.

**Checked**
- Contrast script: every text pair ≥ 4.5:1 and every accent line ≥ 3:1 on bg and surface, in both modes and all five colours.
- Design check PASS for all 20 sheets (5 colours × 2 modes × phone and desktop); 64 click-through checks PASS at 390 and 1440 (the 56 before plus mode switch, light background, persistence across reload, back to dark). Lint clean.
- `/code-review medium --fix`: 8 findings, 2 fixed (unknown theme or mode from the URL or storage now falls back to a known one; sheet headings name the colour and mode in every case). Open: see "For Chime" below.
- Read back from Figma: 10 sheets; Barlow 867 and Barlow Condensed 236 text layers per phone sheet (783 and 196 per desktop sheet); no section wider than its frame; each sheet's background is its light bg.

**Not verified**
- Light mode on Chime's iPhone (L-01). The light palettes are made here, not measured from a reference.
- Later the same day, on Chime's answers: selected chips, segments and tab-bar items get a 1.5 px `--accent-line` ring in light mode only (3.95:1 or more on bg, surface and raised; dark renders pixel-identical, 160 of 160 screens); the mode follows the device until Dark or Light is picked, a pick wins; `color-scheme` set per mode; 27 new mode checks PASS; the Figma "Light mode" page's 10 sheets recaptured in place.

**For Chime**
- In light mode the selected chip, segment and tab-bar item are shown by the bright accent fill alone, which is faint on white (Volt lime on white 1.2:1; under the 3:1 guideline for every colour but Derby). The label still changes colour. Fix if wanted: a thin dark accent ring on selected items, light mode only.
- Light mode needs a decision entry once Chime picks: light, dark, or both with a switch.

## The draft in Figma, and Pro Clubs assets (Sat 21 Nov 2026, later)

**Changed**
- New Figma file (now "ProBuilds") in Chime's GenAI-Labs drafts (D-32): https://www.figma.com/design/hyFx4Audhn4F9KxL9bRCLD. Pages Volt, Pitch, Old Gold, Floodlight, Derby each hold the phone sheet (21 screens and states, 393) and the desktop sheet (11 screens, 1440), captured from `mockup/draft/` as editable layers (text, frames, vectors; no flattened images). Page 6, "Assets (reference)": all 36 FC 27 PlayStyles (badge, PlayStyle+ badge, glyph), the 13 archetype emblems plus Engine (FC 26) as vectors, and 21 The Grounds and Clubs screenshots. Files and sources in `reference/assets/` (git-ignored) and its `manifest.json`.
- O-15 opened: may the product ever ship EA's badges? Today they're reference only (CLAUDE.md rule 2, D-04).
- Two draft bugs found while capturing, both fixed: frame sheets rendered body text in the system font (`.app` now sets Barlow), and Home's content was 578 px wide inside a 393 px phone frame, hidden by the clip (`.main` grid column is now `minmax(0, 1fr)`). `frames.html?theme=<id>` renders a sheet in one colour.

**Checked**
- Read back from Figma: Barlow 867 and Barlow Condensed 236 text layers on a phone sheet; no section wider than its 393 frame; every colour page holds exactly two sheets; 129 image slots filled, 14 emblems placed.
- Draft: design check PASS (21 phone, 11 desktop), 56 click-through checks PASS, no hidden overflow in any frame, lint clean.

**Not verified**
- The Amps screenshot (shows a real footballer's face) was kept out of Figma; it stays only in `reference/assets/other/`.
- Archetype emblems are Pro Clubs HQ's vector tracings of EA's emblems, not EA's own files.

## UI8 references, and the first draft in five colours (Sat 21 Nov 2026)

**Changed**
- Chime called the Mobbin references trash and asked for UI8. Three agents pulled 76 UI8 references (esports, football and sports, faces and utility kits) into the local board `reference/board/` (git-ignored); the 235 Mobbin references stay on their own board, `reference/board-mobbin/`. Every reference on both boards (311) has a "How we'd use it" note.
- Chime marked 8 UI8 references (World Cup 2026 hero card and card grid, Valdûm character sheet, quest objectives, bazaar and skill tree, Olive roster, World Cup pitch line-up). Claude picked the rest per section and built the first draft (D-31): `mockup/draft/`, a clickable prototype of every route (`index.html`), phone and desktop frame sheets (`frames.html`, `desktop.html`), a five-colour comparison (`compare.html`) and `interactions.json` (generated by `tools/gen-interactions.mjs`). Colours: Volt (Ravex), Pitch (NextPlay Sports), Old Gold (Valdûm), Floodlight (World Cup 2026), Derby (Olive).
- The verifier failed the first pass. Fixed: sample recipe numbers were JaxStash's real values carried over from the old mockup (D-08), now neutral samples and no tutorial credit; credit lines on every card; test IDs that broke prefix matching; Sculpt as its own section and Skin Tone without invented end labels (RESEARCH §9); flows 2 (updated face resets ticks) and 4 (older season) walkable; Submit kinds and tabs with their own fields; About credits, Takedown email line, archetype sources; Chime's picks applied fully (later steps greyed, side-panel preview, 4 columns with grid/list, PlayStyle panel, Specialization tile); palette values traced to swatches, changes listed in `themes.css`; ticks update in place and tabs/chips get one springing highlight.

**Checked**
- Design check PASS: 21 phone frames (393), 11 desktop frames (1440), every interactive element specced.
- 56 click-through checks PASS at 390 and 1440 (every SPEC core flow, filters, submit, theme switch, no sideways scroll, no page errors). Every palette's text pairs pass AA (script).
- Two code reviews (`/code-review medium --fix`); the first fixed 7 of 10 findings.

**Not verified**
- Chime hasn't seen the draft. Not checked on Chime's iPhone (L-01).
- New copy that isn't from the repo docs and needs Chime's OK: page subtitles, About and Takedown paragraphs, "Countdowns", "Every face and build re-checked", Submit field hints, the 404 text.

## PR #2 merged; references first; Sharon records too (Fri 20 Nov 2026, late evening)

**Changed**
- D-28: references for every screen (Mobbin, FUT.GG, other sites) and Chime's pick before any Figma work. Chime: "we can't just go and start designing all this. We need references."
- Reviewed Sharon's PR #2 (PRD v2.1): older-season warning only from Thu 3 Dec; video off the launch must-list; season-change metric readable at Season 3 if live by Thu 26 Nov; "Seasons and levels" (cap rises during the year; build cards show level and AP); face-picture loading proposal (the budget check counts HTML, scripts and styles only: confirmed in `scripts/check-budget.mjs`).
- It conflicted with D-28 on the PRD phase-1 row. Claude merged `main` into Sharon's branch, combined both, applied Chime's answers, CI passed; Chime approved; squash-merged as `bfcda6f`.
- D-29: Sharon records faces and builds too, credited by name, platform tagged, reviewed by Chime. D-30: one match per build before it's called meta (replaces "3 matches"; Sharon had proposed none). CLAUDE.md, DESIGN.md, UI-BRIEF, HANDOFF and the sitemap PDF updated.

**Not verified**
- PR #2's "Seasons and levels" facts were seen in search results only (labelled so in the PRD).

## PR #1 merged; pace, Michael Jackson and counting decided (Fri 20 Nov 2026, evening)

**Changed**
- Reviewed Sharon's PR #1 (PRD v2 and `docs/EVIDENCE.md`): CI and Cloudflare green, no decision edited. Chime approved; squash-merged as `037777e`.
- Chime's calls on its questions: ship within days on Season 2, re-check on Season 3 from 3 Dec (D-25, against Claude's recommendation to keep D-18 with an early soft-open); Michael Jackson allowed at launch (D-26, against Claude's recommendation to keep D-10); GoatCounter hosted (D-27, as recommended).
- Validator: a deceased subject now passes only when a decision allows them by exact name (`DECEASED_ALLOWED`, Michael Jackson). The old test "fails a deceased subject" became "fails a deceased subject no decision allows" plus "passes Michael Jackson": a rule change from D-26, not a weakened check.
- PLAN, PRD, EVIDENCE, CLAUDE.md, FORMAT, content/README, HANDOFF and the sitemap PDF (still 12 pages) updated to D-25 to D-27. The three review fixes applied: "FC 24, FC 26 and FC 27" instead of "every edition since FC 24"; the smoke-test form says what contact details are for and deletes them; pace framed as decided.
- DECISIONS housekeeping: O-02, O-03, O-04, O-06, O-09, O-10 and O-12 moved to a new "Closed" section with what answered each.
- Earlier the same evening: repo public again with `main` protected (D-23); CODEOWNERS so only Chime's approval counts (D-24); the Claude GitHub App installed (it shows on meridian and portfolio too; restricting it needs Chime's 2FA).

**Checked**
- Red then green: the two validator tests failed first, then 25 of 25 passed.
- GoatCounter's homepage (via search): hosted is free for "reasonable public usage", small businesses fine; no published pageview cap.

**Not verified**
- GoatCounter's full terms page and script size (Sharon's "about 3.5 KB").

## Phase 1, design lane: mockups, sitemap, private repo (Fri 20 Nov 2026, afternoon)

**Changed**
- Mockup v1 in `mockup/` (FUT.GG-style home at 393 and 1440, face page in 9 states, a wireframe stand-in head with drag to turn). Rejected: "this is bad, we need mobbin references of how a 3d screen should look like".
- Mobbin references for 3D screens (Meta Quest, Instagram, WhatsApp, Facebook and Snapchat avatar editors; Replika; Amazon, Zalando, Apple Store and GOAT 3D viewers). Chime picked the avatar-editor layout; mockup v2 rebuilt the face page that way with a grey mannequin stand-in. Rejected with the rest: "the designs … are all trash".
- Sitemap and two user journeys as a 10-page PDF: `docs/design/sitemap/sitemap-and-journeys.pdf` (source HTML beside it). Structure only, for a UI designer (D-21).
- Repo made private at Chime's request (D-20), then public again the same day (D-23): private Actions minutes were used up (mostly `meridian`'s macOS runs) and GitHub Free only protects branches on public repos. `main` is now protected: a pull request needs Chime's approval and a passing CI `test`; admins can still push. Collaborator: Sharon (`sharrygold`). `CONTRIBUTING.md` and `AGENTS.md` tell people and AI agents how to branch and open pull requests (D-22). The sitemap PDF is updated to match (Submit opens a GitHub issue again).
- UI-BRIEF §6: test-ID suffix convention (`face-card-1`, `version-tag-face-1`).

**Checked**
- Mockups: the proof design check passed (10 phone screens, 1 desktop); a fresh-context review and `/code-review --fix` (9 of 10 fixed) on v1. v2 wasn't reviewed (rejected first).
- PDF v1 (10 pages) pushed at Chime's request before its fresh-context check finished. The check passed routes, page count (40) and copy, and found 9 problems: Submit and GitHub links assume a public repo; Visual Age before Sculpt (FORMAT says the reverse); launch faces would show a Season 2 warning; value kinds incomplete; two links presented as required that SPEC lacks; the Season 3 entry date; four wrong citations; unsourced lines and missing copy; loose tree connectors. v2 (12 pages) fixes all of them, adds a page on value kinds and a page of open questions with recommendations (two new: submissions while private, launch-face season).
- Repo visibility: `gh repo view` reports PRIVATE.

**Not verified**
- Cloudflare Pages deploys from the private repo (next push shows it).
- The test clip for the face preview (A-16): still not in `reference/`.

**Next**
- Chime and the collaborator review the PDF; the collaborator designs the UI from it.
- Core lane, test-first: `load.ts`, `version.ts`, `toIssueUrl.ts`.

## Phase 1, design lane (Fri 20 Nov 2026)

**Changed**
- 48 references, pattern summary and three directions in `docs/design/REFERENCES.md` (a background agent's research; P1-1 passes).
- Direction board at `docs/design/direction-board/index.html` (published privately as an artifact). Chime rejected all three directions: "All these are trash." Recorded as D-19, DESIGN.md "Direction" and memory.
- FUT.GG's home studied at 1440 and 390 px (screenshots kept in the session scratchpad only, not in the repo).
- Face preview plan proposed as A-16: one PS5 clip and one cutscene screenshot per face give the card picture, drag to turn, angle buttons and an in-match picture.

**Not verified**
- Everything in A-16: waiting on Chime's test clip in `reference/`.

**Next**
- With the clip: frames, drag-to-turn viewer, FUT.GG-style home and face page for Chime to approve. Core lane: loader, version wording, issue URL.

## Phase 1, core lane unit 1: content types and validator (Fri 20 Nov 2026)

**Changed**
- `src/lib/content/types.ts`: every FORMAT v1 shape (face with parts, sculpt and visual age per A-09/A-12; build; archetype file; changelog; creators). Fields Chime records take a type parameter, so drafts may hold `"PLACEHOLDER"` and published content can't, at the type level.
- `src/lib/content/check.ts` (a small field checker with paths, no new dependency), `validate.ts` (faces, builds, `validateAll`), `validate-other.ts` (archetypes, creators, changelog). Rules: every field's type and range, status, version tag, a "made-by" credit, living subject (D-10), "Inspired by" titles, tab order, Sculpt 0–100, Skin Tone and Visual Age 0–100, embeds with a matching tutorial credit, known archetype and creator ids, file name = id, and in published files no `PLACEHOLDER` anywhere and no `_example`.
- `scripts/validate-content.mjs` now runs that validator (Node strips the types), so `prebuild` and CI check every field. Its Phase 0 test was replaced by tests of the wrapper (folder reading, broken JSON, message lines); the four Phase 0 rules are covered in the new suite.
- Fixtures: `tests/unit/fixtures/face-good.json`, `build-good.json` (test data); each bad case is the good file with one change.

**Checked**
- Red: `tests/unit/content/validate.test.ts` failed first with "Cannot find package '@/lib/content/validate'". Green: 18 tests, including both examples in `content/` failing when marked published.
- `/code-review --fix` (high): 10 findings, 9 fixed with 6 new tests (26 now). Faces' `pairedBuild` and changelog `affects` must point at real files (the validator builds the id sets; the loader still checks published-to-published links). Impossible dates (30 Feb) fail. URLs must be http(s) (submissions run through this validator). YouTube video ids are letters, digits, `_` and `-` only. A title containing "official" fails (rule 3). Every version needs its history line. Only Skin Tone may use a `position` value. Archetype `typicalPositions` and `specializations` items are checked. Left open: whether Cloudflare's Node 22 is 22.18+; checked from the deploy log on push.
- Gate after the fixes: types, lint, unit (26 tests), content, build + budget + e2e all pass.
- Phase 1 design lane: a background agent is collecting references (results pending).

**Not verified**
- That CI's and Cloudflare's Node 22 strips types like local Node 24 (needs 22.18+; checked on the next push).

## Phase 0: Day 0 findings, repo and scaffold (Thu 19 – Fri 20 Nov 2026)

**Changed**
- Day 0 findings in `docs/RESEARCH.md` §9, from Chime's PS5 screenshots, JaxStash's FC 27 face playlist (every storyboard frame of lmlnVZWi8YQ, frames of 11 more), FC Tools Hub and level-cap sources. Face format reshaped to the real editor (A-09, A-12); level cap 55 / 1,419 AP (A-10); one head for both looks (A-11); PS5 (D-17). JaxStash added to `creators.json` (not asked).
- Season dates checked on EA's Launch Rewards page: Season 3 from Thu 3 Dec, Season 4 from Thu 14 Jan 2027. The plan still assumes "December"; replanning waits for Chime.
- Pronouns: 13 he/his references in CLAUDE.md, PRD, DECISIONS (D-08, D-10 wording only), HANDOFF, FORMAT and `content/README.md` corrected to they/them. CLAUDE.md rule 7 updated to the new value kinds.
- `git init` on `main`; docs committed.
- Scaffold with D-11's exact versions, configs and scripts adapted from Sinima: `next.config.ts` (static export), Playwright at 390×844 and 360×800 serving `out/` on port 4174, Vitest, ESLint 9 plus `check-tokens`, `.nvmrc` 22, `engines` >= 22.18. App shell: `src/app/layout.tsx` with the notice on every page (`site-notice`), placeholder home, empty `tokens.css` (Phase 1 fills it from Figma).
- `scripts/validate-content.mjs` (Phase 0 checks: JSON parses, known status, no `PLACEHOLDER` or `_example` in a published file; Phase 1's `validate.ts` replaces it), run by `prebuild` and CI.
- Budget measured and set (A-13): empty app 131.6 KB JS, 135.7 KB total gzipped per page; limits 165 / 220.
- Host decided on evidence (A-14): Cloudflare Pages; Vercel Hobby's terms are "personal or non-commercial use" only.
- `.claude/proof.json`: the commit gate (types, lint, unit, content, build + budget + e2e). Chime approved it.

**Checked**
- Red: `tests/unit/validate-content.test.ts` failed first with "Failed to load ../../scripts/validate-content.mjs" (script not written yet). Green after: 5 tests pass.
- Gate run on the final code: types, lint, unit, content, build-budget-e2e all pass. E2E `home.spec.ts` passes at phone-390 and phone-360.
- `/code-review --fix` (medium) on the scaffold: 8 findings, 6 fixed. The content check now rejects an unknown status (a typo like "Published" had skipped every check), with a new test. `serve-out` serves `/x/` as `x.html` like a static host (checked `/`, `/index/`, a missing page and `../` / `%2e%2e` paths) and knows webp, jpg, avif and woff. `check-tokens` no longer reads `href="#add"` as a colour, and its palette comment is corrected (the palette is switched off in Phase 1, not yet). Both scripts share Node's recursive `readdirSync`. ESLint ignores `coverage/` and `blob-report/`. Skipped: e2e in WebKit (iPhone Safari). It needs a second browser on a memory-tight Mac, and Chime's real-iPhone check (rule 10) covers it for now.

**Not verified**
- CI on GitHub and the Cloudflare deploy (next).
- `npm` warns ESLint 9.39.5 is out of support; D-11 pins ESLint 9, so moving to 10 needs Chime's OK.
- Sculpt's Weight and Definition modes, and whether Skin Tone's arrows step: noted on Chime's first face recording.

**Later the same session**
- Public repo `ChimeXXD/probuilds` created and pushed; first CI run green (44652883584).
- Figma file created on Chime's personal team: https://www.figma.com/design/1mjxmMNZQOrs40MlmzvRTQ (Cover, Design System, Design screens; read back via use_figma).
- Season 3 replan applied (D-18); ESLint stays on 9 (A-15, checked plugin peer ranges).
- Cloudflare Pages: Chime signed in; Claude created the Git-connected project in Chrome (GitHub was already authorised for Cloudflare, no new grant). Deploy succeeded; `curl` shows the first Pages address 200 with the notice and a missing page 404 with the notice.

- Chime opened the first Pages address on the iPhone and read back the heading, "Work in progress." and the notice: P0-6 passes, and so does Phase 0's gate.

**Next**
- Phase 1: reference board and three directions; core lane test-first.

## Pivot: Facecard becomes a faces-and-builds hub (Thu 19 Nov 2026)

**Changed**
- Folder renamed `Facecard` to the working title (`mv -n`; the target didn't exist; no git repo yet).
- Product is now a faces-led hub for FC 27 Clubs with meta-build cards, archetype pages, a changelog and a submit flow (D-02). Planner later (D-07). Name open; a working title for now (D-15, O-01).
- Rewritten from the 18 Nov research: CLAUDE.md, DESIGN.md (new, Sinima pattern), README.md, docs/PRD.md, docs/RESEARCH.md, docs/DECISIONS.md (fresh: D-01 to D-16, A-01 to A-08, L-01 to L-13, O-01 to O-14), docs/PLAN.md (phases 0 to 3), docs/SPEC.md, docs/FORMAT.md (v1: archetype, build, face, changelog, creators), docs/HANDOFF.md, docs/KICKOFF-PROMPT.md, docs/features.json (38 items), docs/design/UI-BRIEF.md, docs/design/REFERENCES.md, .claude/settings.json, .github/workflows/ci.yml, .gitignore, .env.example.
- New content: `content/archetypes/fc27.json` (13 archetypes, sourced fields only), one example build and one example face (all `PLACEHOLDER`, `draft`), three changelog drafts from EA pages, `creators.json` (two candidates, not asked), `content/README.md`.
- Moved to `_to_delete/` (deletion isn't permitted in this folder): the old Facecard recipes `michael-jackson.fc27.json`, `zinedine-zidane.fc27.json`, their README, and the empty `content/recipes/` folder. Chime can delete `_to_delete/`.

**Checked**
- Every JSON file in `content/` and `docs/features.json` parses.
- Archetype cost-change counts sum to EA's totals (58 up, 29 down).

**Not verified**
- Level cap (55 or 75), face value display, preset and hairstyle counts: Day 0 in-game checks.
- Season 3 date; PhotoFit's Season 4 scope; whether "Pro Clubs" is a mark.
- Creator channels in `creators.json` (not opened).

**Next**
- Day 0: ask Chime the in-game checks, then O-12 (host). See `docs/KICKOFF-PROMPT.md`.

## Facecard project created (Fri 6 Nov 2026)

**Changed**
- Folder created with the plan and starter data: CLAUDE.md, PRD (with research, competitors, brainstorm, legal and risk), PLAN, SPEC, FORMAT (recipe schema v1), DECISIONS (D-01 to D-20, L-1 to L-7, O-1 to O-8), RESEARCH, HANDOFF, KICKOFF-PROMPT, UI brief draft, references plan, features.json (31 items), two example recipes with placeholder values, LICENSE, .gitignore, CI workflow, Claude settings, .env.example.

**Checked**
- `content/recipes/*.json` and `docs/features.json` parse as JSON.
- Example recipes follow `docs/FORMAT.md` by eye (no validator exists yet; Day 1 writes it).

**Not verified**
- How FC 27 shows slider values; preset count; PhotoFit status in Clubs (Day 0 in-game check).
- MediaPipe model size and licence; Cloudflare Pages setup for this repo.
- No `package.json` yet: Day 0 creates it.

**Next**
- Chime answers O-1 (name), O-4 (legal posture), O-7 (launch list). Then Day 0 (see `docs/KICKOFF-PROMPT.md`).
