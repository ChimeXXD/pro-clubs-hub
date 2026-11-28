import { project } from "./motion.ts";

// The turntable's drag (D-35): how far a sideways drag turns the head. One frame per PX_PER_FRAME pixels, so a full
// turn of 36 frames is a 288 px drag, about the picture's width on a phone. It wraps both ways.
export const PX_PER_FRAME = 8;

export function turnFrame(startFrame: number, dx: number, frames: number): number {
  const moved = Math.trunc(dx / PX_PER_FRAME);
  return (((startFrame + moved) % frames) + frames) % frames;
}

// The flick (Scrubber, motion-bookmarks #18; the gestures and apple-design skills): let go while moving and the head
// keeps turning, slowing the way a scroll does, and stops on a whole frame. The landing point is Apple's momentum
// projection with the snappier deceleration rate (0.99 a millisecond), so a flick turns a few frames, not several
// full turns; the motion after release is the same decay, so it leaves the finger at the finger's speed.
const DECAY = 0.99;
/** Slower than this (px/s) at release is a stop, not a flick. */
export const FLING_MIN = 200;
/** Faster than this (px/s) counts as this: 2,900 px/s projects 287 px, one turn of 36 frames at 8 px a frame. */
export const FLING_MAX = 2900;

/**
 * Where a release at `dx` (px dragged) moving at `velocity` (px/s, from the shared VelocityTracker) comes to rest: a
 * whole frame, or `dx` if slow. The projection is the shared one (src/lib/motion.ts) at the same rate as the decay.
 */
export function flingTarget(dx: number, velocity: number): number {
  if (Math.abs(velocity) < FLING_MIN) return dx;
  // Two pointer samples a couple of ms apart can read as a wild speed: a flick turns the head at most once round.
  const v = Math.sign(velocity) * Math.min(Math.abs(velocity), FLING_MAX);
  const end = dx + project(v, DECAY);
  return Math.round(end / PX_PER_FRAME) * PX_PER_FRAME;
}

/** The drag distance `t` ms after letting go at `from`, decaying towards `to`; exactly `to` once under half a pixel. */
export function flingAt(from: number, to: number, t: number): number {
  const at = from + (to - from) * (1 - DECAY ** t);
  return Math.abs(to - at) < 0.5 ? to : at;
}
