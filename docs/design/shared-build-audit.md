# Shared build page audit against Figma (27 Nov 2026, D-107)

Figma file hyFx4Audhn4F9KxL9bRCLD, page "Design screens", section "Phase 1 · Builds". Frames read with get_design_context, get_metadata, get_screenshot and the Plugin API (read only):

| State | Phone 393 | Tablet 834 | Desktop 1440 |
| --- | --- | --- | --- |
| Shared build (player's link) | 439:8847 | 439:9404 | 439:9925 |
| Link doesn't work | 440:8514 | 440:8634 | 440:8734 |

New page, built for this audit (D-99 (2), D-100). probuilds.club/b/<id> is one static page, `/b` (preview only, `src/app/b/page.preview.tsx`, D-105); Cloudflare Pages rewrites `/b/*` to it (`public/_redirects`, and `scripts/serve-out.mjs` does the same locally) and the address stays `/b/<id>`. In the browser it reads the id, loads the build from Supabase through `src/lib/supabase/client.ts` (plain fetch against PostgREST, the `shared_build` function, D-96), validates it like any content file (CLAUDE.md rule 6) and shows the Build page in its shared form. No Supabase project exists yet: with no settings, the preview shows Figma's sample at `/b/k7x2m9` (the id in D-99 (2)'s example) and every other id is "This build link doesn't work." The schema for Chime to run is `docs/supabase-schema.sql`.

Status: **built** = new, as Figma draws it; **not fixed** = still different, with the reason. Pixel diffs are the mean absolute difference per RGB channel (0 to 255) of each section, Chrome at 1x, dark mode, bottom nav and preview bar hidden. Both pages are exactly Figma's height at all three widths (3799, 3137, 2333; 937, 641, 669).

## Shared build (439:8847)

1. Figma's sample is the Meta Finisher sample as a player's "My Finisher", with no badge (`sampleSharedBuild`): every value below the header is the Build page's. **Built.**
2. Breadcrumb "Builds / Shared build", both text/secondary (439:8850). The frame also holds an empty "/" and a third crumb with no text, not drawn. **Built** (the Breadcrumb gained a `muted` current page).
3. Header (439:8862): the neutral "Shared build" tag (bg/raised, Label/Default, 10 × 3 px padding), "Shared by a player · not on ProBuilds' lists yet" (text/muted) 6 px under it, the name, the amber version tag "FC 27 · Season 2 · Not yet checked in game", "Made by — (sample) · shared from Submit a build". No "Sample build · values…" line and no Draft tag, as drawn. **Built.**
4. Then, 20 px apart: the callout "A player shared this build. It goes on ProBuilds' lists only after Chime plays it in game.", Share build, and Make your own build (secondary with a 1 px border/strong, 32 px sides; links to Submit). On the not-yet-checked build the callout comes after Share build; here it comes before, as drawn. **Built.**
5. No tab is lit in the bottom nav (D-100 (1)): `/b` is under none of the nav's sections. Matched with no change.
6. The story cards' link reads `probuilds.club/b/k7x2m9`, and Copy link copies the `/b/` address. Not drawn; follows D-99 (2).
7. Below the header the page is the Build page, so its residuals are the Build page's (build-page-audit items 40 to 44): text drawn about 1 px higher in Chrome, the share cards' small text, and the phone footnote.

| Section | 393 | 834 | 1440 |
| --- | --- | --- | --- |
| Top bar | 4.0 | 3.0 | 1.8 |
| Breadcrumb | (in header) | 1.0 | 0.6 |
| Header to Make your own build (summary column from tablet) | 2.0 | 2.4 | 1.6 |
| Level switch | 2.3 | (in summary) | (in summary) |
| Details, top to bottom | 4.7, 4.9, 4.5, 4.9 | 3.3, 4.5, 4.3, 4.5 | 2.0, 2.2, 4.5 |
| Footnote, footer | 8.1 (item 7), 5.0 | footer 2.1 | footer 1.3 |

## Link doesn't work (440:8514)

8. A faded mannequin card (bg/surface, 20 px corners, 28 × 20 px padding, the face 150 px, 200 px on desktop, at 55 %), "Build not found" with Figma's info icon (text/muted, 18 px), the headline "This build link doesn't work." (H1, caps), the line (Body/Large, text/secondary), Browse builds (to /builds) and Make your own (to /submit). Phone stacks the card over the copy; tablet and desktop put the copy left and the card right (370 / 520 px), 56 px apart, centred on each other, as the 404 does. **Built.**
9. On tablet the button labels (115 and 120 px) are wider than the buttons' insides (156.5 and 159.5 px less 24 px each side): Figma keeps them on one line, running into the padding. Chrome wrapped them to two lines (copy 9.4). **Fixed:** the labels don't wrap and the copy column can't grow (copy 9.4 → 4.8).
10. Figma shares the two tablet buttons 156.5 / 159.5 px; CSS shares them equally, 158 / 158. **Not fixed:** 1.5 px at each edge, no visible difference.
11. The same state shows for `/b` with no id, a malformed id, an id with no build, a build that fails validation, and a failed request (no network). Figma draws only the one state; a "couldn't load, try again" state for a failed request isn't drawn (question for Chime).
12. While the build loads the page is empty (no frame draws a loading state); on the preview's sample it is immediate.

| Section | 393 | 834 | 1440 |
| --- | --- | --- | --- |
| Top bar | 4.0 | 3.0 | 1.7 |
| Card | 0.7 | 0.5 | 0.4 |
| Copy and buttons | 3.7 | 9.4 → 4.8 | 2.5 |
| Footer | 5.2 | 2.0 | 1.2 |
