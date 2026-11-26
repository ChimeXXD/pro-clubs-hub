# Faces library audit against Figma (26 Nov 2026, D-107)

Figma file hyFx4Audhn4F9KxL9bRCLD, page "Design screens", section "Phase 2 · Faces". Frames read with get_design_context, get_metadata and get_screenshot:

| State | Phone 393 | Tablet 834 | Desktop 1440 |
| --- | --- | --- | --- |
| Library | 333:1139 | 345:1310 | 345:1391 |
| No results ("Zidane") | 372:1853 | 427:9875 | 427:9960 |

Compared with the page as built in commits 35d0d57 and 547cbf6, which had one draft face. Figma's five demo faces are now sample face files (drafts, `"sample": { "place": n }`) with Figma's stand-in pictures in `public/sample/faces/` (D-107, D-108). Out of scope: the face page (`/faces/[slug]`, not built yet, so the cards' links 404 on the preview) and Request a face (`/faces/request`, waits on Supabase, D-96).

Status: **fixed** = now as Figma draws it; **not fixed** = still different, with the reason.

## Header

1. Under the intro, the demo note "Demo: stand-in faces from Xaiiros's and CodeName Max's YouTube tutorials. Each real card shows our own in-game recreation." (Label/Caption, text/muted, 8 px below, 600 px wide from tablet). The code left it out (D-68 (4)). **Fixed:** shown while the library lists sample faces, so it describes the stand-ins that now ship on the preview (D-108).
2. The phone no-results frame (372:1853) has no demo note; the tablet and desktop ones (427:9875, 427:9960) do. **Not fixed:** the frames disagree. The note describes the library, not the search result, so it shows in all three; on phone the no-results card sits 68 px lower than 372:1853.

## Chips

3. Counts All 5, Footballers 3, Athletes 1, Musicians 1. The code showed 1 / 1 / 0 / 0: one face, and no `athlete` kind in the format. **Fixed:** the counts follow from the five sample faces; `athlete` is in the types, validator and FORMAT (D-68).
4. Chips are 65 / 125 / 103 / 113 px wide in Figma and 64.2 / 123.6 / 102.5 / 112.2 px in Chrome. Figma rounds each text box up to a whole pixel (label and count separately: for example "All" 16.9 → 17 and "5" 7.3 → 8), so by the fourth chip the row sits 3.8 px further right. **Not fixed:** a renderer difference in the shared chip; it is why the chips row scores highest on the pixel diff.
5. Found while testing: with the new counts, the last chip's focus ring was clipped by half a pixel once focus scrolled it into view (the chips have fractional widths and the row scrolls in whole pixels). **Fixed:** the row's scroll padding is 6 px (4 for the ring, 2 for rounding).

## Grid and cards

6. Five faces, in this order: 2008 Ronaldo, Neymar Jr (Mohawk), Lamine Yamal (Footballer); LeBron James (Athlete); Michael Jackson (Musician). The code showed one card. **Fixed:** five draft sample face files; `sample.place` keeps Figma's order (samples first, then any other face in content order).
7. Each card's picture is Figma's stand-in (468 × 576, the frames' image fills, the same files as `reference/faces-demo/v2/`). The code showed the empty "In-game screenshot" slot. **Fixed:** WebP at the source size (the largest card is 235 px wide on tablet, so 471 px at 2×), quality 80, 52.7 KB for all five. A build without drafts deletes `out/sample/` (postbuild, `scripts/strip-samples.mjs`), so probuilds.club never serves them (D-108); two sample faces in one place fail the build.
8. Titles are plain names (D-69). The code showed "Inspired by Cristiano Ronaldo, 2008", which the validator required. **Fixed:** the validator keeps only the "official" ban (D-69 (5)); the 2008 Ronaldo draft now reads "2008 Ronaldo". This is the same change as Sharon's PR #9 (on hold), applied from its diff, so the overlapping files are identical.
9. Figma draws no Draft tag on the cards. **Fixed** (D-113, amending D-104 (2)): a sample face's card has no Draft tag, because the demo note marks the samples; any other draft keeps it. Driven by the file's `sample` field, tested both ways.
10. The picture frame's padding (12 / 12 / 10, space-between) holds nothing in Figma. No change.
11. Grid geometry matched already: phone two columns (12 px across, 16 px down), tablet three (235.3 px cards, 24 / 32 px), desktop six (180 px cards, 24 px), 4:5 picture with a 1 px border/subtle outline and 12 px corners, meta 10 px below, kind and title 2 px apart. No change.

## Missing a face tile

12. Matched already ("Suggest one on Submit.", D-109); it now sits after Michael Jackson, as drawn. No change.

## Request panel

13. Matched already (stacked on phone; text and a 240 px button in one row from tablet). No change.

## No results

14. Phone: Figma sets "Ask for it, and vote for what we make next." on one line, 311 px of text in a 305 px box, running 3 px into the card's 24 px padding. The code wrapped it to two lines (card 276 px tall, Figma 250). **Fixed:** the line may use 4 px of the padding on each side; it still wraps, balanced, on narrower phones (360 px).
15. Search "Zidane" with Clear, every chip at 0, the card with Request a face. Matched already ("Clear search", D-109). No change.

## Across the page

16. Chrome draws Barlow about 1 px differently from Figma inside the same line boxes (as on the Build page, build-page-audit item 40). **Not fixed:** a renderer difference; it is most of what is left in the header (phone) and footer scores.
17. The preview bar (D-104) sits under the top bar on the preview and is not in Figma. Not a difference to fix; it is hidden for the measurements.

## Values no frame shows (for Chime)

18. The sample files need fields the library does not draw. They are left as `"PLACEHOLDER"` or empty: era labels (except 2008 Ronaldo's "2008"), time, preset, recipe parts. Required fields with no placeholder: the four new faces pair with `meta-finisher` (the only sample build; 2008 Ronaldo keeps `spark-2008-winger`). They are credited "Made by — (sample)" plus a "reference" credit naming the creator and linking the tutorial the picture came from (`reference/faces-demo/SOURCES.md`). Change any of these when the face page is designed or real faces arrive.
