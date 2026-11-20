> Written 19 Nov 2026, replacing the Facecard PRD of 6 Nov. "Pro Clubs Hub" is a working title (O-01). Decisions in `docs/DECISIONS.md` win where this disagrees.

# Pro Clubs Hub

A free, phone-first hub for EA SPORTS FC 27 Clubs players: lookalike and era faces you build step by step, each paired with a build, plus clean meta-build cards for every archetype, all dated and credited.

## Summary

Clubs players want two things for their Pro: to look like someone and to play like the meta. Today the looks live in YouTube tutorials you pause and rewind, and the builds live on sites that change without dates or credit. Pro Clubs Hub leads with a library of faces (2008 Ronaldo, 2017 Ronaldo, Kanye West), each written as a tab-by-tab recipe with a matching build. Beside it sit meta-build cards for all 13 FC 27 archetypes and every position, each tagged "FC 27 · Season 2 · verified <date>" with a source and credit line, plus archetype pages and a public changelog. It is a static Next.js site, free forever, built by one person for $0, and launched with a motion-graphics video when Season 3 lands in December. We don't compete with Pro Clubs HQ on tools; we win on design, speed, honesty and faces.

## Problem and audience

- **Faces are trapped in video.** Players spend about 15 minutes "manually recreating face presets from YouTube tutorials", and FC 27 has no face codes ([EA forum](https://forums.ea.com/discussions/fc-27-feedback-en/feature-request-code-system-clubs-avatars/13794923)). The FC 26 request got no reply ([EA forum](https://forums.ea.com/discussions/fc-26-feedback-en/fc26-character-creation-sharing-system-face--appearance-codes/13272068)).
- **Builds go stale overnight.** EA moved 87 attribute costs and reset every build on 22 Oct ([EA](https://ea.com/games/ea-sports-fc/fc-27/news/fc-27-the-grounds-developer-archetypes-update)). Media builds show no method, credit or update date ([Dexerto](https://www.dexerto.com/wikis/ea-fc-27/best-clubs-builds-for-all-positions/)).
- **No one pairs a look with a build.** An era face (2008 Ronaldo) wants an era build (Spark or Magician, not Target).

**Who:** Clubs players on console with a phone in reach (Chime in Lagos is one); squads picking a theme; lookalike creators who want credit and reach.
**When it hurts:** a new season (everyone re-checks builds), a new edition (everyone rebuilds their Pro), a squad theme night.

## Research findings

Full report with sources: `docs/RESEARCH.md`.

- **The system.** 13 archetypes, Engine gone, Disruptor new. All unlocked, free resets, per-attribute respecs, Masteries, Amps ([EA Pitch Notes](https://www.ea.com/en/games/ea-sports-fc/fc-27/news/pitch-notes-fc27-the-grounds-deep-dive), [PCHQ](https://proclubshq.com/blog/fc27-archetype-changes/)).
- **Level cap** 55 since 22 Oct per Pro Clubs HQ and PRO11; Dexerto says 75 (O-02).
- **Cadence.** Launch 25 Sept; archetype re-price 22 Oct; TU 1.2.0 on 10 Nov; Season 3 due December ([PCHQ](https://proclubshq.com/blog/pro-clubs-level-cap-rise/)). About one meta change per season.
- **PhotoFit** face scan is on EA's roadmap for Season 4 ([EA forum](https://forums.ea.com/discussions/fc-27-general-discussion-en/cranium-photofit/13712988)). No appearance codes exist.
- **No public API.** Everything we publish is entered by hand.

## Competitors

### Hard (same job, same players)

| Product | Strength | Weakness for us to use |
| --- | --- | --- |
| [Pro Clubs HQ](https://proclubshq.com/blog/about/) | Builder with live AP pricing, hundreds of builds, meta XI vote, scouting, LFG, Discord bot; honest labels | No faces; dense UI; HQ Pro at $4.99 a month or $19.99 a season ([pro](https://proclubshq.com/pro)) |
| [PRO11](https://www.pro11.net/) | 13 archetype pages, about 66 guides, planner, sourced builds | Blog layout; no faces; no creator credit |
| [ProClubsHead](https://proclubshead.com/) | Club and player stats since 2016 | No builds or faces |
| [Proxi.gg](https://proxi-dxm.pages.dev/about) | Free builder | Guides still FC 26 |
| [FC Tools Hub](https://fctoolshub.com/en/guides/fc27/face-creator-guide) | FC 27 face creator guide, build saver | No face library; ads gate |
| [Face2Slider](https://blink.new/p/ea-fc-face-f99o5v43) | Photo to slider values (claimed) | A demo; no library; accuracy unproven |
| Media sites ([Dexerto](https://www.dexerto.com/wikis/ea-fc-27/best-clubs-builds-for-all-positions/)) | Search traffic | No method, credit or date |
| YouTube lookalike creators (F.P. Virtual Pro Lookalike, R-Dot-10, [forum post](https://forums.ea.com/discussions/fc-25-game-modes-en/pro-clubs-builds-and-lookalikes/11974643)) | Real faces, audiences | Video only; you pause and rewind |

### Soft (adjacent habits)

FUT.GG, EasySBC, FUTBIN and FUTWIZ set what players expect from a companion site: instant search, a URL for everything, fast updates ([FUT.GG](https://www.fut.gg/about/), [EasySBC](https://www.easysbc.io/), [FUTBIN](https://www.futbin.com/premium), [FUTWIZ](https://www.futwiz.com/subscribe/FUTWIZ50)). None covers Clubs.

### The opening

A faces library with era looks, each paired with a build, written as steps you tick on a phone. Plus build cards that always say which season, when verified and who to credit. Free, fast, beautiful, and friendly to creators instead of copying them.

## Brainstorm

| Direction | Verdict |
| --- | --- |
| A. Clone Pro Clubs HQ (planner first) | No: they lead, and our cost tables aren't verified (D-07) |
| B. Faces-only recipe site (the Facecard plan) | No: too narrow; the hub needs builds for return visits |
| C. Stats and leaderboards | No: needs EA match data and a server |
| **D. Faces-led hub with build cards (chosen, D-02)** | Yes: unique lead feature, builds give repeat visits each season |
| E. Photo-to-sliders AI | Later or never: PhotoFit arrives in Season 4 |

**Chosen direction.** Home leads with faces. Each face page: recipe steps (preset, Skin, Head, Face, Hair), the paired build card, the version tag, the credit line, an embedded tutorial when one was followed. Builds section: one card per archetype and position. Archetype pages. Changelog. Submit.

## How we'd build it

- **Static Next.js** (16.4.6, export) on a free host; content as JSON in `content/`, validated at build time (A-02). MDX only if long guides need it (A-03).
- **Version tags** on every build and face (`game`, `season`, `verifiedOn`); one function words them (A-08).
- **Changelog** entries are JSON with EA source links; each one lists which builds and faces it touched.
- **Patch-note routine:** EA posts an update, Chime reads it, checks affected builds in game, bumps versions, writes a changelog entry, rebuilds. Target: within 48 hours of a season change.
- **Submit** builds a prefilled GitHub issue (A-04); Chime reviews, credits and merges.

| Phase | Dates (proposal) | Focus | Gate |
| --- | --- | --- | --- |
| 0 | Thu 19 – Sun 22 Nov (4 days) | In-game checks, repo, scaffold, CI, Figma Design System page | Day 0 answers in RESEARCH §9; empty site deploys; CI green |
| 1 | Mon 23 – Sun 29 Nov (1 week) | Design screens in Figma; content validator and loader, tests first | Chime approves phone, iPad and desktop screens |
| 2 | Mon 30 Nov – Sun 13 Dec (2 weeks) | Build pages; record 5 faces and 13 builds in game; submit flow; video script and storyboard | Every launch page built and green; content verified |
| 3 | Season 3 week (about 1 week, O-04) | Re-check builds for Season 3; video; launch post; fix fast | Live, "updated for Season 3", video posted |

## Feature and deliverable checklist

**Content**
- [ ] 13 archetype JSON records with sourced fields (FC 27)
- [ ] 5 launch faces recorded in game (O-05)
- [ ] Each launch face paired with a verified build
- [ ] 13 build cards, one per archetype
- [ ] Builds for every position (GK, CB, FB, CDM, CM, CAM, W, ST)
- [ ] Changelog seeded: launch, 22 Oct archetype update, TU 1.2.0
- [ ] Season 3 changelog entry on launch week
- [ ] `creators.json` with every credited creator
- [ ] Chime's own in-game screenshots for each face (their recreations only)
- [ ] `content/README.md` sourcing rules

**Pages**
- [ ] Home: faces first, then builds by position
- [ ] Faces library with filters (footballer, musician, era)
- [ ] Face page: steps, ticks, paired build, credit, tag
- [ ] Builds index by archetype and position
- [ ] Build card page with share URL
- [ ] Archetypes index and 13 archetype pages
- [ ] Changelog page
- [ ] Submit page with a recipe and build builder
- [ ] About: method, sources, credits, notice
- [ ] Takedown page with an email
- [ ] 404 page

**Behaviour**
- [ ] Step ticks saved per face version (A-07)
- [ ] Older-season warning on stale content
- [ ] "Not yet checked in game" wording for unverified content
- [ ] Number and notch values both supported
- [ ] Submission validated before opening the issue
- [ ] Video embeds load on tap (A-05)
- [ ] Share card (Open Graph image) per face and build
- [ ] Search across faces and builds

**Engineering**
- [ ] Public repo, MIT, from Day 0
- [ ] Scaffold with pinned versions
- [ ] Content validator, test-first
- [ ] Loader fails the build on a bad file
- [ ] Version wording function, tested
- [ ] Issue-URL builder, tested
- [ ] Token check in lint
- [ ] Page-weight budget from Day 0
- [ ] Playwright e2e at 390 and 360 wide
- [ ] CI: lint, typecheck, unit, build, budget, e2e
- [ ] Lighthouse mobile 90+

**Design**
- [ ] References by surface
- [ ] Figma Design System page
- [ ] Figma Design screens page (phone, iPad, desktop)
- [ ] Motion pass with the motion skills

**Launch**
- [ ] Name decided (O-01)
- [ ] Motion-graphics video (16:9 and 4:5, captions)
- [ ] Launch post and thread
- [ ] Creator outreach drafts for featured spots
- [ ] Case study with launch numbers

## Content sourcing and credit

1. **Facts are free.** Archetype names, PlayStyle names, EA's stated specialization targets, patch-note changes. Cite the EA page.
2. **Chime makes every build and face themself in game**, from reference. That is what "verified" means.
3. **Credit what they followed.** If a creator's tutorial shaped a face, name the creator, link the video and embed it. Never transcribe or re-upload it.
4. **Ask first** before publishing a creator's full slider list as a recipe. Store the answer in `creators.json` (`permission`).
5. **Featured creator spots** on face pages and the About page, for creators who say yes.
6. **Never bulk-copy** another site's builds, tier lists or cost tables. Linking to them is fine.
7. **Submissions** are credited by the name the submitter chooses.

## Legal and risk

- **EA content policy** ([help.ea.com](https://help.ea.com/en/articles/security-and-rules/ea-content-policy/)): no paywall (D-04); passive ads allowed later; no EA logos with our branding; no implied endorsement.
- **Notice on every page:** "Not endorsed by or affiliated with EA or its licensors. Not endorsed by the people named."
- **Trademarks in naming:** no EA, FC or FUT in the name, domain or logo (D-04). Whether "Pro Clubs" is a mark is unverified; the final name avoids it (O-01).
- **Likeness:** footballers and living musicians at launch; names as text; no photos or drawings of real people; "inspired by", never "official"; no Michael Jackson at launch (D-10). Not legal advice; ads or any income need a fresh look first.
- **Screenshots:** only Chime's own in-game captures of their own recreations.
- **Takedown:** an email on `/takedown`; any request from a named person, estate, creator or rights holder is actioned within 72 hours by setting `"status": "withdrawn"`.

## Insights

- **The season change is the marketing calendar.** Every season, every player re-checks builds. Ship updates within 48 hours and say so.
- **Faces are the hook; builds bring people back.** A face is shared once; a build is checked every season.
- **Credit is a growth channel.** Creators share pages that credit and embed them.
- **PhotoFit is a threat with a date.** Season 4 may cut into "make yourself" faces; era and celebrity looks keep value if the scan is self-only (O-07).
- **Honesty is visible design.** Version tags and "Not yet checked in game" are UI, not footnotes.

## Success metrics

| Metric | Target by 4 weeks after launch (proposal) |
| --- | --- |
| Faces live and verified | 5 at launch, 10 by week 4 |
| Builds live and verified | 13 at launch, every position by week 4 |
| Days from a season change to updated builds | 2 or fewer |
| Lighthouse mobile performance | 90+ |
| Page weight | within the Day 0 budget |
| Credited creators | 3 or more |
| Accepted community submissions | 3 or more |
| Launch post reach | logged honestly, whatever it is |

## Sources

All opened 18 Nov 2026; the full list is in `docs/RESEARCH.md` §Sources. Pages cited above: EA Pitch Notes, EA archetypes update, EA TU 1.2.0, EA content policy, four EA forum threads, Dexerto (builds, archetypes, levels), Pro Clubs HQ (about, pro, level cap, archetype changes), PRO11, ProClubsHead, Proxi.gg, FC Tools Hub, Face2Slider, FUT.GG, EasySBC, FUTBIN, FUTWIZ.
