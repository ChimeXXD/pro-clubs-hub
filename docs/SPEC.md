# Spec

Written 19 Nov 2026. What the site does at launch, precisely enough to build and test. Decisions are cited as D-xx and A-xx. Look and copy live in `design/UI-BRIEF.md` and the Figma pages (D-14). Content shapes live in `FORMAT.md`.

## Goal

A Clubs player opens the site on a phone, picks a face, builds it tab by tab next to the TV, then sets up the paired build. Or they open the build card for their archetype and trust it, because it says which season and when it was checked.

## Users

- **Primary:** Chime, in Lagos, on an iPhone next to the console.
- **Secondary:** Clubs players and squads; lookalike creators.
- **Contributors:** anyone who submits a face or build through `/submit`.

## Non-goals at launch

Build planner (D-07); accounts, ratings, request board, comments (D-09 later); stats, leaderboards or EA match data; photo-to-slider AI; any image of a real person; any EA art; ads; other game modes.

## Data model

| Entity | File | Key fields | Relations |
| --- | --- | --- | --- |
| Archetype | `content/archetypes/fc27.json` | id, name, positionGroup, signaturePlayStyles, masteryAttributes | Has many Builds |
| Build | `content/builds/<slug>.json` | archetype, positions, body, attributes, playStyles, specialization, version, versionTag | Belongs to an Archetype; paired by Faces; listed in Changelog `affects` |
| Face recipe | `content/faces/<slug>.json` | subject, era, preset, tabs[steps], limits, pairedBuild, embeds, version, versionTag | Pairs one Build; credits Creators |
| Era | inside a Face (`era`) | label ("2008"), note | One per face; the same person can have several faces |
| Credit | inside Builds and Faces (`credits`) | role, name, url, creatorId | Points to a Creator |
| Creator | `content/creators.json` | id, name, url, permission, featured | Has many Credits |
| Version | inside Builds and Faces (`version`, `versionTag`, `history`) | game, season, verifiedOn, verifiedBy, platform | Ticks are keyed by version (A-07) |
| Changelog entry | `content/changelog/<date>-<slug>.json` | date, kind, season, changes, source, affects | Points to Builds and Faces |

The loader (`src/lib/content/load.ts`) reads everything at build time, validates it, resolves relations and fails the build on a broken link (a `pairedBuild` with no build, an unknown archetype).

## Routes

| Route | Shows |
| --- | --- |
| `/` | Faces first (featured and newest), then builds by position, latest changelog entry, the current season |
| `/faces` | Face library; filter by kind (footballer, musician) and era; search by name |
| `/faces/[slug]` | Title "Inspired by …", era, version tag, credit line, limits, steps by tab with ticks, paired build card, embed on tap, Chime's screenshots |
| `/builds` | The 13 archetypes in four groups (Keeper, Defence, Midfield, Attack); one in two groups is listed in both (D-33) |
| `/builds/[archetype]` | Archetype header (signature PlayStyles, mastery attributes, positions, Season 2 cost change counts, sources), then every build for it, "Meta pick" and later "Most copied" badges (D-34) |
| `/builds/[archetype]/[build]` | Full build card: archetype, positions, body, attributes, PlayStyles, specialization, version tag, credits, history, "Copy build" |
| `/changelog` | Entries newest first, each with its EA source and the builds and faces it touched |
| `/submit` | Face or build builder with live validation; "Submit for review" opens a prefilled GitHub issue (A-04); "Copy JSON" |
| `/about` | What this is, how content is made and verified, sourcing rules, credits and featured creators, the notice |
| `/takedown` | How to ask for removal; 72-hour promise; email (O-13) |
| `404` | A way back to faces and builds |

## Core flows

1. **Build a face:** Home → a face → "Start" → tick each step while in the editor → "Done" → "Now set up the build" → build card.
2. **Come back later:** reopen the face → ticks still there → "Continue from step 9". A new face version starts fresh and says so.
3. **Check a build:** Builds → filter "ST" → a card → read the version tag → set it up in game.
4. **Old season:** a build with `season` below the current one shows "Made for Season 2. Values may have changed since."
5. **Unverified:** a card with `verifiedOn: null` says "Not yet checked in game" (only possible in previews; drafts aren't built).
6. **Submit:** `/submit` → choose face or build → fill tabs → the validator marks problems inline → "Submit for review" opens GitHub with the JSON in the issue body → Chime reviews, credits and merges.
7. **Watch the tutorial:** a face with an embed shows the title and channel → tap → the YouTube no-cookie player loads.

## Acceptance (Playwright, 390×844 and 360×800)

- Home shows faces before builds.
- A face page shows its version tag, credit line and paired build; ticks survive a reload; a bumped version clears them.
- A published file with `"PLACEHOLDER"` or `_example` fails `npm run validate:content`.
- A face whose `pairedBuild` doesn't exist fails the build.
- A withdrawn face has no page and no link anywhere.
- Every page shows the notice text.
- No request to youtube.com or youtube-nocookie.com before the play tap.
- `/submit` builds an issue URL whose body parses as valid JSON for the chosen kind.
- No image on the site is a photo of a real person (manual check at each gate; files only under `public/faces/` and our own icons).
