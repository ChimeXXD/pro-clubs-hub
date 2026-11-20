# Contributing: how changes get into `main`

Two people work on this repo (D-22):

- **Chime** (`ChimeXXD`): the owner. Reviews every pull request and is the only one who merges into `main`.
- **Sharon** (`sharrygold`): a collaborator. Works on branches and opens pull requests.

If you are an AI agent (Claude Code, Codex, Cursor or any other), this file is your instruction for anything to do with git. Read "For AI agents" below before you commit or push.

## The one rule

**Nothing goes into `main` except through a pull request that Chime has reviewed and merged.**

- Never push to `main`. Never merge your own pull request.
- GitHub can't lock `main` on this plan (a private repo on GitHub Free), so this rule is an agreement. A check (`.github/workflows/main-guard.yml`) opens an issue for Chime whenever someone other than Chime pushes to `main` (when the account has Actions minutes left), and the push may be reverted.

## How to make a change, step by step

1. **Start from the latest `main`.**
   ```bash
   git switch main
   git pull
   ```
2. **Make a branch for one piece of work.** Name it `<type>/<what>`, using the same types as commit messages: `feat/`, `fix/`, `docs/`, `design/`, `content/`, `test/`, `chore/`.
   ```bash
   git switch -c design/home-screen
   ```
   One branch, one unit of work: one screen, one feature, one bug, one document. Small pull requests get reviewed faster.
3. **Read before you change anything.** `CLAUDE.md` (the rules), `docs/HANDOFF.md` (where things stand), `docs/design/sitemap/sitemap-and-journeys.pdf` (the structure the UI follows), and for UI work `DESIGN.md`.
4. **Commit as you go** with conventional messages: `feat: …`, `fix: …`, `docs: …`, `design: …`, `content: …`, `test: …`, `chore: …`. Say what changed, in plain words.
5. **Run the checks** before you push (code changes; skip for docs-only):
   ```bash
   npm run lint && npm run typecheck && npm test && npm run build
   ```
   CI runs the full set (including e2e) on every pull request when the account has Actions minutes left. When it can't start (it says the job "was not started"), say so in the pull request; Chime runs the checks locally during review.
6. **Push your branch** (never `main`):
   ```bash
   git push -u origin design/home-screen
   ```
7. **Open a pull request into `main`:**
   ```bash
   gh pr create --base main --title "design: home screen" --body-file pr.md
   ```
   or use the "Compare & pull request" button on GitHub. Fill in the description below.
8. **Tell Chime** the pull request is ready (its number or link). Chime reviews it, often with Claude, and either merges it or asks for changes.
9. **If changes are asked for,** commit them on the same branch and push again. The pull request updates itself. Don't open a new one.
10. **After Chime merges,** switch back and start fresh:
    ```bash
    git switch main && git pull
    git branch -d design/home-screen
    ```

## What to write in the pull request

```markdown
## What changed
One or two sentences, in plain words.

## Why
The plan item, decision or question this answers (e.g. "PLAN Phase 1: design screens", "D-21", "sitemap page 12, question 3").

## How I checked it
The commands you ran and their result (lint, typecheck, test, build), or "docs only".
For UI: screenshots at phone width (390 px) and desktop (1440 px).

## Anything that changes a decision
"None", or which decision it touches and why. Don't edit existing decisions: propose a new one (see below).
```

## Keeping your branch up to date

If `main` moved while you were working, or GitHub says there are conflicts:

```bash
git switch main && git pull
git switch design/home-screen
git merge main        # fix any conflicts, commit, then push
```

Force-push only your own branch, and only with `git push --force-with-lease`. Never force-push `main`.

## Rules every change follows (from `CLAUDE.md`)

- **No secrets** (keys, tokens, passwords) in any file.
- **No images of real people**: no photos, drawings, AI portraits or silhouettes. Names appear as plain text. Face pictures are only Chime's own in-game captures.
- **No EA material:** no logos, fonts, card art, archetype icons or screenshots in the repo.
- **No made-up game values.** Slider values, attributes and build stats come from Chime in game. Anything not known yet is the string `"PLACEHOLDER"` and its file stays `"status": "draft"`.
- **No new dependency** without Chime's OK. Versions are pinned exactly (no `^`).
- **Decisions are not edited.** If something you need contradicts `docs/DECISIONS.md`, say so in the pull request, or add it under "Open" in `docs/DECISIONS.md`, and let Chime decide.
- Colours, type and spacing come from tokens (`src/styles/tokens.css`), never hard-coded.

## For AI agents

Follow these exactly when you work in this repo for Sharon (or anyone other than Chime):

1. **Before any commit, check the branch** with `git branch --show-current`. If it says `main`, stop and create a branch first (step 2 above). Never commit to `main`.
2. **Never run** `git push origin main`, `git push` while on `main`, `gh pr merge`, or anything that changes repo settings, branch rules, collaborators or visibility.
3. **Push only the current feature branch**, then open a pull request with `gh pr create --base main` and a description in the format above. Ask your human before pushing.
4. **Don't change** `CLAUDE.md`, `CONTRIBUTING.md`, `.github/workflows/`, `.claude/proof.json` or any existing decision in `docs/DECISIONS.md` unless your human asks and the pull request says so in "Anything that changes a decision".
5. **Keep one pull request to one unit of work**, and say in it what you ran to check it. Don't claim a check passed unless you ran it.
6. **When CLAUDE.md says "ask Chime"** and you're working with Sharon, write the question in the pull request description for Chime instead of guessing.

## For Chime: reviewing a pull request

- Ask Claude: "review PR #12". Claude reads the diff, checks it against the spec, sitemap and decisions, and runs the checks on a local copy (`gh pr checkout 12`).
- Approve and merge on GitHub with **Squash and merge** (one tidy commit per pull request on `main`), or comment with what to change.
- If the main guard opens an issue about a direct push, look at the commit it names. Keep it, or revert it with `git revert <sha>`.
