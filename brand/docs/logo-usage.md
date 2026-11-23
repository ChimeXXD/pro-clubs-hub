# Pitchside logo usage

## The system

| Asset | File | Use |
|---|---|---|
| **Horizontal logo (primary)** | `logo/horizontal/pitchside-logo-horizontal-*.svg` | Default everywhere: site header, documents, social banners |
| Stacked logo | `logo/stacked/pitchside-logo-stacked-*.svg` | Square or narrow spaces: splash screens, posters, merch |
| Symbol | `logo/symbol/pitchside-symbol-*.svg` | Once the brand is established on screen: app icon, avatar, mobile nav, watermarks |
| Small symbol | `logo/symbol/pitchside-symbol-small-*.svg` | Anything rendered at 32 px tall or less (wider cuts stay open) |
| Wordmark | `logo/wordmark/pitchside-wordmark-*.svg` | Rare. Only where the symbol already appears nearby. |
| App icon | `app-icon/` | iOS, Android adaptive, PWA maskable, store listings |
| Favicon | `favicon/` | Browser tabs, bookmarks, home-screen shortcuts |

`logo/pitchside-logo-primary.svg`, `logo/pitchside-symbol.svg` and `logo/pitchside-wordmark.svg` are the approved masters (Chalk fill).

## Colourways

| Suffix | Fill | Use on |
|---|---|---|
| `-on-dark` | Chalk `#F6F6EE` | Pitch, Turf, Night, dark photography |
| `-on-light` | Pitch `#0D1F17` | Chalk, white, Floodlight, Grass. The logo for light mode. |
| `-mono-black` | Night `#0A0A0A` | Single-colour print, stamps, embossing |
| `-mono-white` | `#FFFFFF` | Over photography, partner placements |

The logo is never Floodlight, and never two colours (for example a lime symbol with a chalk wordmark).

## Clear space
- **Lockups:** X = ½ of the symbol height, on all four sides.
- **Symbol alone:** X = ¼ of the symbol height.
- Nothing (text, edges, other logos) enters the clear space. Screen edges count.

## Minimum sizes

| Asset | Digital | Print |
|---|---|---|
| Horizontal | 96 px wide | 25 mm wide |
| Stacked | 64 px wide | 18 mm wide |
| Symbol | 16 px tall (use the small version at 32 px and below) | 5 mm tall |

## Backgrounds
- **Preferred:** Pitch, Chalk.
- **Allowed:** Turf, Night, Floodlight (on-light logo, sparingly), calm and dark photography.
- **Not allowed:** busy or high-detail images, mid-tones that drop contrast below 4.5:1, gradients behind the logo.

## Don't
1. Stretch, squash or skew the logo.
2. Rotate it, or change the slant of the symbol.
3. Mirror the symbol.
4. Recolour it outside the four colourways, or use low-contrast pairs (for example Floodlight on Chalk).
5. Add strokes, glows, shadows, bevels or gradients.
6. Retype the wordmark in any font. Always use the outlined files.
7. Rearrange the lockup (symbol on the right, symbol above the horizontal version, different spacing).
8. Fill the four tiles with different colours, or close the cuts.
9. Put the logo in a container shape (circle, badge) except for the approved app icon.
10. Animate the tiles apart in a way that breaks the P. Motion should be one quick slide along the 15° axis.

## Trademark
The files carry no ™. Add it (top right of the wordmark, at 22% of cap height) only once you're claiming the mark.

## App icon
- **Background:** pitch-750 `#1B3A2A`. **Symbol:** Chalk, at 54% of the icon width, nudged 2% left of centre to balance the bowl.
- `app-icon-ios-1024.svg` / `.png`: full-bleed square. iOS applies its own mask, so don't add rounded corners.
- `android-adaptive-foreground.svg` + `android-adaptive-background.svg`: symbol inside the 66 dp safe zone.
- `app-icon-maskable-512.svg` / `icon-512-maskable.png`: PWA maskable (symbol within the 80% safe zone).
- `app-icon-showcase-lime-edge.svg`: marketing presentations only (as on the reference board). Never submit it to a store.

## Favicon
```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#0D1F17">
```
`favicon-16.png` is drawn from a dedicated source with extra-wide cuts (`favicon-16-source.svg`) so the four tiles survive at 16 px.
