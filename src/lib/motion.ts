// Gesture maths for the motion that a finger drives (motion-bookmarks.pdf #1 Swipe deck, #30 the toast's swipe).
// While the pointer is down the element follows it 1:1; on release a spring takes over at the finger's speed
// (apple-design §5), aimed at where the flick was going (§6), and can be caught again mid-flight (§3). The same
// springs as the CSS tokens in motion.css (scripts/build-springs.mjs; a unit test keeps the two equal).

export interface Spring {
  stiffness: number;
  damping: number;
}

export const SPRINGS = {
  follow: { stiffness: 900, damping: 50 },
  settle: { stiffness: 280, damping: 22 },
  soft: { stiffness: 260, damping: 24 },
  pop: { stiffness: 520, damping: 16 },
  fade: { stiffness: 420, damping: 32 },
  lead: { stiffness: 600, damping: 30 },
  trail: { stiffness: 300, damping: 30 },
} as const satisfies Record<string, Spring>;

export interface SpringState {
  value: number;
  /** Units per second. */
  velocity: number;
}

/** One step of a unit-mass spring towards `target` (semi-implicit Euler, stable at frame-sized steps). */
export function stepSpring({ stiffness, damping }: Spring, s: SpringState, target: number, dt: number): SpringState {
  const accel = -stiffness * (s.value - target) - damping * s.velocity;
  const velocity = s.velocity + accel * dt;
  return { value: s.value + velocity * dt, velocity };
}

/** At rest within `precision` units (half a pixel for a position; pass a small one for a 0–1 progress). */
const atRest = (s: SpringState, target: number, precision = 0.5) =>
  Math.abs(s.value - target) < precision && Math.abs(s.velocity) < precision * 10;

/** The whole path at 120 frames a second until it rests (for tests and for checking a spring's feel). */
export function simulate(spring: Spring, from: SpringState, target: number): SpringState[] {
  const out: SpringState[] = [];
  let s = from;
  for (let i = 0; i < 600 && !(i > 0 && atRest(s, target)); i++) out.push((s = stepSpring(spring, s, target, 1 / 120)));
  out.push({ value: target, velocity: 0 });
  return out;
}

/**
 * Runs a spring on animation frames, calling `onFrame` with each value (write it to `style.transform`, never to
 * React state: animation-performance). `stop()` halts it where it is and returns the live value and speed, so a
 * new gesture can catch it mid-flight.
 */
export function runSpring(
  spring: Spring,
  from: SpringState,
  target: number,
  onFrame: (value: number) => void,
  onRest?: () => void,
  precision = 0.5,
): { stop: () => SpringState } {
  let s = from;
  let last = performance.now();
  let frame = requestAnimationFrame(function tick(now) {
    // Steps of at most 1/60 s, so a dropped frame doesn't throw the spring off.
    let dt = Math.min((now - last) / 1000, 0.064);
    last = now;
    while (dt > 0) {
      const step = Math.min(dt, 1 / 60);
      s = stepSpring(spring, s, target, step);
      dt -= step;
    }
    if (atRest(s, target, precision)) {
      s = { value: target, velocity: 0 };
      onFrame(target);
      onRest?.();
      return;
    }
    onFrame(s.value);
    frame = requestAnimationFrame(tick);
  });
  return {
    stop: () => {
      cancelAnimationFrame(frame);
      return s;
    },
  };
}

/** The pointer's speed over its last few moves (gestures: "velocity from the last 3 pointer moves"). */
export class VelocityTracker {
  private samples: { x: number; t: number }[] = [];
  add(x: number, t: number) {
    this.samples.push({ x, t });
    if (this.samples.length > 3) this.samples.shift();
  }
  /** Px per ms; 0 when the finger stopped for more than `staleMs` before letting go. */
  velocity(now = this.samples.at(-1)?.t ?? 0, staleMs = 80): number {
    const first = this.samples[0];
    const last = this.samples.at(-1);
    if (!first || !last || last.t === first.t || now - last.t > staleMs) return 0;
    return (last.x - first.x) / (last.t - first.t);
  }
}

/** How far a flick at `velocity` px/s carries before it stops (Apple's projection, d 0.99 for a snappy feel). */
export function project(velocity: number, decelerationRate = 0.99): number {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/** Past an end, the element follows less the further it goes (Apple's rubber band, constant 0.55). */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  const d = Math.abs(overshoot);
  return (Math.sign(overshoot) * d * dimension * constant) / (dimension + constant * d);
}

/** Whether the person asked for less motion (read at the moment of use; it can change while the page is open). */
export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Whether the change in progress follows the person's own tap, click or key (a page opened on a link that names a
 * state, /builds#finisher, has none: it should open in place, not fly there). Browsers without the API animate.
 */
export const userInitiated = () =>
  typeof navigator === "undefined" || !("userActivation" in navigator) || navigator.userActivation.isActive;

// The sliding pill (Tab pill and Bottom bar, motion-bookmarks #5, #6), and the motion tokens read for the Web
// Animations API (the timings themselves are the tokens in src/styles/motion.css).

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

const px = (n: number) => `${Math.round(n * 100) / 100}px`;

/**
 * The clip-path that cuts a layer the size of its row down to one item, as a pill (Tab pill and Bottom bar,
 * motion-bookmarks #5, #6). `ring` (a CSS length such as "var(--pill-ring)") pulls every side in by that much, so a
 * second layer under it shows as a ring.
 */
export function pillInset(item: Box, row: { width: number; height: number }, ring?: string): string {
  const sides = [item.top, row.width - item.left - item.width, row.height - item.top - item.height, item.left];
  const values = sides.map((s) => (ring ? `calc(${px(s)} + ${ring})` : px(s)));
  return `inset(${values.join(" ")} round 9999px)`;
}

/** A motion token's value, for the Web Animations API, which can't read var(). Browser only. */
export const token = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
export const ms = (name: string, fallback: number) => parseFloat(token(name, `${fallback}ms`)) || fallback;
