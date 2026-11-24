# Handoff: read this first when you pick the project back up

## Latest: Tue 24 Nov 2026. Renamed to ProBuilds everywhere (D-52); brand and design system set

Nothing is running (no dev server or watcher). The rename (later on 24 Nov) changed the GitHub repo (`ChimeXXD/probuilds`), every file, the site name and Claude's memory notes. Still to do: the Cloudflare Pages project `probuilds` (Chime signs in to Cloudflare first), deleting the old Pages project (Chime's OK), and renaming the local folder to `ProBuilds`.

### Where things stand
- **Name: ProBuilds.** Web address probuilds.club (not bought yet; renews at $15.96/yr). Decisions D-46 → D-51 in `docs/DECISIONS.md`. Repo, site, CLAUDE.md and docs say ProBuilds (D-52).
- **Figma file "ProBuilds":** https://www.figma.com/design/hyFx4Audhn4F9KxL9bRCLD (Chime renamed it). This replaces the older Design System file named in CLAUDE.md (1mjxm…).
  - **Logo:** Touchline mark + PROBUILDS wordmark; guide and SVG exports.
  - **Design system** (one page): Overview, Colour, Typography, Spacing & layout, Radius & elevation, Components. All values are Figma variables (Colour · Primitives, Colour · Theme with Dark/Light, Tokens and Typography with Desktop/Tablet/Phone).
  - **Design:** one section per design phase; Meta Finisher (phone, version B) is the only finished screen.
  - **Archive:** every rejected logo round and old draft.
- **References:** UI8 Osnova UI (file zu1wAc8aXjcsdcmDg4rNuJ, structure) and Rayum (file MbzXVWzasW9yy8yYiFXniG, dark look), imported into Chime's drafts.
- **Type:** Barlow Condensed + Barlow (D-51). Smallest text 14 px.

### Start here next
1. **Chime:** look at the Phase 0 components in Figma (Design system → 05 · Components), especially Build card, Archetype tile, Sheet, Version tag, Score ring, Limits callout and Tab item (my screenshot tool couldn't render those). Approve or list changes.
2. **Claude:** Phase 1 · Builds, phone 390 first, built only from the components: Builds (13 archetypes), Archetype (Finisher), Meta Finisher states (specialization not reached, not yet checked, older season, copied). Then tablet and desktop.
3. **Before Phase 2 (code):** propose CLAUDE.md and DESIGN.md updates (Figma file, type; the name is done) for Chime's OK; mirror the variables into `src/styles/tokens.css`.

### Waiting on Chime
- Delete the stray Figma file g1t6DqicHT8w4Lq790DC2G; decide on the stray chat log `2026-11-21-064551-…txt` in the repo root (untracked).
- Buy probuilds.club when ready; a trademark search for ProBuilds.
- From before: record 5 faces and 13 builds on Season 2 (D-29, D-30); GoatCounter account; O-05, O-13; test a submission link (D-45).

### How to work with Chime on design (learned this session)
- Show work in Figma, not local previews; never create a new Figma file; never ask for links (imported files are listed in `~/Library/Application Support/Figma/settings.json`).
- Logos need a clear football element and real craft; rejected work goes to Archive pages, never deleted.
- Follow the UI8 design guide (no eyebrows or decorative pills, 14 px minimum, one family).

### Earlier (19–23 Nov), in short
- Phase 0 (setup) done; live at https://probuilds.pages.dev (A-14). Core lane done test-first: types, validator, loader, version wording, issue URL, issue forms (D-45); 71 unit tests.
- Sharon's PR #3 (two logo directions) and PR #4 (The Grid) reviewed; Chime chose The Touchline.
