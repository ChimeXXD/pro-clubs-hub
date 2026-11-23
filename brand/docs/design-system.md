# Pitchside UI design system

Implementation: `tokens/tokens.css` (generated from `tokens/tokens.json`) and `css/pitchside.css`. You can see every component with its states in `examples/components.html`. All class names are prefixed `ps-`. Tokens are `--ps-*`.

## 1. Foundations

### Spacing (4 px base)
`0 · 2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128` → `--ps-space-{0, 0-5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32}`
- Inside components: 4 to 16. Between components: 16 to 24. Between sections: 64 to 96 (desktop), 48 to 64 (mobile).

### Radius
| Token | Value | Use |
|---|---|---|
| xs | 4 | Badges, keyboard hints |
| sm | 6 | Nav links, focus ring on small targets |
| md | 10 | Inputs, selects, thumbnails |
| lg | 14 | Cards |
| xl | 20 | Modals, media frames, empty states |
| 2xl | 28 | Marketing panels |
| pill | 999 | Buttons, chips, segmented controls |

Tags and step numbers have **no radius**: they use the 15° cut.

### Borders
- Hairline 1 px, `rgba(246,246,238,.10)`: card and section dividers.
- Strong 1 px, `rgba(246,246,238,.20)`: inputs, secondary buttons, chips.
- Focus: 2 px Floodlight ring with a 2 px Pitch gap (`--ps-shadow-focus`), on every focusable element.

### Shadows
Dark UI separates layers with **surface steps and borders**, not shadows. Shadows are only for elements that float.
| Token | Value | Use |
|---|---|---|
| sm | `0 1px 2px rgba(0,0,0,.35)` | Small floating controls |
| md | `0 8px 24px -8px rgba(0,0,0,.55)` | Popovers, menus |
| lg | `0 24px 56px -16px rgba(0,0,0,.65)` | Modals, sheets |
| inset | `inset 0 1px 0 rgba(246,246,238,.06)` | Selected segment |

### Elevation (surfaces)
`bg-sunken #07120D` → `bg #0D1F17` → `surface #11271D` (cards) → `surface-raised #163023` (hover, inputs) → `surface-strong #1B3A2A` (pressed, modals).

### Typography
See `brand-guidelines.md §3`. CSS classes: `.ps-display-2xl/xl/lg`, `.ps-h1` to `.ps-h4`, `.ps-body-lg/body/body-sm`, `.ps-caption`, `.ps-overline`, `.ps-stat-xl/lg`, `.ps-num` (tabular figures), `.ps-mono`.

### Motion
Fast 120 ms (hover, press), base 200 ms (cards, tabs), slow 320 ms (modals). Easing `cubic-bezier(.2,0,0,1)`. Entrances slide along the 15° axis by 8 px or less. All motion is off under `prefers-reduced-motion`.

### Layout and responsiveness
- Container max 1240 px, gutter 24 px (16 px under 768 px).
- Breakpoints: sm 480 · md 768 · lg 1024 · xl 1280.
- Card grid: `repeat(auto-fill, minmax(300px, 1fr))`, which gives 3 columns at desktop, 2 on tablet and 1 on phones without media queries.
- Navigation: top bar (64 px) on md and up. On phones, a top bar with the logo plus a bottom tab bar (Home, Builds, Archetypes, Faces, Saved).
- Face guide: two columns (sticky preview + steps) above 900 px. Stacked below.
- Touch targets ≥ 44 px (sm buttons are 34 px and only for dense desktop rows).

## 2. Component colour rules
1. **Floodlight is for the one primary action per view** (or the active indicator). It is never a large surface.
2. Secondary actions are outlined in Chalk. Tertiary actions are ghost.
3. **Selected** = Turf fill (chips, tags) or a Floodlight indicator line (tabs, nav).
4. Text on Floodlight and Chalk fills is always Pitch.
5. Attribute colour follows the rating band. The number is always shown next to it.
6. Disabled = surface-raised fill with chalk-500 text. Never just reduced opacity on text people need to read.
7. Errors use danger for the border and message. Never colour the whole field red.

## 3. Components

### Navigation (`.ps-nav`)
64 px sticky bar on Pitch with a hairline bottom border. Logo (22 px tall), links (14 px medium, chalk-300). Links turn Chalk on hover with a surface background. **Active:** Chalk text plus a 2 px Floodlight bar aligned to the nav's bottom border. Actions on the right: search (ghost icon), "New build" (primary sm), avatar 32 px.
Mobile: `.ps-tabbar`, 5 items, 22 px icons with 11 px labels. Active is Floodlight.

### Buttons (`.ps-btn`)
| Variant | Default | Hover | Pressed | Disabled |
|---|---|---|---|---|
| primary | Floodlight / Pitch text | floodlight-300 | floodlight-500, 1 px down | surface-raised / chalk-500 |
| secondary | transparent, strong border | surface fill, brighter border | surface-raised | hairline border, chalk-500 |
| ghost | transparent, chalk-300 | surface fill, Chalk | surface-raised | chalk-500 |
| chalk | Chalk / Pitch text | chalk-200 | 1 px down | as primary |
Sizes: sm 34 · md 44 · lg 52 px tall. Pill radius. 15 px semibold. 18 px icons with an 8 px gap. Trailing arrow on forward actions ("Start building →").

### Inputs (`.ps-input`, `.ps-select`, `.ps-search`)
44 px, md radius, surface fill, strong border. Hover brightens the border. **Focus:** Floodlight border plus a 3 px Floodlight ring at 12%. **Error:** danger border plus a 12 px message below. **Disabled:** sunken fill, hairline border. Labels are 13 px medium chalk-300. Hints are 12 px chalk-400. Search has an 18 px leading icon and a `/` shortcut hint.

### Tabs and filters
- **Tabs (`.ps-tab`):** 15 px medium. Inactive chalk-400, hover chalk-300. Selected is Chalk with a 2 px Floodlight underline sitting on the hairline. Counts are inline in chalk-400.
- **Segmented (`.ps-segmented`):** pill track on surface. The selected segment is surface-strong with an inset highlight. Use it for mutually exclusive views (position group, Attributes/Playstyles/Face).
- **Chips (`.ps-chip`):** 34 px pill with a strong border. Selected is a Turf fill with a small 15° Floodlight marker, and uses `aria-pressed`.

### Cards (`.ps-card`)
Surface fill, hairline border, lg radius. Interactive cards brighten the border and step up to surface-raised on hover. They don't lift or scale.

**Build card (`.ps-build-card`)**
- Head: position tag (Turf, 15° cut) plus an optional Meta badge. Title in 19 px Display Bold. Meta line: archetype · height · weight. OVR on the right (stat-lg with an "OVR" overline).
- Body: 4 key attributes in a 2-column grid (label, value, 4 px bar).
- Foot: hairline top border, likes on the left, save and share ghost icon buttons on the right.

**Archetype card (`.ps-archetype-card`)**
Overline, 22 px name, a two-line description, and a six-category bar chart (PAC/SHO/PAS/DRI/DEF/PHY) with the defining categories in Floodlight. A Turf 15° tile bleeds off the top-right corner.

### Player attribute displays
- **Attribute row (`.ps-attr`):** label (13 px chalk-300), value (15 px semibold tnum, rating colour), 4 px bar (6 px in `--lg`) on an 8% Chalk track. Set `--v` to the value. Add `r-elite`, `r-great`, `r-good`, `r-average` or `r-low`.
- **Attribute group (`.ps-attr-group`):** category title plus the average (stat-lg in the rating colour), then rows.
- **Distribution (`.ps-dist`):** for archetypes. The range across builds is a Floodlight band at 22%, and the average is a 15° Floodlight marker, with the value on the right.

### Face guide layout (`.ps-face`)
- **Left:** sticky 4:5 preview frame (xl radius) with a grid backdrop for missing images, 4 angle thumbnails (the active one has a Floodlight border) and a caption explaining the slider scale.
- **Right:** numbered steps (`.ps-face-step`). The number sits in a 15° cut tile, which turns Floodlight when the step is done. Each step has a title and preset, then slider values in 2 columns: label, value, and a 4 px track with a centre tick for the in-game default and a Chalk knob at the value.
- **Mobile:** a one-step-per-screen flow with a 5-segment progress bar and Previous/Next buttons.

### Modals and overlays (`.ps-overlay`, `.ps-modal`)
Night overlay at 72%. The modal is 520 px max, surface-strong, with a strong border, xl radius and the lg shadow. It has a head (title + close), a body and a foot (actions right-aligned, primary last). Focus is trapped inside, Esc closes, and focus returns to the trigger. Share codes sit in `.ps-share-code` (sunken fill, dashed border, mono).

### Empty states (`.ps-empty`)
Dashed strong border, xl radius, grid background. A 64 px icon tile, a 20 px title, one line of help (chalk-400) and a single primary action. Write empty-state copy as an invitation, not an error.

### Tags and badges
- `.ps-tag`: 24 px high, 12 px bold caps, 15° cut. Turf by default, with `--accent`, `--chalk` and `--ghost` variants. Use it for positions, archetype families and media labels.
- `.ps-badge`: 22 px, xs radius. `--meta` (Floodlight at 12%) and `--new` (info).

### States summary
Hover brightens: border +10% Chalk, or one surface step up. Pressed goes one more step, or moves the button 1 px down. Focus is always the Floodlight ring. Selected uses Turf or the Floodlight indicator. Disabled uses chalk-500 text with no hover.

## 4. Accessibility checklist
- Text contrast ≥ 4.5:1 (all text tokens except chalk-500 pass on every surface).
- Visible focus on everything interactive (`:focus-visible`).
- Rating colour always comes with its number.
- Icon-only buttons have `aria-label`. Tabs use `role="tab"` plus `aria-selected`. Toggles use `aria-pressed`.
- `prefers-reduced-motion` is respected.
