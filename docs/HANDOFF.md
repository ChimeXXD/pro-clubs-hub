# Handoff: read this first when you pick the project back up

## Latest: Wed 25 Nov 2026. All five design phases drawn; what's left before code

Nothing is running (no dev server or watcher). Figma file: https://www.figma.com/design/hyFx4Audhn4F9KxL9bRCLD (page "Design screens", one section per phase; rejected work on "Archive").

### Where things stand
- **Phases 1–5 are designed at phone 390, tablet 834 and desktop 1440**, one row per screen. Decisions D-66 to D-95 cover this session; DESIGN.md holds the rules Chime set (type roles §Type, weight beside height, cream-pill toast, lime-tab nav).
- **Changed shape this session:** Submit is "Submit a build" only; faces are requested and voted on (D-83, D-84). The build editor fills AP from the level, sets attributes by slider, typing or − / +, limits PlayStyle+ to the archetype's own (D-85 to D-88), records height and weight (D-90), and shares the player's card with a default mannequin face (D-89). About and Takedown are option C (D-91). The 404 is the replay card, no faces row and no search (D-93, D-95).
- **Toast and bottom nav picked** (D-94): changed in the components, so every screen uses them. **Supabase approved** for face requests (D-96).
- **Deadline:** Season 3 on Thu 3 Dec (D-25). Launch is on Season 2, before then.

### Design status
Designed and checked: every screen and state at phone, tablet and desktop, link previews, and components for the new parts (D-97). Drawn copies were swapped for instances where the content carries over (90 PlayStyle chips, 6 slots, 45 request rows, and on phone the AP counter, height-and-weight card and replay card). Attribute rows stay drawn: each slider's position follows its value, which code drives. The mannequin is redrawn and is the default face of every build (D-98).

### Decisions
All of Chime's open decisions are made (D-96, D-99): Supabase for face requests, listings and short share links; A-18 approved; first faces and builds named; tagline kept. Still needs Chime's hands: the 15-second PS5 turn clip for A-16, and the in-game checks below.

### Needs checking in game (blocks the editor's rules, not the design)
- The 39 specializations and their PlayStyle+ (RESEARCH §10.4).
- Each archetype's height and weight range, what they change, and the AcceleRATE cut-offs (§10.3, sources disagree on Lengthy).
- Attribute prices per archetype (O-14), before the live "AP left" counter turns on (D-85).

### Pull requests waiting on Chime
- #7 level engine ported from the prototype (Sharon), #8 six key stats and GK Kicking (Sharon), #9 athlete faces and plain face titles (Sharon, D-68, D-69).

### Before code, in order
1. Chime answers the decisions above and approves each phase (rule 10: on the iPhone next to the TV).
2. Claude swaps the drawn copies for component instances.
3. `docs/design/UI-BRIEF.md` §1–3 filled; `src/styles/tokens.css` mirrors the Figma variables; CLAUDE.md points at Figma file hyFx4Audhn4F9KxL9bRCLD (it still names 1mjxm…).
4. Then build, phase by phase, tests first for `src/lib/`.

### How to work with Chime on design (learned)
- Show work in Figma, never a new file; rejected work goes to Archive, never deleted.
- Three options per new screen when asked; Chime picks; then tablet and desktop (D-58).
- One type style per role (DESIGN.md §Type); check renders up close before showing; never invent values (samples are labelled).
