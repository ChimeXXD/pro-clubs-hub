> **PRD v2**, 20 Nov 2026, by Sharon (`sharrygold`) with Claude. Replaces v1 of 19 Nov. "Pro Clubs Hub" is a working title (O-01). Decisions in `docs/DECISIONS.md` win where this disagrees. What changed from v1 is listed at the end.

# Pro Clubs Hub

A free, phone-first hub for EA SPORTS FC 27 Clubs players: lookalike and era faces you build step by step, each paired with a build, plus clean meta-build cards for every archetype, all dated and credited.

## Summary

Clubs players want two things for their Pro: to look like someone and to play like the meta. Copying a look today means pausing a YouTube tutorial for about 15 minutes, or following a written guide that says "medium tan shade" where the editor shows an exact value. Builds live on sites that change without a date or credit. Pro Clubs Hub leads with a library of faces (2008 Ronaldo, 2017 Ronaldo and more), each a tab-by-tab checklist with the editor's real values, checked in game and paired with a build. Beside it sit build cards for all 13 FC 27 archetypes, each tagged "FC 27 · Season 3 · verified <date>" with a source and credit line, plus archetype pages and a public changelog. It is a static site, free forever, built for $0, and launched with a motion-graphics video on Sat 19 or Mon 21 Dec, after Season 3 lands on Thu 3 Dec (D-18). We leave tools to Pro Clubs HQ and win on design, mobile speed, honesty and faces (D-03).

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
| **1. Players will follow an exact, tickable recipe on a phone.** | Players ask EA for shareable face codes in every edition since FC 24, in more than one language. Written guides exist but are vague (EVIDENCE §2.1, §2.3). Nobody has asked for recipes as such. | Smoke test this weekend (EVIDENCE §3); after launch, recipes finished per week. |
| **2. Lookalike and era faces are the ones players want.** | Ronaldo requests are loud. No evidence found yet for musician faces. Some players want to copy real friends instead (EVIDENCE §2.2). | The faces named in the smoke test decide O-05. |
| **3. Players will find us and come back when the meta moves.** | No evidence yet, and v1 had no way to measure it. | Metrics below, live from launch day. |

If the smoke test fails, Chime and Sharon decide before Thu 3 Dec whether the launch leads with builds instead.

## Research findings

Full report with sources: `docs/RESEARCH.md`. New evidence: `docs/EVIDENCE.md`.

- **The system.** 13 archetypes, Engine gone, Disruptor new. All unlocked, free resets, per-attribute respecs, Masteries, Amps ([EA Pitch Notes](https://www.ea.com/en/games/ea-sports-fc/fc-27/news/pitch-notes-fc27-the-grounds-deep-dive)).
- **Level cap 55, 1,419 AP at the cap** (A-10). Reopen if Season 3 raises it.
- **Cadence.** Launch 25 Sept; archetype re-price 22 Oct; TU 1.2.0 on 10 Nov; **Season 3 from Thu 3 Dec; Season 4 from Thu 14 Jan 2027** (EA's Launch Rewards page, D-18). About one meta change per season.
- **The face editor** shows exact values: numbered items ("Nose 116"), named options ("Warm Black"), 0 to 100 Sculpt sliders, and controls with no number measured by position (A-09, A-12). One head serves street and matchday looks (A-11). Chime records on PS5 (D-17).
- **PhotoFit** (face scanning) is still unconfirmed by EA in anything opened on 20 Nov. RESEARCH cites an EA community manager placing it in Season 4. If it accepts any photo, as the old GameFace tool did, celebrity faces get easier for everyone (O-07, EVIDENCE §2.4).
- **No public API.** Everything we publish is entered by hand.

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
- **The structure** is the sitemap and two user journeys in `docs/design/sitemap/sitemap-and-journeys.pdf` (D-21). Sharon designs the screens from it in Figma (D-14); Chime approves.

## Metrics

v1 counted output (faces live, builds live). v2 adds measures of whether players get value. Targets are set after two weeks of real numbers; we don't guess them now.

**Main metric: recipes finished per week.** A face recipe counts as finished when its last step is ticked, once per face version per device. The ticks already exist (A-07), so this is one event.

| Supporting metric | Why it matters | Read from |
| --- | --- | --- |
| **Face to build:** share of face-page visits that open the paired build | Tests whether pairing a look with a build matters (EVIDENCE #8) | An event on the paired build link |
| **Season-change return:** visits to build pages in the 7 days after a season change, against the 7 days before | Tests bet 3: do players come back when the meta moves? First reading: Season 4, Thu 14 Jan 2027 | Page views |
| **Shares:** weekly visits arriving from WhatsApp, X, Reddit and Discord | Faces are the hook; shares are how hooks spread | Referrers |

**Kept from v1 (health checks):** days from a season change to updated builds (2 or fewer); Lighthouse mobile 90+; page weight within budget (A-13); credited creators (3+); accepted submissions (3+); launch post reach, logged honestly.

**How to count, for $0 and no cookies (proposal A-17, needs Chime's OK as a third-party script):**

| Option | Gives us | Cost to the site | Catch |
| --- | --- | --- | --- |
| **A. Cloudflare Web Analytics** (we already host on Cloudflare) | Page views, referrers, devices; free, no cookies | Small script | No custom events, so no recipes-finished count |
| **B. GoatCounter, hosted** (recommended) | Page views, referrers and custom events; no cookies, no personal data | About 3.5 KB script, inside the 220 KB budget | Free for reasonable public use; re-check its terms before any ads (D-04) |
| **C. Both** | Cloudflare's Web Vitals plus GoatCounter's events | Two scripts | More to maintain |

About gets one line saying what is counted and that nothing personal is stored.

## How we'd build it

- **Static Next.js** (16.4.6, export) on Cloudflare Pages (A-14); content as JSON in `content/`, validated at build time (A-02).
- **Version tags** on every build and face (`game`, `season`, `verifiedOn`); one function words them (A-08).
- **Changelog** entries are JSON with EA source links, each listing the builds and faces it touched.
- **Patch-note routine:** EA posts an update, Chime checks affected builds in game, bumps versions, writes a changelog entry, rebuilds. Target: within 48 hours of a season change.
- **Submit** builds a prefilled GitHub issue (A-04); Chime reviews, credits and merges.
- **Two people, one gate:** Sharon works on branches and opens pull requests; only Chime merges into `main`, which GitHub enforces (D-22, D-23).

| Phase | Dates | Focus | Gate |
| --- | --- | --- | --- |
| 0 | 19 to 22 Nov | In-game checks, repo, scaffold, CI, deploy | **Passed 20 Nov** |
| 1 | 23 to 29 Nov | Design screens in Figma from the sitemap; loader, version wording and issue URL, tests first; start recording faces; **smoke test and metrics set-up** | Chime approves phone, iPad and desktop screens; core lane green |
| 2 | 30 Nov to 13 Dec | Build every page; **Thu 3 Dec: Season 3 changelog entry, then record 13 builds on Season 3**; finish 5 faces; video script and storyboard | All launch pages green; content verified |
| 3 | 14 to 21 Dec | Harden, video final, launch. Nothing goes live Tue 15 to Fri 18 Dec | Live Sat 19 or Mon 21 Dec, "updated for Season 3" |
| After | 4 weeks | Watch the metrics, add faces and positions, case study | Two weeks of baseline, then targets |

## Scope to launch

| Must | Should (ranked by RICE, below) | Cut (not before launch) |
| --- | --- | --- |
| Faces library, face page with ticks and paired build | 1. Submit without GitHub (O-11) | Build planner (D-07) |
| 5 verified faces | 2. Share card per face and build | Michael Jackson and deceased stars (D-10) |
| 13 verified build cards with version tags and credits | 3. 15-second cut of the video | Ratings, request board, comments |
| 13 archetype pages | 4. Tutorial embeds on tap | Accounts |
| Changelog with EA sources | 5. Search across faces and builds | Stats, leaderboards, EA match data |
| Submit: builder to prefilled GitHub issue | 6. 10 faces | Photo-to-slider AI |
| About, takedown, notice on every page | 7. Featured creator spot | Ads (a later decision) |
| Validator fails the build on bad content | 8. Builds for every position | Native app |
| Budget and e2e in CI | | |
| **Counting for the main metric (new, A-17)** | | |
| Motion-graphics video and launch post | | |

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

If a phase overruns, cut from the bottom of this list. Never cut faces, the video or launch day.

## Content sourcing and credit

1. **Facts are free.** Archetype names, PlayStyle names, EA's stated specialization targets, patch-note changes. Cite the EA page.
2. **Chime makes every build and face in game**, from reference. That is what "verified" means.
3. **Credit what was followed.** If a creator's tutorial shaped a face, name the creator, link the video and embed it. Never transcribe or re-upload it.
4. **Ask first** before publishing a creator's full slider list as a recipe. Store the answer in `creators.json` (`permission`).
5. **Featured creator spots** for creators who say yes.
6. **Never bulk-copy** another site's builds, tier lists or cost tables. Linking to them is fine.
7. **Submissions** are credited by the name the submitter chooses.

## Legal and risk

- **EA content policy** ([help.ea.com](https://help.ea.com/en/articles/security-and-rules/ea-content-policy/)): no paywall (D-04); passive ads allowed later; no EA logos with our branding; no implied endorsement.
- **Notice on every page:** "Not endorsed by or affiliated with EA or its licensors. Not endorsed by the people named."
- **Naming:** no EA, FC or FUT in the name, domain or logo (D-04). Whether "Pro Clubs" is a mark is unverified; the final name avoids it (O-01).
- **Likeness:** footballers and living musicians at launch; names as text; no photos or drawings of real people; "inspired by", never "official"; no Michael Jackson at launch (D-10). Not legal advice; ads or any income need a fresh look first.
- **Screenshots:** only Chime's own in-game captures of their own recreations.
- **Takedown:** an email on `/takedown`; requests are actioned within 72 hours by setting `"status": "withdrawn"`.
- **Analytics:** no cookies and no personal data (A-17).

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
| A-17 | Counting for the metrics (option A, B or C) | Phase 1, so it ships with the first pages |
| New | Which season do launch faces carry? Recommendation: re-check each in game after 3 Dec and tag Season 3 (sitemap p. 12) | Phase 3 |

**Already answered elsewhere** (still listed under "Open" in `DECISIONS.md`): O-02 (A-10), O-03 (A-09, A-12), O-04 and O-06 (D-18), O-09 (D-17), O-10 (A-11), O-12 (A-14).

## Insights

- **The season change is the marketing calendar.** Every season, every player re-checks builds. Ship updates within 48 hours and say so.
- **Faces are the hook; builds bring people back.** This is a bet until the metrics say so.
- **Exact beats vague.** Written face guides exist; none gives the editor's real values, checked and dated.
- **Credit is a growth channel.** Creators share pages that credit and embed them.
- **PhotoFit is a threat with a likely date.** Era and celebrity faces keep their value if the scan is self-only (O-07).
- **Honesty is visible design.** Version tags and "Not yet checked in game" are UI.

## What changed from v1

- Season 3 dates and the launch date from D-18; phase table updated; Phase 0 marked passed.
- The repo workflow (D-22, D-23), design direction (D-19, D-21) and face preview proposal (A-16) added.
- Value kinds updated to A-09 and A-12; level cap settled (A-10).
- "What we're betting on" and `docs/EVIDENCE.md` added: evidence and assumptions marked; a smoke test before Chime records content.
- Metrics now measure value; counting proposed as A-17.
- Should items ranked with RICE; "Submit without GitHub" moves to the top.
- Written face guides added as competitors; the opening reworded around exact values.
- Open questions trimmed to what is open; answered ones listed.

## Sources

v1 sources (opened 18 Nov 2026) are listed in `docs/RESEARCH.md` §Sources. New sources (20 Nov 2026) are listed in `docs/EVIDENCE.md` §5. Analytics: [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/), [GoatCounter](https://www.goatcounter.com/) (seen in search results, 20 Nov 2026).
