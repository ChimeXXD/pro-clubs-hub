# Pitchside logo: reference analysis and construction

Stage 1 and Stage 2 of the brand build: the reference analysis and the construction of the primary logo and symbol. **Approved 23 Nov 2026** with all three recommendations (rounded-square i-dot, symbol 1.8× cap height, stem foot at 96).

## 1. What the reference actually shows

The reference is the "02 · The Grid" board, 514 × 1013 px. The hero logo is about 100 px wide on that board and the smaller lockups are about 30 px tall. Every measurement below comes from those pixels, so I treat anything under roughly 1 px as uncertain (see section 5).

### What makes it distinctive (keep all of it)

1. **A P cut into four tiles by a cross.** The symbol is a solid, slanted P split by one horizontal and one slanted cut. The cuts are the idea: they read as pitch markings and grid lines, which ties straight into "The Grid".
2. **One slant everywhere, about 15°.** The stem edges and the vertical cut are parallel, so the cross leans with the letter.
3. **The cut sits off-centre.** The horizontal cut is about 42% down the symbol, so the top tiles are taller than the lower bowl tile. That asymmetry gives the mark its forward lean and stops it looking like a window icon.
4. **Soft outer corners, hard inner ones.** The three outer corners are generously rounded (top-left a little tighter than the bowl), and every corner on a cut is square.
5. **The stem drops below the bowl** like a true lowercase-p descender, so the mark reads as "P", not "D".
6. **The wordmark is calm.** It's an upright, bold neo-grotesk with a large x-height, open spacing and rounded-square i-dots. All the motion is in the symbol. The type stays still.
7. **Colour:** cream (#F6F6EE) on deep pitch green (#0D1F17), with lime (#D6F16A) used only as an accent (for example the app-icon border and the CTA).

### What I left out on purpose
- The grass photography, glow and vignette: they're presentation, not identity.
- The ™: kept for later. It belongs in the files only once you're actually claiming the mark.

## 2. Symbol construction

Drawn upright on a **96-unit grid with a 6-unit module**, then slanted **15°**. The slant is baked into the path coordinates, so the SVG has no transforms.

| Element | Value (grid units) | Reference measurement (scaled) |
|---|---|---|
| Height | 96 | 3 of 4 instances agree (see decision 3) |
| Stem / left column width | 48 | 48.0 |
| Cut width (both cuts) | 6 | ≈ 5.5 |
| Right column width | 48 | 49.8 |
| Horizontal cut centre | 42 | 40.7 (hero), 41.4 (small lockup) |
| Foot of bowl | 72 | 72.9 (hero), 69.5 (small lockup) |
| Top-left radius | 24 | ≈ 24–25 |
| Top-right radius | 30 | ≈ 30–31 |
| Bottom-right radius | 30 (centred on the cut line) | ≈ 33 |
| Slant | 15° | 15.0°–15.6° |

Overlaid on the hero render, the outline lands within about 1 reference pixel everywhere except the stem foot (see `previews/logo/08-fidelity-check.png`).

**Professional calls**
- I evened the right column to 48 so both columns match on the grid. The measured 49.8 is within blur tolerance.
- I set the bottom-right radius to 30, the same as the top-right, with its centre on the cut line. The reference suggests about 33, but 30 keeps one radius for the whole bowl, and the difference doesn't show at any real size.
- I widened the cuts slightly from about 5.5 to 6 (one grid module). At small sizes a thin cut fills in first, so this buys legibility. The small-size symbol (`logo/symbol/pitchside-symbol-small-*`) uses 9-unit cuts, and the 16 px favicon uses 13.

## 3. Wordmark construction

- **Base:** Inter Bold (SIL Open Font License, free for commercial use). I tested ten open-licence grotesks against the reference pixels. Inter Bold matched the weight (stem ≈ 0.20 × cap), the x-height (0.75 × cap) and the letter shapes best. Archivo Expanded scored higher on raw pixel overlap, but only by squeezing its letters together, which changed the character, so I rejected it.
- **Custom work:**
  1. **i-dots redrawn as rounded squares** (300 × 300 units, matching the stem width, with a 72-unit corner radius), as the reference shows. Stock Inter dots are round.
  2. **Spacing re-set by hand.** I fitted each letter's position to the reference, which came out about +18 units per pair. Then I balanced the pairs by eye: base tracking +20, P–i +20, c–h +16, d–e −10.
  3. **Outlined to a single path,** so no font is needed to render the logo.
- The reference letters run about 5% wider than Inter's. At this resolution I can't tell whether that's the intended typeface or an artefact of the generated image, so I kept Inter's true proportions and didn't stretch the letters, because stretching distorts stroke weights.

## 4. Lockup (primary logo)

- Symbol height = **1.8 × cap height**.
- The foot of the bowl sits **on the baseline**.
- The cut lands **just above the cap mid-line** (0.06 × cap), as in the reference's small lockup.
- The gap from the right edge of the bowl to the P = **½ cap height**.

## 5. Uncertainties (not invented, flagged)

| Detail | Why it's uncertain | What I did |
|---|---|---|
| Stem length | The hero shows the stem ending about 15 px below the bowl. The small lockup, the symbol tile and the app icon all show about 24% of the height (≈ 21 px at hero scale). | Followed the 3-of-4 majority (96). The short version is in options. |
| Symbol-to-wordmark proportion | The hero lockup has the symbol at 2.0× cap. The small lockup has 1.8× cap. | Recommended 1.8×. Both, plus a strictly grid-locked 1.6×, are in options. |
| Exact typeface | The wordmark is about 40 px tall on the board. | Inter Bold base. See section 3. |
| i-dot shape | 8 × 8 px in the reference. It reads as a rounded square, but that's not certain. | Rounded square recommended. Round and slanted-tile dots are in options. |
| Corner curve type | Can't tell slanted circles from true circles at this size. | Slanted circles: drawn upright, then slanted. That's the standard method and it matches the overlay. |

## 6. Decisions (approved)

1. **i-dot:** rounded square (alternatives were a slanted tile and a round dot)
2. **Lockup proportion:** symbol 1.8× cap height (alternatives were 1.6× grid-locked and 2.0× hero)
3. **Stem length:** foot at 96 (the alternative was 90)

The option files are kept in `archive/` for reference only.

## 7. Rebuilding

```bash
pip install fonttools
python3 scripts/build.py        # regenerates every SVG in /logo
python3 scripts/previews.py     # needs rsvg-convert and the Inter font installed
```
All geometry lives in `scripts/geometry.py` (symbol) and `scripts/wordmark.py` (wordmark). Change a number there and rebuild. Don't hand-edit the SVGs.
