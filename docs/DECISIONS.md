# Decisions

Written 19 Nov 2026, when the Facecard folder became Pro Clubs Hub. The Facecard log (6 Nov) is retired; this file starts again at D-01. Claude CLI treats decisions as fixed. To change one, add a new entry that supersedes it. Never edit an old entry.

Kinds: **D-** decided by Chime. **A-** architecture proposal (Claude's call until Chime objects). **L-** lesson carried from Meridian, CenterSpot and Sinima. **O-** open question.

## Chime's calls (19 Nov 2026)

| ID | Decision | Why |
| --- | --- | --- |
| D-01 | **Portfolio project with a real public launch.** Built with Claude Code, launched with a motion-graphics video, $0 budget. | Same frame as Sinima. A live link, an open repo and a launch moment are the portfolio proof. |
| D-02 | **A FUT.GG-style hub for FC 27 Clubs, faces-led, with meta builds as cards.** Lead with lookalike and era faces, each paired with a build. Clean build cards for all 13 archetypes and every position. Archetype pages. Public changelog. | Research: no site has an organised faces library; Pro Clubs HQ owns build tools (`docs/RESEARCH.md` §3). |
| D-03 | **Don't fight Pro Clubs HQ on tools.** Win on design, mobile speed, always free and the faces library. | PCHQ has a builder, hundreds of builds, a meta XI, scouting and a paid tier. Matching it alone is a losing race. |
| D-04 | **Always free. No paywall, ever.** Passive banner ads allowed later, by a new decision. No "EA", "FC" or "FUT" in the name, domain or logo. Notice on every page: "Not endorsed by or affiliated with EA or its licensors. Not endorsed by the people named." | EA's content policy bars paywalls (Patreon named), allows passive ads, asks for the notice and bars implying endorsement. |
| D-05 | **Every build and face carries a version tag** ("FC 27 · Season 2 · verified 19 Nov 2026") **and a source and credit line.** Unverified content says so in words. An older season's content shows a warning. | EA re-priced 87 attribute costs and reset every build on 22 Oct. A build without a date can be wrong overnight. |
| D-06 | **A public changelog of meta changes.** One entry per EA update that moves the meta, with the EA source link and what changed on the site. | Patch notes do move the meta (archetype update, TU 1.2.0). The changelog is also the launch story for each season. |
| D-07 | **No build planner at launch.** It comes only after Chime verifies the cost tables in game. | EA doesn't publish costs or caps. Other sites' tables are their work (D-08). |
| D-08 | **Content sourcing rules.** Facts are free. Chime makes builds and faces themself in game from reference. Credit and link any creator tutorial they followed. Embed creator videos; never re-upload or transcribe them. Ask before publishing a creator's full slider list. Offer "featured creator" spots. Never bulk-copy another site's builds or cost tables. | Honest sourcing is the edge over media sites that credit no one, and it makes creator partnerships possible. |
| D-09 | **Community at launch: a recipe and build builder that produces a submission Chime reviews before publishing** (prefilled GitHub issue or form), credited. Ratings and a request board come later. | $0, moderated by default, no database. |
| D-10 | **Launch faces: footballers and living musicians only. No Michael Jackson at launch.** Names as text only. No photos of real people. Only Chime's own in-game screenshots of their recreations. Takedowns acted on within 72 hours. | Lowers right-of-publicity risk. A protective estate is the highest risk; living public figures named as text in a free guide are lower. |
| D-11 | **Stack:** Next.js 16.4.6 static export, React 19.3.1, TypeScript 5.9.3 strict, Tailwind 4.3.3, ESLint 9, Vitest, Playwright 1.64.1, Node 22, npm, exact pins. | Sinima's stack, including its 16.4.6 security patch (Sinima D-115). Nothing new to learn. |
| D-12 | **Public repo from Day 0, MIT.** Repo `ChimeXXD/pro-clubs-hub` until the name lands; GitHub redirects after a rename. | Sinima D-30: Actions would not run on a private repo without a payment method. |
| D-13 | **Day 0 in-game checks before any format is final:** how the face editor shows values (numbers or bars), preset count, level cap (55 or 75). Formats support both `number` and `notch` values. | No source we opened settles these. Committing early means rewriting every recipe. |
| D-14 | **Figma is the design source of truth:** a Design System page (tokens as variables, text and effect styles, components with states) and a Design screens page (phone, iPad, desktop). Build from them. | Sinima D-66: building from a Figma system made implementation easier and consistent. |
| D-15 | **The name is not decided.** Working title "Pro Clubs Hub" everywhere. The final name must cover builds too (not only faces) and avoid EA, FC and FUT. "Facecard" is at most the faces feature's name. | Chime: "we'll think about it later". |
| D-16 | **Launch rides a season change** (Season 3, due in December). Chime builds Oya Ball side by side: one dev server at a time across both. | A season change is when every Clubs player re-checks builds. |

## Day 0 findings (20 Nov 2026)

| ID | Decision | Why |
| --- | --- | --- |
| D-17 | **Chime records faces and builds on PS5.** `versionTag.platform` is `"ps5"` on Chime's content. Closes O-09; whether editors differ by platform stays unchecked (the Xbox captures in RESEARCH §9 look the same). | Chime's answer, 19 Nov. |
| A-10 | **Level cap 55, 1,419 AP at the cap**, taken as fact. Closes O-02. Reopen if Season 3 (3 Dec) raises it. | Three independent sources agree and Chime's LVL 42 rules out 40; only Dexerto says 75 (RESEARCH §9). |
| A-11 | **One head serves both the street and the matchday look**, so `target.look` stays `"matchday"` and needs no second recipe. Closes O-10; reopen if a face looks different in a match. | The look switch exists only on Gear / Outfit; no capture of the head editor has one (RESEARCH §9). |
| A-12 | **Controls with no number are stored as positions measured from Chime's screenshots.** Skin Tone: `position` (knob's place along the track, 0–100). Visual Age: `{ toward, percent }`, with 100 meaning "LIMIT REACHED". `notch` is dropped. `sculpt` may be `null` for a quick face. Closes O-03: Weight and Definition use the same `mode` field and get checked on Chime's first face recording. | JaxStash's lmlnVZWi8YQ (frame from Chime, full storyboard): Visual Age is an analog pad with exact end stops; Skin Tone has no number and tutorials have viewers match the knob by eye; quick tutorials skip Sculpt (RESEARCH §9). |

## Architecture proposals

| ID | Proposal | Why |
| --- | --- | --- |
| A-01 | **Host on Cloudflare Pages (free)**, deploying `out/` from `main`. | D-04 allows ads later. The Facecard research (6 Nov) found Vercel Hobby is non-commercial only; not re-checked on 19 Nov. Chime confirms (O-12). |
| A-02 | **Content is JSON in `content/`, git is the CMS.** Schemas in `docs/FORMAT.md`; `validate.ts` runs before every build and in CI. | Free, reviewable, versioned. Submissions arrive as issues that become diffs. |
| A-03 | **MDX only if long guides need it.** Not at launch; needs Chime's OK as a dependency. | Cards and steps are data, not prose. |
| A-04 | **Submit builds a GitHub issue URL in the browser** (`/issues/new?template=…&body=…`). No server. A form fallback for people without GitHub is O-11. | $0 and fits D-09. |
| A-05 | **Creator videos load on tap** (a facade with the title and channel, then a `youtube-nocookie.com` iframe). | Keeps the page budget; no YouTube cookies until a viewer chooses to play. |
| A-06 | **Page-weight budget set from the Day 0 empty-app measurement** and enforced in CI. | Sinima D-21. Lagos mobile data. |
| A-07 | **Step ticks live in `localStorage`**, keyed by face id and version. A new version starts fresh. No accounts. | Tick-as-you-go is the faces interaction; accounts need a server. |
| A-08 | **Version wording comes from one function**, `lib/content/version.ts`, tested. | One place for "verified 19 Nov 2026", "Not yet checked in game" and the old-season warning. |
| A-09 | **Face recipes follow the editor's real structure** (20 Nov; supersedes the value kinds in D-13 and the face shape first written in FORMAT v1, which no content used). Preset counted among photo presets only; `parts` for the Skin, Head, Face and Hair tabs with `item` ("Nose 116") and `named` ("Warm Black") values; `sculpt` with mode, layer, region, sub-region and 0–100 `slider` values carrying their end labels; `visualAge` held at `null` until seen. `grid` and `option` are gone; `notch` is reserved. Answers most of O-03; O-03 closes when Chime confirms on PS5 the Skin tab's first bar, Visual Age and the Weight and Definition modes. | RESEARCH §9: Chime's screenshots plus still frames from JaxStash's FC 27 face playlist. Screen rows differ between players because saved heads come first in the grid. |

## Lessons carried

| ID | Lesson | Source | How it applies |
| --- | --- | --- | --- |
| L-01 | Renders are not enough; a bug only showed on the device. | Meridian, CenterSpot | Check face steps on Chime's iPhone next to the TV before a gate. |
| L-02 | Tests first on core logic caught real bugs. | Meridian, CenterSpot | Validator, loader and version wording are test-first. |
| L-03 | "Trust was the product." | Meridian | Version tags and credit lines in words, always visible. |
| L-04 | A numbered decisions log kept many sessions consistent. | All three | This file. Supersede, never edit. |
| L-05 | Honest numbers read as senior. | Meridian, CenterSpot | Publish page weights, Lighthouse and launch numbers, misses included. |
| L-06 | Parallel agents and servers collided on one machine. | Sinima L-7, CenterSpot L-4 | One dev server and one Playwright run at a time, shared with Oya Ball. |
| L-07 | A private repo blocked GitHub Actions without a payment method. | Sinima D-30 | Public from Day 0 (D-12). |
| L-08 | `playwright install --with-deps` hung on the runner's apt mirror. | Sinima CI, 11 Nov | No `--with-deps`; a 5-minute step timeout. |
| L-09 | A Figma Design System page made the build faster and consistent. | Sinima D-66 | D-14. |
| L-10 | Motion skills planned but never run until a pass forced them. | Sinima D-102 | Name the skills that ran in each UI unit's PROGRESS entry. |
| L-11 | Next.js 16.4.3 printed a security notice; 16.4.6 fixed it. | Sinima D-115 | Start on 16.4.6. |
| L-12 | Hovers came out too dark twice. | Sinima D-110, D-111 | Start faint: 2 % hover fills (DESIGN.md). |
| L-13 | Picking a name late cost a rename. | Agmen, via Facecard L-7 | Repo starts as `pro-clubs-hub`; rename once, when O-01 closes. |

## Open

| ID | Question | Owner |
| --- | --- | --- |
| O-01 | **The name.** Candidates: Dressing Room, Tunnel, ProForma, Locker, Pitchface, Archetype Atlas. Rules: covers builds and faces, no EA, FC or FUT. Pitchface leans on faces only, against D-15. "Pro Clubs" was EA's own mode name; whether it is a registered mark is unverified, so keep it out of the final name. Search each name before picking. | Chime |
| O-02 | **Level cap: 55 or 75?** Pro Clubs HQ and PRO11 say 55 since 22 Oct (1,419 AP). Dexerto says 75. EA's post doesn't say. Check in game on Day 0. | Chime |
| O-03 | **How does the face editor show values?** Numbers, bars or notches; ranges; preset count and grid; hairstyle and beard counts. Day 0. | Chime |
| O-04 | **Launch date.** Proposal: within 48 hours of Season 3 going live, never Tue 15 to Fri 18 Dec (Sinima launches 15 Dec; Avengers: Doomsday opens 18 Dec). If Season 3 lands before 19 Dec, launch Sat 19 or Mon 21 Dec as "updated for Season 3". | Chime |
| O-05 | **First 5 faces and first builds.** Proposal: 2008 Ronaldo, 2017 Ronaldo, one more footballer era, Kanye West, one more living musician; builds for the 13 archetypes, one per archetype, then one per position. | Chime |
| O-06 | **Season 3 timing.** Pro Clubs HQ says December; no exact date found. Watch EA's news page. | Chime and Claude |
| O-07 | **PhotoFit impact.** EA's community manager said face scanning is on the roadmap for Season 4 (EA forum, about 12 days before 19 Nov). If it lets anyone scan a photo of a celebrity, the faces library's value drops; if it is your own face only, era faces keep their value. Re-check when Season 4 is announced. | Chime |
| O-08 | **Tagline.** Draft: "Look like a legend. Play like one." | Chime |
| O-09 | **Platform Chime records on** (PS5, Xbox, PC). Do editors differ? | Chime |
| O-10 | **Street look vs matchday look.** FC 27 customises them separately. Is the face shared, or only clothes? Faces default to matchday until checked. | Chime |
| O-11 | **Submissions without GitHub.** A Google Form fallback, or GitHub only at launch? | Chime |
| O-12 | **Host.** Cloudflare Pages (A-01) or Vercel Hobby like Sinima. | Chime |
| O-13 | **Takedown email address.** | Chime |
| O-14 | **How the cost tables get verified for the later planner.** Proposal: Chime records each archetype's cost per point band in game, 13 sessions, logged in `docs/RESEARCH.md`. | Chime |
