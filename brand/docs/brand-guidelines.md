# Pitchside brand guidelines

**Direction: "The Grid".** A structured identity built on the logic of the game: a slanted P cut into four tiles by the lines of the pitch, set beside a calm, upright wordmark. Modern, systematic, precise.

The visual version of this document is `examples/brand.html`. Logo rules are in `logo-usage.md` and the UI rules in `design-system.md`.

---

## 1. Brand idea

Pro Clubs players spend their time on structure: attribute points, height and weight trade-offs, slider values. Pitchside's job is to make that structure clear, and the identity says the same thing:

- **The cut cross** is the grid and the pitch markings at once: a halfway line and a channel.
- **The 15° slant** gives forward motion. It's the only angle in the system.
- **The calm wordmark** carries no motion of its own, so it never competes with the symbol.

Three principles, from the reference board:
1. **Clean and system-driven.** Every element comes from the grid, the slant or the pitch.
2. **Scales across the product.** The same tokens drive the app icon, the build card and the social post.
3. **Distinctive, minimal, timeless.** No gradients, glows, chrome or "gamer" effects.

## 2. Colour

### Core palette

| Name | HEX | Role |
|---|---|---|
| **Pitch** | `#0D1F17` | Primary background. The ground everything sits on. |
| **Turf** | `#2E5E3D` | Secondary green: selected states, position tags, illustration. |
| **Floodlight** | `#D6F16A` | Accent. Primary action and the one highlight that matters. |
| **Chalk** | `#F6F6EE` | Logo, headings, primary text on dark. Light background. |
| **Night** | `#0A0A0A` | Overlays, mono logo, print. |

### Extended ramps

| Token | HEX | Use |
|---|---|---|
| pitch-950 | `#07120D` | Sunken areas, code wells |
| pitch-900 | `#0D1F17` | App background (= Pitch) |
| pitch-850 | `#11271D` | Cards, panels |
| pitch-800 | `#163023` | Hover, inputs, popovers |
| pitch-750 | `#1B3A2A` | Pressed, modals, app-icon background |
| pitch-700 | `#224634` | Strong fills |
| turf-600 | `#2E5E3D` | = Turf |
| turf-500 | `#3D7650` | Illustration |
| turf-400 | `#5A9268` | Illustration highlights |
| chalk-50 | `#FBFBF7` | Light-mode raised surface |
| chalk-100 | `#F6F6EE` | = Chalk |
| chalk-200 | `#E7E9DE` | Secondary headings on dark, light borders |
| chalk-300 | `#C8CDBF` | Secondary text |
| chalk-400 | `#A3AD9F` | Tertiary text. The lowest contrast allowed for text. |
| chalk-500 | `#7F8C7F` | Disabled and placeholder only |
| floodlight-200 / 300 | `#EEF9BF` / `#E3F598` | Hover on accent |
| floodlight-400 | `#D6F16A` | = Floodlight |
| floodlight-500 / 600 | `#C3DE52` / `#A2BC33` | Pressed accent |
| floodlight-800 | `#55661A` | Floodlight-family text on light backgrounds |

### Feedback and rating colours

| Token | HEX | Use |
|---|---|---|
| positive | `#6FD68A` | Success |
| warning | `#F1B84A` | Warnings |
| danger | `#F26D5B` | Errors, destructive actions |
| info | `#79BEF2` | "New", tips |
| rating-elite (90+) | `#D6F16A` | Attribute values and bars |
| rating-great (80–89) | `#8FDB7A` | |
| rating-good (70–79) | `#E9D45C` | |
| rating-average (60–69) | `#EFA14A` | |
| rating-low (<60) | `#EE6A55` | |

The rating colours always sit next to the number. Colour alone never carries the value, so the scale still works for colour-blind players.

### Proportions
Pitch ~60% · Turf and surfaces ~18% · Chalk ~14% · Floodlight ≤5% · Night ~3%.
**One Floodlight element per view.** If two compete, one of them is wrong.

### Contrast (WCAG 2.2, measured)
- Chalk on Pitch: 15.8:1 · Chalk-300 on Pitch: 10.6:1 · Chalk-400 on any surface: ≥ 5.4:1 (AA)
- Pitch on Floodlight (primary button): 13.6:1
- Danger text: use it on pitch-900 / 850 / 800 only (≥ 4.8:1), not on pitch-750
- Chalk-500 (4.9:1 on Pitch, 3.5:1 on pitch-750) is reserved for disabled and placeholder text
- Don't use Floodlight as text on Chalk (1.2:1). Use floodlight-800 (5.9:1) or Pitch.

### Light contexts
The product is dark-first. For light surfaces (docs, print, partner decks), use a Chalk background with Pitch text and the on-light logo. Floodlight on light backgrounds works only as a fill with Pitch text on top.

## 3. Typography

**Inter Display + Inter**, one superfamily with two optical sizes. Both are free under the SIL Open Font License, including commercial use, and both load from Google Fonts in a single request (`Inter`, opsz 14–32).

| Role | Face | Why |
|---|---|---|
| Display (grotesk) | Inter Display Bold, optical size 32 | Matches the wordmark's DNA. Tight and confident at large sizes. |
| Text (neo-grotesk) | Inter Regular / Medium / Semibold | Very readable on screens, with a large x-height |
| Numbers | Inter with tabular figures (`tnum`) | Attribute columns line up |
| Share codes | JetBrains Mono Medium (OFL) | Unambiguous characters (0/O, 1/l) |

I considered alternatives: General Sans and Satoshi (Fontshare licence, not OFL), and Archivo, which tested close to the reference but loses character. Inter wins because it is open, it is already the wordmark's base, and it has optical sizes and tabular figures built in.

### Type scale

| Token | Size / line height | Tracking | Weight | Use |
|---|---|---|---|---|
| display-2xl | 72 / 1.0 | −3.5% | 700 Display | Hero |
| display-xl | 56 / 1.04 | −3% | 700 Display | Page titles |
| display-lg | 44 / 1.08 | −2.5% | 700 Display | Section titles |
| heading-1 | 34 / 1.15 | −2% | 700 Display | |
| heading-2 | 26 / 1.2 | −1.5% | 700 Display | |
| heading-3 | 20 / 1.3 | −1% | 600 Text | Card and panel titles |
| heading-4 | 17 / 1.35 | −0.5% | 600 Text | |
| body-lg | 18 / 1.55 | 0 | 400 | Intros |
| body | 16 / 1.5 | 0 | 400 | Default |
| body-sm | 14 / 1.45 | 0 | 400 | Dense UI |
| caption | 12 / 1.4 | +0.5% | 400 | Meta |
| label | 14 / 1.2 | 0 | 500 | Buttons, inputs, tabs |
| overline | 11 / 1.2 | +14%, uppercase | 600 | Section kickers |
| stat-xl | 48 / 1.0, tnum | −3% | 700 Display | OVR, hero numbers |
| stat-lg | 28 / 1.0, tnum | −2% | 700 Display | Card numbers |
| stat | 15 / 1.0, tnum | 0 | 600 | Attribute values |

Rules: sentence case everywhere except overlines and tags. Headlines are short and end with a full stop when they make a statement ("Build Smarter."). Display sizes step down with `clamp()` on small screens.

## 4. Graphic language

| Motif | What it is | Use |
|---|---|---|
| **The grid** | A 48 px hairline grid (Chalk at 6%) with crosshairs and dots at major intersections | Heroes, empty states, image placeholders. `graphics/patterns/` |
| **Pitch markings** | Accurate pitch lines (105 × 68 m) in Chalk at 35%, 0.3 m stroke, with Chalk formation dots | Formations, positions, landing heroes. `graphics/pitch/` |
| **The cut** | The 15° slant from the symbol | Position tags, step numbers, chip markers, the average marker on distribution bars. `graphics/motifs/slanted-tile.svg` |
| **The tile crop** | Imagery masked by the four symbol tiles | Campaign images and feature heroes. `graphics/motifs/symbol-tiles-mask.svg` + `.ps-tile-crop` |

Rules: use one or two motifs per layout. Motif lines are always hairline and low-opacity. Never rotate the slant or add a second angle. No gradients, glows, bevels, lens flares or particle effects.

### Imagery
- **Photography:** close, tactile and real: turf texture, chalk lines, the goal net, kit fabric, boots on grass, stadium light at dusk. Grade it to the palette: deep greens, lifted blacks towards Pitch, highlights towards Chalk. Avoid identifiable real players and club badges. No EA or FC imagery.
- **In-game captures** (faces, builds): show them unfiltered inside a `ps-media` frame with a 20 px radius and a 1 px border, so players can trust they match the game.
- **Illustration:** flat geometric shapes built from the slant and the tiles, in Turf and Pitch with one Floodlight accent. No mascots or 3D renders.

### Iconography
24 px grid, 1.75 px stroke, round caps and joins, no fills, 2 px corner radius. A custom set covers Pitchside concepts (`icons/`: build, archetype, face, compare, meta, pitch and others). The face icon carries the symbol's cut. For everything else use **Lucide** (ISC licence), which matches this stroke. Icons take the colour of the text next to them.

## 5. Voice (short)
Clear, confident, player to player. Talk like a teammate who knows the numbers: "Built for clean first-time contact," not "Unleash your ultimate potential!" Use numbers when they help. No hype words, no exclamation marks in the product.

## 6. Independence
Pitchside is independent. Don't use EA, EA SPORTS FC or club logos, fonts or colours, or official card art. When a page needs it, include the line "Not affiliated with EA."
