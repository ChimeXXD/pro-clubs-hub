# Pro Clubs Hub: the plan to launch

Written 19 Nov 2026. Decisions are in `DECISIONS.md`; the PRD is `PRD.md`. Launch rides the **Season 3** change (D-16). **Season 3 starts Thu 3 Dec** (EA's Launch Rewards page), so builds are recorded on Season 3 only and launch is **Sat 19 or Mon 21 Dec** (D-18). Chime builds Oya Ball side by side and Sinima launches Tue 15 Dec, so this plan avoids that week's peak (O-04).

## What "done" means on launch day

1. **A live, free site** where a Clubs player builds a lookalike or era face step by step on a phone, then sets up its paired build.
2. **5 verified faces and 13 verified builds** (one per archetype), each tagged "FC 27 · Season 3 · verified <date>" and credited.
3. **Archetype pages, a changelog and a submit flow.**
4. **A motion-graphics video and a launch post**, timed to Season 3.
5. **A public MIT repo** that reads like senior work: README, formats, tests, CI badge, honest numbers.

## Phases

| Phase | Dates (proposal) | Focus | Gate (must pass before the next phase) |
| --- | --- | --- | --- |
| 0 | Thu 19 – Sun 22 Nov (4 days) | **In-game checks**, public repo, scaffold, CI, deploy, Figma Design System page started | RESEARCH §9 filled (O-02, O-03, O-09, O-10); empty site builds, tests and deploys; CI green; budget set |
| 1 | Mon 23 – Sun 29 Nov (1 week) | **Design** in Figma (references, directions, Design System, Design screens); **core lane** test-first (validator, loader, version wording, issue URL); **start recording faces** (season-independent) | Chime approves phone, iPad and desktop screens; core lane green |
| 2 | Mon 30 Nov – Sun 13 Dec (2 weeks) | **Build** every page from Figma with motion; **Thu 3 Dec: Season 3 changelog entry, then record the 13 builds on Season 3**; finish the 5 faces; video script and storyboard | All launch pages green; 5 faces verified; 13 builds verified on Season 3; storyboard approved |
| 3 | Mon 14 – Mon 21 Dec | **Harden, video final, launch.** Sinima launches Tue 15 Dec: nothing goes live Tue 15 – Fri 18 Dec | Live Sat 19 or Mon 21 Dec, "updated for Season 3"; video posted; no blocking bugs |
| After | 4 weeks | Watch use, fix, add faces and positions, case study | Case study draft with launch numbers |

Season 3 lands Thu 3 Dec, before 19 Dec, so O-04's rule gives Sat 19 or Mon 21 Dec (D-18). Season 4 (and PhotoFit, O-07) starts Thu 14 Jan 2027. If a phase slips, cut its Should items; never cut faces, the video or launch day.

## Scope to launch

| Must | Should | Cut (not before launch) |
| --- | --- | --- |
| Faces library, face page with ticks and paired build | Search across faces and builds | Build planner (D-07) |
| 5 verified faces (footballers, living musicians) | 10 faces | Michael Jackson and deceased stars (D-10) |
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

## Phase 1: design and core lane (23–29 Nov)

**Design**
- [ ] References by surface (`docs/design/REFERENCES.md`)
- [ ] Three directions on a direction board; Chime picks one
- [ ] Design System page: tokens as variables, text and effect styles, components with states (FaceCard, BuildCard, VersionTag, CreditLine, StepRow, ValueChip, Tabs, Sheet, Toast)
- [ ] Design screens: home, faces, face, builds, build, archetypes, archetype, changelog, submit, about, takedown, 404, at iPhone, iPad and desktop
- [ ] Chime approves the screens; `docs/design/UI-BRIEF.md` §1–3 filled; `tokens.css` mirrors Figma

**Core lane (tests first)**
- [x] `lib/content/types.ts` from FORMAT v1
- [x] `lib/content/validate.ts` with good and bad fixtures (PLACEHOLDER, `_example`, unknown archetype, missing credit, deceased subject)
- [ ] `lib/content/load.ts` resolves relations, fails on broken links, drops drafts and withdrawn
- [ ] `lib/content/version.ts` wording (verified, not checked, older season)
- [ ] `lib/submit/toIssueUrl.ts`
- [x] `npm run validate:content` and prebuild hook

## Phase 2: build and record (30 Nov – 13 Dec)

- [ ] Shared components and layout from Figma, with motion (DESIGN.md)
- [ ] Home, faces library, face page with ticks
- [ ] Builds index and build page
- [ ] Archetypes index and 13 pages
- [ ] Changelog page
- [ ] Submit page
- [ ] About, takedown, 404
- [ ] Motion pass with the motion skills, named in PROGRESS (L-10)
- [ ] Content: first 5 faces chosen (O-05) and recorded; Chime's screenshots exported
- [ ] Thu 3 Dec: read EA's Season 3 notes, write the changelog entry
- [ ] Content: 13 builds recorded on Season 3 (from Thu 3 Dec) and played 3 matches each
- [ ] Creator outreach drafts for featured spots (Chime sends)
- [ ] Video script (30–45 s) and storyboard in Figma; Chime approves
- [ ] Budget, Lighthouse mobile 90+, accessibility pass, Chime's iPhone check next to the TV

## Phase 3: Season 3 and launch

- [ ] Re-check builds against any Season 3 title update since they were recorded; bump versions if anything moved
- [ ] Faces re-checked if the editor changed
- [ ] Video final (16:9 and 4:5, captions burned in)
- [ ] Launch post and thread; share cards checked in X's composer and WhatsApp
- [ ] Post, pin, watch, fix the same day

## After launch

- [ ] Add faces and positions weekly
- [ ] Open the request board and ratings (D-09 later)
- [ ] Case study in `docs/CASE-STUDY.md` with honest numbers
- [ ] Season 4: re-check PhotoFit's impact (O-07)
