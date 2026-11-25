# Handoff: read this first when you pick the project back up

## Latest: Wed 25 Nov 2026. All five design phases drawn; what's left before code

Nothing is running (no dev server or watcher). Figma file: https://www.figma.com/design/hyFx4Audhn4F9KxL9bRCLD (page "Design screens", one section per phase; rejected work on "Archive").

### Where things stand
- **Phases 1–5 are designed at phone 390, tablet 834 and desktop 1440**, one row per screen. Decisions D-66 to D-95 cover this session; DESIGN.md holds the rules Chime set (type roles §Type, weight beside height, cream-pill toast, lime-tab nav).
- **Changed shape this session:** Submit is "Submit a build" only; faces are requested and voted on (D-83, D-84). The build editor fills AP from the level, sets attributes by slider, typing or − / +, limits PlayStyle+ to the archetype's own (D-85 to D-88), records height and weight (D-90), and shares the player's card with a default mannequin face (D-89). About and Takedown are option C (D-91). The 404 is the replay card, no faces row and no search (D-93, D-95).
- **Toast and bottom nav picked** (D-94): changed in the components, so every screen uses them.
- **Deadline:** Season 3 on Thu 3 Dec (D-25). Launch is on Season 2, before then.

### Not designed yet
1. **Link-preview images (1200 × 630), Should (Phase 5):** a face one is missing; the build one exists in Phase 1. The two Phase 5 placeholders are still empty.
2. **States still only on phone:** build page states (specialization not reached, not yet checked, older season, link copied) and face page states (not started, in progress, no results, finished, ticks reset). D-58 asks for tablet and desktop of every screen; states may follow their page's layout. Chime to say.
3. **Submit a build states:** an error (e.g. an attribute over its cap, nothing picked), "Send for listing" done, and an empty or loading moment, if any.
4. **Request a face states:** after sending a request, "already requested, vote instead", voted, an empty list, and how a request reaches Chime for moderation.
5. **A way into Request a face from the Faces library** (it lives under the Faces tab but nothing links to it yet).
6. **D-80 (4):** no search entry on phone, and the bottom nav has no "no tab" state (About, Takedown and 404 show Home as current).
7. **Components for the new parts** before code: attribute row (stepper, typed value, slider), PlayStyle chip, PlayStyle+ slot, height-and-weight card, replay card, request row with vote.

### Decisions Chime hasn't made
- **O-19** which free database for face requests (proposal: Supabase free tier; a new service and dependency).
- **How "Send for listing" reaches Chime** now that a database is coming: GitHub issue (A-04, needs a GitHub account) or the same database. Also O-11 (submissions without GitHub).
- **What the share link points to** (probuilds.club/b/your-finisher is drawn): a static site can't host a page per unlisted build unless the build is stored (database) or packed into the link itself.
- **A-18** Sharon's format fields (badge, picture, spend, specializations, turn) plus the new submit fields; needs Chime's OK before code.
- **A-16** the face turn capture (waits on Chime's 15-second test clip).
- **O-05** first five faces and first builds; **O-08** tagline ("Look like a legend. Play like one." is still a draft).
- **Link previews (Should):** make them now or after launch.
- **Default face:** keep the drawn mannequin, or replace it with an in-game screenshot of a default Pro.

### Needs checking in game (blocks the editor's rules, not the design)
- The 39 specializations and their PlayStyle+ (RESEARCH §10.4).
- Each archetype's height and weight range, what they change, and the AcceleRATE cut-offs (§10.3, sources disagree on Lengthy).
- Attribute prices per archetype (O-14), before the live "AP left" counter turns on (D-85).

### Pull requests waiting on Chime
- #7 level engine ported from the prototype (Sharon), #8 six key stats and GK Kicking (Sharon), #9 athlete faces and plain face titles (Sharon, D-68, D-69).

### Before code, in order
1. Chime answers the decisions above and approves each phase (rule 10: on the iPhone next to the TV).
2. Claude designs the remaining states and components (list above).
3. `docs/design/UI-BRIEF.md` §1–3 filled; `src/styles/tokens.css` mirrors the Figma variables; CLAUDE.md points at Figma file hyFx4Audhn4F9KxL9bRCLD (it still names 1mjxm…).
4. Then build, phase by phase, tests first for `src/lib/`.

### How to work with Chime on design (learned)
- Show work in Figma, never a new file; rejected work goes to Archive, never deleted.
- Three options per new screen when asked; Chime picks; then tablet and desktop (D-58).
- One type style per role (DESIGN.md §Type); check renders up close before showing; never invent values (samples are labelled).
