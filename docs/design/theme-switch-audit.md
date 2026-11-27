# Theme switch audit against Figma (27 Nov 2026, D-107, D-112, D-114)

Figma file hyFx4Audhn4F9KxL9bRCLD, page "Design screens", section "Phase 3 · Home & frame", row "Theme switch · option A (picked, D-114)": dark 499:11271 / 499:11505 / 499:11728, light 499:11948 / 499:12246 / 499:12545; component "Theme switch" 497:976 (Option=A · Top bar button, Theme=Dark/Light, State=Default/Focused) on the Design System page.

Built: `src/components/shell/ThemeSwitch.tsx`, `src/lib/theme.ts`, the top bar's layout and an inline script in `src/app/layout.tsx`. Status: **fixed** = as Figma draws it; **not fixed** = still different, with the reason.

## The switch

1. A 44 px ghost icon button with 8 px corners and a 20 px icon in text/primary: the sun while dark, the moon while light (the mode a tap switches to). Its name is "Switch to light mode" / "Switch to dark mode", the component description's draft labels. The focus ring is the site's 2 px focus ring. **Fixed** (new). Icon/sun (495:11258) and Icon/moon (495:11265) exported into `public/icons/`.
2. One tap sets `data-theme="light"` on `<html>` (or removes it for dark), and stores `theme` = `light` / `dark` in localStorage, wrapped in try/catch. An inline script in `<head>` reads it before anything paints, so a light page never flashes dark; it is tested with every script file blocked. Dark stays the default whatever the device says (D-112). **Fixed.**
3. On every page: it lives in the top bar (layout). **Fixed.**

## The top bar (499:11455, 499:11705, 499:11925)

4. Phone: the logo left; the season chip, the switch and search side by side at the right, no gaps between them (chip 161–285, switch 285–329, search 329–373 at 393, as drawn). Tablet and desktop: the chip, then 16 px, then the switch and search 4 px apart (switch 702, search 750 at 834; 1228 and 1276 at 1440). **Fixed.** The bar's gap was 16 px on phone; Figma lays the phone bar out space-between, so it is 8 px now, a minimum the frame never reaches.
5. Figma's frames are 393 and 834 wide. At 360 px the phone bar needs 381 px; at 744 px (iPad mini) the tablet bar needs 791. **Not as drawn below those widths, by necessity:** under 390 px the chip reads "Season 2" (the game's name stays for screen readers); from 744 to 833 px the nav's gaps are 18 px instead of 32 and the bar's 12 instead of 16. Every control keeps its 44 px. *Question for Chime.*

## Measurements

Mean absolute RGB difference per section, Figma frame against Chromium at 1x, the viewport only (the frames are one screen of Home), bottom nav shown. Each section cropped at its own box.

| Mode | Section | 393 | 834 | 1440 |
| --- | --- | --- | --- | --- |
| Dark | Top bar | 4.24 | 3.06 | 1.77 |
| Dark | Faces | 5.92 | 2.66 | 2.50 |
| Dark | Face of the week | 1.74 | – | – |
| Dark | Bottom nav | 3.71 (2.65 one px right) | – | – |
| Light | Top bar | 3.97 | 2.83 | 1.64 |
| Light | Faces | 5.97 | 3.90 | 3.41 |
| Light | Face of the week | 2.02 | – | – |
| Light | Bottom nav | 5.85 | – | – |

6. Light bottom nav: Figma's current pill is 95 px in light (its ring drawn outside) and 93 in dark; the code's ring is inset (D-102 (5)), so the pill stays 93 and the icons after it sit 1 px left of Figma's. **Not fixed:** D-102 (5) chose the inset ring.
7. The bottom nav sits 18 px above the frames' foot (774 in 852) while the component's description and the code put it 24 px above the home indicator (shell-audit.md item 6). Not measured here (each section is cropped at its own box).
8. Faces on phone: the round crops of the stand-in pictures resample differently in Figma and Chrome (home-audit item 4).

## Light mode, every built page (the check D-114 asked for)

Every page and state was opened in light mode at 393 and 1440 and swept for text contrast (each text's colour against the first opaque background behind it, WCAG AA: 4.5:1, 3:1 for large text): the home, Faces, the face page (not started, in progress, finished, ticks reset), Builds, the Finisher archetype page, the Meta Finisher and 2008 Winger build pages, Changelog, About, Takedown, Search and the 404. The light screenshots were also looked at one by one.

9. **Text:** one failure: the 404's art draws its two "4"s in lime (#d8ff4f) on the replay card's white (bg/surface): 1.15:1. They are large display text and the only thing that reads "404" in the art. Not changed here (the 404 is outside these units). Proposal: in light mode draw them in accent/on-fill, or keep them as art and give the card an accessible name ("404").
10. **Graphics (WCAG 1.4.11, 3:1):** on the face page the section bar's lime (#d8ff4f) against cream (#f7f3e6) and white (bg/raised) is about 1.03:1 and 1.15:1, so in light mode the progress is very hard to see. Not changed (no light frame of the face page). Proposal, as D-37 does for the lime pills: a 1 px accent/on-fill ring on the done segments, or text/primary for the fill in light mode.
11. Lime buttons (Done, next; Start; Faces on the 404; Back to faces) are 1.03:1 against the cream page; their dark labels carry them (AA allows it), but D-37 puts a dark ring on selected lime only. No change; noted for the design.
12. The season card's 1 px outline is bg/raised (white) on cream, about 1.1:1: decorative, as drawn in 499:11948.
13. Everything else passes: text tokens are AA in both modes (tests/unit/tokens.test.ts), and the Meta pick tags, position chips and current nav pill already carry D-37's dark ring.
