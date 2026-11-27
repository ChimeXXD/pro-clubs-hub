# Shell audit against Figma (27 Nov 2026, D-107)

The frame on every page, built before D-107 (D-102) and re-read to its standard: Top bar (205:407, and with the theme switch 499:11455 / 499:11705 / 499:11925), Bottom nav (282:521, Page=Home/Faces/None), Footer notice (205:434), and the "Footer and notice" frames 375:2044 (phone), 375:2213 (tablet), 375:2392 (desktop). Read with the Plugin API (read only) and get_screenshot; measured on Home, the face page and Search, and on Home scrolled to its foot at each Footer-and-notice frame's size.

Status: **fixed** = as Figma draws it; **not fixed** = still different, with the reason.

## Top bar

1. Heights 60 / 72 px with the 1 px system/divider under them; logo 22 / 26 px tall at 20 / 40 / 120 px from the edge; season chip 124 × 34 (border/strong, Label/Caption secondary); the sections (Label/Default, 32 px apart, the current one text/primary) centred between logo and chip; search a 44 px ghost icon button. Matched already; checked again in every frame. No change.
2. The theme switch (D-114) joined the bar: chip, switch and search side by side on phone; switch and search a pair 4 px apart, 16 px after the chip, from tablet. **Fixed** in the theme unit (theme-switch-audit.md items 4 and 5, including how the bar fits 360 px phones and the 744 px iPad mini).

## Bottom nav

3. 344 px pill, 5 px in, border/strong, bg/page, the current section a lime pill with its label (Button/Small), the others 48 px icons in text/secondary; on a page outside the five sections (Page=None: About, Takedown, 404, Search) every item is inactive and Home's icon is text/primary (checked in 376:2372). Matched already. No change.
4. Figma's background blur is left out (D-102 (3)). No change.
5. In light mode Figma draws the current pill's ring outside the pill (95 px against 93); the code's ring is inset (D-102 (5)), so the icons after it sit 1 px left. **Not fixed:** D-102 (5).
6. The frames place the nav 18 px above their foot (1763 in 1841, 774 in 852, 562 in 640); the component's description and the code put it 24 px above the bottom (and the home indicator). **Not fixed:** the description is explicit, and the frames draw no home indicator. *Question for Chime:* 18 or 24.
7. It is centred: 24.5 px from each side at 393, where Figma puts it at 25. Half a pixel; no change.

## Footer notice

8. Phone: 20 px in, 16 px apart: the 18 px logo, the four links (Label/Default secondary, 24 px apart) and the notice (Label/Caption muted), the 1 px divider above. Tablet and desktop: 48 / 40 px in (48 / 120 on desktop, the 1200 px column). The 96 px space under it on phone keeps the notice clear of the nav. Matched already (border pixel for pixel). No change.
9. The links sit up to 2 px left of Figma's by "Submit": Figma rounds each text box up to a whole pixel ("About" 36.x → 37) and the 24 px gaps follow, while Chrome keeps the fractions; and Chrome sets Barlow about 1 px lower in the same line box. **Not fixed:** renderer (as faces-library-audit item 4 and build-page-audit item 40). It is why the phone footer scores 5–6.

## Measurements

Mean absolute RGB difference per section, Figma frame against Chromium at 1x, dark mode, each section cropped at its own box. In brackets: the best score within ±2 px, where it is at least 0.3 lower.

| Section | Where | 393 | 834 | 1440 |
| --- | --- | --- | --- | --- |
| Top bar | Home 364:2118 / 367:1629 / 367:1836 (before the switch) | 3.97 | 2.97 | 1.72 |
| Top bar | Theme switch, dark (499:11271 / 11505 / 11728) | 4.24 | 3.06 | 1.77 |
| Top bar | Theme switch, light (499:11948 / 12246 / 12545) | 3.97 | 2.83 | 1.64 |
| Footer | Footer and notice (375:2044 / 2213 / 2392) | 6.00 (5.62) | 1.99 | 1.15 |
| Bottom nav | Footer and notice, phone | 3.21 (2.13 one px right) | – | – |
| Bottom nav | Theme switch, light, phone | 5.85 | – | – |

Above 3 on phone: text set 1 px apart by the two renderers in small areas (items 9 and 1), the half-pixel centring of the nav (item 7) and, in light mode, the ring (item 5). Note: the first top bar row compares the bar with the theme switch against frames drawn before it existed, so the switch itself counts against it.
