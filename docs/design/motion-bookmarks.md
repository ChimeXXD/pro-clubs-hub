# Motion bookmarks from designbookmark.com/motion (28 Nov 2026)

Chime asked: review every animation on https://designbookmark.com/motion, bookmark each one that could work on ProBuilds, and write how it would be built here. All 89 were reviewed (watched in Brave, and the 59 DesignBookmark sources read; the newer Kokonut UI and SmoothUI cards were judged on screen). 30 fit. This is a plan for the animation phase, not approved work: each one is built only when Chime picks it, one unit at a time.

## How they would be built here

- **No new package.** ProBuilds has no motion library, and new dependencies need Chime's OK. DesignBookmark's sources drive everything from a few shared springs ("stiffness damping"): follow 900 50 (held by the pointer), settle 280 22 (letting go, one small overshoot), soft 260 24 (panels), pop 520 16 (an icon or number on select), fade 420 32 (opacity and small slides), stagger 45 ms. We would add these to the motion tokens as CSS `linear()` easings sampled from the same springs, so CSS transitions and the Web Animations API can use them; a dragged element follows the pointer with a plain transform.
- **The house rules still apply** (DESIGN.md, CLAUDE.md): every animation names its purpose; UI motion under 300 ms; ease-out to enter, never ease-in; only transform and opacity; nothing on keyboard or very frequent actions (an attribute's − / + tapped ten times in a row must not queue ten rolls); hover only inside `(hover: hover) and (pointer: fine)`; reduced motion means a gentler version (a fade), not nothing.
- **Build our own.** The cards are references for the feel. Their code isn't copied in: the licence isn't stated, and our components already exist.

## The 30 bookmarked

| # | Animation | Where on ProBuilds | How I would build it |
| --- | --- | --- | --- |
| 1 | Swipe deck | Builds page, Stance cards | The front card follows the finger with a small tilt (rotate = x ÷ 20, at most 10°) and nothing else moves (D-116). On release, a fast flick or more than 50 px sends it out the side it was thrown and the next card settles in with the settle spring. A short drag springs back. Velocity comes from the last 3 pointer moves. Reduced motion: a crossfade. |
| 2 | Fan cards | Submit, step 4: "Your card" opening into the share sheet (D-117) | Tapping "Your card" lifts it into the sheet, where it lands as the flip card; while it travels, the back peeks out behind it at −4°, so the player sees there are two sides. About 240 ms. |
| 3 | Parallax ticket (card flip) | Build page share sheet (and the same sheet from Submit): one card in place of the two | Chime, 28 Nov: not on the Stance card (Swipe deck only there). The front is the Overview card, the back the Attributes card. A tap or click turns it over (rotateY 180° with a slight tilt as it turns, backface hidden, about 400 ms), and a hint under it reads "Tap to flip" while the card keeps its "1 / 2" count (D-117). Save images still makes both sides as two images. Reduced motion: a crossfade between the sides. |
| 4 | Rubber dock | Archetype emblem rail | The lime ring moves from the old emblem to the new one as a stretchy pill: the leading edge uses the lead spring, the trailing edge the trail spring, so it stretches and snaps back. One element moves, so the rail needs no layout change. |
| 5 | Bottom bar | Phone bottom nav | The lime pill slides to the new tab and the label fades in (DESIGN.md: "the highlight is one shape that springs from row to row"). With View Transitions between pages, the pill keeps its place across the navigation. |
| 6 | Tab pill | Filter chips (Faces kinds, Changelog filters, Request a face kinds) | One lime pill behind the chips moves to the picked chip, by transform only, measured from each chip's box. The chips stay buttons with `aria-pressed`. |
| 7 | Segmented control | Submit, the Keeper/Defender/Midfielder/Forward group control | The same sliding pill, inside a track. When the group changes, the archetype tiles below fade and rise 8 px, 45 ms apart. |
| 8 | Smooth tab | Faces library grid when the kind changes | The old grid fades out by 120 ms while the new one fades in and slides 12 px from the side of the chip picked. |
| 9 | Step progress | Submit's four steps ("1 of 4") and the face page's section bar | The bar's fill grows by `scaleX` (the section bar already does, D-115). A finished step's dot pops (pop spring) into a check, and the next label brightens. |
| 10 | Checkbox list | Face step ticks (step-tick-N) | The tick draws its check stroke over 160 ms (stroke-dashoffset on a 16 px SVG) and the row's text dims to muted. No strike-through, because the values must stay readable next to the TV. |
| 11 | Task list | The All steps sheet | Sections show "3 of 4" and their checks pop as they fill. Opening the sheet staggers rows in at 45 ms, capped at the first 8 rows. |
| 12 | Number stepper | Level − / + on the Build page; attribute − / + in Submit | The digits roll: the old value slides out 6 px up, the new one in from below, 140 ms. Taps that come faster than the roll skip it and set the number at once (the frequent-action rule). |
| 13 | Stat card | Key stats (PAC … PHY) and the AP numbers when the level changes | Numbers count to their new value over 220 ms with tabular figures, so nothing shifts. Only numbers that changed move. |
| 14 | Storage meter | AP bar: AP at this level, spent and left | One bar split into the spend per attribute group, each segment growing by scaleX in order. Left over stays the track colour; over budget turns status/danger. |
| 15 | Range slider | Submit height and weight | A value bubble rides the knob, the knob grows 1.1× while held (follow spring), and the range ends stay labelled. Keyboard arrows step without animation. |
| 16 | Exposure slider | The Build page's level slider (1–55) | Tick marks under the track; the knob snaps to whole levels with a small settle. The specialization level (50) gets a taller tick. A light haptic (`navigator.vibrate(5)`) on each detent where the phone supports it. |
| 17 | Star rating | Submit skill moves and weak foot | The star picked pops (pop spring, 1 → 1.15 → 1) and the stars before it fill left to right, 30 ms apart. Hover preview on desktop only. |
| 18 | Scrubber | Face page 360° turntable | Dragging scrubs the 36 frames 1:1 with the finger. On release it keeps turning with the flick's speed and settles on the nearest frame. The angle buttons ease to their frame over 240 ms. |
| 19 | Loading to success | Save images, Send for listing, Request | The button keeps its width, the label crossfades to the spinner (already drawn, D-114), then to a check that draws in. It returns to the label after 1.5 s. A failure shakes 4 px twice and shows the red row. |
| 20 | Copy button | Copy link (share sheet), Copy email (Takedown) | The copy icon crossfades to a check, 150 ms, and back after 2 s. The toast still announces it for screen readers. |
| 21 | Like burst | Request a face vote | On a vote, the arrow pops and 6 small lime dots burst 10 px out and fade (300 ms), and the count rolls up by one. An undo or a failed vote rolls the count back. |
| 22 | Expand card | Changelog entries opening in place; build card → build page | The entry's body grows from the row (height by grid-template-rows 0fr → 1fr, which is not a layout-property animation) and its content fades in. For card → page: a View Transition shares the card's picture and title with the page header. |
| 23 | Morph popover | The All steps dialog (desktop) | The dialog grows from the "All steps" link (transform-origin at the trigger, scale 0.96 → 1 with a fade), not from the centre. |
| 24 | Morph tooltip | PlayStyle badges and emblem names on desktop | One tooltip morphs between targets instead of a new one per hover: the first opens after 500 ms, the next ones instantly. Its width and position animate by transform. |
| 25 | Command button | Top bar search button (tablet and desktop) | The search icon button widens into the field (clip-path on a full-size field, so text never reflows) and focuses. Esc collapses it. |
| 26 | Command palette | Search results | Results open under the field in a panel, with arrow-key focus moving a single highlight shape. Groups (Faces, Builds) keep their counts. Phone keeps the full search page. |
| 27 | File drop | Submit, "Your Pro's face" picture | The drop zone tints and lifts while a file is dragged over it. The picture fades in at its final crop, and Remove fades it back to the mannequin. |
| 28 | Ghost suggestion | Request a face, a name already asked for | While typing, the rest of a matching request shows as muted ghost text. Tab or → accepts it, and the "already asked for" row appears with Vote. |
| 29 | Letter limit | Submit "Name your build"; Request a face name | A small ring fills as the limit nears and turns status/warning in the last 10 characters. The count appears only then. It needs a limit set first (TODO: none decided). |
| 30 | Notification stack | Toasts | When a second toast arrives (Link copied, then Saved), the first steps back (scale 0.95, 8 px up, 60 %) instead of being replaced. Swipe to dismiss on phone. |

## Left out, and why

- **No such feature on ProBuilds:** Date range, Mention picker, Invite people, Focus mode, Plan switch, OTP code, Card field, Password strength, Tag input, Cart button, Bell button, Undo button, Signature pad, Boarding pass, Glass player, Music toggle, Stack panel (settings drill-in), Sidebar collapse, Dynamic menu, Toolbar, Pull to refresh (a static site has nothing to refresh), Cookie bite (no cookies, D-27), Dust delete (nothing is deleted on the site).
- **AI patterns (no AI in the product):** Thinking sphere, Goo thinking, Prompt box, Streaming reply, Agent steps, Tool approval, Voice input, Siri orb, Thinking text, Typewriter, Read along.
- **Decoration without a job, or a trend unslop removes:** Goo menu, Goo morph, Jelly slider (the Exposure slider's detents suit a level better), Glass lens, Weight wave (Barlow isn't a variable font), Scramble text, Word roll, Dynamic text, Roll links, Marker text, Magnetic button, Springy input, Morph island, Pull cord (the theme switch is option A, D-114), Unlock Face ID, Page flip.
- **Too much friction for what it does:** Hold to publish, Hold button and Slide to confirm (Send for listing is moderated anyway, and a hold makes a phone-by-the-TV user wait).
- **Covered by another pick:** Spring dropdown (phones use sheets), Profile card, Toggle switch (no settings), Pagination dots (the Stance stage shows "12 of 13"; Swipe deck covers it), Detent dial (the Exposure slider covers the level), Wheel picker (Figma draws sliders for height and weight).

## Order I'd suggest

The ones that fix something Chime already noticed or that every visitor touches first: 1 Swipe deck, 5 Bottom bar, 6 Tab pill, 4 Rubber dock, 10 Checkbox list, 16 Exposure slider, 19 Loading to success. Then the share card flip (3), the Submit set (7, 9, 12–15, 17, 27–29), then the desktop extras (23–26).
