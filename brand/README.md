# Pitchside brand

Brand identity and design system for **Pitchside**, the companion platform for Pro Clubs players. Direction: **"The Grid"**.

> **Sample values only.** The builds, attributes, slider values and counts in `examples/` and `social/` are made up to show the layout. They are not game data and must never be copied into `content/` (CLAUDE.md: no invented values).
>
> **Not wired into the app yet.** `src/styles/tokens.css` and the Figma files are unchanged. Adopting these tokens there is a separate step.

Open `examples/index.html` in a browser to see the identity working in the product. `examples/brand.html` is the visual guidelines page, and `examples/components.html` shows every UI component with its states.

## Folder structure

```
logo/
  pitchside-logo-primary.svg        Approved master: horizontal logo, Chalk
  pitchside-symbol.svg              Approved master: symbol, Chalk
  pitchside-wordmark.svg            Approved master: wordmark, Chalk
  horizontal/   stacked/   symbol/   wordmark/
                                    Each in on-dark, on-light, mono-black, mono-white
                                    symbol/ also has -small-* versions for 32 px and below
app-icon/                           iOS 1024, rounded, maskable PWA, Android adaptive layers, PNG exports
favicon/                            favicon.svg/.ico, 16/32/48 PNGs, apple-touch-icon, site.webmanifest, 192/512 icons
graphics/
  patterns/                         Grid hairlines and grid with crosshairs (tileable)
  pitch/                            Pitch markings: horizontal, vertical, 4-3-3 formation
  motifs/                           Cut cross, slanted tile, symbol-tile mask (for image crops)
icons/                              14 custom 24 px stroke icons + sprite.svg
tokens/
  tokens.json                       Design tokens (W3C design-tokens format). The source of truth.
  tokens.css                        CSS custom properties (--ps-*), generated
css/pitchside.css                   Base styles, typography classes and every component
examples/                           HTML product applications (sample content)
  index.html                        Website header + homepage
  builds.html                       Build discovery
  archetype.html                    Archetype page
  face-guide.html                   Custom face guide
  mobile.html                       Mobile screens (390 × 844)
  components.html                   Component reference with states
  brand.html                        Visual brand guidelines
social/                             OG image, build share card, story, X header, avatar (SVG + PNG)
docs/
  brand-guidelines.md               Colour, typography, graphic language, imagery, icons, voice
  logo-usage.md                     Logo system, clear space, minimum sizes, misuse, app icon, favicon
  design-system.md                  UI foundations, component specs and states, accessibility
  logo-construction.md              Reference analysis and the logo's geometry
previews/                           PNG renders for review (not production assets)
scripts/                            Generators for everything above
archive/                            Stage 2 logo options (not for use)
```

## Using it in the product

```html
<link rel="stylesheet" href="tokens/tokens.css">
<link rel="stylesheet" href="css/pitchside.css">
```

```html
<a class="ps-btn ps-btn--primary" href="/builds">Start building</a>
<div class="ps-attr r-elite"><span class="ps-attr__label">Finishing</span><span class="ps-attr__value">94</span><span class="ps-attr__bar"><i style="--v:94"></i></span></div>
```

**React / Tailwind / other stacks:** read the values from `tokens/tokens.json`. Aliases such as `{color.pitch.900}` follow the W3C token format, which Style Dictionary or Tokens Studio can transform into a Tailwind config, TypeScript or native platforms.

Rating band helper:
```js
const rating = v => v >= 90 ? 'elite' : v >= 80 ? 'great' : v >= 70 ? 'good' : v >= 60 ? 'average' : 'low';
```

### Fonts
Inter (with optical sizes) and JetBrains Mono, both under the SIL Open Font License. `css/pitchside.css` imports them from Google Fonts. To self-host, download Inter from rsms.me/inter and remove the `@import`.

### Logos
- Use the SVGs directly (`<img src="logo/horizontal/pitchside-logo-horizontal-on-dark.svg" alt="Pitchside">`) or inline them.
- They're pure vector paths with transparent backgrounds and tight viewBoxes, and need no font.
- Each symbol tile is a named `<path>` (`tile-top-left`, `tile-top-right`, `tile-stem`, `tile-bottom-right`) for animation.

## Rebuilding
```bash
pip install fonttools pillow       # plus rsvg-convert (librsvg) for PNG exports
python3 scripts/build_system.py    # logos, app icons, favicons
python3 scripts/build_tokens.py    # tokens.json + tokens.css
python3 scripts/build_examples.py  # example pages
python3 scripts/build_social.py    # social graphics
```
The logo geometry lives in `scripts/geometry.py` and `scripts/wordmark.py`. Change numbers there and rebuild. Don't hand-edit the generated SVGs.

## Licences
- The wordmark is built from Inter Bold by Rasmus Andersson (SIL OFL 1.1), outlined and modified (rounded-square i-dots, custom spacing).
- Pitchside is independent and not affiliated with EA. The examples use sample data.
