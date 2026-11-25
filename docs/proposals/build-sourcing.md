# Proposal: get builds from streamers' videos

From Sharon, 25 Nov 2026, for Chime to approve, change or reject. Nothing here is decided. It is O-17 in `docs/DECISIONS.md`.

## The problem

We can't make every build ourselves. Each archetype levels up on its own, and on 22 Nov Chime's were Finisher 44, Maestro 42, Progressor 34 and ten at level 1 (RESEARCH §9). Streamers have maxed theirs and publish builds on YouTube. Pausing videos and copying values by hand is slow, and it was the problem with faces too.

Sharon's idea: take builds from streamers who have tested them, compare where they differ, and work out what a player below level 55 can afford.

## What today's rules say

| Rule | What it blocks |
| --- | --- |
| D-08, D-29 | Builds are made in game by Chime or Sharon. A creator's full list needs their yes |
| D-30 | A Meta pick is played for one match |
| D-36 | No values transcribed from a video, no frames cut from it. Written for faces; builds aren't mentioned |
| CLAUDE.md rules 5 and 9 | Videos are never transcribed. Another site's finished build is not free to copy |
| SPEC flow 5 | Content not checked in game appears only in previews |

RESEARCH §10 already takes game facts (prices, AP per level) from the captions of seven videos. Single facts and a creator's whole build are different things, and the rules should say where the line is.

**YouTube's terms** ([Permissions and Restrictions](https://www.youtube.com/t/terms), read 25 Nov): no access by "any automated means (such as robots, botnets or scrapers)", and no downloading, without YouTube's written permission or where the law allows it. Its official API only downloads captions for videos you can edit ([reference](https://developers.google.com/youtube/v3/docs/captions/download)). This isn't legal advice.

## Options

| | A. Assisted reading | B. Fully automatic | C. Creators send theirs |
| --- | --- | --- | --- |
| How | A person watches, pauses on the final attributes screen and takes one screenshot. Claude reads it into a draft build | A script downloads videos or captions and reads them | Creators submit through `/submit`, or say yes to us using a video |
| Our time per build | Minutes (estimate, not tested) | Almost none | Waiting for replies |
| YouTube's terms | No robot. A person is viewing; the screenshot is still a copy, so it stays private | Not allowed without permission | No problem |
| Accuracy | A person confirms every value against the frame | Misread numbers can slip in | The creator's own numbers |

**Recommendation: A to prepare, C to publish.** Read the video with A, then publish once the creator says yes. Optional helper: YouTube's official API can list new videos from chosen channels and read their descriptions, where some creators may write the build out. Its free quota and data-storage rules need checking first.

## How A would work

1. Sharon or Chime picks the video and notes its link, date, season and the timestamp.
2. One screenshot of the final attributes, one of PlayStyles and body. They go in the git-ignored `reference/` and never in the repo.
3. Claude writes a **draft** build. Anything unreadable stays `"PLACEHOLDER"`.
4. The validator checks it: real attribute names, values 0 to 99, a known archetype (the stricter checks are in the build-format branch).
5. Sharon checks every value against the screenshot. The streamer is credited and linked.
6. Where two or more streamers differ, we show each as its own credited build. A merged build is ours only if one of us makes and tests it.
7. Chime reviews the pull request. Until one of us makes it in game, the tag says "not yet checked in game", and it can't be a Meta pick.

## A player below the build's level

The AP part is known: level 55 has 1,419 AP and level 53 has 1,344, so a level 53 player is 75 short (RESEARCH §10.1). Chime's prototype (`mockup/builds-v2/level.js`, D-43, D-44) has the method: spend in the build's order and stop at the first point you can't afford.

It ran on sample prices. Two things are missing, and some build videos may show both:

- **The order** attributes were raised in.
- **The price of each point**, which the game shows in Edit Attributes as you raise it.

Where a video shows neither, the page can say "75 AP short" and shows no plan. The method is being ported to tested code that refuses to plan with an unknown price.

## Test before building anything

One Finisher video and one Maestro video, because Chime can check those two closest to the cap. Time how long each takes, count misread values, and note whether order and prices were visible. Claude's web searches on 25 Nov found written guides and no level 55 build video, so we need links from people who watch these creators.

## Questions for Chime

1. May we read builds from videos this way, and may a build be published with a creator's yes before one of us makes it in game?
2. Does D-36 cover builds, or only faces?
3. Which past project pulled information from YouTube, and how? Nothing was found in your public repos.
4. Which two or three streamers do you trust for builds?
5. Reading prices off the game screen in a video: a free fact, as in RESEARCH §10?
