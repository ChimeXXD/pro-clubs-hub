# Handoff: read this first when you pick the project back up

## Latest: Phase 0 done except the iPhone check, Fri 20 Nov 2026

### Where it stands
- **Public repo:** https://github.com/ChimeXXD/pro-clubs-hub (MIT). CI is green on `main`: lint, typecheck, unit, content, build, budget and e2e at 390 and 360 wide.
- **Scaffold:** Next.js 16.4.6 static export with D-11's exact pins; configs and scripts adapted from Sinima. A placeholder home with the notice on every page. `.claude/proof.json` is the commit gate (Chime approved it).
- **Day 0 findings** (`docs/RESEARCH.md` §9): the FC 27 editor shows numbered parts ("Nose 116"), Sculpt sliders 0–100 with end labels, and Skin Tone and Visual Age with no number. The face format was rebuilt around that (A-09, A-12). Level cap 55 / 1,419 AP (A-10), one head for both looks (A-11), PS5 (D-17).
- **Budget** (A-13): empty app 131.6 KB JS; limits 165 KB JS and 220 KB total per page, gzipped.
- **Host** (A-14): Cloudflare Pages, because Vercel Hobby is non-commercial only.
- **Figma file:** https://www.figma.com/design/1mjxmMNZQOrs40MlmzvRTQ (personal team): Cover, Design System, Design screens.
- **Season 3 replan (D-18):** builds recorded on Season 3 only (from Thu 3 Dec); faces start in Phase 1; launch Sat 19 or Mon 21 Dec.
- **ESLint stays on 9** (A-15): Next's lint plugins don't support 10 yet.
- **Live:** https://pro-clubs-hub.pages.dev (Cloudflare Pages, Git-connected to `main`: every push redeploys). Home 200 and 404 both carry the notice.

### Waiting on Chime
1. **Open https://pro-clubs-hub.pages.dev on the iPhone** next to the TV (P0-6's last criterion; only Chime can do it).

### Do next
- Tick P0-6 once Chime has opened the site on the iPhone. Then Phase 1 (design directions, plus the core lane test-first: types, validator, loader, version wording, issue URL). Phase 1's `validate.ts` replaces the Phase 0 `scripts/validate-content.mjs`.

### Research rules learned (Chime, 20 Nov)
- Research game facts before asking Chime. JaxStash's playlist (https://www.youtube.com/playlist?list=PLM30xERFMmrU) shows the face editor in full; read every storyboard frame of the relevant video before calling anything unknown.

### Not verified
- Sculpt's Weight and Definition modes; whether Skin Tone's arrows step. Note both on Chime's first face recording.
- Whether "Pro Clubs" is a registered mark; the final name's availability (O-01).
- Creator channels in `creators.json` (none asked yet).
