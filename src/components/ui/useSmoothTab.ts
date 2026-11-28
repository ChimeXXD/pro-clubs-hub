"use client";

import { useLayoutEffect, useRef } from "react";
import { ms, reducedMotion, token } from "@/lib/motion";

// Smooth tab (motion-bookmarks #8): when a filter chip changes what a grid shows, the old grid fades out over 120 ms
// while the new one fades in and slides 12 px in from the side of the chip picked (a chip to the right of the last
// one brings the grid in from the right). The old grid is a still copy laid over the new one and taken out of the
// layout at once, so the page below closes up while it fades (choreograph: a view swap is a crossfade, never a
// queue). The copy is cloned from the page, so it adds no second set of React cards, test IDs or links: it is
// inert and hidden from screen readers. Only a chip pick plays it; typing a search changes the grid instantly
// (nothing animates on keyboard input). Reduced motion keeps both fades and drops the slide.
export function useSmoothTab<T extends HTMLElement>(key: unknown) {
  const grid = useRef<T>(null);
  const leave = useRef<HTMLDivElement>(null);
  const side = useRef(0);

  /** Call before the state change, with +1 when the chip picked is right of the last one, -1 when left. */
  const before = (direction: 1 | -1) => {
    const from = grid.current;
    const layer = leave.current;
    side.current = direction;
    if (!from || !layer) return;
    layer.replaceChildren();
    const copy = from.cloneNode(true) as HTMLElement;
    for (const el of [copy, ...Array.from(copy.querySelectorAll("[data-testid], [id]"))]) {
      el.removeAttribute("data-testid");
      el.removeAttribute("id");
    }
    layer.append(copy);
    const out = copy.animate({ opacity: [1, 0] }, { duration: 120, easing: token("--ease-out", "ease-out"), fill: "forwards" });
    out.onfinish = () => copy.remove();
  };

  useLayoutEffect(() => {
    const el = grid.current;
    const direction = side.current;
    side.current = 0;
    if (!el || !direction) return;
    const frames = reducedMotion() ? { opacity: [0, 1] } : { opacity: [0, 1], transform: [`translateX(${12 * direction}px)`, "none"] };
    el.animate(frames, { duration: ms("--dur-base", 220), easing: token("--ease-out", "ease-out") });
  }, [key]);

  return { grid, leave, before };
}
