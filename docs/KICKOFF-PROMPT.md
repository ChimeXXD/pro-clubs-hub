# Kickoff prompts for Claude CLI

Open Terminal in this folder (`Projects/Personal Projects/Pro Clubs Hub`) and run `claude`. Paste one prompt per session. Stop Oya Ball's dev server first: one dev server at a time.

## Session 1: Day 0 (in-game checks, setup)

```
Read CLAUDE.md, docs/HANDOFF.md, docs/PLAN.md, docs/DECISIONS.md, docs/FORMAT.md and docs/RESEARCH.md.
We're starting Phase 0 of Pro Clubs Hub (working title).

First, before any setup, ask me the in-game checks (D-13), one click-through question at a time where you can:
  a. Which platform am I on (PS5, Xbox, PC)?
  b. In the Clubs face editor (The Grounds, Customise), do sliders show numbers, bars or notches? What range?
  c. How many preset heads are there, and how is the grid laid out (pages, rows, columns)?
  d. How many hairstyles and facial-hair options? Any that fit 2008 or 2017 Ronaldo?
  e. Is the face shared between the street look and the matchday look?
  f. What level cap does the game show for an archetype, and how much AP at the cap?
Write my answers into docs/RESEARCH.md §9 with today's date. Then update docs/FORMAT.md (control ids, value
kinds) and close O-02, O-03, O-09 and O-10 with new decisions. If I can't check something today, leave it open.

Then ask me O-12 (host: Cloudflare Pages or Vercel Hobby).

Setup:
1. git init, public GitHub repo ChimeXXD/pro-clubs-hub (D-12), MIT, first commit of these docs.
2. Scaffold Next.js in place with exact versions: next 16.4.6, react 19.3.1, react-dom 19.3.1,
   typescript 5.9.3, tailwindcss 4.3.3 + @tailwindcss/postcss 4.3.3, eslint 9 + eslint-config-next 16.4.6,
   @playwright/test 1.64.1, vitest. App Router, src/, static export. npm scripts from CLAUDE.md.
   One Vitest and one Playwright test pass. Push only when the scaffold exists (first CI run must be real).
3. CI green. Deploy the empty site to the host I picked.
4. Measure the empty app's weight; propose a budget as a decision; add scripts/check-budget.mjs.
5. Remind me to create the Figma file with a cover, a Design System page and a Design screens page.
Commit and push after each green step. Tick Phase 0 in docs/PLAN.md and docs/features.json with evidence,
log the session in PROGRESS.md and rewrite docs/HANDOFF.md. Ask before anything that costs money or adds
a dependency. Stop the dev server when done.
```

## Session 2: Day 1 (design direction and core lane)

```
Read CLAUDE.md, DESIGN.md, docs/HANDOFF.md, docs/design/UI-BRIEF.md, docs/design/REFERENCES.md and
docs/FORMAT.md. Phase 1 starts (D-14).
Design lane:
1. Collect 30-50 references by surface from docs/design/REFERENCES.md. Use the reference library connector if
   it's connected (never name it in the repo). Images stay in docs/design/reference-board/images/ (git-ignored).
   Note each pick and what to take from it. No photos of real people.
2. Write the pattern summary.
3. Build three distinct directions at 390 px wide on docs/design/direction-board/index.html. Each shows:
   home with faces first; a face page mid-way with ticks, the version tag and credit line; a build card for a
   Spark; the old-season warning; the notice. Use "Pro Clubs Hub" as the wordmark placeholder.
Core lane, while I look (tests first):
4. src/lib/content/types.ts, validate.ts, load.ts, version.ts and src/lib/submit/toIssueUrl.ts, with good and
   bad fixtures in tests/unit/fixtures/. The two example files in content/ must validate as drafts and fail
   if marked published.
5. Stop and ask me to pick a direction. Then help me build the Figma Design System page from it (tokens as
   variables, styles, components with states), fill UI-BRIEF §1-3, write src/styles/tokens.css from the Figma
   variables, and log the pick as a decision.
Commit and push after each green step; update PLAN.md, features.json, PROGRESS.md and HANDOFF.md.
```

## Session 3+: build and content days

```
Read CLAUDE.md, DESIGN.md, docs/HANDOFF.md, the latest PROGRESS.md entry and docs/PLAN.md. Continue with
<phase and item>. Build from the Figma Design screens page. Tests first for lib/content and lib/submit.
Screenshot at 390, 834 and 1440 and compare with Figma before calling a screen done; run the motion skills
on UI units and name them in PROGRESS. Commit and push after each green step, update PLAN.md,
features.json, PROGRESS.md and HANDOFF.md. If I paste in-game values, write them into content/ exactly as
given, set verifiedOn, and run npm run validate:content. Never invent a value. Stop the dev server when done.
```
