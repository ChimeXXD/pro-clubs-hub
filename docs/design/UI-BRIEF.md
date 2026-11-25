# UI brief

How each screen looks and behaves. **§1–3 written 25 Nov 2026 from the approved design.** The Figma Design System and Design screens pages are the source of truth (D-14): https://www.figma.com/design/hyFx4Audhn4F9KxL9bRCLD ("Design System" page for tokens, styles and components; "Design screens" page, one section per phase, phone 390, tablet 834 and desktop 1440). This file records what Figma can't (how tokens reach code, copy, states, test IDs). The name is ProBuilds (D-50). Copy marked *new* can change at screen review.

## 1. Direction

The look Chime approved, phase by phase, on 24–25 Nov:

- **A FUT.GG-style hub led by faces** (DESIGN.md §Direction): dense grids of face cards first, then builds; one accent; small badges.
- **Colours from the logo** (D-46): deep green pages and surfaces, cream text, lime accent; cream pages in light mode (D-37). The site follows the device's light or dark setting and a switch overrides it.
- **Type** (D-92, DESIGN.md §Type): Barlow Condensed ExtraBold for headings and numbers (H1 and H2 in capitals), Barlow for text, both free. One style per role on every screen: page title H1, selected item's name H2, section heading H3, card or row title H4; Display only inside card art. Values use the Number styles with tabular figures.
- **Frame:** cream-pill toast and lime-tab bottom nav (D-94); the mannequin is every build's default face (D-98); the notice on every page.

Constraints that still hold for every screen:

1. **Faces lead.** The home page opens on faces; builds follow.
2. **The value is the hero.** On a face step or a build card, the number or notch is the biggest thing.
3. **Readable at arm's length.** A phone propped next to a TV, glanced at between controller moves.
4. **No faces of real people** (D-10). Personality comes from type, colour, era badges and Chime's own in-game screenshots.
5. **No EA look.** No game chrome, card-art frames or rarity colours.
6. **Version tag and credit line always visible** on cards (DESIGN.md).
7. **Fast.** Static, small, fonts self-hosted through `next/font` (no request to Google from the browser, no blocking). Within the page-weight budget.

## 2. Tokens (Figma variables → `src/styles/tokens.css`)

- **How they reach code:** `docs/design/figma-variables.json` is a snapshot of the Figma variables, text styles and effect styles (read 25 Nov). `npm run tokens` (`scripts/build-tokens.mjs`) writes `tokens.css` from it; never edit `tokens.css` by hand. `tests/unit/tokens.test.ts` fails if the two differ, if a value is missing, or if a text colour drops under WCAG AA on its background. When the design system changes in Figma: re-export the snapshot, run `npm run tokens`, commit both.
- **Names in code** (Tailwind 4 classes; Tailwind's own palette, text sizes, radii and shadows are switched off):
  - Colour · Theme: `bg/page` → `--color-bg-page` → `bg-bg-page`; `text/primary` → `text-text-primary`; `accent/fill` → `bg-accent-fill`. Each holds `light-dark(light, dark)`.
  - Spacing: Tailwind's numeric steps are 4 px each and match Figma's scale (`spacing/xs` 16 = `p-4`, `spacing/md` 24 = `gap-6`); Figma's names are also variables, `p-(--space-md)`. They stay out of Tailwind's spacing namespace, where `md` would also change `max-w-md`.
  - Layout: `--layout-page-gutter`, `--layout-section-gap`, `--layout-card-padding`, `--layout-card-gap`, `--layout-content-max`, `--layout-touch-target`; use as `p-(--layout-page-gutter)`.
  - Radius `rounded-xs` … `rounded-full`; elevation `shadow-elevation-1` to `-3`. `--layout-touch-target` is 40 px only on desktop with a mouse; any touch screen keeps 44 px.
  - Text styles: one class each, `type-display`, `type-h1` … `type-h4`, `type-body-lg`, `type-body`, `type-label`, `type-caption`, `type-number-xl`, `-lg`, `-md`, `type-button-lg`, `-md`, `-sm`.
- **Breakpoints** (D-101): phone values by default; tablet values from 744 px (`tablet:`); desktop values from 1280 px (`desktop:`). Figma draws them at 390, 834 and 1440.
- **Checked 25 Nov:** every text colour passes AA (4.5:1) on page, surface and raised in both modes, and the focus ring passes 3:1. Open (O-20): resting input borders are under the 3:1 WCAG asks for a field's edge. Light mode's lime fill is 1.03:1 on the page, which is why selected states get a dark ring there (D-37).
- **Undecided (O-21):** DESIGN.md's grey hover fills (`--hover-fill`, surface + 2 % of the text colour) aren't in Figma, which has `action/hovered` at 4 %. No hover is built until Chime picks one.
- **Overlays and muted text:** `text/muted` drops under AA on a selected or accent-hovered row in dark mode (3.6–4.2:1, measured 25 Nov). Keep muted text off selected rows, or add the combined pair to `tests/unit/tokens.test.ts` before using it.
- **Not in Figma yet:** motion (§3).

## 3. Motion

No motion values are in Figma. DESIGN.md sets page and tab changes at `--dur-page` (300 ms) with an ease-out, selected and pressed states fading over `--dur-fast`, and no motion on key presses. Under reduced motion the page slide is off (DESIGN.md); other motion gets gentler (a short fade instead of a move), not removed. The other durations and the curve are set in the motion pass with the motion skills, and added to the snapshot so they are generated like the rest.

- Tick: check draws in, row dims slightly.
- Tabs (Skin, Head, Face, Hair): highlight springs between tabs.
- Page change: 40 px slide (DESIGN.md).
- Finishing a face: one small moment, then the paired build slides up.

## 4. Screens

| Screen | Must show |
| --- | --- |
| Home | Current season chip ("FC 27 · Season 2"); faces rail (picture, name, kind; D-69); builds by position; latest changelog line |
| Faces | Filter chips (All, Footballers, Athletes, Musicians; D-68); search; FaceCards (layout: Chime's pick of the three options) |
| Face | Title, era, version tag, credit line; limits callout; Start; tabs; StepRows with ValueChips; progress; paired BuildCard; tutorial embed facade; Chime's screenshots |
| Builds | Position chips; archetype filter; BuildCards |
| Build | Archetype, positions, height, weight, AcceleRATE, attribute list, PlayStyles (Signature, Plus, Regular), specialization, skill moves, weak foot, version tag, credits, history |
| Archetypes | Four groups (Goalkeepers, Defenders, Midfielders, Attackers), 13 tiles |
| Archetype | Signature PlayStyles (launch, Season 2), mastery attributes, Season 2 cost change, builds, sources |
| Changelog | Entries newest first: date, kind, title, changes, EA source link, "What we updated" |
| Submit | Choose face or build; tabbed form; inline validation; Submit for review; Copy JSON |
| About | What it is, how content is made, sourcing rules, credits, featured creators, notice |
| Takedown | How to ask; 72 hours; email |
| 404 | Back to faces and builds |

## 5. Copy and states

| Where | Copy |
| --- | --- |
| Version tag, verified | "FC 27 · Season 2 · verified 19 Nov 2026" |
| Version tag, not checked | "FC 27 · Season 2 · not yet checked in game" |
| Older season | "Made for Season 2. Values may have changed since." |
| Credit line | "Made by Chime in game" or "Made by Sharon in game" (D-29) · "Tutorial by <creator>" · "Submitted by <name>" |
| Face title | The plain name, era or look included: "2008 Ronaldo", "Neymar Jr (Mohawk)" (D-69) |
| Limits | "The game can't do this exactly: <limit>" *new* |
| Ticks reset | "This face was updated. Your ticks start fresh." *new* |
| Continue | "Continue from step <n>" |
| Embed facade | "<title> · <channel> · Tap to play" |
| Submit done | "Opened on GitHub. Chime reviews every submission before it goes live." *new* |
| Notice (every page) | "Not endorsed by or affiliated with EA or its licensors. Not endorsed by the people named." |
| Empty faces filter | "No faces here yet. Suggest one on Submit." *new* |

## 6. Test IDs

`home-faces`, `home-builds`, `season-chip`, `face-card`, `build-card`, `version-tag`, `credit-line`, `step-row`, `step-tick`, `value-chip`, `face-progress`, `paired-build`, `embed-facade`, `limits-callout`, `filter-chip`, `search-input`, `archetype-tile`, `changelog-entry`, `submit-kind`, `submit-issue`, `submit-copy`, `site-notice`.

Repeated items add a suffix, so IDs stay unique on a page (mockup v1, 20 Nov): `face-card-1`, `step-row-9`, `step-tick-9`, `value-chip-9`, `filter-chip-2`, `build-card-3`, `changelog-entry-1`. A tag or credit inside a card says which card: `version-tag-face-1`, `credit-line-build-2`, `version-tag-paired`. Tests match these by prefix (`[data-testid^="face-card-"]`). The full list per screen is in `mockup/interactions.json` and the mockup's DOM.
