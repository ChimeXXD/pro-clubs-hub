"use client";

import { useLayoutEffect, useRef } from "react";
import type { sectionBar } from "@/lib/face-page";
import { ms, reducedMotion, token } from "@/lib/motion";

// Figma "Sections bar" (354:1469, D-73): one 6 px segment per section, 4 px apart, each as wide as its values. Done
// sections are lime; the current one fills from the left by its screens done (including the one in hand); the rest are
// bg/raised. Light mode fills with accent/text: lime on cream is 1.03:1 (O-23, D-115). The fill grows by transform,
// not width, eased out when a step is done; under reduced motion it jumps.
// Step progress (motion-bookmarks #9): when the player's step finishes a section, its segment pops (grows to 1.5×
// its height and settles, --dur-base, --ease-out) as the fill lands: state indication for the section done. Only on
// the player's own move (`pop`), never when the page opens on a stored step. Reduced motion: the segment's fill
// fades up from half instead.
type Section = ReturnType<typeof sectionBar>[number];

export function SectionBar({ sections, pop = false }: { sections: Section[]; pop?: boolean }) {
  const bar = useRef<HTMLDivElement>(null);
  const before = useRef(sections);
  useLayoutEffect(() => {
    const was = before.current;
    before.current = sections;
    if (!pop || !bar.current) return;
    sections.forEach((s, i) => {
      // Finished just now: the step has moved past it, and it was the section in hand or one a jump passed.
      const w = was[i];
      if (!(w && (w.current || w.fill < 1) && !s.current && s.fill === 1)) return;
      const segment = bar.current?.children[i] as HTMLElement | undefined;
      const easing = token("--ease-out", "ease-out");
      if (reducedMotion()) segment?.firstElementChild?.animate({ opacity: [0.5, 1] }, { duration: ms("--dur-base", 220), easing });
      // It lands as the fill's own 200 ms transition ends (cause, then effect).
      else segment?.animate({ transform: ["none", "scaleY(1.5)", "none"], offset: [0, 0.4, 1] }, { duration: ms("--dur-base", 220), delay: 150, easing });
    });
  }, [sections, pop]);

  return (
    <div ref={bar} data-testid="section-bar" aria-hidden="true" className="flex gap-1">
      {sections.map((s) => (
        <span
          key={s.name}
          data-fill={String(Math.round(s.fill * 1000) / 1000)}
          className="relative h-1.5 min-w-px overflow-hidden rounded-[3px] bg-bg-raised"
          style={{ flexGrow: s.weight, flexBasis: 0 }}
        >
          <span
            className="absolute inset-0 origin-left bg-accent-fill transition-transform duration-200 ease-(--ease-out) motion-reduce:transition-none light:bg-accent-text"
            style={{ transform: `scaleX(${s.fill})` }}
          />
        </span>
      ))}
    </div>
  );
}
