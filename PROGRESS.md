# Progress

Newest first. Each entry: what changed, what was checked, what wasn't verified, what's next.

## Level switch and specialization on the sample build (Sun 22 Nov 2026, evening)

**Changed**
- D-43 in `mockup/builds-v2/`: the Meta Finisher page has a "Your level" switch (slider 1–55, −/+ steppers, a typed box), sticky under the header so it stays reachable while the attributes scroll (one 140 px bar on phone; the raw-values note sits just below it so only the controls stick). It spends the level's AP in the build's stored spend order, point by point, and stops at the first point the AP can't buy. Rows show the value at that level, solid, over the level-55 target as a ghost bar ("84 / 91"); the six summary stats (group averages, our simplification) update too. "Not affordable yet" lists the next three steps with the AP each still needs. The specialization panel shows Finisher+ (Chip Shot+), its three targets, its status at the chosen level and the level it's reached from. New `level.js` holds the maths and the live update; `index.html` is interactive.
- AP per level is §10.1's table (reproduces every row total). Prices and starting values are flat made-up samples, labelled "Sample prices and starting values · not yet checked in game". Which Finisher+ target is the 92 one isn't recorded, so the sample counts all three at 92.
- Motion: the gestures skill set the slider rules (1:1 tracking with no transition while dragging, 44 px hit area, `touch-action: pan-y`); only a stepper press eases the bars (150 ms ease-out, none under reduced motion).
- Figma (59:2): build screens replaced at level 55 (phone 89:2, desktop 91:2) and a level-32 state added beside them (phone 90:2, desktop 92:2); both sheets grew to fit.

**Checked**
- Live in `index.html` at 390×844 (touch): drag lands on the level under the finger with no transition, steppers ease 150 ms (0 under reduced motion), typed 0 → 1 and 99 → 55, the bar stays at top 0 while scrolling, every control is at least 44 px, no errors. At 32: 724 AP, 719 spent, 5 left; Reactions 86 → 90 needs 31 AP more; specialization not reached (Ball Control 85, Composure 90, Reactions 86 of 92), reached from 50.
- Contrast on every new text pair is 6.34:1 or more; slider thumb and fill at least 6.17:1. Code review (medium, fix): 9 findings, 7 fixed (quieter live regions, native thumb sized to the drawn one, per-build work cached, unknown attribute throws, card level, shared stat grid, range text from MIN/MAX).

**Not verified**
- On Chime's iPhone. Every price, starting value and star price is a sample; the specialization's "reached from" level depends on them.

## Faces on every build (Sun 22 Nov 2026, late afternoon)

**Changed**
- Chime loved the new Builds style but found it flat without pictures; D-41: every build shows a face. In `mockup/builds-v2/`: each Finisher card has a portrait beside its stats (Meta, Tall and Quick Finisher each a different face), a fourth card "2008 Ronaldo-inspired (sample)" with "Inspired by" wording and a dimmed slot tagged "Stand-in · in-game recreation goes here", and the sample build's hero has a large face on a cut-corner panel that overlaps the card panel, after FUT.GG's detail page. The picker keeps emblems only: three stand-in faces can't cover 13 tiles without repeating, and the 393 tiles are already full.
- Stand-in faces are crops of the three avatars in EA's Clubs Grounds screenshot (no other screenshot had a usable face), written to git-ignored `reference/assets/faces-standin/` and loaded like the icons. Each is tagged "Stand-in face"; the footer says what they are and that Chime's and Sharon's in-game faces replace them. Crops stop above club, sponsor and kit logos.
- Figma page "Builds · new style (Old Gold)" (59:2) recaptured: phone sheet 74:2, desktop sheet 75:2.
- Chime then chose an empty slot for player-named builds: the "2008 Ronaldo-inspired" card now shows only the Finisher emblem and "Face coming soon" in its portrait box, no avatar or silhouette (D-10); the grey stand-in crop was deleted. Finisher screens recaptured in place (phone 78:2, desktop 79:2). Code review (medium, fix): 5 findings, 3 fixed (decorative emblem hidden from screen readers, archetype passed explicitly, no face file now means a slot); D-41 still describes the dimmed stand-in and needs a superseding entry.

**Checked**
- 393 and 1440: no overflow, every face, emblem and icon loads, no page errors; tag text on its dark pill stays above 9:1 even over a white patch of photo.
- `index.html` clicked through live in a browser: picker (13 tiles) → Spark (its own page, 0 builds) → back → Finisher (4 builds, 4 tagged faces) → Meta Finisher; an unknown slug falls back to the picker; no errors or warnings.
- Code review (medium, fix): 8 findings, 3 fixed by the review (per-card test IDs, escaped "inspired by" name, a dead rule), 3 more by hand (the slot comment now says what it shows, no shadow on the cut-corner face, the stat grid is `statgrid` not `face`).
- Figma read-back: screen heights equal the browser, no overflow, 4 faces on the Finisher screen and 1 on the build screen, every stand-in tag present as text.

**Not verified**
- On Chime's iPhone. Whether a generic avatar beside a real player's name reads as that player (see the Ronaldo card); the "Ronaldo-inspired" card still opens the Meta Finisher sample page.

## Builds in a new style, with the game's icons (Sun 22 Nov 2026, afternoon)

**Changed**
- Chime asked for a new page combining archetype and builds (D-33) in a different style, Old Gold, using the archetype emblems and PlayStyle icons (D-39). New `mockup/builds-v2/` (the first draft is untouched): `/builds` (13 emblem tiles in four groups, each with its two Signature PlayStyle icons), `/builds/finisher` (emblem hero, Signature PlayStyles, mastery, Season 2 cost changes, 3 build cards with Meta pick and "Most copied after launch") and a demo Finisher build (FUT.GG-style attribute groups with gauges and bars, PlayStyles+ and PlayStyles with icons, Copy build). `index.html` is clickable; `sheet.html?w=phone|desktop` is the Figma sheet.
- Style: FUT.GG's player stats page for structure, FC 27's Clubs menus for the emblem rings and cut corners, sports editorial for the type scale. Archetype facts come from `fc27.json`; every build number is a labelled sample.
- Icons load from `reference/assets/` (git-ignored) and are never committed. The archetype emblems there are Pro Clubs HQ's tracings, not EA's files.
- Figma: page "Builds · new style (Old Gold)" (59:2), phone sheet 68:2 above desktop sheet 69:2. Code review (medium, fix): 10 findings, 6 fixed (each archetype tile now opens its own archetype page, emblem fetch failures no longer hang the sheet, icons next to their printed name are alt="", footer credits the emblems to Pro Clubs HQ, badge helper reused); skipped: one sample build page only, flat-colour corner notches, 44 px targets and token-only colours apply to `src/`.

**Checked**
- Browser at 393 and 1440: no element wider than its frame, every emblem and icon loaded, no page errors, Barlow loaded. Contrast on every new pair (the card-face tint lowered to 16% so its labels reach 4.9:1).
- Figma read-back: 6 screens, no layer outside its frame, editable Barlow / Barlow Condensed text, emblems as vectors, 42 icon images per sheet, screen heights equal to the browser.

**Not verified**
- Not seen on Chime's iPhone (L-01). New copy for Chime's OK: "Pick your archetype", the two ledes, "Every Finisher build, the Meta pick first."

## Planning: builds by archetype, face preview, modes (Sun 22 Nov 2026)

**Changed**
- Chime, as a Clubs player: the separate Archetypes pages made no sense; builds are picked by archetype. D-33: one Builds section (`/builds` → `/builds/[archetype]` → `/builds/[archetype]/[build]`), no `/archetypes`. D-38: the four groups are the position path, no position filter.
- D-34: "Meta pick" (Chime's, after one match) at launch; "Most copied" from Copy-button counts after launch, never merged.
- D-35: face preview is a turntable cut from one in-game turn, plus a 3D rebuild tested from the same clip for comparison. D-36: faces are made in game by Chime and Sharon, never taken from YouTube (rule 5). O-16 opened: creators sending their own faces after launch.
- D-37: light and dark mode both, following the device, with a switch; selected items get a dark ring in light mode.
- SPEC routes, PLAN, CLAUDE.md layout and the sitemap brief (v4, still 12 pages) updated to match.

**Checked**
- Sitemap PDF re-rendered and read back: 12 pages (`pdfinfo`), every section within its page at print width, pages 2, 4 and 9 looked at.

**Not verified**
- GoatCounter events and API (D-34) not yet checked against its docs. Whether the head turns at an even speed with the stick held fully over (needs Chime's test clip).

**Next**
- Redesign the draft's Builds screens for D-33; turntable script and 3D test once the clip is in `reference/`; `load.ts` (paused).

## Light mode for the five colours (Sun 22 Nov 2026)

**Changed**
- Chime asked to see the light mode. `mockup/draft/themes.css` gains a light block per colour (`data-mode="light"`): each keeps its accent fill and ink; surfaces, text, muted, warning and danger are new, plus a darker `--accent-text` and a new `--accent-line` token (selected borders, slider, progress and stat bars), because the bright accents fail as text and as borders on white. The tab bar shadow became a token (`--shadow-float`). Dark mode is unchanged (`--accent-line` = `--accent` there).
- Prototype: a Dark / Light switch next to the colour switcher (remembered per browser). `frames.html` and `desktop.html` take `?theme=<id>&mode=light` and name the colour in the sheet title.
- Figma: new page "Light mode" (34:2) in https://www.figma.com/design/hyFx4Audhn4F9KxL9bRCLD: one column per colour, phone sheet (21 frames at 393) above desktop sheet (11 at 1440), captured as editable layers.

**Checked**
- Contrast script: every text pair ≥ 4.5:1 and every accent line ≥ 3:1 on bg and surface, in both modes and all five colours.
- Design check PASS for all 20 sheets (5 colours × 2 modes × phone and desktop); 64 click-through checks PASS at 390 and 1440 (the 56 before plus mode switch, light background, persistence across reload, back to dark). Lint clean.
- `/code-review medium --fix`: 8 findings, 2 fixed (unknown theme or mode from the URL or storage now falls back to a known one; sheet headings name the colour and mode in every case). Open: see "For Chime" below.
- Read back from Figma: 10 sheets; Barlow 867 and Barlow Condensed 236 text layers per phone sheet (783 and 196 per desktop sheet); no section wider than its frame; each sheet's background is its light bg.

**Not verified**
- Light mode on Chime's iPhone (L-01). The light palettes are made here, not measured from a reference.
- Later the same day, on Chime's answers: selected chips, segments and tab-bar items get a 1.5 px `--accent-line` ring in light mode only (3.95:1 or more on bg, surface and raised; dark renders pixel-identical, 160 of 160 screens); the mode follows the device until Dark or Light is picked, a pick wins; `color-scheme` set per mode; 27 new mode checks PASS; the Figma "Light mode" page's 10 sheets recaptured in place.

**For Chime**
- In light mode the selected chip, segment and tab-bar item are shown by the bright accent fill alone, which is faint on white (Volt lime on white 1.2:1; under the 3:1 guideline for every colour but Derby). The label still changes colour. Fix if wanted: a thin dark accent ring on selected items, light mode only.
- Light mode needs a decision entry once Chime picks: light, dark, or both with a switch.

## The draft in Figma, and Pro Clubs assets (Sat 21 Nov 2026, later)

**Changed**
- New Figma file "Pro Clubs Hub" in Chime's GenAI-Labs drafts (D-32): https://www.figma.com/design/hyFx4Audhn4F9KxL9bRCLD. Pages Volt, Pitch, Old Gold, Floodlight, Derby each hold the phone sheet (21 screens and states, 393) and the desktop sheet (11 screens, 1440), captured from `mockup/draft/` as editable layers (text, frames, vectors; no flattened images). Page 6, "Assets (reference)": all 36 FC 27 PlayStyles (badge, PlayStyle+ badge, glyph), the 13 archetype emblems plus Engine (FC 26) as vectors, and 21 The Grounds and Clubs screenshots. Files and sources in `reference/assets/` (git-ignored) and its `manifest.json`.
- O-15 opened: may the product ever ship EA's badges? Today they're reference only (CLAUDE.md rule 2, D-04).
- Two draft bugs found while capturing, both fixed: frame sheets rendered body text in the system font (`.app` now sets Barlow), and Home's content was 578 px wide inside a 393 px phone frame, hidden by the clip (`.main` grid column is now `minmax(0, 1fr)`). `frames.html?theme=<id>` renders a sheet in one colour.

**Checked**
- Read back from Figma: Barlow 867 and Barlow Condensed 236 text layers on a phone sheet; no section wider than its 393 frame; every colour page holds exactly two sheets; 129 image slots filled, 14 emblems placed.
- Draft: design check PASS (21 phone, 11 desktop), 56 click-through checks PASS, no hidden overflow in any frame, lint clean.

**Not verified**
- The Amps screenshot (shows a real footballer's face) was kept out of Figma; it stays only in `reference/assets/other/`.
- Archetype emblems are Pro Clubs HQ's vector tracings of EA's emblems, not EA's own files.

## UI8 references, and the first draft in five colours (Sat 21 Nov 2026)

**Changed**
- Chime called the Mobbin references trash and asked for UI8. Three agents pulled 76 UI8 references (esports, football and sports, faces and utility kits) into the local board `reference/board/` (git-ignored); the 235 Mobbin references stay on their own board, `reference/board-mobbin/`. Every reference on both boards (311) has a "How we'd use it" note.
- Chime marked 8 UI8 references (World Cup 2026 hero card and card grid, Valdûm character sheet, quest objectives, bazaar and skill tree, Olive roster, World Cup pitch line-up). Claude picked the rest per section and built the first draft (D-31): `mockup/draft/`, a clickable prototype of every route (`index.html`), phone and desktop frame sheets (`frames.html`, `desktop.html`), a five-colour comparison (`compare.html`) and `interactions.json` (generated by `tools/gen-interactions.mjs`). Colours: Volt (Ravex), Pitch (NextPlay Sports), Old Gold (Valdûm), Floodlight (World Cup 2026), Derby (Olive).
- The verifier failed the first pass. Fixed: sample recipe numbers were JaxStash's real values carried over from the old mockup (D-08), now neutral samples and no tutorial credit; credit lines on every card; test IDs that broke prefix matching; Sculpt as its own section and Skin Tone without invented end labels (RESEARCH §9); flows 2 (updated face resets ticks) and 4 (older season) walkable; Submit kinds and tabs with their own fields; About credits, Takedown email line, archetype sources; Chime's picks applied fully (later steps greyed, side-panel preview, 4 columns with grid/list, PlayStyle panel, Specialization tile); palette values traced to swatches, changes listed in `themes.css`; ticks update in place and tabs/chips get one springing highlight.

**Checked**
- Design check PASS: 21 phone frames (393), 11 desktop frames (1440), every interactive element specced.
- 56 click-through checks PASS at 390 and 1440 (every SPEC core flow, filters, submit, theme switch, no sideways scroll, no page errors). Every palette's text pairs pass AA (script).
- Two code reviews (`/code-review medium --fix`); the first fixed 7 of 10 findings.

**Not verified**
- Chime hasn't seen the draft. Not checked on Chime's iPhone (L-01).
- New copy that isn't from the repo docs and needs Chime's OK: page subtitles, About and Takedown paragraphs, "Countdowns", "Every face and build re-checked", Submit field hints, the 404 text.

## PR #2 merged; references first; Sharon records too (Fri 20 Nov 2026, late evening)

**Changed**
- D-28: references for every screen (Mobbin, FUT.GG, other sites) and Chime's pick before any Figma work. Chime: "we can't just go and start designing all this. We need references."
- Reviewed Sharon's PR #2 (PRD v2.1): older-season warning only from Thu 3 Dec; video off the launch must-list; season-change metric readable at Season 3 if live by Thu 26 Nov; "Seasons and levels" (cap rises during the year; build cards show level and AP); face-picture loading proposal (the budget check counts HTML, scripts and styles only: confirmed in `scripts/check-budget.mjs`).
- It conflicted with D-28 on the PRD phase-1 row. Claude merged `main` into Sharon's branch, combined both, applied Chime's answers, CI passed; Chime approved; squash-merged as `bfcda6f`.
- D-29: Sharon records faces and builds too, credited by name, platform tagged, reviewed by Chime. D-30: one match per build before it's called meta (replaces "3 matches"; Sharon had proposed none). CLAUDE.md, DESIGN.md, UI-BRIEF, HANDOFF and the sitemap PDF updated.

**Not verified**
- PR #2's "Seasons and levels" facts were seen in search results only (labelled so in the PRD).

## PR #1 merged; pace, Michael Jackson and counting decided (Fri 20 Nov 2026, evening)

**Changed**
- Reviewed Sharon's PR #1 (PRD v2 and `docs/EVIDENCE.md`): CI and Cloudflare green, no decision edited. Chime approved; squash-merged as `037777e`.
- Chime's calls on its questions: ship within days on Season 2, re-check on Season 3 from 3 Dec (D-25, against Claude's recommendation to keep D-18 with an early soft-open); Michael Jackson allowed at launch (D-26, against Claude's recommendation to keep D-10); GoatCounter hosted (D-27, as recommended).
- Validator: a deceased subject now passes only when a decision allows them by exact name (`DECEASED_ALLOWED`, Michael Jackson). The old test "fails a deceased subject" became "fails a deceased subject no decision allows" plus "passes Michael Jackson": a rule change from D-26, not a weakened check.
- PLAN, PRD, EVIDENCE, CLAUDE.md, FORMAT, content/README, HANDOFF and the sitemap PDF (still 12 pages) updated to D-25 to D-27. The three review fixes applied: "FC 24, FC 26 and FC 27" instead of "every edition since FC 24"; the smoke-test form says what contact details are for and deletes them; pace framed as decided.
- DECISIONS housekeeping: O-02, O-03, O-04, O-06, O-09, O-10 and O-12 moved to a new "Closed" section with what answered each.
- Earlier the same evening: repo public again with `main` protected (D-23); CODEOWNERS so only Chime's approval counts (D-24); the Claude GitHub App installed (it shows on meridian and portfolio too; restricting it needs Chime's 2FA).

**Checked**
- Red then green: the two validator tests failed first, then 25 of 25 passed.
- GoatCounter's homepage (via search): hosted is free for "reasonable public usage", small businesses fine; no published pageview cap.

**Not verified**
- GoatCounter's full terms page and script size (Sharon's "about 3.5 KB").

## Phase 1, design lane: mockups, sitemap, private repo (Fri 20 Nov 2026, afternoon)

**Changed**
- Mockup v1 in `mockup/` (FUT.GG-style home at 393 and 1440, face page in 9 states, a wireframe stand-in head with drag to turn). Rejected: "this is bad, we need mobbin references of how a 3d screen should look like".
- Mobbin references for 3D screens (Meta Quest, Instagram, WhatsApp, Facebook and Snapchat avatar editors; Replika; Amazon, Zalando, Apple Store and GOAT 3D viewers). Chime picked the avatar-editor layout; mockup v2 rebuilt the face page that way with a grey mannequin stand-in. Rejected with the rest: "the designs … are all trash".
- Sitemap and two user journeys as a 10-page PDF: `docs/design/sitemap/sitemap-and-journeys.pdf` (source HTML beside it). Structure only, for a UI designer (D-21).
- Repo made private at Chime's request (D-20), then public again the same day (D-23): private Actions minutes were used up (mostly `meridian`'s macOS runs) and GitHub Free only protects branches on public repos. `main` is now protected: a pull request needs Chime's approval and a passing CI `test`; admins can still push. Collaborator: Sharon (`sharrygold`). `CONTRIBUTING.md` and `AGENTS.md` tell people and AI agents how to branch and open pull requests (D-22). The sitemap PDF is updated to match (Submit opens a GitHub issue again).
- UI-BRIEF §6: test-ID suffix convention (`face-card-1`, `version-tag-face-1`).

**Checked**
- Mockups: the proof design check passed (10 phone screens, 1 desktop); a fresh-context review and `/code-review --fix` (9 of 10 fixed) on v1. v2 wasn't reviewed (rejected first).
- PDF v1 (10 pages) pushed at Chime's request before its fresh-context check finished. The check passed routes, page count (40) and copy, and found 9 problems: Submit and GitHub links assume a public repo; Visual Age before Sculpt (FORMAT says the reverse); launch faces would show a Season 2 warning; value kinds incomplete; two links presented as required that SPEC lacks; the Season 3 entry date; four wrong citations; unsourced lines and missing copy; loose tree connectors. v2 (12 pages) fixes all of them, adds a page on value kinds and a page of open questions with recommendations (two new: submissions while private, launch-face season).
- Repo visibility: `gh repo view` reports PRIVATE.

**Not verified**
- Cloudflare Pages deploys from the private repo (next push shows it).
- The test clip for the face preview (A-16): still not in `reference/`.

**Next**
- Chime and the collaborator review the PDF; the collaborator designs the UI from it.
- Core lane, test-first: `load.ts`, `version.ts`, `toIssueUrl.ts`.

## Phase 1, design lane (Fri 20 Nov 2026)

**Changed**
- 48 references, pattern summary and three directions in `docs/design/REFERENCES.md` (a background agent's research; P1-1 passes).
- Direction board at `docs/design/direction-board/index.html` (published privately as an artifact). Chime rejected all three directions: "All these are trash." Recorded as D-19, DESIGN.md "Direction" and memory.
- FUT.GG's home studied at 1440 and 390 px (screenshots kept in the session scratchpad only, not in the repo).
- Face preview plan proposed as A-16: one PS5 clip and one cutscene screenshot per face give the card picture, drag to turn, angle buttons and an in-match picture.

**Not verified**
- Everything in A-16: waiting on Chime's test clip in `reference/`.

**Next**
- With the clip: frames, drag-to-turn viewer, FUT.GG-style home and face page for Chime to approve. Core lane: loader, version wording, issue URL.

## Phase 1, core lane unit 1: content types and validator (Fri 20 Nov 2026)

**Changed**
- `src/lib/content/types.ts`: every FORMAT v1 shape (face with parts, sculpt and visual age per A-09/A-12; build; archetype file; changelog; creators). Fields Chime records take a type parameter, so drafts may hold `"PLACEHOLDER"` and published content can't, at the type level.
- `src/lib/content/check.ts` (a small field checker with paths, no new dependency), `validate.ts` (faces, builds, `validateAll`), `validate-other.ts` (archetypes, creators, changelog). Rules: every field's type and range, status, version tag, a "made-by" credit, living subject (D-10), "Inspired by" titles, tab order, Sculpt 0–100, Skin Tone and Visual Age 0–100, embeds with a matching tutorial credit, known archetype and creator ids, file name = id, and in published files no `PLACEHOLDER` anywhere and no `_example`.
- `scripts/validate-content.mjs` now runs that validator (Node strips the types), so `prebuild` and CI check every field. Its Phase 0 test was replaced by tests of the wrapper (folder reading, broken JSON, message lines); the four Phase 0 rules are covered in the new suite.
- Fixtures: `tests/unit/fixtures/face-good.json`, `build-good.json` (test data); each bad case is the good file with one change.

**Checked**
- Red: `tests/unit/content/validate.test.ts` failed first with "Cannot find package '@/lib/content/validate'". Green: 18 tests, including both examples in `content/` failing when marked published.
- `/code-review --fix` (high): 10 findings, 9 fixed with 6 new tests (26 now). Faces' `pairedBuild` and changelog `affects` must point at real files (the validator builds the id sets; the loader still checks published-to-published links). Impossible dates (30 Feb) fail. URLs must be http(s) (submissions run through this validator). YouTube video ids are letters, digits, `_` and `-` only. A title containing "official" fails (rule 3). Every version needs its history line. Only Skin Tone may use a `position` value. Archetype `typicalPositions` and `specializations` items are checked. Left open: whether Cloudflare's Node 22 is 22.18+; checked from the deploy log on push.
- Gate after the fixes: types, lint, unit (26 tests), content, build + budget + e2e all pass.
- Phase 1 design lane: a background agent is collecting references (results pending).

**Not verified**
- That CI's and Cloudflare's Node 22 strips types like local Node 24 (needs 22.18+; checked on the next push).

## Phase 0: Day 0 findings, repo and scaffold (Thu 19 – Fri 20 Nov 2026)

**Changed**
- Day 0 findings in `docs/RESEARCH.md` §9, from Chime's PS5 screenshots, JaxStash's FC 27 face playlist (every storyboard frame of lmlnVZWi8YQ, frames of 11 more), FC Tools Hub and level-cap sources. Face format reshaped to the real editor (A-09, A-12); level cap 55 / 1,419 AP (A-10); one head for both looks (A-11); PS5 (D-17). JaxStash added to `creators.json` (not asked).
- Season dates checked on EA's Launch Rewards page: Season 3 from Thu 3 Dec, Season 4 from Thu 14 Jan 2027. The plan still assumes "December"; replanning waits for Chime.
- Pronouns: 13 he/his references in CLAUDE.md, PRD, DECISIONS (D-08, D-10 wording only), HANDOFF, FORMAT and `content/README.md` corrected to they/them. CLAUDE.md rule 7 updated to the new value kinds.
- `git init` on `main`; docs committed.
- Scaffold with D-11's exact versions, configs and scripts adapted from Sinima: `next.config.ts` (static export), Playwright at 390×844 and 360×800 serving `out/` on port 4174, Vitest, ESLint 9 plus `check-tokens`, `.nvmrc` 22, `engines` >= 22.18. App shell: `src/app/layout.tsx` with the notice on every page (`site-notice`), placeholder home, empty `tokens.css` (Phase 1 fills it from Figma).
- `scripts/validate-content.mjs` (Phase 0 checks: JSON parses, known status, no `PLACEHOLDER` or `_example` in a published file; Phase 1's `validate.ts` replaces it), run by `prebuild` and CI.
- Budget measured and set (A-13): empty app 131.6 KB JS, 135.7 KB total gzipped per page; limits 165 / 220.
- Host decided on evidence (A-14): Cloudflare Pages; Vercel Hobby's terms are "personal or non-commercial use" only.
- `.claude/proof.json`: the commit gate (types, lint, unit, content, build + budget + e2e). Chime approved it.

**Checked**
- Red: `tests/unit/validate-content.test.ts` failed first with "Failed to load ../../scripts/validate-content.mjs" (script not written yet). Green after: 5 tests pass.
- Gate run on the final code: types, lint, unit, content, build-budget-e2e all pass. E2E `home.spec.ts` passes at phone-390 and phone-360.
- `/code-review --fix` (medium) on the scaffold: 8 findings, 6 fixed. The content check now rejects an unknown status (a typo like "Published" had skipped every check), with a new test. `serve-out` serves `/x/` as `x.html` like a static host (checked `/`, `/index/`, a missing page and `../` / `%2e%2e` paths) and knows webp, jpg, avif and woff. `check-tokens` no longer reads `href="#add"` as a colour, and its palette comment is corrected (the palette is switched off in Phase 1, not yet). Both scripts share Node's recursive `readdirSync`. ESLint ignores `coverage/` and `blob-report/`. Skipped: e2e in WebKit (iPhone Safari). It needs a second browser on a memory-tight Mac, and Chime's real-iPhone check (rule 10) covers it for now.

**Not verified**
- CI on GitHub and the Cloudflare deploy (next).
- `npm` warns ESLint 9.39.5 is out of support; D-11 pins ESLint 9, so moving to 10 needs Chime's OK.
- Sculpt's Weight and Definition modes, and whether Skin Tone's arrows step: noted on Chime's first face recording.

**Later the same session**
- Public repo `ChimeXXD/pro-clubs-hub` created and pushed; first CI run green (44652883584).
- Figma file created on Chime's personal team: https://www.figma.com/design/1mjxmMNZQOrs40MlmzvRTQ (Cover, Design System, Design screens; read back via use_figma).
- Season 3 replan applied (D-18); ESLint stays on 9 (A-15, checked plugin peer ranges).
- Cloudflare Pages: Chime signed in; Claude created the Git-connected project in Chrome (GitHub was already authorised for Cloudflare, no new grant). Deploy succeeded; `curl` shows https://pro-clubs-hub.pages.dev/ 200 with the notice and a missing page 404 with the notice.

- Chime opened https://pro-clubs-hub.pages.dev on the iPhone and read back the heading, "Work in progress." and the notice: P0-6 passes, and so does Phase 0's gate.

**Next**
- Phase 1: reference board and three directions; core lane test-first.

## Pivot: Facecard becomes Pro Clubs Hub (Thu 19 Nov 2026)

**Changed**
- Folder renamed `Facecard` to `Pro Clubs Hub` (`mv -n`; the target didn't exist; no git repo yet).
- Product is now a faces-led hub for FC 27 Clubs with meta-build cards, archetype pages, a changelog and a submit flow (D-02). Planner later (D-07). Name open; "Pro Clubs Hub" is the working title (D-15, O-01).
- Rewritten from the 18 Nov research: CLAUDE.md, DESIGN.md (new, Sinima pattern), README.md, docs/PRD.md, docs/RESEARCH.md, docs/DECISIONS.md (fresh: D-01 to D-16, A-01 to A-08, L-01 to L-13, O-01 to O-14), docs/PLAN.md (phases 0 to 3), docs/SPEC.md, docs/FORMAT.md (v1: archetype, build, face, changelog, creators), docs/HANDOFF.md, docs/KICKOFF-PROMPT.md, docs/features.json (38 items), docs/design/UI-BRIEF.md, docs/design/REFERENCES.md, .claude/settings.json, .github/workflows/ci.yml, .gitignore, .env.example.
- New content: `content/archetypes/fc27.json` (13 archetypes, sourced fields only), one example build and one example face (all `PLACEHOLDER`, `draft`), three changelog drafts from EA pages, `creators.json` (two candidates, not asked), `content/README.md`.
- Moved to `_to_delete/` (deletion isn't permitted in this folder): the old Facecard recipes `michael-jackson.fc27.json`, `zinedine-zidane.fc27.json`, their README, and the empty `content/recipes/` folder. Chime can delete `_to_delete/`.

**Checked**
- Every JSON file in `content/` and `docs/features.json` parses.
- Archetype cost-change counts sum to EA's totals (58 up, 29 down).

**Not verified**
- Level cap (55 or 75), face value display, preset and hairstyle counts: Day 0 in-game checks.
- Season 3 date; PhotoFit's Season 4 scope; whether "Pro Clubs" is a mark.
- Creator channels in `creators.json` (not opened).

**Next**
- Day 0: ask Chime the in-game checks, then O-12 (host). See `docs/KICKOFF-PROMPT.md`.

## Facecard project created (Fri 6 Nov 2026)

**Changed**
- Folder created with the plan and starter data: CLAUDE.md, PRD (with research, competitors, brainstorm, legal and risk), PLAN, SPEC, FORMAT (recipe schema v1), DECISIONS (D-01 to D-20, L-1 to L-7, O-1 to O-8), RESEARCH, HANDOFF, KICKOFF-PROMPT, UI brief draft, references plan, features.json (31 items), two example recipes with placeholder values, LICENSE, .gitignore, CI workflow, Claude settings, .env.example.

**Checked**
- `content/recipes/*.json` and `docs/features.json` parse as JSON.
- Example recipes follow `docs/FORMAT.md` by eye (no validator exists yet; Day 1 writes it).

**Not verified**
- How FC 27 shows slider values; preset count; PhotoFit status in Clubs (Day 0 in-game check).
- MediaPipe model size and licence; Cloudflare Pages setup for this repo.
- No `package.json` yet: Day 0 creates it.

**Next**
- Chime answers O-1 (name), O-4 (legal posture), O-7 (launch list). Then Day 0 (see `docs/KICKOFF-PROMPT.md`).
