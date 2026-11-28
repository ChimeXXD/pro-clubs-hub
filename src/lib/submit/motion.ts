// The small rules behind Submit a build's motion (motion-bookmarks.pdf #2, #12, #17, #29; motion-placement.pdf
// pages 10 to 12). Pure, so they are tested without a browser; the components only apply them.
import { SPRINGS, stepSpring } from "../motion.ts";

/** How long a number's roll lasts (RollingNumber); a change that comes sooner is set at once. */
export const ROLL_MS = 140;

/**
 * Whether a change should skip its motion: one from the keyboard (a click with no pointer behind it, detail 0), or
 * one that came faster than the roll it would start (the frequent-action rule: ten fast taps never queue ten rolls).
 */
export const skipsMotion = (at: number, lastAt: number, byKey: boolean) => byKey || at - lastAt < ROLL_MS;

/** Star rating (#17): the gap between stars filling left to right. */
export const STAR_GAP_MS = 30;

/**
 * When each of the five stars lights, in ms after the tap (null: it doesn't change). The picked star lights at once,
 * under the finger, and pops; the stars before it that were off fill left to right, 30 ms apart, from the first one
 * that changes. Stars that go out all go out together (an exit is simultaneous, never a reverse stagger).
 */
export function starDelays(picked: number, previous: number): (number | null)[] {
  return [1, 2, 3, 4, 5].map((n) => {
    const was = n <= previous;
    const is = n <= picked;
    if (was === is) return null;
    if (!is || n === picked) return 0;
    return (n - (previous + 1)) * STAR_GAP_MS;
  });
}

/**
 * The picked star's pop (#17): scale 1 → about 1.15 → 1 on the pop spring, as samples at 120 frames a second for the
 * Web Animations API (so it runs off the main thread). It is the spring's answer to a tap: a push of speed from rest
 * at scale 1, sized so the first swing peaks at `peak`, with the spring's small swing back before it settles.
 */
export function popFrames(peak = 1.15): number[] {
  const dt = 1 / 120;
  let s = { value: 0, velocity: 1 };
  const path: number[] = [0];
  for (let i = 0; i < 240; i++) {
    s = stepSpring(SPRINGS.pop, s, 0, dt);
    path.push(s.value);
    if (i > 12 && Math.abs(s.value) < 1e-4 && Math.abs(s.velocity) < 0.02) break;
  }
  const top = Math.max(...path);
  // The response is linear in the push, so one scale factor sets the peak; the tail below 0.2 % is cut.
  const frames = path.map((x) => 1 + ((peak - 1) * x) / top);
  let end = frames.length;
  while (end > 2 && Math.abs(frames[end - 1]! - 1) < 0.002) end--;
  return [...frames.slice(0, end), 1];
}

/** Letter limit (#29): the ring's fill, the warning in the last `warnWithin` letters and the letters left. */
export function letterLimit(length: number, max: number, warnWithin = 10) {
  const left = Math.max(max - length, 0);
  return { show: length > 0, fill: Math.min(length / max, 1), warn: left <= warnWithin, left };
}

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Fan cards (#2): the transform that puts the share sheet's card (at `to`) over "Your card" on the page (at `from`),
 * from its top left corner, so animating it back to none lifts the card from the page into the sheet. Both are the
 * same 9:16 story card at different sizes, so one scale fits.
 */
export function liftFrom(from: Box, to: Box): string {
  const scale = to.width > 0 ? from.width / to.width : 1;
  return `translate(${round(from.left - to.left)}px, ${round(from.top - to.top)}px) scale(${round(scale, 4)})`;
}

const round = (n: number, places = 2) => Math.round(n * 10 ** places) / 10 ** places;
