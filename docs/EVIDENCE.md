# Evidence: what the PRD rests on, and how sure we are

Written 20 Nov 2026 by Sharon (`sharrygold`) with Claude, for PRD v2. Chime and Sharon are both Clubs players and built this around problems they and their friends hit, so the direction is set (D-02). This file tests how much of the PRD is evidence and how much is belief, then names the cheapest way to check the riskiest belief before launch.

Pages marked *(search result)* were seen only in search results; Claude didn't open them. Reddit and the EA forum's PhotoFit thread were blocked to Claude on 20 Nov; §4 is the short list of what Sharon checks by hand.

## 1. Assumption map

Risk = how bad it is if we're wrong × how little we know. Evidence is something a player or EA said or did; assumption is something we believe from our own play.

| # | The PRD depends on | Evidence or assumption | Risk |
| --- | --- | --- | --- |
| 1 | **A player will follow a written, tickable recipe on a phone**, which saves pausing and rewinding a video. | Assumption, with partial evidence: players ask for a faster way to copy faces every edition (§2.1). Nobody has asked for written recipes as such. | **High.** It is the lead feature. |
| 2 | **Lookalike and era faces are the faces players want**, and the first five (O-05) are the right five. | Partial. Ronaldo face requests are loud (§2.1). For musicians, Sharon has seen Michael Jackson faces made several times (his own observation, links not collected); Claude found no written requests. A second wish showed up: recreating real friends (§2.2). | **High.** It sets the home grid and the launch video. |
| 3 | **Players will find us, and come back when the meta changes.** | Assumption. The PRD has no channel plan and nothing measures use (no analytics). | **High.** Without it, launch numbers can't be read. |
| 4 | Builds go stale and players want dated, credited cards. | Evidence: EA reset every build on 22 Oct (RESEARCH §1). Media build pages carry no date (RESEARCH §3). | Medium. Need is real; whether players pick us over Pro Clubs HQ is open. |
| 5 | PhotoFit won't make celebrity faces trivial. | Unknown (§2.4). | Medium. External: we can watch it but can't test it. |
| 6 | Players are on a phone next to the console. | Assumption from our own play. | Low. Cheap to be wrong: the site works on desktop too. |
| 7 | Contributors will submit through a GitHub issue. | Assumption. Console players without a GitHub account can't submit at all. | Medium. O-11 is the fix. |
| 8 | Pairing a face with a build matters to players. | Assumption. | Low. Costs little to keep. |

**Top three:** #1, #2, #3. #1 is tested by the smoke test in §3. #2 is partly answered by the same test. #3 is answered by setting up measurement before launch (PRD v2, Metrics).

## 2. What players and EA say

### 2.1 Copying a face is a chore, and players ask EA to fix it every year

- **FC 27:** a feature request asks for shareable codes for Clubs avatars, like tactic codes, and says players lose about 15 minutes per face copying presets from YouTube ([EA forum, FC 27](https://forums.ea.com/discussions/fc-27-feedback-en/feature-request-code-system-clubs-avatars/13794923)). EA's only reply was a moderator.
- **FC 26:** a request for face and appearance codes says many players make realistic faces of famous footballers in Clubs and share them online ([EA forum, FC 26](https://forums.ea.com/discussions/fc-26-feedback-en/fc26-character-creation-sharing-system-face--appearance-codes/13272068)) *(search result)*. A Portuguese thread asks for the same thing ([EA forum, FC 26 PT](https://forums.ea.com/discussions/fc-26-general-discussion-pt/c%C3%B3digos-de-compartilhamento-de-face-no-clubs/13553405)) *(search result)*.
- **FC 24:** a thread asked for a game face generator back (RESEARCH §5).

**Count:** at least 4 threads, 3 editions, 2 languages. **Weakness:** each thread has one or no reply, and view counts weren't visible. This shows the pain exists every year. It doesn't show how many people feel it.

### 2.2 A second face wish: recreating real friends

- An FC 27 Clubs player asks EA to reopen appearance editing for AI teammates because they recreate real-life friends in their club ([EA forum, FC 27](https://forums.ea.com/discussions/fc-27-feedback-en/please-let-us-customize-the-appearance-of-our-ai-teammates-in-clubs/13759147)) *(search result)*.
- FC 25 bug reports show players editing AI teammates' face sliders and losing them in matches ([EA forum, FC 25](https://forums.ea.com/discussions/fc-25-game-modes-en/re-help-us-enhance-ai-players-in-clubs/7950223)) *(search result)*.

**What it means:** our recipes can't help with a friend's face, but the same "steps you tick" format could later teach players how to copy a look from a photo. Noted for after launch; no change to D-10.

### 2.3 Written recipes already exist, and they are vague

- Sportsdigest publishes "How to create Cristiano Ronaldo in EA FC 26" and the same for Messi, as written steps taken from a YouTube tutorial ([Ronaldo](https://sportsdigest.in/how-to-create-cristiano-ronaldo-in-ea-fc-26/162926/), [Messi](https://sportsdigest.in/how-to-create-lionel-messi-in-ea-fc-26/162932/amp/)) *(search results)*. The values are loose descriptions ("medium tan shade", "oval with sharp jawline") where the editor shows exact numbers and names. They are written for Career Mode.

**This goes against the PRD's line that faces are "trapped in video".** Written guides exist. What doesn't exist is a guide with the editor's real values, checked in game, dated, credited and tickable. PRD v2 says that instead.

### 2.4 PhotoFit is still unconfirmed

- The leak (Aug 2026) describes scanning your own face into the game ([Dexerto](https://www.dexerto.com/ea-sports-fc/ea-fc-27-leak-reveals-you-can-scan-yourself-into-the-game-for-first-time-in-a-decade-3394992/)) *(search result)*. Earlygame, opened on 20 Nov, calls it not officially confirmed and says it may land in FC 27 or be held for FC 28 ([Earlygame](https://earlygame.com/de/news/fifa/ea-fc-27-karrieremodus-roadmap-face-scanning-und-neue-nationen-im-ueberblick)).
- RESEARCH §5 cites an EA community manager placing it in Season 4. That thread didn't load on 20 Nov, so it wasn't re-checked.
- The old GameFace tool (FIFA 10 to 16) took front and side photos "of yourself or someone else" ([All Things How](https://allthings.how/ea-fc-27-cranium-photofit-what-the-face-scanning-leak-reveals/)) *(search result)*. If PhotoFit works the same way, anyone could scan a celebrity's photo. O-07 stays open; check on Thu 14 Jan 2027.

### 2.5 Builds

- Dexerto and RealSport101 publish FC 27 Clubs builds by position with archetype, height, weight and PlayStyles ([Dexerto](https://www.dexerto.com/wikis/ea-fc-27/best-clubs-builds-for-all-positions/), [RealSport101](https://realsport101.com/article/fc-27-best-winger-build-for-clubs-the-grounds-archetype-playstyles-attributes)) *(search results)*. Neither shows a verified date in the parts seen.
- No player quote was found saying they distrust undated builds. #4 rests on EA's 22 Oct reset, which is a fact, and on our own experience.

## 3. Smoke test (this weekend, $0)

**Tests #1 and #2:** will Clubs players ask for exact, tickable face recipes, and which faces?

There's no finished recipe yet (`content/faces/cristiano-ronaldo-2008.json` is a draft with 16 placeholders), so the test measures demand.

**What to post** (Reddit, plus the Clubs group chats and Discords Sharon and Chime are already in):

> **Making a free site with exact FC 27 Clubs face recipes. Which faces should we do first?**
>
> Copying a lookalike from YouTube means pausing and rewinding for 15 minutes. We're two Clubs players building a free site where every face is a checklist you tick on your phone: the exact preset, every value the editor shows, and a build to match. Every recipe is made and checked in game, dated and credits the creator whose tutorial helped.
>
> Which faces do you want first? Drop names below (footballers from any era).
>
> Want a ping when the first five are up? [form link]

**Form:** a free Google Form or Tally with two questions: "Which faces?" (free text) and "Email or Discord name for one ping at launch" (optional). Nothing else is collected.

**Pass and fail, fixed before posting.** Read after 72 hours, all channels added together.

| Result | Meaning | Next step |
| --- | --- | --- |
| **Pass:** 25+ form sign-ups, or 15+ comments or replies that name a face | Demand is real | Keep the faces-first plan; use the names to pick O-05 |
| **Unclear:** 10 to 24 sign-ups, or 5 to 14 naming comments | Some demand | Keep the plan; post once more in a second community |
| **Fail:** under 10 sign-ups and under 5 naming comments | Faces may not pull people in | Chime and Sharon decide: lead the launch with builds, or test once more before 3 Dec |

These numbers are a first guess for small Clubs communities. If the subreddit is large (over 100k members), double them before posting.

## 4. What Sharon checks by hand (10 minutes)

Claude couldn't open these. Paste what you find into the pull request or into this file.

1. **Reddit (4 min).** Open https://www.reddit.com/r/EASportsFC/search/?q=clubs%20lookalike&sort=top&t=year and the same search with `face code`. Then check whether r/ProClubs exists and how many members it has. Paste the top 5 post titles, their upvotes and links.
2. **YouTube (3 min).** Search `pro clubs lookalike FC 26` and `FC 27 clubs face creation`, then Filters → Sort by view count. Paste the top 5 titles, view counts and upload dates. No need to watch anything.
3. **Google Trends (2 min).** Open https://trends.google.com/trends/explore?date=today%205-y&q=pro%20clubs%20lookalike,pro%20clubs%20build and screenshot it.
4. **Post the smoke test (1 min)** once the form exists.

## 5. Sources

Opened 20 Nov 2026: Earlygame. The FC 27 face-code request was opened on 18 Nov (RESEARCH §5) and seen again in search results on 20 Nov. Seen in search results only, 20 Nov 2026: the remaining links above. Earlier sources: `docs/RESEARCH.md`.
