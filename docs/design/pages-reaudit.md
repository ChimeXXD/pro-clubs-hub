# Changelog, About, Takedown and 404: re-audit to the D-107 standard (27 Nov 2026)

These four pages were built before D-107 (every section, line and value Figma draws is built; missing content is Figma's own sample). Each frame was read again (get_screenshot, every visible text through the Plugin API, read only) and compared with the pages as built on `main`, Chrome at 1x, dark, preview bar hidden, the window set to the frame's height.

| Page | Phone 393 | Tablet 834 | Desktop 1440 |
| --- | --- | --- | --- |
| Changelog | 383:3158 | 390:2540 | 390:2700 |
| About | 416:3589 | 418:3457 | 418:3567 |
| Takedown | 417:3706 | 418:3678 | 418:3784 |
| 404 | 420:4819 | 423:4713 | 423:4836 |

Every text Figma draws on these frames was compared with the page word for word; all match except About's six questions (item 4). Shared by all: the top bar has the theme button since D-114 and the current section is cream from tablet up, and the footer and bottom nav are the shell's (`docs/design` shell audit, lane B); those bands are listed but not part of these pages.

## Changelog

1. Every section is built: the title, the line, the Season 3 card, the kind chips (phone scrolls them, "Show" over them on desktop), Season 2 with "Now", Title Update 1.2.0 open with its four lines, Source and "We updated", the two closed entries and Season 1. **Matched.**
2. The three entries are drafts until Chime approves their wording (HANDOFF, O-22 (5)); on the preview each shows the Draft tag beside its kind, which Figma doesn't draw, and probuilds.club lists none. They are real entries, not Figma's samples, so D-113 (sample marker instead of Draft) doesn't apply. **Not fixed** (each tag adds 6 px to its card; question: approve the wording, or treat them as samples).

| Section | 393 | 834 | 1440 |
| --- | --- | --- | --- |
| Top bar | 5.9 | 6.9 | 4.0 |
| Head (title, Season 3 card, chips) | 2.2 | 1.9 | 3.1 |
| Entries | 6.7 (item 2) | 6.6 (item 2) | 4.6 (item 2) |
| Footer and nav | 14.1 (10 px lower, item 2) | 7.4 | (in entries) |
| Height | 1482 / 1472 | 1362 / 1354 | 1086 / 1078 |

## About

3. Title, line, "What is ProBuilds?" and "Who makes them?" open with their answers, the notice card (left column on desktop). **Matched.**
4. Figma draws six more questions, closed: "What does “Not yet checked in game” mean?", "What's the date on every card?", "Can I send a build?", "How do face requests work?", "Are you part of EA?", "How do I get something removed?". The page left them out because Figma has no answer for any of them (checked: no hidden layer holds one). **Fixed on the preview:** they show closed as drawn, and open to nothing; probuilds.club still leaves them out until there is copy (question; O-22 (3)).

| Section | 393 | 834 | 1440 |
| --- | --- | --- | --- |
| Top bar | 5.9 | 6.7 | 3.9 |
| Content, before → after item 4 | 9.6 (whole page) → 1.6 | 6.0 (whole page) → 1.1 | 2.1 (whole page) → 0.7 |
| Footer and nav | 5.6 | 2.1 | (below the window) |
| Height, after | 1295 / 1295 | 1221 / 1221 | 1015 / 1015 |

## Takedown

5. "Takedown", "72 hours", the line, the three-step timeline, the address card with Email and Copy, the withdrawn line; desktop's 440 px card column. **Matched**, no change. Figma draws no "copied" toast (O-22 (4)); the page's "Email copied." stays as built.

| Section | 393 | 834 | 1440 |
| --- | --- | --- | --- |
| Top bar | 5.9 | 6.7 | 3.9 |
| Content | 2.7 | 1.5 | 0.9 |
| Footer and nav | 4.6 | 1.2 | 2.0 |
| Height | 1067 / 1067 | 1011 / 1011 | 805 / 805 (window) |

## 404

6. The replay card ("Replay", "404", the art), "Over the bar.", the line, Faces and Builds; tablet and desktop put the card on the right. **Matched**, no change. The tablet's 3.5 is the art's anti-aliasing and the card sitting 2 px higher.

| Section | 393 | 834 | 1440 |
| --- | --- | --- | --- |
| Top bar | 5.9 | 6.7 | 3.9 |
| Content | 2.3 | 3.5 | 0.9 |
| Footer and nav | 4.5 | 0.5 | 1.3 |
| Height | 969 / 969 | 712 / 712 (window) | 892 / 892 (window) |
