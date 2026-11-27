# Home audit against Figma (27 Nov 2026, D-107)

Figma file hyFx4Audhn4F9KxL9bRCLD, page "Design screens", section "Phase 3 · Home & frame": Home phone 364:2118, tablet 367:1629, desktop 367:1836 (D-75 to D-78). Read with get_metadata, the Plugin API (read only) and get_screenshot.

Built new in `src/app/page.tsx` (it replaces the "Work in progress" placeholder) with `src/lib/home.ts` and `src/components/home/HomeView.tsx`. Status: **fixed** = as Figma draws it; **not fixed** = still different, with the reason.

## What the live site shows

1. Home appears only when content fills every section: four faces plus a face of the week, a card for each of the three lines of the team, and at least one change. On the preview that is Figma's samples and the draft changelog (D-107); probuilds.club has no published face or change yet, so it keeps the placeholder rather than show empty sections. A `page.preview.tsx` wasn't used: Next can't hold `page.tsx` and `page.preview.tsx` in one folder on the preview build. *Question for Chime:* what the live home should show before launch content is published.

## Faces

2. Phone: "Faces" (H3) and "See all" (Label/Default, lime) baseline to baseline; four equal columns 8 px apart, each a 72 px round picture with a 2 px border/strong ring and the plain name centred under it (Label/Caption, secondary, wrapping). Tablet and desktop: the library's face card (4:5, kind and name) in four columns 24 px apart (D-78). **Fixed** (new).
3. The four are the library's order without the face of the week (D-77): 2008 Ronaldo, Lamine Yamal, LeBron James, Michael Jackson; the pictures are the library's stand-ins (same image hashes as the frames). **Fixed.**
4. The phone score (5.92) is the round crops: Figma and Chrome resample the 468 × 576 stand-ins to 72 px differently. Not a layout difference.

## Face of the week

5. bg/surface, 20 px corners, 14 px in: the picture (112 × 140 on phone, 171 × 214 from tablet, 12 px corners), "Face of the week" (lime caption), the name (H3), "Footballer · 18 steps" and a small primary "Start" with the arrow (Button/Small, 36 px tall, with a 44 px tap area). Tablet and desktop: 242 px tall, half the row plus 14 px (379 / 602 px), the text centred. **Fixed** (new). The step count is the face's recipe total (Figma's sample recipe, 18).
6. Which face is the face of the week has no rule yet (HANDOFF). Figma draws Neymar Jr (Mohawk); the sample file marks it with `sample.faceOfTheWeek` (new, drafts only, one face at most). *TODO(Chime):* the rule for real faces.

## Meta builds

7. Three cards, one per line of the team (D-75 (2)): Meta Finisher (the sample build: Meta pick, ST CF, "Level 55 · 185 cm · 80 kg", 88 80 58 84 38 66, Low Driven Shot and First Touch), then Meta Maestro and Meta Boss, which have no build file: drawn from their archetypes as Figma does (Meta pick, "Midfielder · not recorded yet" / "Defender · not recorded yet", "—" for every stat, the archetype's signature PlayStyles+: Pinged Pass and Long Ball Pass; Bruiser and Aerial Fortress, D-75 (4)). Maestro and Boss open their archetype's page; Meta Finisher its build page. **Fixed** (new). The card is the face page's matching-build card with the tag (`src/components/ui/BuildPreviewCard.tsx`).
8. Phone: a rail of 320 px cards, 12 px apart, that swipes sideways to the screen's edge (snapping to each card). Tablet: two columns of 365 px with the dashed "View all builds" tile ("Pick an archetype, then a build.") as the fourth cell; desktop: three columns of 384 px. Under them, "Sample builds. Maestro and Boss values come when they are recorded in game. Tap a card to open its build." while any card is a sample. **Fixed** (new).
9. The tile is 264 px tall (the row's height); Figma draws it 266 against the 264 px Boss card. CSS draws the dashes shorter than Figma. **Not fixed:** renderer and row stretch; 2 px.
10. "Meta <archetype>" for a line nobody has recorded, and the sample note's naming of Maestro and Boss, are the frames' wording. *TODO(Chime):* both fit only while those two lines are unrecorded.

## What changed and the season

11. "What changed" with "Changelog"; the three latest entries, newest first, in a bg/surface list (16 px corners), each "10 Nov 2026 · Title update" (caption, muted) over its title (Label/Default), a divider between. They are the changelog's drafts, so they show on the preview only. **Fixed** (new).
12. The season card: 1 px bg/raised outline, 16 px corners, "Season 3 starts Thu 3 Dec" and "Every face and build gets re-checked in game, and older ones say so." **Fixed** (new). Dated copy, as on the Changelog (O-22 (6)).

## Frame

13. Top bar with no section lit, bottom nav on Home, footer: the shell (shell-audit.md). The page has a visually hidden "ProBuilds" h1, since the frames draw no title.

## Measurements

Mean absolute RGB difference per section, Figma frame against Chromium at 1x, dark mode, preview bar and floating bottom nav hidden, each section cropped at its own box. In brackets: the best score within ±2 px, where it is at least 0.3 lower.

| Section | 393 | 834 | 1440 |
| --- | --- | --- | --- |
| Top bar | 3.97 | 2.97 | 1.72 |
| Faces | 5.92 | 2.66 | 2.50 |
| Face of the week | 1.74 | 1.56 | 2.00 (0.98) |
| Meta builds | 4.42 | 3.20 | 3.15 |
| What changed | 2.76 | 2.78 | 3.29 (1.70) |
| Season | 1.43 | 0.89 | 3.79 (0.56) |
| Footer | 5.22 (4.84) | 1.99 | 1.21 |

Above 3: the phone faces (item 4), the builds (small text set 1 px apart in Chrome, the dashed tile, item 9), and on desktop everything below the face cards sits half a pixel higher (Figma rounds the 404.5 px cards to 405), which is why the best offset is one pixel down. The shell is unit 5.
