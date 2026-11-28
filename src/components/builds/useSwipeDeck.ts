"use client";

import { type PointerEvent, useLayoutEffect, useRef, useState } from "react";
import { project, reducedMotion, rubberband, runSpring, SPRINGS, type SpringState, VelocityTracker } from "@/lib/motion";

// The Swipe deck (motion-bookmarks.pdf #1) behind the Stance stage. While the finger is down only the front card
// moves (D-116): 1:1 with the finger, tilting x ÷ 20 degrees (at most 10), with a rubber band past the first and
// last card; no React render per move, the transform is written straight to the card (gestures, animation-
// performance). On release a spring takes over at the finger's speed: a flick whose projected end (apple-design §6)
// is more than 50 px out throws the card out the side it was thrown, to that side's neighbour slot behind the new
// front card, which settles in with the settle spring; anything less springs back. A card in flight can be caught
// again. Reduced motion keeps the tracking (the finger makes that motion) and drops the throw and the spring: the
// cards change places at once and only their opacity fades.

export const SWIPE = 50; // px of projected travel past which a release moves one card
const tilt = (x: number) => Math.max(-10, Math.min(10, x / 20));

/** A card's transform in its slot (`offset` from the front), plus a drag and its tilt. */
export const slot = (offset: number, x = 0, r = 0) =>
  `translateX(calc(-50% + ${offset} * var(--peek-x) + ${x}px)) rotate(${r}deg) scale(${offset === 0 ? 1 : "var(--peek-s)"})`;

interface Flight {
  stop: () => SpringState;
  /** The selection the flight belongs to: a change to any other stops it, and CSS takes the card from where it is. */
  selected: number;
}

export function useSwipeDeck({ selected, count, onSelect }: { selected: number; count: number; onSelect: (i: number) => void }) {
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef(new Map<number, HTMLElement>());
  const flights = useRef(new Map<HTMLElement, Flight>());
  // `moved`: the card is under the finger (a drag, or a card caught in motion); `swiped`: the finger itself travelled
  // past the 6 px slop. Only a swipe can throw: a tap that catches a card still settling lets it spring home.
  const drag = useRef<{ id: number; x0: number; base: number; moved: boolean; swiped: boolean; dx: number; v: VelocityTracker } | null>(null);
  const lastMoved = useRef(false); // whether the last press became a drag: a drag is never a tap on a neighbour
  const current = useRef(selected);
  // The card a throw sent to the front: it lands with the settle spring; every other change eases out.
  const [settling, setSettling] = useState<number | null>(null);
  // Any later change of selection (the rail, an arrow, a tap) eases out, even back to the card a throw once brought.
  const [seen, setSeen] = useState(selected);
  if (seen !== selected) {
    setSeen(selected);
    if (settling !== null && settling !== selected) setSettling(null);
  }

  const rest = (el: HTMLElement, i: number, sel = current.current) => {
    flights.current.delete(el);
    el.style.transition = "";
    el.style.transform = slot(i - sel);
  };

  // A new selection from anywhere else (the rail, the arrows, a tap on a neighbour) takes over a card still in an
  // older flight: CSS carries it from where it is to its new slot.
  useLayoutEffect(() => {
    current.current = selected;
    for (const [el, f] of flights.current) {
      if (f.selected === selected) continue;
      f.stop();
      const i = [...cards.current].find(([, c]) => c === el)?.[0];
      flights.current.delete(el);
      el.style.transition = "";
      if (i !== undefined) el.style.transform = slot(i - selected);
    }
  }, [selected]);
  useLayoutEffect(() => () => flights.current.forEach((f) => f.stop()), []);

  const front = () => cards.current.get(current.current);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || drag.current) return; // one finger drives the swipe
    const el = front();
    let base = 0;
    const flight = el && flights.current.get(el);
    if (el && flight) {
      // Caught mid-flight: carry on from where it is.
      base = flight.stop().value;
      flights.current.delete(el);
    } else if (el) {
      // Caught while CSS is still moving it into place: read where it is on screen.
      const live = new DOMMatrixReadOnly(getComputedStyle(el).transform).m41 + el.offsetWidth / 2;
      if (Math.abs(live) > 1) base = live;
    }
    if (el && base !== 0) {
      el.style.transition = "none";
      el.style.transform = slot(0, base, tilt(base));
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    const v = new VelocityTracker();
    v.add(e.clientX, e.timeStamp);
    lastMoved.current = base !== 0;
    drag.current = { id: e.pointerId, x0: e.clientX, base, moved: base !== 0, swiped: false, dx: base, v };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = front();
    if (!d || d.id !== e.pointerId || !el) return;
    const raw = e.clientX - d.x0;
    if (Math.abs(raw) > 6) d.swiped = true;
    if (!d.moved && d.swiped) {
      d.moved = lastMoved.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      // The opacity may still fade; the transform belongs to the finger now.
      el.style.transition = "opacity 250ms var(--ease-out)";
    }
    if (!d.moved) return;
    const x = d.base + raw;
    const atEnd = (x > 0 && current.current === 0) || (x < 0 && current.current === count - 1);
    d.dx = atEnd ? rubberband(x, e.currentTarget.clientWidth) : x;
    el.style.transform = slot(0, d.dx, tilt(d.dx));
    d.v.add(e.clientX, e.timeStamp);
  };

  const throwCard = (el: HTMLElement, x: number, velocity: number, dir: 1 | -1) => {
    const index = current.current;
    const next = index + dir;
    setSettling(next);
    onSelect(next);
    if (reducedMotion() || !stage.current) return rest(el, index, next);
    const style = getComputedStyle(stage.current);
    const peekX = parseFloat(style.getPropertyValue("--peek-x"));
    const peekS = parseFloat(style.getPropertyValue("--peek-s"));
    const distance = -dir * peekX - x;
    const r0 = tilt(x);
    el.style.transition = "opacity 250ms var(--ease-out)";
    // One spring runs the throw from here (0) to the neighbour slot (1), starting at the finger's speed. When the card
    // was let go near that slot the progress can swing far past 0–1 (the speed over a short distance): the position
    // follows it, the shrink and the untilt are held to 0–1 so the card never mirrors or balloons.
    const flight = runSpring(
      SPRINGS.settle,
      { value: 0, velocity: distance ? velocity / distance : 0 },
      1,
      (p) => {
        const q = Math.max(0, Math.min(1, p));
        el.style.transform = `translateX(calc(-50% + ${x + p * distance}px)) rotate(${r0 * (1 - q)}deg) scale(${1 + (peekS - 1) * q})`;
      },
      () => rest(el, index),
      0.002,
    );
    flights.current.set(el, { stop: flight.stop, selected: next });
  };

  const springBack = (el: HTMLElement, x: number, velocity: number) => {
    if (reducedMotion()) return rest(el, current.current);
    const flight = runSpring(
      SPRINGS.fade,
      { value: x, velocity },
      0,
      (v) => (el.style.transform = slot(0, v, tilt(v))),
      () => rest(el, current.current),
    );
    flights.current.set(el, { stop: flight.stop, selected: current.current });
  };

  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    const el = front();
    if (!d.moved || !el) return;
    const velocity = d.v.velocity(e.timeStamp) * 1000; // px/s
    const projected = d.dx + project(velocity);
    const dir = !d.swiped ? 0 : projected <= -SWIPE ? 1 : projected >= SWIPE ? -1 : 0;
    const next = current.current + dir;
    if (e.type !== "pointercancel" && dir !== 0 && next >= 0 && next < count) throwCard(el, d.dx, velocity, dir);
    else springBack(el, d.dx, velocity);
  };

  // A press that leaves the stage before it became a drag (so before capture) ends there, or the next hover would drag.
  const onPointerLeave = () => {
    if (drag.current && !drag.current.moved) drag.current = null;
  };

  /** Whether the last pointer press became a drag (read by a neighbour's click). */
  const dragged = () => lastMoved.current;

  // One stable callback per card, so React doesn't detach and re-attach every card's ref on each render.
  const refs = useRef(new Map<number, (el: HTMLElement | null) => void>());
  const cardRef = (i: number) => {
    let ref = refs.current.get(i);
    if (!ref) {
      ref = (el) => {
        if (el) cards.current.set(i, el);
        else cards.current.delete(i);
      };
      refs.current.set(i, ref);
    }
    return ref;
  };

  return {
    stage,
    cardRef,
    settling,
    dragged,
    handlers: { onPointerDown, onPointerMove, onPointerUp: onPointerEnd, onPointerCancel: onPointerEnd, onPointerLeave },
  };
}
