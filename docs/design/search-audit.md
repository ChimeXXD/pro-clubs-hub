# Search results audit against Figma (27 Nov 2026, D-107)

Figma file hyFx4Audhn4F9KxL9bRCLD, page "Design screens", section "Phase 3 · Home & frame": "Search results (Should)" phone 376:2282, tablet 376:2393, desktop 376:2491 (D-80 (3), D-97 (6)). Read with the Plugin API (read only) and get_screenshot.

Built new: `/search` (`src/app/search/page.preview.tsx`, preview only, D-105), `src/lib/search.ts`, `src/components/search/SearchView.tsx`. The top bar's search button already linked to `/search`; it no longer opens the 404 on the preview. Status: **fixed** = as Figma draws it; **not fixed** = still different, with the reason.

## Layout

1. "Search" (H1), the Search field (200:410, State=filled: the query, Clear; full width on phone, 560 px from tablet), "2 results for “Ronaldo”" (caption, muted), then the Faces and Builds groups: the title (H3) and its count (Label/Default, muted) 8 px apart on the baseline, the cards 12 px below. Content 16 px below the top bar, 24 px between blocks, 48 px at the foot. **Fixed** (new).
2. Faces use the library's card (4:5, kind, name) two / three / six across; builds use the preview card (D-62, as on Home without a tag) one / two / three across; 24 px gaps. **Fixed** (new).
3. The bottom nav lights no section (Page=None, D-97 (6)); the existing nav already did that outside the five sections. **Fixed.**

## Behaviour (not drawn)

4. What is searched: faces by title and the person's name, as the library's search; builds by name, archetype and positions (positions as whole words), and through a matching face they are paired with, which is how Figma's "Ronaldo" finds the 2008 Winger build. Every word must match; case and accents don't count. The query goes into the address (`?q=`) as it is typed, so a reload or a shared link keeps it.
5. Empty (no query): the field only. Nothing found: the count only ("0 results for “Zidane”"). A group with no result is left out. *TODO(Chime):* no frame draws these states.
6. The field's placeholder is the Design System's own, "Search faces and builds"; the Faces library keeps "Search faces by name". The field is the library's component with a width and placeholder passed in.

## Content

7. The build reads "PLACEHOLDER" where Figma draws "2008 WINGER": `content/builds/spark-2008-winger.json` (the Builds lane's file) has no title yet. **Not fixed**, as in face-page-audit item 5.

## Measurements

Mean absolute RGB difference per section, Figma frame against Chromium at 1x, dark mode, `/search?q=Ronaldo`, preview bar and floating bottom nav hidden, each section cropped at its own box. In brackets: the best score within ±2 px, where it is at least 0.3 lower.

| Section | 393 | 834 | 1440 |
| --- | --- | --- | --- |
| Top bar | 3.97 | 2.97 | 1.72 |
| Title | 1.85 | 1.85 | 1.85 |
| Search field | 0.42 | 0.26 | 0.26 |
| Results line | 15.63 (3.74) | 15.63 (3.74) | 15.63 (3.74) |
| Faces | 1.47 | 0.77 | 0.34 |
| Builds | 4.84 | 2.26 | 1.41 |
| Footer | 5.48 (4.48) | 1.99 | 1.15 |

Above 3: the results line (one line of small text that Chrome sets 1 px lower; 3.74 one pixel up), the builds on phone (item 7), and the shell (shell-audit.md).
