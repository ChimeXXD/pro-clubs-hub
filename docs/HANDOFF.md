# Handoff: read this first when you pick the project back up

## Latest: Tue 24 Nov 2026. Renamed to ProBuilds everywhere (D-52); brand and design system set

Nothing is running (no dev server or watcher).

### Where things stand
- **Name: ProBuilds** everywhere (D-49, D-50, D-52): GitHub repo `ChimeXXD/probuilds`, every file, the site, Claude's memory notes, Figma. Web address probuilds.club, not bought yet ($4.12 the first year at Porkbun, then $15.96/yr).
- **Hosting:** old Cloudflare Pages project deleted (Chime's OK); new project `probuilds` from `ChimeXXD/probuilds` (build `npm run build`, output `out`, branch `main`). Live at https://probuilds.pages.dev: checked from outside the Mac's network (200, ProBuilds; 404 with the notice). From the Mac itself it timed out for 15+ minutes after the deploy; Chime to open it on the iPhone.
- **Figma file "ProBuilds":** https://www.figma.com/design/hyFx4Audhn4F9KxL9bRCLD. Replaces the older file named in CLAUDE.md (1mjxm…).
  - **Logo:** Touchline mark + PROBUILDS wordmark; guide and SVG exports.
  - **Design system** (one page): Overview, Colour, Typography, Spacing & layout, Radius & elevation, Components. All values are Figma variables.
  - **Design:** one section per design phase; Meta Finisher (phone, version B) is the only finished screen.
  - **Archive:** every rejected logo round and old draft.
- **References:** UI8 Osnova UI (file zu1wAc8aXjcsdcmDg4rNuJ, structure) and Rayum (file MbzXVWzasW9yy8yYiFXniG, dark look).
- **Type:** Barlow Condensed + Barlow (D-51). Smallest text 14 px.
- **Deadline:** Season 3 on Thu 3 Dec (D-25). Launch is on Season 2, before then.

### What's next, in order

**1. Finish the rename (Claude, minutes)**
- [x] https://probuilds.pages.dev loads from outside (heading, 404 with notice); recorded in `docs/features.json` P0-6.
- [ ] Chime opens https://probuilds.pages.dev on the iPhone (the Mac's network timed out on it).
- [ ] Rename the folder to `Projects/Personal Projects/ProBuilds` (memory notes are already copied to the new location). Then Chime restarts Claude Code there and accepts the folder-trust prompt again.

**2. Chime, now (unblocks design)**
- [ ] Review the Phase 0 components in Figma (Design system → 05 · Components): Build card, Archetype tile, Sheet, Version tag, Score ring, Limits callout, Tab item. Approve or list changes.
- [ ] Buy probuilds.club at Porkbun (tab open in Brave); then Claude points it at the Pages project.
- [ ] Delete the stray Figma file g1t6DqicHT8w4Lq790DC2G.

**3. Design, Phase 1 · Builds (Claude, after step 2's approval)**
- [ ] Phone 390 from the components only: Builds (13 archetypes), Archetype (Finisher), Meta Finisher states (specialization not reached, not yet checked, older season, copied).
- [ ] Then tablet 834 and desktop 1440. Chime approves before the next phase (faces, home, changelog, submit, about/takedown/404).

**4. Content, in game (Chime or Sharon, in parallel with design)**
- [ ] Pick the first 5 faces (O-05) and record them on Season 2 (D-29).
- [ ] Record 13 builds, one per archetype, each played for one match (D-30).

**5. Before code (Claude, needs Chime's OK)**
- [ ] CLAUDE.md and DESIGN.md: point at the new Figma file and Barlow type.
- [ ] Mirror the Figma variables into `src/styles/tokens.css`.

**6. Build, Phase 2 (Claude)** — shared components, then home, faces, face page, builds, changelog, submit, about/takedown/404; motion pass; budget, Lighthouse 90+, accessibility, Chime's iPhone check next to the TV.

**7. Launch, then Season 3 (Thu 3 Dec)** — launch post; re-check every face and build on Season 3, changelog entry, "Updated for Season 3" post; video ships with one of the two.

### Small open questions for Chime
- O-13 takedown email address · O-11 submissions without GitHub (Google Form fallback?) · O-08 tagline · GoatCounter account (D-27) · trademark search for ProBuilds · test one submission link (D-45).
- Sharon: her open PRs #3 and #4 may still say the old name in their files; they need rebasing before any merge.

### How to work with Chime on design (learned this session)
- Show work in Figma, not local previews; never create a new Figma file; never ask for links (imported files are listed in `~/Library/Application Support/Figma/settings.json`).
- Logos need a clear football element and real craft; rejected work goes to Archive pages, never deleted.
- Follow the UI8 design guide (no eyebrows or decorative pills, 14 px minimum, one family).

### Earlier (19–23 Nov), in short
- Phase 0 (setup) done; site on Cloudflare Pages (A-14). Core lane done test-first: types, validator, loader, version wording, issue URL, issue forms (D-45); 71 unit tests.
- Sharon's PR #3 (two logo directions) and PR #4 (The Grid) reviewed; Chime chose The Touchline.
