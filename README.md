# ProBuilds

[![CI](https://github.com/ChimeXXD/probuilds/actions/workflows/ci.yml/badge.svg)](https://github.com/ChimeXXD/probuilds/actions/workflows/ci.yml)

**Look like a legend. Play like one.** *(draft)* A free, phone-first hub for EA SPORTS FC 27 Clubs players: lookalike and era faces you build step by step, each paired with a build, plus meta-build cards for all 13 archetypes, each dated and credited.

> Live (work in progress): https://probuilds.club
>
> Work in progress by [Chime Ekpendu](https://chimexd.work), built with Claude Code. The repo is public from day one.

- **What and why:** [`docs/PRD.md`](docs/PRD.md) · **Research:** [`docs/RESEARCH.md`](docs/RESEARCH.md)
- **Plan:** [`docs/PLAN.md`](docs/PLAN.md) · **Decisions:** [`docs/DECISIONS.md`](docs/DECISIONS.md) · **Spec:** [`docs/SPEC.md`](docs/SPEC.md)
- **Content formats:** [`docs/FORMAT.md`](docs/FORMAT.md): open JSON for faces, builds, archetypes and the changelog
- **How content is sourced:** [`content/README.md`](content/README.md)

## How content is made

Every face and build is made by hand in the game and tagged with the season and the date it was checked. Creators whose tutorials helped are credited and linked. Nothing is copied from other sites.

## Contributing

Use the Submit page (coming soon) to send a face or a build. It opens a GitHub issue; every submission is reviewed and credited before it goes live.

## Build

Requires Node 22 (`.nvmrc`).

```bash
npm ci
npm run dev
npm test
npm run build      # static export to out/ (checks content/ first)
npm run budget     # page-weight budget on out/
npm run test:e2e   # Playwright at 390 and 360 wide
```

## Not affiliated

Not endorsed by or affiliated with EA or its licensors. Not endorsed by the people named. No images of real people and no game assets are included. To ask for something to be removed, see the Takedown page; we act within 72 hours.

## Licence

MIT. See [LICENSE](LICENSE).
