# Handoff: read this first when you pick the project back up

## Latest: Phase 0 nearly done, Fri 20 Nov 2026

### Where it stands
- **Public repo:** https://github.com/ChimeXXD/pro-clubs-hub (MIT). CI is green on `main`: lint, typecheck, unit, content, build, budget and e2e at 390 and 360 wide.
- **Scaffold:** Next.js 16.4.6 static export with D-11's exact pins; configs and scripts adapted from Sinima. A placeholder home with the notice on every page. `.claude/proof.json` is the commit gate (Chime approved it).
- **Day 0 findings** (`docs/RESEARCH.md` §9): the FC 27 editor shows numbered parts ("Nose 116"), Sculpt sliders 0–100 with end labels, and Skin Tone and Visual Age with no number. The face format was rebuilt around that (A-09, A-12). Level cap 55 / 1,419 AP (A-10), one head for both looks (A-11), PS5 (D-17).
- **Budget** (A-13): empty app 131.6 KB JS; limits 165 KB JS and 220 KB total per page, gzipped.
- **Host** (A-14): Cloudflare Pages, because Vercel Hobby is non-commercial only.

### Waiting on Chime
1. **Connect Cloudflare Pages** to the repo (dashboard; build `npm run build`, output `out`, `NODE_VERSION=22`). Then check that the URL loads on the iPhone (P0-6).
2. **Season 3 starts Thu 3 Dec** (EA Launch Rewards page). Proposal: record builds only on Season 3, launch Sat 19 or Mon 21 Dec. Not yet in PLAN.md until Chime agrees.
3. **Figma file:** cover, Design System page, Design screens page (P0-8).
4. ESLint 9.39.5 is out of support; D-11 pins ESLint 9. Moving to 10 needs Chime's OK.

### Do next
- After the deploy: tick P0-6, then Phase 1 (design directions, plus the core lane test-first: types, validator, loader, version wording, issue URL). Phase 1's `validate.ts` replaces the Phase 0 `scripts/validate-content.mjs`.

### Research rules learned (Chime, 20 Nov)
- Research game facts before asking Chime. JaxStash's playlist (https://www.youtube.com/playlist?list=PLM30xERFMmrU) shows the face editor in full; read every storyboard frame of the relevant video before calling anything unknown.

### Not verified
- Sculpt's Weight and Definition modes; whether Skin Tone's arrows step. Note both on Chime's first face recording.
- Whether "Pro Clubs" is a registered mark; the final name's availability (O-01).
- Creator channels in `creators.json` (none asked yet).
