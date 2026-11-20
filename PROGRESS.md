# Progress

Newest first. Each entry: what changed, what was checked, what wasn't verified, what's next.

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
