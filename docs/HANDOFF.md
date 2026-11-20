# Handoff: read this first when you pick the project back up

## Latest: Fri 20 Nov 2026, afternoon. Two people on the project now

Chime invited a collaborator to the repo, which is now **private** (D-20). The collaborator will design the UI. Nothing is running (no dev server, browser or watcher).

### New here? Read in this order
0. `CONTRIBUTING.md`: **only Chime merges into `main`.** Work on a branch and open a pull request (D-22).
1. `CLAUDE.md`: what we're building, the stack, the rules that protect correctness. Chime is they/them.
2. `docs/design/sitemap/sitemap-and-journeys.pdf`: **the brief for the UI**. Every page, how the pages link, what each must show and its states, and the two journeys (face seeker, meta-build seeker). The HTML source is beside it.
3. `docs/PRD.md` (why and what), `docs/SPEC.md` (routes, flows, acceptance tests), `docs/FORMAT.md` (every content field), `docs/DECISIONS.md` (every decision, numbered).
4. `DESIGN.md`: Chime's taste rules, learned from their corrections.
5. `docs/PLAN.md` (phases and checkboxes) and `PROGRESS.md` (session log, newest first).

### Where the design stands (D-21)
- **Rejected:** the three-direction board (D-19), mockup v1 (FUT.GG home plus a boxed wireframe head) and mockup v2 (avatar-editor face page from Mobbin references). Chime: "the designs … are all trash."
- **Agreed so far:** the structure in the sitemap PDF. Faces lead (D-02). The start screen takes FUT.GG's structure (dark hub, tab pills, face grid first) (D-19). Each face should be previewable from Chime's own in-game captures, turned by drag (A-16, proposed).
- **Mobbin references for a 3D character preview:** Chime picked the avatar-editor layout (Meta Quest, Instagram, WhatsApp: the character fills the top, a sheet with tabs below), then rejected the mockup built from it. Treat it as a reference, not a decision. Listed in PROGRESS.md.
- `mockup/` holds v1/v2 as a record only, not a direction. Don't build from it.
- **Never in the UI:** photos, drawings or AI images of real people; EA logos, card art, icons or rarity colours; coloured side-stripe cards (CLAUDE.md rules 1–2; Chime's global rule).

### Start here next
1. Chime and the collaborator review the PDF. Answer its open questions (page 10): the name (O-01), the first 5 faces (O-05), the face preview (A-16), top-bar order, each archetype's typical positions, the takedown email (O-13).
2. The collaborator designs the screens from the PDF (Figma file: https://www.figma.com/design/1mjxmMNZQOrs40MlmzvRTQ, D-14).
3. Core lane, test-first, no UI needed: `src/lib/content/load.ts` (relations; drop drafts and withdrawn; fail on broken links), then `version.ts` (tag wording), then `src/lib/submit/toIssueUrl.ts`.

### Waiting on Chime
- A test clip in `reference/` (git-ignored) for the face preview: Clubs → Head → Customize, zoom in (L3), press Create to record, turn the Pro one full circle with the right stick (about 10 s). Optionally one match-cutscene screenshot.
- **GitHub Actions can't start on the private repo** (checked 20 Nov): "The job was not started because recent account payments have failed or your spending limit needs to be increased." November's free minutes are used up, mostly by the `meridian` repo's macOS runs (532 min, counted at 10x). Until the allowance resets on 1 Dec, or Chime raises the spending limit or makes the repo public, CI and the main guard don't run: run `npm run lint && npm run typecheck && npm test && npm run build` locally, and check pull requests locally when reviewing.
- Cloudflare Pages deploys from the private repo: checked on commit `eedf595` (success).

### Earlier (19–20 Nov), in short
- **Phase 0 done:** repo, Next.js 16.4.6 static-export scaffold, CI, commit gate (`.claude/proof.json`), page-weight budget (A-13), live at https://pro-clubs-hub.pages.dev (A-14).
- **Research (RESEARCH §9):** how FC 27's face editor shows values; level cap 55 / 1,419 AP. Season 3 starts Thu 3 Dec, Season 4 Thu 14 Jan 2027; launch is Sat 19 or Mon 21 Dec (D-18).
- **Core lane unit 1 done:** content types and a full validator run before every build (26 unit tests).

### Not verified
- Sculpt's Weight and Definition modes; whether Skin Tone's arrows step (noted on Chime's first face recording).
- Whether "Pro Clubs" is a registered mark; the final name's availability (O-01).
- e2e in WebKit (iPhone Safari): Chime's real-iPhone check covers it for now.
