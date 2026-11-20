# Handoff: read this first when you pick the project back up

## Latest: Phase 1 under way, session ended Fri 20 Nov 2026 (about 03:30 Lagos)

Chime stopped for the night: "We'll continue tomorrow." Nothing is running (no dev server, browser or watcher).

### Start here tomorrow
1. **Ask whether Chime put the test clip in `reference/`** (see "Waiting on Chime"). If it's there: cut the frames and build the face preview (below). If not: build the FUT.GG-style screens with a plain stand-in head and swap the clip in later. Don't ask anything research can answer (memory: research-before-asking).
2. **Build real screens, not "directions"** (D-19, DESIGN.md "Direction"). The start screen follows FUT.GG's home; every face is shown from Chime's own in-game captures.
3. Core lane, unit 2: `src/lib/content/load.ts`, test-first (relations, drop drafts and withdrawn, fail on broken links between published files). Then `version.ts` and `toIssueUrl.ts`.

### What happened this session (19–20 Nov)
- **Plan reviewed and replanned.** EA's Launch Rewards page dates Season 3 to Thu 3 Dec 2026 and Season 4 to Thu 14 Jan 2027. Builds are recorded on Season 3 only; faces start now; launch Sat 19 or Mon 21 Dec (D-18).
- **Day 0 research** (`docs/RESEARCH.md` §9). Chime's PS5 screenshots plus every storyboard frame of JaxStash's FC 27 face videos (playlist https://www.youtube.com/playlist?list=PLM30xERFMmrU, which Chime says answers any editor question). The editor:
  - Shows numbered parts ("Nose 116").
  - Has Sculpt sliders from 0 to 100, with a label at each end.
  - Shows no number for Skin Tone (a colour slider) or Visual Age (an Older / Younger pad).
  - Shows saved heads before the presets, so presets are counted among photo presets only.
  - Format rebuilt to match (A-09, A-12). Level cap 55 / 1,419 AP (A-10). One head serves both looks (A-11). PS5 (D-17).
- **Phase 0 done:**
  - Public repo https://github.com/ChimeXXD/pro-clubs-hub (MIT, CI green).
  - Next.js 16.4.6 static-export scaffold.
  - Commit gate `.claude/proof.json` (Chime approved it).
  - Budget 165 KB JS / 220 KB total (A-13).
  - Live at https://pro-clubs-hub.pages.dev on Cloudflare Pages (A-14), checked on Chime's iPhone.
  - Figma file https://www.figma.com/design/1mjxmMNZQOrs40MlmzvRTQ.
  - ESLint stays on 9 (A-15).
  - Pronouns fixed to they/them in every doc.
- **Phase 1, core unit 1 done:**
  - `src/lib/content/types.ts`, `check.ts`, `validate.ts`, `validate-other.ts`.
  - Every field of every content file is checked in `prebuild`, CI and Cloudflare (Node strips the types). 26 unit tests pass.
  - The code review fixed 9 findings, including links between files, real dates, http(s)-only URLs, safe video ids, "official" in titles, and history lines.
- **Phase 1, design:**
  - 48 references in `docs/design/REFERENCES.md`.
  - The three-direction board (`docs/design/direction-board/index.html`, published privately at https://claude.ai/artifact/Ve5U3Tmp8pd16yKXJRd6Jz) was **rejected**: "All these are trash. This is not the design I had in mind at all." Recorded as D-19, in DESIGN.md and in memory (design-from-named-reference).
- **What Chime wants instead:** FUT.GG's start screen, studied at 1440 and 390 px on 20 Nov:
  - Dark navy with one orange accent and a top bar with search.
  - Tab pills (Trending, Evos, Recent…).
  - A dense card grid first: 9 across on desktop, 3 on a phone.
  - Then countdowns, Featured / Quick links / Expiring soon lists with small badges, a What's New / What's Hot card grid with vote %, and news.
  - Ours is that structure with our own card style, no EA frames (D-04).
- **Chime's key need:** "People need to see how the face is on our app before they actually decide that they want to use the preset… Think of a way to actually show the face." Recommended plan (A-16, proposed):
  - **One capture per face:** a 15-second PS5 clip of the head turning a full circle in Customize, plus one match-cutscene screenshot.
  - **What the site shows from it:**
    - A front picture on each face card.
    - Drag to turn on the face page (about 36 frames, loaded only on touch).
    - Front, ¾ and Side angle buttons.
    - An "In a match" picture.
    - The starting preset's own tile, cropped from a preset-grid screenshot.
    - The front picture on the share card.
  - **Submissions** need the same captures.
  - **Not possible:** a true 3D model (FC 27 can't export one), and an AI or 3D image of the real person (D-10).

### Waiting on Chime
- **A test clip in `reference/`** (git-ignored): in Clubs → Head → Customize, zoom in (L3), press Create to record, and turn the Pro one full circle with the right stick (about 10 seconds). Optionally add one match-cutscene screenshot. Their current Pro is fine. Sent from the PS App to the Mac by AirDrop.
- Once the screens exist, approval of the FUT.GG-style home and face page (replaces P1-2).

### Phase 1 checklist (docs/PLAN.md)
- Done: references (P1-1); types and validator (P1-5); `validate:content` and prebuild.
- Next: FUT.GG-style home and face page with the face preview (D-19, A-16); Chime approves; then Figma Design System and Design screens from them; `tokens.css`.
- Core lane left: loader (P1-6), version wording (P1-7), issue-URL builder (P1-8; GitHub issue forms take query parameters for their own fields, reference #44), tokens check (P1-9).
- FORMAT and validator need a small addition for the preview once A-16 is accepted: `screenshots[].angle` (front, three-quarter, side, match) and a `spin` field (frame count and folder).

### Rules learned this session
- Research game facts before asking Chime; read every frame of the video they point to (memory: research-before-asking).
- Build real screens from the named reference, never abstract style boards (memory: design-from-named-reference; DESIGN.md "Direction").
- Chime is they/them.

### Not verified
- Sculpt's Weight and Definition modes; whether Skin Tone's arrows step. Note both on Chime's first face recording.
- Whether "Pro Clubs" is a registered mark; the final name's availability (O-01).
- Creator channels in `creators.json` (none asked yet).
- e2e in WebKit (iPhone Safari): skipped for memory; Chime's real-iPhone check covers it.
