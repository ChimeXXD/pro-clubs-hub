"use client";

import { type CSSProperties, useState } from "react";

// A number that rolls when it changes (Number stepper and Stat card, motion-bookmarks.pdf #12, #13): the old value
// leaves 0.6 em upward while the new one rises in when it grows, the other way when it falls, 140 ms ease-out. A change
// during a roll restarts it, so fast taps never queue; a change the caller marks `still` (from a key press, or a tap
// that came faster than the roll) is set at once (nothing on keyboard or very frequent actions). Reduced motion
// crossfades. The text is the plain value, so screen readers and tests read it as before; the leaving value is hidden
// from them.
const ROLL = "animate-[var(--roll)_140ms_var(--ease-out)_both] motion-reduce:animate-[fade-in_140ms_linear_both]";
const LEAVE = "animate-[var(--roll)_140ms_var(--ease-out)_both] motion-reduce:animate-[fade-out_140ms_linear_both]";

function direction(next: string, prev: string): 1 | -1 {
  const a = Number(next.replace(/[^\d.-]/g, ""));
  const b = Number(prev.replace(/[^\d.-]/g, ""));
  return Number.isNaN(a) || Number.isNaN(b) || a >= b ? 1 : -1;
}

export function RollingNumber({ value, className = "", still = false }: { value: string; className?: string; still?: boolean }) {
  const [roll, setRoll] = useState({ current: value, previous: null as string | null, up: true, n: 0, still: true });
  // Store what was shown before, during render (React's pattern for a value from the previous render).
  if (roll.current !== value)
    setRoll({ current: value, previous: still ? null : roll.current, up: direction(value, roll.current) === 1, n: roll.n + 1, still });
  const vars = { "--roll": roll.up ? "roll-in-up" : "roll-in-down" } as CSSProperties;
  const leaveVars = { "--roll": roll.up ? "roll-out-up" : "roll-out-down" } as CSSProperties;
  return (
    <span className={`relative inline-grid overflow-hidden align-bottom ${className}`}>
      <span key={roll.n} className={`col-start-1 row-start-1 ${roll.still ? "" : ROLL}`} style={vars}>
        {roll.current}
      </span>
      {roll.previous !== null && (
        <span
          key={`out-${roll.n}`}
          aria-hidden="true"
          className={`col-start-1 row-start-1 ${LEAVE}`}
          style={leaveVars}
          onAnimationEnd={() => setRoll((r) => (r.n === roll.n ? { ...r, previous: null } : r))}
        >
          {roll.previous}
        </span>
      )}
    </span>
  );
}
