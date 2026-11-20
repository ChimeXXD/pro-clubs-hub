# DESIGN.md — Pro Clubs Hub taste rules

Rules learned from Chime's corrections, read before building or changing UI. Values come from `src/styles/tokens.css`, which mirrors the Figma Design System page (D-14). Decisions behind them are in `docs/DECISIONS.md`. A rule marked *inferred* has a reason Chime approved but did not word. A rule marked *carried* comes from Sinima and holds until Chime says otherwise for this project.

This file starts with the Sinima rules that fit any product. Add a rule each time Chime corrects the UI, with the quote and date in a comment.

## Direction (Chime, 20 Nov 2026)

- **The start screen follows FUT.GG's home:** a dark hub with one accent, a top bar with search, tab pills (Trending, New, …), and a dense grid of face cards as the first thing on screen; then live items (season countdown, latest changes), quick links and lists with small badges. Our own card style: no EA card frames or rarity colours (D-04).
- **Every face is shown as a 3D preview you can turn:** a 360° spin of the face as made in FC 27, captured by Chime in game (D-10 still holds: only Chime's own in-game captures, never a model or render of the real person).
- **Never show abstract style directions** (moods of type and colour on sample screens). Show the product's real screens, built from the reference Chime names.
  Why: Chime rejected the three-direction board (Scoreboard, Almanac, Instrument panel): "All these are trash. This is not the design I had in mind at all."
  <!-- 2026-11-20, D-19 -->

## Color

- **Grey hover fills use hover tokens only: `--hover-fill` (surface + 2 % of the text colour), `--hover-fill-raised` and `--hover-fill-page` (page + 1 %). No component mixes its own grey. Start faint.** *Carried.*
  Why: on Sinima, Chime judged hovers too dark twice and landed at 2 %, a third of the first 6 %.
  <!-- Sinima 2026-11-16, D-110, D-111 -->

- **Toasts are coloured by what they say: info and saved in a light action blue, errors in a deep red mixed from Figma's red/500, never pure red, never navy.** *Carried.*
  <!-- Sinima 2026-11-16, D-109 d -->

- **No EA look.** No game UI chrome, no card-art frames, no rarity colours copied from Ultimate Team cards. Our own diagrams for slider tracks and preset grids.
  Why (*inferred*): EA's content policy bars implying endorsement (D-04).

## Content

- **The value is the hero.** On a face step or a build card, the number or notch is the biggest thing; labels and tips are secondary.
  Why (*inferred*): the phone sits next to a TV and is read between controller moves.

- **Version tag and credit line are always visible on a card, never in a tooltip.** Format: "FC 27 · Season 2 · verified 19 Nov 2026" and "Made by <Chime or Sharon> in game · tutorial by <creator>".
  Why: trust is the product (L-03); a stale build without its date misleads.

## Interaction

- **Menus and pickers open below their trigger on a computer, 8 px under it, trigger visible and clickable, chevron turning up while open. On a phone they are sheets.** *Carried.*
  <!-- Sinima 2026-11-16, D-109 c -->

- **When rebuilding a component from a reference Chime gave, copy its layering and cut-outs, not only its motion. Compare a still frame side by side before showing it.** *Carried.*
  <!-- Sinima 2026-11-16, D-109 e -->

## Motion

- **Page and tab changes slide the new page 40 px from the side it came from over `--dur-page` (300 ms), `--ease-out`.** None on key press or under reduced motion. *Carried.*
  <!-- Sinima 2026-11-16, D-109 b -->

- **In any menu or list of options, the highlight is one shape that springs from row to row, never a fill that snaps per row.** *Carried.*
  <!-- Sinima 2026-11-16, D-109 c -->

- **Every selected or pressed state fades over `--dur-fast`. Every clickable surface answers a hover, only inside `@media (hover: hover) and (pointer: fine)`.** *Carried.*
  <!-- Sinima 2026-11-16, D-106 c, d -->
