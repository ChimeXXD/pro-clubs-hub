"use client";

import { type MouseEvent, useLayoutEffect, useRef, useState } from "react";
import { GROUPS } from "@/lib/builds";
import type { PositionGroup } from "@/lib/content/types";
import { reducedMotion } from "@/lib/motion";

// The Keeper · Defender · Midfielder · Forward chips over the archetype tiles (Figma Chip 200:337, Size=small, as
// SmallChip draws it), with the Segmented control's sliding pill (motion-bookmarks.pdf #7). Purpose: state indication;
// the lime highlight is one shape that travels to the picked group (DESIGN.md: "the highlight is one shape that springs
// from row to row, never a fill that snaps per row").
// Built as a clipped copy (emil-design-eng, "Tabs with perfect color transitions"): the chips are drawn twice, plain
// underneath and lime on top, and the top copy is clipped to the picked chip by clip-path inset(), which travels on the
// fade spring (--spring-fade, about 2 % overshoot: a tap, not a throw, so almost no bounce). The text turns from cream
// to ink exactly where the pill passes, which per-chip colour fades can't do, and nothing is measured per frame.
// From the keyboard (Enter or Space) the pill moves at once. With reduced motion it doesn't travel: the lime copy
// fades in on the picked chip over --dur-fast (DESIGN.md: a selected state fades), a gentler version, not none. Both rows are the same boxes, as SmallChip draws them: the picked chip has no border (2 px
// narrower than the outlined ones, which is what keeps the four on one row at 390 px), the lime copies of the others
// keep a transparent one. Until the script has measured the row (the static page, before it runs), the picked chip
// itself is lime, so the choice never shows unpicked.
// The classes are SmallChip's (Figma Chip, Size=small), copied rather than shared so the shared chip stays as it is.
const CHIP = "type-label inline-flex h-8 shrink-0 items-center rounded-full px-3 whitespace-nowrap";
const LIT = "bg-accent-fill text-accent-on-fill light:ring-1 light:ring-accent-on-fill light:ring-inset";
const PLAIN = "border border-border-strong bg-bg-surface text-text-primary";

export function GroupChips({ group, onGroup }: { group: PositionGroup; onGroup: (group: PositionGroup, still: boolean) => void }) {
  const row = useRef<HTMLDivElement>(null);
  const lime = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ clip: string; still: boolean } | null>(null);
  const still = useRef(true);
  // The row the pill is on: a move to a chip on another row (the chips wrap at 360 px) doesn't travel, since a window
  // sliding diagonally across both rows shows slices of chips it isn't on (choreograph: when overlap looks broken).
  const rowTop = useRef<number | null>(null);

  // Measure the picked chip before paint (no frame shows the old place), and again when the row reflows.
  useLayoutEffect(() => {
    const el = row.current;
    if (!el) return;
    const measure = () => {
      const chip = el.querySelector<HTMLElement>(`[data-group="${group}"]`);
      if (!chip) return null;
      const top = chip.offsetTop;
      if (rowTop.current !== null && rowTop.current !== top) still.current = true;
      rowTop.current = top;
      const left = chip.offsetLeft;
      const right = el.clientWidth - left - chip.offsetWidth;
      const bottom = el.clientHeight - top - chip.offsetHeight;
      return `inset(${top}px ${right}px ${bottom}px ${left}px round 9999px)`;
    };
    let clip = measure();
    if (clip) setPill({ clip, still: still.current });
    if (clip && !still.current && reducedMotion()) lime.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: "linear" });
    // A pick's kind is used once: a later change of group from outside (not a click here) moves the pill at once.
    still.current = true;
    // A resize (the window, the font loading in) moves the pill at once. A call that finds the pill where it is (the
    // observer's first, on observe) does nothing, so it can't cancel a pill already on its way.
    const observer = new ResizeObserver(() => {
      const next = measure();
      if (!next || next === clip) return;
      clip = next;
      still.current = true;
      setPill({ clip: next, still: true });
    });
    observer.observe(el);
    el.querySelectorAll("button").forEach((b) => observer.observe(b));
    return () => observer.disconnect();
  }, [group]);

  // A tap on the picked chip changes nothing (and leaves no pick kind behind for a later change).
  const pick = (g: PositionGroup, e: MouseEvent<HTMLButtonElement>) => {
    if (g === group) return;
    still.current = e.detail === 0;
    onGroup(g, still.current);
  };

  return (
    <div ref={row} className="relative flex flex-wrap gap-1.5">
      {GROUPS.map((g) => (
        <button
          key={g.group}
          type="button"
          data-testid="submit-group"
          data-group={g.group}
          aria-pressed={g.group === group}
          onClick={(e) => pick(g.group, e)}
          className={`${CHIP} tap-target ${g.group !== group ? PLAIN : pill ? "bg-bg-surface text-text-primary" : LIT}`}
        >
          {g.label}
        </button>
      ))}
      {/* The lime copy, clipped to the picked chip. It takes no clicks and is hidden from screen readers. */}
      <div
        ref={lime}
        aria-hidden="true"
        data-testid="group-pill"
        className={`pointer-events-none absolute inset-0 flex flex-wrap gap-1.5 ${
          !pill || pill.still ? "transition-none" : "transition-[clip-path] duration-(--spring-fade-ms) ease-(--spring-fade) motion-reduce:transition-none"
        } ${pill ? "" : "invisible"}`}
        style={pill ? { clipPath: pill.clip } : undefined}
      >
        {GROUPS.map((g) => (
          <span key={g.group} className={`${CHIP} ${LIT} ${g.group === group ? "" : "border border-transparent"}`}>
            {g.label}
          </span>
        ))}
      </div>
    </div>
  );
}
