# Content

Everything the site shows lives here as JSON. Formats: `docs/FORMAT.md`. The build validates every file and fails on any error (A-02).

| Folder | What | Status today |
| --- | --- | --- |
| `archetypes/fc27.json` | The 13 FC 27 archetypes | Sourced fields filled; unverified fields `null`; none checked in game yet |
| `builds/` | Build cards | One example, `spark-2008-winger.json`, all values `PLACEHOLDER`, `draft` |
| `faces/` | Face recipes, each paired with a build | One example, `cristiano-ronaldo-2008.json`, all values `PLACEHOLDER`, `draft` |
| `changelog/` | Meta changes with EA sources | Three entries from EA pages, `draft` until Chime reviews the wording |
| `creators.json` | Credited creators and featured spots | Three candidates (F.P. Virtual Pro Lookalike, R-Dot-10, JaxStash), `permission: not-asked` |

## Sourcing rules (D-08)

1. **Facts are free.** Archetype names, PlayStyle names, EA's stated targets and patch-note changes. Cite the page in `sources`.
2. **Chime makes every build and face themself, in game.** Only then does `versionTag.verifiedOn` get a date.
3. **Credit what you followed.** A creator tutorial that shaped a face gets a `"tutorial"` credit with a link, and its video goes in `embeds` (loaded on tap). Never transcribe or re-upload a video.
4. **Ask before publishing a creator's full slider list.** Record the answer in `creators.json`. Publish only with `"permission": "yes"`. Builds read from a streamer's video don't wait for an answer (D-66): credit the streamer with a `reference` credit linking the exact video, keep `verifiedOn` `null` until one of us makes it in game, and never make it a Meta pick.
5. **Offer featured creator spots** to creators who say yes.
6. **Never bulk-copy** another site's builds, tier lists or cost tables. Link to them instead.
7. **Never invent values.** Use `"PLACEHOLDER"` and keep the file `draft`.

## People and images (D-10)

- Launch faces: footballers and living musicians, plus Michael Jackson (D-26). Any other deceased subject needs a decision naming them.
- Names as plain text. No photos, drawings or AI portraits of real people.
- Screenshots: only Chime's own in-game captures of their recreations, in `public/faces/`. Raw captures stay in the git-ignored `reference/`.
- Titles say "Inspired by", never "official".

## How Chime records a face

1. In FC 27 Clubs, open Home, then Head. Note the platform.
2. Pick the preset head under "All". Note its number counted among the photo presets only (skip the FC, two-people and saved-head tiles), left to right, top to bottom.
3. Press Customize. Work the part tabs in order, Skin, Head, Face, Hair: note each section you change with its label and what it shows ("Jaw 17", "Warm Black"). Skin Tone shows no number: screenshot the slider (if the arrows move it in steps, also note the presses from the far left).
4. Optional deeper pass, Sculpt (Free Sculpt off; note Symmetry). For each sub-region you change, note mode, layer, region, sub-region and every slider's end labels and number (0 to 100).
5. Visual Age: push toward Older or Younger, screenshot the pad (note if it says "LIMIT REACHED"), then save when asked.
6. Note what the game can't do for this look in `limits` (a missing era hairstyle).
7. Check the face in a match cutscene, not only the editor.
8. Write the JSON (or use `/submit` once it exists), set `verifiedOn`, remove `_example`, set `status` to `published`.
9. Run `npm run validate:content`, then commit `content: add <name> face (fc27 s2)`.

## How Chime records a build

1. Make the build in game on the archetype. Note level, height, weight, AcceleRATE type, every attribute you raised, PlayStyles, specialization.
2. Play at least three matches with it before setting `verifiedOn`.
3. When EA changes the meta: re-check, bump `version`, add a `history` line, write a changelog entry listing the build in `affects`.

## Takedown

Set `"status": "withdrawn"` and deploy. That is the whole change. Acted on within 72 hours.
