import { ms, reducedMotion, token } from "@/lib/motion";

/**
 * Morph popover (motion-bookmarks #23): from tablet the All steps dialog grows out of the "All steps" link, not the
 * middle of the screen. The dialog's own entrance (scale 0.95 → 1 with a fade, --dur-base, --ease-out; AllSteps)
 * scales about the link's centre. The dialog is anchored to that link (it opens nowhere else), which is why it gets an
 * origin when a free-standing modal wouldn't. Measured from the dialog's layout box (offsetLeft/Top ignore the
 * entrance's own scale), right after showModal and before the first frame. The phone's sheet only slides, so the
 * origin changes nothing there; reduced motion drops the scale (a fade).
 */
export function growFromTrigger(dialog: HTMLElement, trigger: HTMLElement) {
  const t = trigger.getBoundingClientRect();
  const x = t.left + t.width / 2 - dialog.offsetLeft;
  const y = t.top + t.height / 2 - dialog.offsetTop;
  dialog.style.transformOrigin = `${Math.round(x)}px ${Math.round(y)}px`;
}

/**
 * Task list (motion-bookmarks #11): on an open by tap or click, the list's first 8 lines (section labels and rows, in
 * reading order) come in one after another, each fading up 4 px over --dur-fast (--ease-out), starting 30 ms apart
 * with each gap 15 % shorter than the last (a wave, not a metronome), so the eighth starts at 136 ms and the group is
 * done by 286 ms (UI motion under 300); later lines come with it. They run with the sheet's own entrance, not after it, so the list is readable as the sheet lands and every
 * row can be tapped at once. A rule the choreograph skill sets (one entrance per container) is bent here because the
 * bookmark asks for it; see the report. Reduced motion: nothing staggers, the rows come with the sheet.
 */
export const staggerDelay = (i: number) => Math.round((30 * (1 - 0.85 ** Math.min(i, 7))) / 0.15);

export function staggerIn(dialog: HTMLElement) {
  if (reducedMotion()) return;
  const lines = Array.from(dialog.querySelectorAll<HTMLElement>("ol > li"));
  const timing = { duration: ms("--dur-fast", 150), easing: token("--ease-out", "ease-out"), fill: "backwards" as const };
  lines.forEach((line, i) => line.animate({ opacity: [0, 1], transform: ["translateY(4px)", "none"] }, { ...timing, delay: staggerDelay(i) }));
}

/**
 * Checkbox list (motion-bookmarks #10) in the All steps list: each tick just marked done fills with a small pop
 * (scale 0.85 → 1 on --spring-pop: feedback for a tap, sized for a 28 px circle) and its check draws in from the left
 * (the check-in keyframe's clip-path, 160 ms, --ease-out), starting 90 ms in so the circle has begun to fill: cause,
 * then effect. The row's text dims to muted by a colour transition; nothing is struck through, so values stay readable
 * next to the TV. Several ticks marked by one tap move together. Played with the Web Animations API once, so reopening
 * the list never replays them. Reduced motion: the check fades in, nothing scales.
 */
export function drawTicks(list: HTMLElement, steps: readonly number[]) {
  const reduce = reducedMotion();
  const ease = token("--ease-out", "ease-out");
  const pop = { duration: ms("--spring-pop-ms", 510), easing: token("--spring-pop", "ease-out") };
  const fade = ms("--dur-fast", 150);
  for (const step of steps) {
    const tick = list.querySelector<HTMLElement>(`[data-testid="step-tick-${step}"]`);
    const check = tick?.firstElementChild;
    if (!tick || !check) continue;
    if (reduce) {
      check.animate({ opacity: [0, 1] }, { duration: fade, easing: ease });
      continue;
    }
    tick.animate({ transform: ["scale(0.85)", "none"] }, pop);
    check.animate({ clipPath: ["inset(0 100% 0 0)", "inset(0 0 0 0)"] }, { duration: 160, delay: 90, easing: ease, fill: "backwards" });
  }
}
