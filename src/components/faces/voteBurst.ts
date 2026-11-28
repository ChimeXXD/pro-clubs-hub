import { ms, reducedMotion, token } from "@/lib/motion";

// Like burst (motion-bookmarks #21): a vote is a rare, deliberate act (once per request, D-96), so it gets the one
// small celebration on the page: the arrow pops (from 0.85 on --spring-pop) and six dots burst from the vote box's
// edge 10 px outward, brightening then fading (300 ms, --ease-out) while the box turns lime. The dots are the burst's
// children (VoteButton), placed round the box, and move by transform and opacity only. The count rolls up by itself
// (RollingNumber); a vote that fails rolls it back down. Not played for a keyboard press (nothing animates on
// keyboard input) or under reduced motion, where the box's colour change and the count's crossfade remain.
const DOTS = 6;
/** The box is 56 px: each dot starts at its edge along its own angle (28 px straight up, ~32 px on the slants, so
 * none peaks hidden over the lime box), and ends 10 px further out. */
const HALF = 28;
const edge = (a: number) => HALF / Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a)));
const TRAVEL = 10;

export const BURST_DOTS = Array.from({ length: DOTS }, (_, i) => (i * 2 * Math.PI) / DOTS - Math.PI / 2);

export function burst(button: HTMLElement) {
  if (reducedMotion()) return;
  const arrow = button.querySelector("[data-vote-arrow]");
  arrow?.animate({ transform: ["scale(0.85)", "none"] }, { duration: ms("--spring-pop-ms", 510), easing: token("--spring-pop", "ease-out") });
  const dots = button.querySelectorAll<HTMLElement>("[data-vote-dot]");
  const easing = token("--ease-out", "ease-out");
  dots.forEach((dot, i) => {
    const a = BURST_DOTS[i] ?? 0;
    const from = edge(a);
    const at = (r: number) => `translate(${(Math.cos(a) * r).toFixed(2)}px, ${(Math.sin(a) * r).toFixed(2)}px)`;
    // They come up as they leave the edge (a quarter of the way), not as a ring already there when the tap lands.
    dot.animate({ transform: [at(from), at(from + TRAVEL * 0.4), at(from + TRAVEL)], opacity: [0, 1, 0], offset: [0, 0.25, 1] }, { duration: 300, easing });
  });
}
