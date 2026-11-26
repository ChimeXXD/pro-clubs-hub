# Build page audit against Figma (26 Nov 2026, D-107)

Figma file hyFx4Audhn4F9KxL9bRCLD, page "Design screens", section "Phase 1 · Builds". Frames read with get_design_context, get_screenshot and the Plugin API:

| State | Phone 393 | Tablet 834 | Desktop 1440 |
| --- | --- | --- | --- |
| Main (level 55) | 298:3630 | 306:794 | 306:1286 |
| Specialization not reached (level 32) | 371:1697 | 427:4565 | 427:6532 |
| Not yet checked in game | 371:2208 | 427:5062 | 427:7029 |
| Older season warning | 371:2719 | 427:5557 | 427:7524 |
| Share sheet / dialog | 319:904 | 319:2234 | 319:2952 |
| Link copied (toast) | 319:1674 | 427:6071 | 427:8038 |
| Share cards (360 × 640) | 316:888 (Overview), 316:973 (Attributes) | | |

Compared with the page as built in commit 2aad1bd, with Figma's sample build in `content/builds/meta-finisher.json` (draft). Out of scope: "Shared build (player's link)" (439:8847…) and its failure state, which need Supabase short links (D-100).

Status: **fixed** = now as Figma draws it; **not fixed** = still different, with the reason.

## Header (title block)

1. Under the badge, "Sample build · values and prices not checked in game" (Label/Default, text/muted), 6 px below "Meta pick". Missing. **Fixed.**
2. The code showed a "Draft" tag; Figma's sample has none, its sample line stands in. **Fixed** (the Draft tag still shows on drafts that aren't the sample).
3. Version tag "FC 27 · Season 2 · Not yet checked in game", capital N. Code: lower-case "not". **Fixed** in the one wording function (A-08); every Figma screen uses the capital, so archetype cards change too. FORMAT.md and UI-BRIEF updated.
4. Credit "Made by — (sample) · Played for one match before it's called meta". Code would print "Made by — (sample) in game · …". **Fixed:** a sample's maker line drops "in game" (also on its archetype-page card).
5. Not yet checked (371:2208): "Read from a creator's video · Watch the video" replaces the maker line; the link is not underlined. Code showed both lines and underlined the link. **Fixed.** The sample's reference credit is named "a creator", as drawn; a real one names the streamer (rule 5, D-66).
6. Older season (371:2719 / 427:5557): the warning tops the summary column on tablet and desktop (300 / 400 px wide). Code put it full width above both columns. **Fixed.**
7. Breadcrumb "/" is text/secondary. Code: text/muted. **Fixed** (shared component).

## Level switch (missing entirely)

8. "YOUR LEVEL" (Barlow Condensed 20) with a − / 55 / + stepper (44 px buttons, 52 px number, 8 px radius, border/subtle). **Built.**
9. "AP at level 55: **1,419** · spent **1,410** · left **9**". **Built.**
10. Slider: 6 px track (bg/surface) with text/secondary fill, 28 px lime knob with a 3 px dark ring, knob at level ÷ 55; 140 px section with a bottom rule. **Built.**
11. Level 32 (371:1697): "32", "AP at level 32: 724 · spent 724 · left 0", knob at 32/55, and the warning "At level 32 you're 695 AP short of this build. Its specialization needs level 50." under the section. **Built**; reached with − or the slider.
12. In the level-32 frames the AP numbers are not bold; in the main frames they are. **Not fixed:** the frames disagree; the main frame's bold is kept.
13. On tablet and desktop the level-32 knob sits at the phone's 189 px, not at 32/55 of the wider track. **Not fixed:** the knob stays proportional (it would otherwise move with screen width).
14. Moving the switch: only levels 55 and 32 have figures in Figma, so − / + and the slider snap between those two. **Missing data** (not in Figma): the AP each level gives (level engine, Sharon's PR #7) and each archetype's attribute prices (O-14).

## Hero

15. Key stats PAC 88, SHO 80, PAS 58, DRI 84, DEF 38, PHY 66. Code: "–". **Fixed** (sample figures; also on the sample's archetype-page card).
16. The face is Figma's "Face/ProBuilds default" drawing, but Figma's raster draws the V collar filled where Chrome shows the grey chest inside it. **Not fixed:** same SVG paths and fills as the Figma export (checked); a renderer difference.

## All of it at level N (missing)

17. Card: "All of it at level 55" / "Every step of the build fits, with 9 AP to spare." (bg/surface, 12 px padding). **Built.**

## Specialization

18. Explanatory paragraph "Targets Ball Control, Composure, Reactions: one at 92, two at 90. Which one is 92 isn't recorded yet, so this sample counts all three at 92." **Built.**
19. Targets read "92 / 92" for all three. Code would show "92 / 90" for Ball Control and Reactions (the archetype file's in-game targets). **Fixed** through the sample's counted target. **For Chime:** the archetype file (25 Nov, in game) now records Composure as the 92, so Figma's note is out of date.
20. "Reached from level 50 with the sample prices. Counts raw values only." **Built.**
21. Target rows are 20 px tall, 4 px apart (code ~28 px); on phone both notes are 305 px wide; the name row is 49 px; "Reached at level 55" sits in a 30 px row. **Fixed.**
22. Target value gold (Figma d9a93c) and " / 92" (ab9b80, Barlow SemiBold 14 / 18) aren't tokens. **Not fixed exactly:** status/warning and text/muted, the nearest tokens (no hard-coded colours, CLAUDE.md).

## Body and skills

23. AcceleRATE "Controlled Explosive". FORMAT had three types; the game has seven (Explosive, Mostly Explosive, Controlled Explosive, Controlled, Controlled Lengthy, Mostly Lengthy, Lengthy). **Fixed:** type, validator, FORMAT.md, tests.
24. Values 2 px under their term; rows 41.14 px (phone, tablet) and 44 px (desktop), 12 px apart. **Fixed.**
25. The ★ glyphs: Barlow has no star, and Figma's fallback draws smaller stars than Chrome's. **Not fixed** (font fallback).

## PlayStyles+ and PlayStyles

26. Matched already (two columns of 158.5 px on phone and tablet, three of 229 px on desktop). No change.

## Attributes

27. Group gauges 88 / 80 / 58 / 84 / 38 / 66. Code: "–". **Fixed.**
28. Rows 35.3 px (code 35); on phone the heading sits 48 px below the PlayStyles list (code 32). **Fixed.**
29. "EA Pitch Notes" was underlined; Figma draws plain text. **Fixed** (still a link).
30. Bars for 89 to 94 are drawn full width while 87 is drawn at 87 %. **Not fixed:** every bar stays at its value % (D-63 (4)); Figma's long bars are inconsistent with its own 87.

## Footnote (missing)

31. "Draft only: PlayStyle icons are EA's art, archetype emblems are Pro Clubs HQ's tracings and the stances are Chime's screenshots. None of them ships as is." **Built** (sample only).

## Share sheet and dialog

32. Two story cards (316:888, 316:973), drawn at 360 × 640 and scaled to 225 × 400 (phone) and 270 × 480 (tablet, desktop). Missing. **Built** in HTML.
33. Phone pager: current dot 8 px text/primary, other 6 px text/muted, "1 of 2"; follows the swipe. Missing. **Built.**
34. "Save images" (download icon from Figma, 318:414). Missing. **Built**; the action is a TODO: making image files needs a renderer, a new dependency that needs Chime's OK.
35. Buttons: phone [Save images | Copy link] then "Share via…" full width; tablet one centred row with the 52 px share icon; desktop the two buttons. **Built.**
36. Hints, one per breakpoint, centred from tablet: "Saves both cards to your photos." / "… The last button opens your device's share menu." / "Saves both cards as images. Copy link to paste the build page anywhere." Missing. **Built.**
37. From tablet the title sits at the top of its 52 px row and the close icon is 24 px. **Fixed.**
38. "Share via…" and the tablet share icon show only where the browser has a share menu (kept from before); Figma draws them always.

## Link copied (toast)

39. The toast sits 6 px higher than Figma's, measured against the bottom nav. **Not fixed:** Toast and BottomNav are shared shell components (D-94), outside this page.

## Across the page

40. Chrome draws Barlow 14/20 and 15/20 glyphs about 1 px higher than Figma inside the same line box (the raw-values box is at y 514 in both; its glyphs start at 528 in Figma and 527 here). **Not fixed:** a renderer difference; it is why text-heavy sections score higher on the strict pixel diff.
