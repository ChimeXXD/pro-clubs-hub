> **PRD v2.1**, 20 Nov 2026, by Sharon (`sharrygold`) with Claude. Replaces v1 of 19 Nov; v2.1 is Sharon's review after v2 merged. The name is ProBuilds (D-49, D-50). Decisions in `docs/DECISIONS.md` win where this disagrees. What changed from v1 is listed at the end.

# ProBuilds

A free, phone-first hub for EA SPORTS FC 27 Clubs players: lookalike and era faces you build step by step, each paired with a build, plus clean meta-build cards for every archetype, all dated and credited.

## Summary

Clubs players want two things for their Pro: to look like someone and to play like the meta. Copying a look today means pausing a YouTube tutorial for about 15 minutes, or following a written guide that says "medium tan shade" where the editor shows an exact value. Builds live on sites that change without a date or credit. ProBuilds leads with a library of faces (2008 Ronaldo, 2017 Ronaldo and more), each a tab-by-tab checklist with the editor's real values, checked in game and paired with a build. Beside it sit build cards for all 13 FC 27 archetypes, each tagged with its season and date, e.g. "FC 27 · Season 2 · verified <date>", with a source and credit line, plus archetype pages and a public changelog. It is a static site, free forever, built for $0. It ships within days, on Season 2, and is re-checked and updated for Season 3 on Thu 3 Dec (D-25). We leave tools to Pro Clubs HQ and win on design, mobile speed, honesty and faces (D-03).

## Who it's for

Chime and Sharon are both Clubs players, and the product starts from problems they and their friends keep hitting.

- **Players** on console with a phone in reach, setting up a Pro for a new edition or season.
- **Squads** picking a theme for a night (an era, a team of lookalikes).
- **Lookalike creators** who want credit and reach.

**When it hurts:** a new edition (everyone rebuilds their Pro), a new season (everyone re-checks builds), a squad theme night.

## What we're betting on

The full map with sources is in `docs/EVIDENCE.md`. The three bets that matter most:

| Bet | What we know (20 Nov) | How we'll know |
| --- | --- | --- |
| **1. Players will follow an exact, tickable recipe on a phone.** | Players asked EA for an easier way to copy faces in FC 24, FC 26 and FC 27, in more than one language. Written guides exist but are vague (EVIDENCE §2.1, §2.3). Nobody has asked for recipes as such. | Smoke test this weekend (EVIDENCE §3); after launch, recipes finished per week. |
| **2. Lookalike and era faces are the ones players want.** | Ronaldo requests are loud. Sharon has seen Michael Jackson faces made several times; Chime allowed him as a launch face (D-26). Some players want to copy real friends instead (EVIDENCE §2.2). | The faces named in the smoke test decide O-05. |
| **3. Players will find us and come back when the meta moves.** | No evidence yet, and v1 had no way to measure it. | Metrics below, live from launch day. |

If the smoke test fails, Chime and Sharon decide before launch whether it leads with builds instead (D-25 makes that within days).

## Research findings

Full report with sources: `docs/RESEARCH.md`. New evidence: `docs/EVIDENCE.md`.

- **The system.** 13 archetypes, Engine gone, Disruptor new. All unlocked, free resets, per-attribute respecs, Masteries, Amps ([EA Pitch Notes](https://www.ea.com/en/games/ea-sports-fc/fc-27/news/pitch-notes-fc27-the-grounds-deep-dive)).
- **Level cap 55, 1,419 AP at the cap** (A-10). Reopen if Season 3 raises it. See "Seasons and levels" below.
- **Cadence.** Launch 25 Sept; archetype re-price 22 Oct; TU 1.2.0 on 10 Nov; **Season 3 from Thu 3 Dec; Season 4 from Thu 14 Jan 2027** (EA's Launch Rewards page, D-18). About one meta change per season.
- **The face editor** shows exact values: numbered items ("Nose 116"), named options ("Warm Black"), 0 to 100 Sculpt sliders, and controls with no number measured by position (A-09, A-12). One head serves street and matchday looks (A-11). Chime records on PS5 (D-17).
- **PhotoFit** (face scanning) is still unconfirmed by EA in anything opened on 20 Nov. RESEARCH cites an EA community manager placing it in Season 4. If it accepts any photo, as the old GameFace tool did, celebrity faces get easier for everyone (O-07, EVIDENCE §2.4).
- **No public API.** Everything we publish is entered by hand.

### Seasons and levels (added 20 Nov, v2.1)

Sharon's point: as seasons go on, EA raises the level cap, so a build made at one cap can't use the points a later cap gives. What we found (sources below; most seen in search results only, 20 Nov):

- **The cap rises during the year.** FC 27 started at level 40 (962 AP) and Season 2 raised it to **55 (1,419 AP)** on 22 Oct ([Pro Clubs HQ](https://proclubshq.com/blog/pro-clubs-level-cap-rise/), [AOEAH](https://www.aoeah.com/news/4913--fc-27-pro-clubs-attribute-points-per-level--how-to-reach-max-level)). In FC 26, Clubs started at level 50 and EA said seasonal updates would raise the cap ([EA, FC 26 Clubs deep dive](https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-clubs-deep-dive)). **No Season 3 cap change has been announced** as of 20 Nov; check on Thu 3 Dec.
- **Last year's pattern (FC 26): the cap rose about every one to three months, often with a title update rather than at a season start.** Reported steps: 50 at launch; 60 with TU 1.1 ([Football Gaming Zone](https://footballgamingzone.com/ea-sports-fc/ea-fc-26-1-1-update-massively-buffs-defending-full-patch-notes/)); 60 to 75 in the December Holiday Update ([EA](https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-holiday-update)); up to 90 with TU 1.5.0 in March; 90 to 95 in May ([FPCHK](https://fpchk.com/news/112?lang=en)); 100 by the end ([Pro Clubs HQ](https://proclubshq.com/blog/pro-clubs-level-rewards/)). Sources disagree on the steps between 75 and 90. **So a December rise in FC 27 is likely but not announced**, and we should expect five or so rises a year, some between seasons. The routine in point 4 below runs on every title update, not only on season starts.
- **Levels unlock more than points.** PlayStyle slots at 5, 15, 40 and 55; PlayStyle+ at 20 and 55; Signature Perks at 10 and 45; Masteries at 10, 30 and 55 ([Pro Clubs HQ level rewards](https://proclubshq.com/blog/pro-clubs-level-rewards/), not confirmed by EA; RESEARCH §1).
- **Costs move too.** EA re-priced 87 attribute costs and reset every build on 22 Oct (D-05).

**What it means for the product:**

1. **Every build card says what it was made for:** "Level 55 · 1,419 AP", next to the version tag. `level` is already in the build format (FORMAT §Build); the AP total is a small addition, proposed here.
2. **A cap rise makes a build out of date even if no cost changed:** it leaves points unspent. A cap rise gets its own changelog entry, and every build gets a new version that spends the new points, the same routine as a season change.
3. **Most players are below the cap.** A build made at 55 doesn't tell a level-20 player where to start. Proposal for after launch, for Chime to weigh against D-07 (no planner): each build card lists the order to spend points in ("first Acceleration to 80, then…") and the level each PlayStyle and Perk unlocks at. It's content written by hand, not a calculator.
4. **The update routine (every season start and title update) checks four things:** the cap, the AP at the cap, the level unlocks and the costs, logged in RESEARCH §9 before builds are re-checked.

## Competitors

### Hard (same job, same players)

| Product | Strength | Weakness for us to use |
| --- | --- | --- |
| [Pro Clubs HQ](https://proclubshq.com/blog/about/) | Builder with live AP pricing, hundreds of builds, meta XI vote, scouting, LFG, Discord bot; honest labels | No faces; dense UI; HQ Pro at $4.99 a month or $19.99 a season ([pro](https://proclubshq.com/pro)) |
| [PRO11](https://www.pro11.net/) | 13 archetype pages, about 66 guides, planner, sourced builds | Blog layout; no faces; no creator credit |
| [ProClubsHead](https://proclubshead.com/) | Club and player stats since 2016 | No builds or faces |
| [FC Tools Hub](https://fctoolshub.com/en/guides/fc27/face-creator-guide) | FC 27 face creator guide, build saver | No face library; ads gate |
| Written face guides ([Sportsdigest](https://sportsdigest.in/how-to-create-cristiano-ronaldo-in-ea-fc-26/162926/)) | Search traffic for "how to create Ronaldo" | Vague values; Career Mode; no check in game, date or credit |
| Media build pages ([Dexerto](https://www.dexerto.com/wikis/ea-fc-27/best-clubs-builds-for-all-positions/), [RealSport101](https://realsport101.com/article/fc-27-best-winger-build-for-clubs-the-grounds-archetype-playstyles-attributes)) | Search traffic | No method, credit or verified date |
| YouTube lookalike creators | Real faces, audiences | Video only; you pause and rewind |
| [Face2Slider](https://blink.new/p/ea-fc-face-f99o5v43), [Proxi.gg](https://proxi-dxm.pages.dev/about) | Photo-to-slider demo; free builder | Unproven accuracy; guides still FC 26 |

### Soft (adjacent habits)

FUT.GG, EasySBC, FUTBIN and FUTWIZ set what players expect from a companion site: instant search, a URL for everything, fast updates. None covers Clubs. FUT.GG's home is our start screen's model (D-19).

### The opening

A faces library with the editor's exact values, each recipe checked in game, dated, credited and paired with a build, ticked off on a phone. Plus build cards that always say which season, when they were verified and who to credit. Free, fast, and friendly to creators.

## What launches

- **Home** in FUT.GG's structure: dark hub, tab pills, a grid of face cards first, then the season, latest changes and build lists (D-19).
- **Face page:** a preview of the face as made in FC 27, turnable by drag, from Chime's own in-game captures (A-16, proposed, waiting on a test clip); then recipe steps by tab with ticks (A-07), the paired build card, version tag, credit line, limits ("the game can't do this exactly") and the tutorial on tap.
- **Builds:** one card per archetype at launch, filterable by position; each with version tag and credit.
- **13 archetype pages, a changelog, Submit, About, Takedown, 404.** 40 pages in all.
- **The structure** is the sitemap and two user journeys in `docs/design/sitemap/sitemap-and-journeys.pdf` (D-21). Sharon gathers references for every screen first (Mobbin and other sites), Chime picks, and only then are the screens designed in Figma (D-14, D-28); Chime approves.

## Metrics

v1 counted output (faces live, builds live). v2 adds measures of whether players get value. Targets are set after two weeks of real numbers; we don't guess them now.

**Main metric: recipes finished per week.** A face recipe counts as finished when its last step is ticked, once per face version per device. The ticks already exist (A-07), so this is one event.

| Supporting metric | Why it matters | Read from |
| --- | --- | --- |
| **Face to build:** share of face-page visits that open the paired build | Tests whether pairing a look with a build matters (EVIDENCE #8) | An event on the paired build link |
| **Season-change return:** visits to build pages in the 7 days after a season change, against the 7 days before | Tests bet 3: do players come back when the meta moves? First reading: Season 3, Thu 3 Dec, if we are live by Thu 26 Nov (a full week before); otherwise Season 4, Thu 14 Jan 2027 | Page views |
| **Shares:** weekly visits arriving from WhatsApp, X, Reddit and Discord | Faces are the hook; shares are how hooks spread | Referrers |

**Kept from v1 (health checks):** days from a season change to updated builds (2 or fewer); Lighthouse mobile 90+; page weight within budget (A-13); credited creators (3+); accepted submissions (3+); launch post reach, logged honestly.

**How to count, for $0 and no cookies (A-17; Chime chose option B on 20 Nov, D-27):**

| Option | Gives us | Cost to the site | Catch |
| --- | --- | --- | --- |
| **A. Cloudflare Web Analytics** (we already host on Cloudflare) | Page views, referrers, devices; free, no cookies | Small script | No custom events, so no recipes-finished count |
| **B. GoatCounter, hosted** (chosen, D-27) | Page views, referrers and custom events; no cookies, no personal data | About 3.5 KB script, inside the 220 KB budget | Free for reasonable public use; re-check its terms before any ads (D-04) |
| **C. Both** | Cloudflare's Web Vitals plus GoatCounter's events | Two scripts | More to maintain |

About gets one line saying what is counted and that nothing personal is stored.

## How we'd build it

- **Static Next.js** (16.4.6, export) on Cloudflare Pages (A-14); content as JSON in `content/`, validated at build time (A-02).
- **Version tags** on every build and face (`game`, `season`, `verifiedOn`); one function words them (A-08).
- **Changelog** entries are JSON with EA source links, each listing the builds and faces it touched.
- **Patch-note routine:** EA posts an update, Chime checks affected builds in game, bumps versions, writes a changelog entry, rebuilds. Target: within 48 hours of a season change.
- **Submit** builds a prefilled GitHub issue (A-04); Chime reviews, credits and merges.
- **Two people, one gate:** Sharon works on branches and opens pull requests; only Chime merges into `main`, which GitHub enforces (D-22, D-23).
- **Face pictures: full quality, loaded smartly (proposed, v2.1).** The page-weight check (A-13) counts a page's code only, not its images, so nothing yet stops a face page from loading several megabytes on mobile data. Quality is not reduced to fix this. Each frame is exported sharp enough for an iPhone screen (twice the size it is shown at), in AVIF or WebP, which look nearly the same as the original at a fraction of the file size. The front picture loads with the page; the turn set (about 36 frames, A-16) loads in the background after the page opens, so turning is instant by the time a player touches it. The check then gets an image limit, set by measuring Chime's real clip at full quality, so the limit follows the quality and not the other way round.

**Pace (D-25, 20 Nov):** ship within days, as soon as the Must list passes, on Season 2. Chime chose this over waiting for Season 3 (D-18). The cost: all 13 builds and 5 faces are recorded on Season 2 and re-checked from Thu 3 Dec. Until 3 Dec, Season 2 is the current season, so no warning shows; from 3 Dec, anything not yet re-checked shows the older-season warning (D-05). The date is set once the screens and the first faces exist; the real limit is the screens, the core lane and 18 items recorded in game.

| Phase | When | Focus | Gate |
| --- | --- | --- | --- |
| 0 | 19 to 20 Nov | In-game checks, repo, scaffold, CI, deploy | **Passed 20 Nov** |
| 1 | Now, in parallel | Sharon: references for every screen first (Chime picks), then screens from the sitemap and the picks; smoke test. Claude: loader, version wording, issue URL, GoatCounter. Chime and Sharon: record 5 faces and 13 builds on Season 2, one match per build (D-29, D-30) | Chime has picked references for every screen; Chime approves the screens; core lane green; content recorded |
| 2 | Right after | Build every launch page; load the content | All launch pages green; content verified |
| Launch | As soon as phase 2 passes | Launch post; video if ready (open, D-25) | Live, no blocking bugs |
| Season 3 | Thu 3 Dec | Re-check everything on Season 3; changelog entry; "updated for Season 3" | Every item re-tagged Season 3, or warning showing |
| After | 4 weeks | Watch the metrics, add faces and positions, case study | Two weeks of baseline, then targets |

## Scope to launch

| Must | Should (ranked by RICE, below) | Cut (not before launch) |
| --- | --- | --- |
| Faces library, face page with ticks and paired build | 1. Submit without GitHub (O-11) | Build planner (D-07) |
| 5 verified faces | 2. Share card per face and build | Deceased subjects other than Michael Jackson (D-10, D-26) |
| 13 verified build cards with version tags and credits | 3. 15-second cut of the video | Ratings, request board, comments |
| 13 archetype pages | 4. Tutorial embeds on tap | Accounts |
| Changelog with EA sources | 5. Search across faces and builds | Stats, leaderboards, EA match data |
| Submit: builder to prefilled GitHub issue | 6. 10 faces | Photo-to-slider AI |
| About, takedown, notice on every page | 7. Featured creator spot | Ads (a later decision) |
| Validator fails the build on bad content | 8. Builds for every position | Native app |
| Budget and e2e in CI | | |
| **Counting for the main metric (GoatCounter, D-27)** | | |
| Launch post; the motion-graphics video ships with the launch or with the Season 3 update (D-25) | | |

**RICE scores** (reach 1 to 10, impact 0.25 to 3, confidence, effort in person-days; first estimates for Chime and Sharon to adjust):

| Should item | R | I | C | E | Score | Note |
| --- | --- | --- | --- | --- | --- | --- |
| Submit without GitHub (O-11) | 3 | 2 | 80% | 1 | 4.8 | Most console players likely have no GitHub account; a free form keeps the review gate |
| Share card per face and build | 8 | 2 | 50% | 2 | 4.0 | Shares are how faces spread (metrics) |
| 15-second video cut | 7 | 1 | 50% | 1 | 3.5 | Reposts on X and WhatsApp |
| Tutorial embeds on tap | 5 | 1 | 80% | 1.5 | 2.7 | Credit as a growth channel |
| Search | 6 | 1 | 80% | 2 | 2.4 | Matters more as the library grows |
| 10 faces | 8 | 2 | 50% | 8 | 1.0 | Chime's recording time is the bottleneck |
| Featured creator spot | 2 | 1 | 50% | 1 | 1.0 | Needs a creator who says yes |
| Builds for every position | 6 | 1 | 50% | 10 | 0.3 | Large recording cost; one per archetype covers launch |

If a phase overruns, cut from the bottom of this list. Never cut faces or launch day. The video is still coming, but may ship with the Season 3 update instead (D-25).

## Content sourcing and credit

1. **Facts are free.** Archetype names, PlayStyle names, EA's stated specialization targets, patch-note changes. Cite the EA page.
2. **Chime or Sharon makes every build and face in game**, from reference (D-08, D-29). That is what "verified" means. Each item names its maker in the credit line ("Made by Sharon in game") and its platform in the version tag, and goes through Chime's pull-request review. Faces and builds are made in the game's menus; a build is also played for one match before it is called meta (D-30).
3. **Credit what was followed.** If a creator's tutorial shaped a face, name the creator, link the video and embed it. Never transcribe or re-upload it.
4. **Ask first** before publishing a creator's full slider list as a recipe. Store the answer in `creators.json` (`permission`).
5. **Featured creator spots** for creators who say yes.
6. **Never bulk-copy** another site's builds, tier lists or cost tables. Linking to them is fine.
7. **Submissions** are credited by the name the submitter chooses.

## Legal and risk

- **EA content policy** ([help.ea.com](https://help.ea.com/en/articles/security-and-rules/ea-content-policy/)): no paywall (D-04); passive ads allowed later; no EA logos with our branding; no implied endorsement.
- **Notice on every page:** "Not endorsed by or affiliated with EA or its licensors. Not endorsed by the people named."
- **Naming:** no EA, FC or FUT in the name, domain or logo (D-04). Whether "Pro Clubs" is a mark is unverified; the final name avoids it (O-01).
- **Likeness:** footballers and living musicians at launch, plus Michael Jackson (D-26); names as text; no photos or drawings of real people; "inspired by", never "official" (D-10). Michael Jackson's estate actively protects his likeness, so his page is the most likely takedown: the 72-hour process must work on day one. Not legal advice; ads or any income need a fresh look first.
- **Screenshots:** only Chime's own in-game captures of their own recreations.
- **Takedown:** an email on `/takedown`; requests are actioned within 72 hours by setting `"status": "withdrawn"`.
- **Analytics:** GoatCounter, no cookies and no personal data (D-27).

## Open questions

| ID | Question | Needed by |
| --- | --- | --- |
| O-01 | The name | Before Sharon draws the logo |
| O-05 | The first 5 faces; the smoke test's named faces feed this | Phase 1 (screens use them) |
| O-07 | PhotoFit: own face only, or any photo? | Season 4 announcement |
| O-08 | Tagline (draft: "Look like a legend. Play like one.") | Launch video |
| O-11 | Submit without GitHub (ranked first among Should items) | Phase 2 |
| O-13 | Takedown email address | Phase 2 |
| A-16 | Face preview from one capture per face | Chime's test clip |
| New | The launch date, once the screens and first faces exist (D-25) | Phase 1 |
| New | The video: with the launch, or with the Season 3 update? (D-25) | Phase 1 |
| New | Michael Jackson's era and which face (D-26 allows him) | With O-05 |
| New | Does Season 3 raise the level cap? Likely: FC 26 raised it in its December update. If so, every build gets a new version ("Seasons and levels") | Thu 3 Dec |
| New | Image limit for face pictures, set from the real clip (proposed in v2.1) | Chime's test clip |

**Answered and moved to "Closed" in `DECISIONS.md`:** O-02 (A-10), O-03 (A-09, A-12), O-04 (D-18, then D-25), O-06 (D-18), O-09 (D-17), O-10 (A-11), O-12 (A-14). Answered on 20 Nov: pace (D-25), Michael Jackson (D-26), counting (D-27), Sharon records too (D-29), one match per build (D-30).

## Insights

- **The season change is the marketing calendar.** Every season, every player re-checks builds. Ship updates within 48 hours and say so.
- **Faces are the hook; builds bring people back.** This is a bet until the metrics say so.
- **Exact beats vague.** Written face guides exist; none gives the editor's real values, checked and dated.
- **Credit is a growth channel.** Creators share pages that credit and embed them.
- **PhotoFit is a threat with a likely date.** Era and celebrity faces keep their value if the scan is self-only (O-07).
- **Honesty is visible design.** Version tags and "Not yet checked in game" are UI.

## What changed in v2.1 (20 Nov, Sharon's review after merge)

- The video is no longer a launch-day must; it ships with the launch or the Season 3 update (D-25).
- The older-season warning shows only from Thu 3 Dec, on anything not yet re-checked; before then Season 2 is current.
- The season-change metric can first be read at Season 3 if we're live by Thu 26 Nov.
- "Seasons and levels" added: cap rises, level unlocks, and what they mean for build cards.
- Decided on merge: Sharon records faces and builds too, credited by name, platform tagged, reviewed by Chime (D-29); each build is recorded in the menus and played for one match before it's called meta (D-30).
- Proposed: face pictures at full quality, with the turn set loaded in the background and an image limit set from the real clip.

## What changed from v1

- Season 3 dates added; then, on merge, the launch moved to "within days" on Season 2 (D-25); phase table updated; Phase 0 marked passed.
- The repo workflow (D-22, D-23), design direction (D-19, D-21) and face preview proposal (A-16) added.
- Value kinds updated to A-09 and A-12; level cap settled (A-10).
- "What we're betting on" and `docs/EVIDENCE.md` added: evidence and assumptions marked; a smoke test alongside Chime's recording.
- Metrics now measure value; counting with GoatCounter (D-27).
- Should items ranked with RICE; "Submit without GitHub" moves to the top.
- Written face guides added as competitors; the opening reworded around exact values.
- Open questions trimmed to what is open; answered ones listed.

## Sources

v2.1 "Seasons and levels" sources (seen in search results, 20 Nov 2026): [Pro Clubs HQ, level cap rise](https://proclubshq.com/blog/pro-clubs-level-cap-rise/), [Pro Clubs HQ, level rewards](https://proclubshq.com/blog/pro-clubs-level-rewards/), [AOEAH, AP per level](https://www.aoeah.com/news/4913--fc-27-pro-clubs-attribute-points-per-level--how-to-reach-max-level), [PRO11, max level and AP](https://www.pro11.net/max-overall-rating/), [EA, FC 26 Clubs deep dive](https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-clubs-deep-dive). v1 sources (opened 18 Nov 2026) are listed in `docs/RESEARCH.md` §Sources. New sources (20 Nov 2026) are listed in `docs/EVIDENCE.md` §5. Analytics: [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/), [GoatCounter](https://www.goatcounter.com/) (seen in search results, 20 Nov 2026).
