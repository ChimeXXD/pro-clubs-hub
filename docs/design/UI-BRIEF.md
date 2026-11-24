# UI brief

How each screen looks and behaves. **Draft, 19 Nov 2026.** §4–6 (screens, copy, states, test IDs) are ready to design from. §1–3 are filled after Chime picks a direction (Phase 1). Then the Figma Design System and Design screens pages are the source of truth (D-14) and this file only records what Figma can't (copy, states, test IDs). The name is ProBuilds (D-50). Copy marked *new* can change at screen review.

## 1. Direction (Phase 1)

To be written from Chime's pick. Constraints any direction must meet:

1. **Faces lead.** The home page opens on faces; builds follow.
2. **The value is the hero.** On a face step or a build card, the number or notch is the biggest thing.
3. **Readable at arm's length.** A phone propped next to a TV, glanced at between controller moves.
4. **No faces of real people** (D-10). Personality comes from type, colour, era badges and Chime's own in-game screenshots.
5. **No EA look.** No game chrome, card-art frames or rarity colours.
6. **Version tag and credit line always visible** on cards (DESIGN.md).
7. **Light and dark.** Dark likely default (dim room, TV). Decide in Phase 1.
8. **Fast.** Static, small, no blocking web fonts. Within the Day 0 budget.

## 2. Tokens (Figma variables, mirrored in `src/styles/tokens.css`)

- Colour roles: `--bg`, `--surface`, `--raised`, `--text`, `--text-muted`, `--accent`, `--accent-ink`, `--done`, `--warning`, `--focus`, hover fills per DESIGN.md. Light and dark. All text pairs pass WCAG AA.
- Type: one display face with tabular figures for values; one text face. Free fonts only.
- Spacing 4 · 8 · 12 · 16 · 24 · 32 · 48. Radius from Figma.
- Motion: `--dur-fast`, `--dur-base`, `--dur-page` (300 ms), `--ease-out`. Zero under reduced motion.

## 3. Motion (Phase 1, then the motion pass)

- Tick: check draws in, row dims slightly.
- Tabs (Skin, Head, Face, Hair): highlight springs between tabs.
- Page change: 40 px slide (DESIGN.md).
- Finishing a face: one small moment, then the paired build slides up.

## 4. Screens

| Screen | Must show |
| --- | --- |
| Home | Current season chip ("FC 27 · Season 2"); faces rail (era badge, kind, "Inspired by" name); builds by position; latest changelog line |
| Faces | Filter chips (All, Footballers, Musicians, eras); search; grid of FaceCards |
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
| Face title | "Inspired by <name>, <era>" |
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
