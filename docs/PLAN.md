# Pro Clubs Hub: the plan to launch

Written 19 Nov 2026; replanned 20 Nov for a fast launch (D-25). Decisions are in `DECISIONS.md`; the PRD is `PRD.md`. **We ship within days, as soon as the Must list passes, on Season 2** (D-25 supersedes D-18's 19/21 Dec date). **Season 3 starts Thu 3 Dec** (EA's Launch Rewards page): that day every face and build is re-checked on Season 3 and the changelog entry written. Season 4 (and PhotoFit, O-07) starts Thu 14 Jan 2027.

## What "done" means on launch day

1. **A live, free site** where a Clubs player builds a lookalike or era face step by step on a phone, then sets up its paired build.
2. **5 verified faces and 13 verified builds** (one per archetype), each tagged "FC 27 · Season 2 · verified <date>" and credited.
3. **Archetype pages, a changelog and a submit flow.**
4. **A launch post**; the motion-graphics video ships with the launch or with the Season 3 update (open, D-25).
5. **Counting live** (GoatCounter, D-27), so the main metric starts on day one.
6. **A public MIT repo** that reads like senior work: README, formats, tests, CI badge, honest numbers.

## Phases

| Phase | When | Focus | Gate (must pass before the next phase) |
| --- | --- | --- | --- |
| 0 | 19 – 20 Nov | **In-game checks**, repo, scaffold, CI, deploy | **Passed 20 Nov** |
| 1 | Now, in parallel | **Sharon:** screens in Figma from the sitemap brief (D-21). **Claude:** core lane test-first (loader, version wording, issue URL), GoatCounter wiring. **Chime:** record the 5 faces and 13 builds on Season 2, the face-preview captures (A-16). **Sharon:** smoke test (EVIDENCE §3) | Chime approves the screens; core lane green; content recorded |
| 2 | Right after | **Build** every launch page from the screens; load the recorded content | All launch pages green; 5 faces and 13 builds verified on Season 2 |
| Launch | As soon as phase 2 passes (date set then) | Launch post; video if ready | Live; no blocking bugs |
| Season 3 | Thu 3 Dec | Re-check every face and build on Season 3, bump versions, write the changelog entry, "updated for Season 3" post | Every launch item tagged Season 3, or showing the older-season warning until it is |
| After | 4 weeks | Watch the metrics, fix, add faces and positions, case study | Two weeks of baseline, then targets |

The real limit on "days" is the work in phase 1: screens, the core lane, and 18 items recorded in game. If a phase slips, cut its Should items; never cut faces or launch day.

## Scope to launch

| Must | Should | Cut (not before launch) |
| --- | --- | --- |
| Faces library, face page with ticks and paired build | Search across faces and builds | Build planner (D-07) |
| 5 verified faces (footballers, living musicians, and Michael Jackson, D-26) | 10 faces | Other deceased subjects (D-10, D-26) |
| 13 verified build cards with version tags and credits | Builds for every position | Ratings, request board, comments |
| 13 archetype pages | Share card (Open Graph image) per face and build | Accounts |
| Changelog with EA sources | Featured creator spot with a creator who said yes | Stats, leaderboards, EA match data |
| Submit: builder to prefilled GitHub issue | Form fallback without GitHub (O-11) | Photo-to-slider AI |
| About, takedown, notice on every page | Tutorial embeds on tap | Ads (a later decision) |
| Validator fails the build on bad content | | Native app |
| Budget and e2e in CI | | |
| Motion-graphics video and launch post | 15 s cut for reposts | |

## Phase 0: setup and in-game checks (19–22 Nov)

- [x] Chime's in-game checks recorded in `docs/RESEARCH.md` §9: value display, ranges, preset count, hairstyles, street vs matchday face, level cap, AP at cap, platform
- [x] `docs/FORMAT.md` control ids and value kinds updated from the checks; a decision logged
- [x] Public repo `ChimeXXD/pro-clubs-hub` (D-12), first commit of these docs
- [x] Scaffold with exact versions (CLAUDE.md stack); npm scripts; one Vitest and one Playwright test
- [x] CI green on push to main
- [x] Host chosen (O-12, A-14) and the empty site deployed: https://pro-clubs-hub.pages.dev
- [x] Empty-app weight measured; budget logged as a decision (A-06)
- [x] Figma file created: cover, Design System page, Design screens page (D-14): https://www.figma.com/design/1mjxmMNZQOrs40MlmzvRTQ

## Phase 1: screens, core lane and recording (now, in parallel; D-25)

**Design**
- [x] References by surface (`docs/design/REFERENCES.md`): 48 picks, 20 Nov
- [x] ~~Three directions on a direction board~~: rejected by Chime 20 Nov (D-19)
- [x] ~~FUT.GG-style home and face page with a 3D spin preview (D-19)~~: mockups v1 and v2 rejected by Chime 20 Nov (D-21); kept in `mockup/` as a record
- [x] Sitemap and user journeys (face seeker, meta-build seeker): `docs/design/sitemap/sitemap-and-journeys.pdf`, 20 Nov (D-21). The brief for the UI designer
- [ ] Sharon designs the screens from the sitemap brief; Chime approves
- [ ] Design System page: tokens as variables, text and effect styles, components with states (FaceCard, BuildCard, VersionTag, CreditLine, StepRow, ValueChip, Tabs, Sheet, Toast)
- [ ] Design screens: home, faces, face, builds, build, archetypes, archetype, changelog, submit, about, takedown, 404, at iPhone, iPad and desktop
- [ ] Chime approves the screens; `docs/design/UI-BRIEF.md` §1–3 filled; `tokens.css` mirrors Figma

**Core lane (tests first)**
- [x] `lib/content/types.ts` from FORMAT v1
- [x] `lib/content/validate.ts` with good and bad fixtures (PLACEHOLDER, `_example`, unknown archetype, missing credit, deceased subject not allowed by name, D-26)
- [ ] `lib/content/load.ts` resolves relations, fails on broken links, drops drafts and withdrawn
- [ ] `lib/content/version.ts` wording (verified, not checked, older season)
- [ ] `lib/submit/toIssueUrl.ts`
- [x] `npm run validate:content` and prebuild hook
- [ ] GoatCounter on every page (D-27): Chime creates the account; script within the budget; About says what is counted; events for recipes finished and face to build

**Recording (Chime, on Season 2, D-25)**
- [ ] First 5 faces chosen (O-05; the smoke test feeds it) and recorded; captures for the face preview (A-16)
- [ ] 13 builds recorded and played 3 matches each

**Evidence (Sharon)**
- [ ] Smoke test posted and read after 72 hours (EVIDENCE §3)

## Phase 2: build (right after the screens are approved)

- [ ] Shared components and layout from Figma, with motion (DESIGN.md)
- [ ] Home, faces library, face page with ticks
- [ ] Builds index and build page
- [ ] Archetypes index and 13 pages
- [ ] Changelog page
- [ ] Submit page
- [ ] About, takedown, 404
- [ ] Motion pass with the motion skills, named in PROGRESS (L-10)
- [ ] Creator outreach drafts for featured spots (Chime sends)
- [ ] Video script (30–45 s) and storyboard; ships with the launch or with the Season 3 update (open, D-25)
- [ ] Budget, Lighthouse mobile 90+, accessibility pass, Chime's iPhone check next to the TV

## Launch (as soon as phase 2 passes)

- [ ] Launch post and thread; share cards checked in X's composer and WhatsApp
- [ ] Post, pin, watch, fix the same day

## Season 3 update (Thu 3 Dec)

- [ ] Read EA's Season 3 notes, write the changelog entry
- [ ] Re-check every face and build on Season 3; bump versions and tags; until then the older-season warning shows
- [ ] Video final (16:9 and 4:5, captions burned in), if it didn't ship at launch
- [ ] "Updated for Season 3" post

## After launch

- [ ] Add faces and positions weekly
- [ ] Open the request board and ratings (D-09 later)
- [ ] Case study in `docs/CASE-STUDY.md` with honest numbers
- [ ] Season 4: re-check PhotoFit's impact (O-07)
