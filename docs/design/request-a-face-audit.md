# Request a face audit against Figma (27 Nov 2026, D-107)

Figma file hyFx4Audhn4F9KxL9bRCLD, page "Design screens", section "Phase 4 · Changelog & Submit" (197:256). Frames read with get_metadata, get_screenshot and the Plugin API (read only); the "Request row" component (431:1092) from the Design System panel 431:843.

| State | Phone 393 | Tablet 834 | Desktop 1440 |
| --- | --- | --- | --- |
| Main | 402:3451 | 418:9607 | 418:9742 |
| Typing a name already asked for | 430:6093 | 430:6247 | 430:6381 |
| Request sent | 430:6517 | 430:6665 | 430:6797 |
| No requests yet | 430:6931 | 430:7066 | 430:7185 |
| Request failed | 441:9598 | 441:9740 | 441:9865 |
| Vote failed | 441:9992 | 441:10035 | 441:10075 |

New page, built for this audit. `/faces/request` (the address the Faces library already links to, `REQUEST_FACE_HREF`), preview only (`src/app/faces/request/page.preview.tsx`, D-105) until the Supabase project exists. Its rules and calls are in `src/lib/requests.ts`; the components are `src/components/faces/RequestFace.tsx`, `RequestForm.tsx` and `RequestList.tsx`. Requests, votes and the three functions (`face_requests`, `request_face`, `vote_face_request`) are in `docs/supabase-schema.sql`, tested in PGlite 0.5.17: a new request is pending and hidden; a listed request needs its kind; a vote counts once per voter id; the anon key can't read the tables; the sixth request in an hour from one caller is refused.

**Preview states.** With no Supabase settings the preview shows Figma's sample list (2017 Ronaldo being made, 214; Kanye West 167; 2006 Ronaldinho 121; Burna Boy 96; Usain Bolt 58; the first and third voted, as drawn) and a stand-in: `?state=typing` (Kanye typed), `sent`, `request-failed`, `vote-failed`; `?requests=none` (the empty list), `?request=fail` and `?vote=fail` make real taps fail. The live site has no stand-in: with no database the list stays empty and sending fails.

Status: **built** = as Figma draws it; **not fixed** = still different, with the reason. Pixel diffs as in the other audits (mean absolute RGB difference per section, Chrome 1x, dark, preview bar hidden, full page height). Every page is exactly Figma's height except the desktop empty state, which is shorter than the 900 px window Figma draws.

## Main (402:3451)

1. H1 "Request a face", the Body/Large line, then the form card (bg/surface, 16 px corners and padding, 12 px gaps): "Who do you want?", the field (search icon, 52 px, 12 px corners), "If someone asked already, you'll see it here and can vote instead." and Request. **Built.**
2. The placeholder "A name and the look, e.g. 2006 Ronaldinho" wraps to two lines on phone in Figma; a text field's own placeholder can't wrap, so it is drawn over the field (hidden while typing) and the field keeps it for screen readers, unseen. **Built.**
3. "Most requested" (H3) with "One vote each", the kind chips (All, Footballers, Athletes, Musicians; Chip Size=small, shared with Submit as `ui/SmallChip`) and the rows: rank (Number/Medium; lime when being made), name, kind (and "· Being made" in lime), the 56 px vote box (chevron and count; lime once voted). A kind keeps each request's rank in the whole list. **Built.**
4. "Chime and Sharon make the top requests in game, then they appear in Faces with their build." with the info icon: under the list on phone and tablet, under the form on desktop. **Built.**
5. Desktop: the title, form and note in a 440 px column, the list in the rest (664 px), 96 apart. **Built.** The bottom nav lights Faces (the page is under /faces).
6. One vote each: a browser keeps a random voter id and its votes in localStorage; a second tap does nothing; the database counts a voter once per request (D-96). A vote shows at once (+1, lime) and is taken back if it fails. **Built.**

## Typing a name already asked for (430:6093)

7. The field rings lime (2 px). Once three letters match the start of each word of a listed request, "Already asked for" (bg/raised): the name, "Musician · 167 votes" and a lime Vote pill (chevron, Button/Medium), then "Ask for “Kanye” as a new face" (secondary) in place of the note and Request. **Built.** Voting from here counts the same vote as the row's.

## Request sent (430:6517) and failed (441:9598)

8. Sent: the tick in a status/success-bg circle, "Asked for 2006 Ronaldinho", "New requests show in the list once we've checked them." and Ask for another (which empties the field and focuses it). The request doesn't join the list: it is moderated first (D-96). **Built.**
9. Failed: Figma's red row (status/danger-bg, error icon, "Couldn't send your request. Check your connection and try again.") and the primary button becomes Try again; the name stays. While sending the button shows the spinner (not drawn). **Built.**

## No requests yet (430:6931)

10. The chips and list give way to a card (bg/surface, 32 / 20 px padding): the face icon (28 px, text/muted), "No requests yet." (H4) and "Be the first: ask for a face above." 20 px under the heading. **Built** (first built 12 px under it: 8 px short; fixed).

## Vote failed (441:9992)

11. The cream toast with the red error icon, "Your vote didn't go through. Try again." (D-100 (3)), and the vote taken back. **Built.** Phone: Figma puts this toast 10 px above the bottom nav, where its other toast frames (319:1674) put it 44 px above; the shared Toast keeps 44 px. **Not fixed** (one placement for every toast; question). That 34 px is the phone footer band's 47.

| Section | 393 | 834 | 1440 |
| --- | --- | --- | --- |
| Top bar (shell, the theme button since D-114) | 7.0 | 6.8 | 3.9 |
| Title | 3.9 | 2.0 | (ask column and list) 1.1 |
| Form: main / typing / sent / failed / empty | 1.6 / 2.2 / 3.1 / 2.0 / 1.6 | 0.8 / 1.2 / 1.8 / 0.9 / 0.8 | 1.1 / 1.2 / 1.1 / 1.1 / 1.0 |
| List: main / typing / sent / failed / empty | 2.4 / 1.8 / 1.9 / 2.1 / 4.8 | 0.9 / 0.9 / 0.9 / 0.9 / 1.5 | (with the column) |
| How it works | 0.0 to 7.5 | 0.0 to 4.3 | (with the column) |
| Footer and nav | 6.6 to 9.3; vote failed 47.1 (item 11) | 0.6 to 1.8 | 0.9 to 1.5 |
| Height | equal in every state | equal | equal (empty: 845 / 900, the window) |

The phone title's 3.9 is the H1, drawn about 1 px higher in Chrome; the "how it works" band ranges because it sits where the page's last 20 px of the list end, so a 1 px text shift there counts double. The empty list's 4.8 on phone is the face icon (Figma's Icon/face at 28 px against the same SVG scaled by Chrome) and the two lines of text.

## Not drawn, decided here (questions in the report)

- A list that fails to load: only the "Most requested" heading shows (no chips, no "No requests yet.", which would be untrue).
- Tapping a vote already given: nothing happens (one vote each); there is no undo.
- An empty field and Request: nothing is sent.
