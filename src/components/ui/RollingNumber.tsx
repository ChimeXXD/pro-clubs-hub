"use client";

import { type CSSProperties, useState } from "react";

// A number that rolls when it changes (Number stepper and Stat card, motion-bookmarks.pdf #12, #13): the old value
// leaves 0.6 em upward while the new one rises in when it grows, the other way when it falls, 140 ms ease-out. A change
// during a roll restarts it, so fast taps never queue; a change the caller marks `still` (from a key press, or a tap
// that came faster than the roll) is set at once (nothing on keyboard or very frequent actions). Reduced motion
// crossfades. The text is the plain value, so screen readers and tests read it as before; the leaving value is hidden
// from them. The box takes the new value's width at once (the leaving value is laid over it, clipped only top and
// bottom), so the text around a number that changes length (1,419 → 724) moves once, not again when the roll ends.
// `from` (optional): a value shown before this one mounted (Submit's step line, remade on each step): it rolls in from
// that value on mount, unless `still`.
const ROLL = "animate-[var(--roll)_140ms_var(--ease-out)_both] motion-reduce:animate-[fade-in_140ms_linear_both]";
const LEAVE = "animate-[var(--roll)_140ms_var(--ease-out)_both] motion-reduce:animate-[fade-out_140ms_linear_both]";

function direction(next: string, prev: string): 1 | -1 {
  const a = Number(next.replace(/[^\d.-]/g, ""));
  const b = Number(prev.replace(/[^\d.-]/g, ""));
  return Number.isNaN(a) || Number.isNaN(b) || a >= b ? 1 : -1;
}

export function RollingNumber({ value, className = "", still = false, from }: { value: string; className?: string; still?: boolean; from?: string }) {
  const [roll, setRoll] = useState(() => {
    const rolls = from !== undefined && from !== value && !still;
    return { current: value, previous: rolls ? from : (null as string | null), up: !rolls || direction(value, from) === 1, n: 0, still: !rolls };
  });
  // Store what was shown before, during render (React's pattern for a value from the previous render).
  if (roll.current !== value)
    setRoll({ current: value, previous: still ? null : roll.current, up: direction(value, roll.current) === 1, n: roll.n + 1, still });
  const vars = { "--roll": roll.up ? "roll-in-up" : "roll-in-down" } as CSSProperties;
  const leaveVars = { "--roll": roll.up ? "roll-out-up" : "roll-out-down" } as CSSProperties;
  return (
    <span className={`relative inline-grid overflow-y-clip align-bottom ${className}`}>
      <span key={roll.n} className={`col-start-1 row-start-1 ${roll.still ? "" : ROLL}`} style={vars}>
        {roll.current}
      </span>
      {roll.previous !== null && (
        <span
          key={`out-${roll.n}`}
          aria-hidden="true"
          className={`absolute top-0 left-0 whitespace-nowrap ${LEAVE}`}
          style={leaveVars}
          onAnimationEnd={() => setRoll((r) => (r.n === roll.n ? { ...r, previous: null } : r))}
        >
          {roll.previous}
        </span>
      )}
    </span>
  );
}
