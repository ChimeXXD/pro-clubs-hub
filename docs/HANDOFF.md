# Handoff: read this first when you pick the project back up

## Latest: Fri 20 Nov 2026, afternoon. Two people on the project now

Chime invited a collaborator, Sharon (`sharrygold`), who will design the UI. The repo is **public** again and `main` is protected: only pull requests Chime approves merge (D-23). Nothing is running (no dev server, browser or watcher).

### New here? Read in this order
0. `CONTRIBUTING.md`: **only Chime merges into `main`** (GitHub enforces it). Work on a branch and open a pull request (D-22, D-23).
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
**Decided 20 Nov after PR #1 (Sharon's PRD v2, merged):** ship within days on Season 2, re-check on Season 3 from Thu 3 Dec (D-25); Michael Jackson allowed as a launch face (D-26); GoatCounter for counting (D-27).
1. **Sharon:** references first. For each screen in the sitemap PDF, gather references (Mobbin, FUT.GG, other sites) into `docs/design/REFERENCES.md`; Chime picks per screen (D-28). Only then the screens in Figma (https://www.figma.com/design/1mjxmMNZQOrs40MlmzvRTQ, D-14). Also the smoke test (EVIDENCE §3).
2. **Chime (and Sharon, D-29):** record 5 faces and 13 builds on Season 2, one match per build (D-30), plus the face-preview captures (A-16, Chime); create the GoatCounter account; answer O-01 (name), O-05 (first faces, including which Michael Jackson era) and O-13 (takedown email); decide whether the video ships at launch or with Season 3.
3. **Claude:** core lane, test-first: `src/lib/content/load.ts` (relations; drop drafts and withdrawn; fail on broken links), `version.ts` (tag wording, older-season warning), `src/lib/submit/toIssueUrl.ts`; then GoatCounter wiring once the account exists.

### Waiting on Chime
- A test clip in `reference/` (git-ignored) for the face preview: Clubs → Head → Customize, zoom in (L3), press Create to record, turn the Pro one full circle with the right stick (about 10 s). Optionally one match-cutscene screenshot.
- The account's private-repo Actions minutes are used up for November, mostly by `meridian`'s macOS runs (532 min, counted at 10x). This repo is public, so its CI runs free; other private repos stay blocked until 1 Dec.

### Earlier (19–20 Nov), in short
- **Phase 0 done:** repo, Next.js 16.4.6 static-export scaffold, CI, commit gate (`.claude/proof.json`), page-weight budget (A-13), live at https://pro-clubs-hub.pages.dev (A-14).
- **Research (RESEARCH §9):** how FC 27's face editor shows values; level cap 55 / 1,419 AP. Season 3 starts Thu 3 Dec, Season 4 Thu 14 Jan 2027. Launch was Sat 19 or Mon 21 Dec (D-18), now within days on Season 2 (D-25).
- **Core lane unit 1 done:** content types and a full validator run before every build (26 unit tests).

### Not verified
- Sculpt's Weight and Definition modes; whether Skin Tone's arrows step (noted on Chime's first face recording).
- Whether "Pro Clubs" is a registered mark; the final name's availability (O-01).
- e2e in WebKit (iPhone Safari): Chime's real-iPhone check covers it for now.
