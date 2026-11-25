# CLAUDE.md — ProBuilds

**ProBuilds** is the name (D-49, D-50, D-52); the site is https://probuilds.club (D-53); takedowns go to takedown@probuilds.club. "Facecard" is at most the name of the faces feature. You are building this project. Read this file first. **Design source of truth: the Figma *Design System* page (tokens, styles, components) and the *Design screens* page (D-14) in https://www.figma.com/design/hyFx4Audhn4F9KxL9bRCLD; build from them. Tokens reach code through `npm run tokens` (docs/design/UI-BRIEF.md §2).** Before building or changing UI, read `DESIGN.md` (Chime's taste rules). Then `docs/HANDOFF.md` (the latest session summary), `docs/PLAN.md` for the current phase and `PROGRESS.md` for where the last session stopped.
Every product and architecture decision so far is in `docs/DECISIONS.md`. Don't reopen one unless it blocks you. If it does, write the problem under "Open" in `docs/DECISIONS.md` and ask Chime. Chime is they/them.

## What we are building

A **FUT.GG-style hub for EA SPORTS FC 27 Clubs (Pro Clubs), led by faces** (D-02). One line: **"Look like a legend. Play like one."** (draft copy, O-08)

- **Faces** (the lead): a library of lookalike and era faces (2007, 2008 and 2017 Ronaldo; living musicians; Michael Jackson by decision, D-26), each written as a step-by-step recipe and paired with a matching build.
- **Meta builds as cards**: one clean card per build, for all 13 FC 27 archetypes and every position. Each card has a version tag ("FC 27 · Season 2 · verified 19 Nov 2026") and a source and credit line (D-05).
- **Builds by archetype** (13, D-33), a **public changelog** of meta changes (D-06), and a **submit** flow that builds a recipe or build and opens a prefilled GitHub issue for Chime to review (D-09).
- **Not now:** a build planner. It comes only after Chime verifies the attribute cost tables in game (D-07). We don't fight Pro Clubs HQ on tools. We win on design, mobile speed, always free and the faces library (D-03).
- Primary user: Chime in Lagos, on an iPhone next to the console. Research: `docs/RESEARCH.md`. PRD: `docs/PRD.md`. Spec: `docs/SPEC.md`. Formats: `docs/FORMAT.md`.

## Project frame (D-01)

- **Portfolio project** built with Claude Code, **launched publicly within days, on Season 2** (D-25), then re-checked and updated for **Season 3** on Thu 3 Dec. A motion-graphics video ships with the launch or the Season 3 update (open).
- **The repo is public** (MIT, D-23). Everything committed is public at once: no keys, no EA screenshots, no photos of people.
- **Budget is $0.** Free host (Cloudflare Pages proposed, A-01), free GitHub Actions on the public repo, no paid APIs, no paid fonts.
- **Always free.** No paywall, ever (EA content policy, D-04). Passive banner ads may come later, after a decision. No affiliate links or tips at launch.
- **Scope** is the Must / Should / Cut table in `docs/PLAN.md`. If a phase overruns, cut its Should items. Never cut the faces library, the video or launch day.
- **Design comes first** (D-14). Figma Design System page plus Design screens page, then build from them.
- **Content comes from Chime or Sharon, in game** (D-08, D-29): credited by name, platform tagged, reviewed by Chime; each build played for one match before it is called meta (D-30). Never invent slider values, attribute numbers or build stats. Placeholder values are the string `"PLACEHOLDER"` and their files stay `"status": "draft"`.
- **Chime builds Oya Ball at the same time.** The Mac is tight on memory: one dev server at a time across both projects, stop it when you finish, never leave Playwright browsers or watchers running.

## Stack (fixed, D-11)

- **Next.js 16.4.6** App Router, **static export** (`output: "export"`), **React 19.3.1**, **TypeScript 5.9.3** strict, **Tailwind CSS 4.3.3** (`@tailwindcss/postcss`). Same versions as Sinima.
- **ESLint 9** with `eslint-config-next` 16.4.6. **Vitest** for unit tests. **@playwright/test 1.64.1** for e2e. Node 22, npm.
- Pin exact versions (no `^`). Any new dependency needs Chime's OK. MDX is a proposal (A-03), not approved.
- No server code, no API routes, no database. Content is JSON in `content/`, validated at build time.
- Colours, type and spacing come from tokens in `src/styles/tokens.css`, mirrored from Figma variables. No hard-coded colours.

## Layout (create as you go)

```
content/
  archetypes/fc27.json        13 archetypes (docs/FORMAT.md §Archetype)
  builds/<slug>.json          build cards (FORMAT §Build)
  faces/<slug>.json           face recipes, each pairing a build (FORMAT §Face)
  changelog/<date>-<slug>.json  meta changes with EA sources (FORMAT §Changelog)
  creators.json               credited creators and featured spots (FORMAT §Credit)
  README.md                   sourcing rules
src/app/                      / , /faces, /faces/[slug], /builds, /builds/[archetype],
                              /builds/[archetype]/[build], /changelog, /submit, /about, /takedown
src/components/               FaceCard, BuildCard, VersionTag, CreditLine, StepList, ValueChip
src/lib/content/              types.ts, validate.ts, load.ts (build time), version.ts (tag wording)
src/lib/submit/               toIssueUrl.ts (prefilled GitHub issue)
src/styles/                   tokens.css, globals.css
scripts/                      validate-content.mjs, check-budget.mjs, check-tokens.mjs
tests/unit/ tests/e2e/        Vitest; Playwright (phone viewport)
reference/                    git-ignored: in-game screenshots, design reference images
```

## Commands

```bash
npm run dev               # one dev server at a time (shared with Oya Ball); stop it when done
npm run build             # static export to out/; prebuild runs validate:content
npm run lint              # eslint . && node scripts/check-tokens.mjs
npm run typecheck         # tsc --noEmit
npm test                  # vitest run
npm run test:e2e          # playwright test (builds and serves out/)
npm run validate:content  # every file in content/ against docs/FORMAT.md
npm run budget            # page-weight budget on out/
```

Run `npm run lint`, `npm run typecheck`, `npm test` and `npm run build` before saying a task is done.

## Rules that protect correctness

1. **No images of real people, ever** (D-10). No photos, drawings, AI portraits or silhouettes. Names appear as plain text. Face pages may show only Chime's own in-game screenshots of their own recreations, exported by them, never EA marketing art.
2. **No EA logos, fonts or card art.** Archetype emblems and PlayStyle icons are allowed (D-39), but only EA's own files or our own drawings, never another site's tracings, and they stay out of the repo until shipped. "EA", "FC" and "FUT" never appear in the product name, domain or logo (D-04).
3. **The notice is on every page:** "Not endorsed by or affiliated with EA or its licensors. Not endorsed by the people named." A face's title is its plain name ("2008 Ronaldo", "Neymar Jr (Mohawk)"), never "official" (D-69).
4. **Every build and face carries a version tag** (`game`, `season`, `verifiedOn`). Unverified content says "Not yet checked in game" in words. Content from an older season shows a warning; it is never silently carried over (D-05).
5. **Every build and face carries a source and credit line** (D-08). A creator whose tutorial was followed is named and linked. Creator videos are embedded with `youtube-nocookie.com`, never re-uploaded or transcribed. Exception, builds only (D-66): a build may be read from a streamer's video by hand, published as "not yet checked in game" and credited with a link to that video.
6. **Never trust a content file.** `validate.ts` checks every field against `docs/FORMAT.md`. One bad file fails the build. Submissions are validated the same way before Chime sees them.
7. **Values are stored as the game shows them** (A-09, A-12): `item` ("Nose 116"), `named` ("Warm Black"), `slider` (Sculpt, 0–100 with its end labels), and `position` for controls with no number (Skin Tone, Visual Age), measured from Chime's screenshot. The editor's structure is in `docs/RESEARCH.md` §9.
8. **Withdrawn means gone.** `"status": "withdrawn"` is not built, listed or linked. Takedowns are acted on within 72 hours (D-10).
9. **Never copy another site's builds or cost tables.** Facts (a PlayStyle name, a specialization target EA states) are free. Another site's finished build, tier list or cost table is not (D-08). A streamer's build read from their video follows D-66.
10. **Renders are not enough.** Check pages on Chime's iPhone next to the TV before a gate passes (L-01).

## Two people, one review gate (D-22, D-23)

Chime (`ChimeXXD`, the owner) and Sharon (`sharrygold`, a collaborator) both work here. **Only Chime merges into `main`.** GitHub enforces it (D-23): a pull request into `main` needs Chime's approval and a passing CI `test`. Anyone else, and any AI agent working for them, works on a branch and opens a pull request: follow `CONTRIBUTING.md` before any git command. Working with Chime, commit and push to `main` as below. When this file says "ask Chime" and you're working with Sharon, put the question in the pull request for Chime.

## Working style

- Work phase by phase from `docs/PLAN.md`. Pass a phase's gate before starting the next.
- **Tests first** for `src/lib/content/` (types, validator, loader, version wording) and `src/lib/submit/`. Fixtures are JSON in `tests/unit/fixtures/` (good and bad files).
- Playwright e2e at 390×844 and 360×800 for the flows in `docs/SPEC.md` §Acceptance, using the test IDs in `docs/design/UI-BRIEF.md`.
- After UI work: build, screenshot at 390, 834 and 1440, compare with the Figma frame before calling the step done. For UI units, run the motion skills and name them in PROGRESS (Sinima D-102).
- Commit after each green step with a conventional message (`feat:`, `fix:`, `test:`, `chore:`, `docs:`, `content:`). Push after every commit (the repo is public).
- Update the checkbox in `docs/PLAN.md` and the matching item in `docs/features.json` (with evidence) when a task is done. Log each session in `PROGRESS.md` (newest first) and rewrite `docs/HANDOFF.md` at the end of each session.
- New product or architecture choices get a numbered entry in `docs/DECISIONS.md` (supersede, never edit).
- Ask Chime decisions as click-through questions with three options when a tool for that is available.
- Keep files under about 300 lines. Semantic HTML, visible focus, 44 px targets, `prefers-reduced-motion` respected.
- Never invent copy, metrics, dates or values. Use `TODO` and list them at the end of each task.
- Never contact creators yourself. Draft messages for Chime; they send them.
