# Progress

Newest first. Each entry: what changed, what was checked, what wasn't verified, what's next.

## Pivot: Facecard becomes Pro Clubs Hub (Thu 19 Nov 2026)

**Changed**
- Folder renamed `Facecard` to `Pro Clubs Hub` (`mv -n`; the target didn't exist; no git repo yet).
- Product is now a faces-led hub for FC 27 Clubs with meta-build cards, archetype pages, a changelog and a submit flow (D-02). Planner later (D-07). Name open; "Pro Clubs Hub" is the working title (D-15, O-01).
- Rewritten from the 18 Nov research: CLAUDE.md, DESIGN.md (new, Sinima pattern), README.md, docs/PRD.md, docs/RESEARCH.md, docs/DECISIONS.md (fresh: D-01 to D-16, A-01 to A-08, L-01 to L-13, O-01 to O-14), docs/PLAN.md (phases 0 to 3), docs/SPEC.md, docs/FORMAT.md (v1: archetype, build, face, changelog, creators), docs/HANDOFF.md, docs/KICKOFF-PROMPT.md, docs/features.json (38 items), docs/design/UI-BRIEF.md, docs/design/REFERENCES.md, .claude/settings.json, .github/workflows/ci.yml, .gitignore, .env.example.
- New content: `content/archetypes/fc27.json` (13 archetypes, sourced fields only), one example build and one example face (all `PLACEHOLDER`, `draft`), three changelog drafts from EA pages, `creators.json` (two candidates, not asked), `content/README.md`.
- Moved to `_to_delete/` (deletion isn't permitted in this folder): the old Facecard recipes `michael-jackson.fc27.json`, `zinedine-zidane.fc27.json`, their README, and the empty `content/recipes/` folder. Chime can delete `_to_delete/`.

**Checked**
- Every JSON file in `content/` and `docs/features.json` parses.
- Archetype cost-change counts sum to EA's totals (58 up, 29 down).

**Not verified**
- Level cap (55 or 75), face value display, preset and hairstyle counts: Day 0 in-game checks.
- Season 3 date; PhotoFit's Season 4 scope; whether "Pro Clubs" is a mark.
- Creator channels in `creators.json` (not opened).

**Next**
- Day 0: ask Chime the in-game checks, then O-12 (host). See `docs/KICKOFF-PROMPT.md`.

## Facecard project created (Fri 6 Nov 2026)

**Changed**
- Folder created with the plan and starter data: CLAUDE.md, PRD (with research, competitors, brainstorm, legal and risk), PLAN, SPEC, FORMAT (recipe schema v1), DECISIONS (D-01 to D-20, L-1 to L-7, O-1 to O-8), RESEARCH, HANDOFF, KICKOFF-PROMPT, UI brief draft, references plan, features.json (31 items), two example recipes with placeholder values, LICENSE, .gitignore, CI workflow, Claude settings, .env.example.

**Checked**
- `content/recipes/*.json` and `docs/features.json` parse as JSON.
- Example recipes follow `docs/FORMAT.md` by eye (no validator exists yet; Day 1 writes it).

**Not verified**
- How FC 27 shows slider values; preset count; PhotoFit status in Clubs (Day 0 in-game check).
- MediaPipe model size and licence; Cloudflare Pages setup for this repo.
- No `package.json` yet: Day 0 creates it.

**Next**
- Chime answers O-1 (name), O-4 (legal posture), O-7 (launch list). Then Day 0 (see `docs/KICKOFF-PROMPT.md`).
