"use client";

import { type CSSProperties, type RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

// Morph tooltip (motion-bookmarks.pdf #24): one tooltip for a group of targets (every element with data-tip inside
// `container`) that slides from target to target instead of a new one per hover. Pointer devices only (a mouse that
// can hover): touch has no hover and the targets already carry their names for screen readers, so it is aria-hidden.
// The first opens after 500 ms, grows from 97 % towards its target and fades in (125 ms --ease-out, origin at the
// bottom, where the target is); while it is open the next target is instant: it slides there (--spring-follow, no
// overshoot) and its cream pill widens or narrows by clip-path, the words swapping at once. It leaves faster than it
// came (100 ms), and 300 ms after leaving the group the next one waits 500 ms again. Reduced motion: it only fades.
// TODO(Chime): not drawn in Figma; the cream pill (bg/inverse, as the toasts) with a caption is a proposal.

const GAP = 8; // px above the target
const SLIDE = "duration-(--spring-follow-ms) ease-(--spring-follow) motion-reduce:transition-none";

export function MorphTooltip({ container }: { container: RefObject<HTMLElement | null> }) {
  const [tip, setTip] = useState<{ label: string; x: number; y: number } | null>(null);
  const [open, setOpen] = useState(false);
  const [slide, setSlide] = useState(false); // moving between targets (vs. appearing in place)
  const [width, setWidth] = useState(0);
  // The box is as wide as the widest label (the clip shows only the current label's width of it), so the invisible
  // box never reaches past the page edge over the first or last target and adds a sideways scroll.
  const [max, setMax] = useState(0);
  const text = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    // A mouse, and the rail laid out in one row (from tablet, 744 px): below that the rail scrolls sideways and clips it.
    const hover = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 744px)");
    let wait: ReturnType<typeof setTimeout> | undefined;
    let cool: ReturnType<typeof setTimeout> | undefined;
    let warm = false; // a tooltip was open a moment ago: the next one is instant and slides from where it was
    let current: HTMLElement | null = null; // the target under the pointer (its own children fire pointerover too)
    const target = (node: EventTarget | null) => (node instanceof Element ? node.closest<HTMLElement>("[data-tip]") : null);
    const place = (t: HTMLElement) => {
      const c = el.getBoundingClientRect();
      const r = t.getBoundingClientRect();
      return { label: t.dataset.tip ?? "", x: r.left + r.width / 2 - c.left, y: r.top - c.top };
    };
    const show = (t: HTMLElement, sliding: boolean) => {
      setSlide(sliding);
      setTip(place(t));
      setOpen(true);
      warm = true;
    };
    const over = (e: PointerEvent) => {
      const t = target(e.target);
      if (!t || t === current || e.pointerType !== "mouse" || !hover.matches) return;
      current = t;
      clearTimeout(cool);
      clearTimeout(wait);
      // A real mouse crosses the gap between two targets, closing the tooltip for a moment, so "warm" (open a
      // moment ago), not "open now", decides the slide.
      if (warm) show(t, true);
      else wait = setTimeout(() => show(t, false), 500);
    };
    const out = (e: PointerEvent) => {
      if (!target(e.target) || target(e.relatedTarget)) return; // on to another target: it slides there instead
      current = null;
      clearTimeout(wait);
      setOpen(false);
      cool = setTimeout(() => (warm = false), 300);
    };
    const press = () => {
      clearTimeout(wait);
      setOpen(false);
    };
    el.addEventListener("pointerover", over);
    el.addEventListener("pointerout", out);
    el.addEventListener("pointerdown", press);
    return () => {
      clearTimeout(wait);
      clearTimeout(cool);
      el.removeEventListener("pointerover", over);
      el.removeEventListener("pointerout", out);
      el.removeEventListener("pointerdown", press);
    };
  }, [container]);

  // The widest label, measured in the caption's own style before any tooltip shows (again once web fonts load).
  useEffect(() => {
    const measure = () => {
      const t = text.current;
      const el = container.current;
      if (!t || !el || t.firstChild) return; // a label is showing: React owns the text now
      let m = 0;
      for (const n of el.querySelectorAll<HTMLElement>("[data-tip]")) {
        t.textContent = n.dataset.tip ?? "";
        m = Math.max(m, t.offsetWidth);
      }
      t.textContent = "";
      setMax(Math.ceil(m));
    };
    measure();
    document.fonts?.ready.then(measure);
  }, [container]);

  // The pill's width follows the words (measured once they are in).
  useLayoutEffect(() => {
    if (text.current) setWidth(text.current.offsetWidth);
  }, [tip?.label]);

  const box = Math.max(max, width);
  const inset = Math.max(0, (box - width) / 2);
  return (
    <span
      aria-hidden="true"
      data-testid="morph-tooltip"
      data-open={open || undefined}
      className={`pointer-events-none absolute top-0 left-0 z-30 h-7 w-(--tip-max) ${
        slide ? `transition-transform ${SLIDE}` : ""
      }`}
      style={{ "--tip-max": `${box}px`, transform: tip ? `translate(${tip.x - box / 2}px, ${tip.y - GAP}px) translateY(-100%)` : undefined } as CSSProperties}
    >
      <span
        className={`absolute inset-0 flex origin-bottom items-center justify-center transition-[opacity,scale] ease-(--ease-out) motion-reduce:scale-100 ${
          open ? "scale-100 opacity-100 duration-[125ms]" : "scale-[0.97] opacity-0 duration-100"
        }`}
      >
        <span
          className={`absolute inset-0 rounded-sm bg-bg-inverse ${slide ? `transition-[clip-path] ${SLIDE}` : ""}`}
          style={{ clipPath: `inset(0 ${inset}px round 6px)` }}
        />
        <span ref={text} className="type-caption relative px-2.5 whitespace-nowrap text-text-inverse">
          {tip?.label}
        </span>
      </span>
    </span>
  );
}
