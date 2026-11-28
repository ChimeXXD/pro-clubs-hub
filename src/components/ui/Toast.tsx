"use client";

import { type PointerEvent, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/shell/Icon";
import { reducedMotion, rubberband, VelocityTracker } from "@/lib/motion";

// Figma Toast (205:365): a cream pill (bg/inverse) with ink text and an icon (DESIGN.md, D-94), Elevation/3. Tones:
// success (check), info (its icon set by the caller, such as Save images' download), danger (the error icon in
// status/danger-bg, never pure red). Placement "page": centred, 44 px above the bottom nav on phone, 40 px from the
// bottom on tablet and desktop. Placement "dialog", for a toast over the share sheet or dialog, inside it so it sits
// in the top layer (493:9624 to 493:15977): 34 px from the top on phone (the sheet fills the bottom), 40 px from
// the bottom on tablet and 24 px on desktop, under the dialog.
// The role="status" region stays mounted and only its content changes: a live region inserted with its text
// already inside is often not announced (VoiceOver). A new `id` brings a new toast in (a repeat of the same message
// replaces it and comes in again). The caller clears `message` after 4 s, as the Figma description says.
// Notification stack (motion-bookmarks.pdf #30): a second toast stacks on the first instead of replacing it; the
// first steps back (95 %, 8 px away from the edge it sits on, peeking out behind, 60 % opacity, --ease-out 220 ms, a transition so a third
// toast retargets it) and its words fade out, so only its edge shows, as Sonner's stack does. Both leave when the
// caller clears the message. Swipe to dismiss: the front toast follows the finger 1:1 towards its edge (a rubber band
// the other way) and leaves when pulled 20 px or flicked; otherwise it springs back. Reduced motion: the stack and the
// dismissal only fade.
const PLACE = {
  page: "bottom-[calc(128px+env(safe-area-inset-bottom))] tablet:bottom-10",
  dialog: "top-[34px] tablet:top-auto tablet:bottom-10 desktop:bottom-6",
} as const;
// The toast behind steps back towards the edge the toasts sit on: up from the bottom, down from the top.
const BACK = {
  page: "origin-top -translate-y-2",
  dialog: "origin-bottom translate-y-2 tablet:origin-top tablet:-translate-y-2",
} as const;
const DISMISS = 20; // px
const FLICK = 0.11; // px per ms (Emil: a flick dismisses whatever the distance)

export type ToastTone = "success" | "info" | "danger";
interface Item {
  key: string;
  message: string;
  tone: ToastTone;
  icon?: IconName;
}

export function Toast({
  message,
  id,
  tone = "success",
  icon,
  placement = "page",
}: {
  message: string | null;
  id?: number;
  tone?: ToastTone;
  icon?: IconName;
  placement?: keyof typeof PLACE;
}) {
  const change = message === null ? null : `${id ?? ""}|${message}`;
  const [shown, setShown] = useState<{ change: string | null; items: Item[] }>({ change: null, items: [] });
  // A new toast joins the stack (at most two: the newest in front); the same `id` with a new message updates the
  // front one in place ("Making your images…" becoming its result); a cleared message takes the stack away.
  if (shown.change !== change) {
    const key = id !== undefined ? String(id) : (message ?? "");
    const front = shown.items.at(-1);
    let items: Item[] = [];
    if (message !== null && front?.key === key) items = [...shown.items.slice(0, -1), { key, message, tone, icon }];
    else if (message !== null) items = [...shown.items.filter((i) => i.message !== message).slice(-1), { key, message, tone, icon }];
    setShown({ change, items });
  }
  const dismiss = (k: string) => setShown((s) => ({ ...s, items: s.items.filter((i) => i.key !== k) }));
  const items = shown.items;

  return (
    // Fixed, so the empty region takes no room (and no gap) in whatever row the caller puts it in.
    <div role="status" className="fixed">
      {items.map((item, i) => {
        const front = i === items.length - 1;
        return (
          <Pill
            key={item.key}
            item={item}
            front={front}
            className={`${PLACE[placement]} ${front ? "z-20" : `z-19 scale-95 opacity-60 ${BACK[placement]}`}`}
            onDismiss={() => dismiss(item.key)}
          />
        );
      })}
    </div>
  );
}

function Pill({ item, front, className, onDismiss }: { item: Item; front: boolean; className: string; onDismiss: () => void }) {
  const drag = useRef<{ id: number; y0: number; dy: number; dir: 1 | -1; v: VelocityTracker } | null>(null);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!front || drag.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    // Towards the nearer edge: down for a toast at the bottom, up for one at the top.
    const dir = r.top + r.height / 2 > window.innerHeight / 2 ? 1 : -1;
    const v = new VelocityTracker();
    v.add(e.clientY, e.timeStamp);
    drag.current = { id: e.pointerId, y0: e.clientY, dy: 0, dir, v };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.transition = "none";
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const raw = e.clientY - d.y0;
    // 1:1 towards the edge; the other way gives a little and stops.
    d.dy = Math.sign(raw) === d.dir ? raw : rubberband(raw, 120);
    e.currentTarget.style.transform = `translateY(${d.dy}px)`;
    d.v.add(e.clientY, e.timeStamp);
  };
  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    const el = e.currentTarget;
    const speed = d.v.velocity(e.timeStamp) * d.dir;
    // Only the front toast leaves: one that a newer toast pushed back mid-drag springs back instead.
    // A flick needs a few pixels of travel too, so a tap that wobbles 2 px never dismisses it.
    if (front && e.type !== "pointercancel" && (d.dy * d.dir > DISMISS || (speed > FLICK && d.dy * d.dir > 4))) {
      // Leaves the way it was pushed (fading only with reduced motion), then the stack closes up.
      const reduce = reducedMotion();
      el.style.transition = reduce
        ? "opacity var(--dur-fast) linear"
        : "transform var(--dur-base) var(--ease-out), opacity var(--dur-base) var(--ease-out)";
      if (!reduce) el.style.transform = `translateY(${d.dir * 100}%)`;
      el.style.opacity = "0";
      // Its own opacity, not a bubbled transition from its words (they fade in when it has just come forward).
      const done = (t: TransitionEvent) => {
        if (t.target !== el || t.propertyName !== "opacity") return;
        el.removeEventListener("transitionend", done);
        onDismiss();
      };
      el.addEventListener("transitionend", done);
      return;
    }
    // Back to the class's own transition once settled, so stepping back in the stack still animates afterwards.
    const settle = (t?: TransitionEvent) => {
      if (t && (t.target !== el || t.propertyName !== "transform")) return;
      el.removeEventListener("transitionend", settle);
      el.style.transition = "";
    };
    if (d.dy === 0) return settle();
    el.style.transition = "transform var(--spring-fade-ms) var(--spring-fade)";
    el.style.transform = "";
    el.addEventListener("transitionend", settle);
  };

  return (
    <div
      aria-hidden={front ? undefined : true}
      data-testid="toast"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      className={`fixed inset-x-0 ${className} mx-auto flex w-fit max-w-[340px] touch-none items-center gap-2 rounded-[22px] bg-bg-inverse py-3 pr-[18px] pl-3.5 text-text-inverse shadow-elevation-3 transition-[opacity,translate,scale] duration-(--dur-base) ease-(--ease-out) select-none starting:translate-y-2 starting:opacity-0 motion-reduce:transition-opacity motion-reduce:starting:translate-y-0`}
    >
      {/* The toast behind shows only its edge: its words fade out, so two messages never show through each other. */}
      <span className={`flex transition-opacity duration-(--dur-fast) ${front ? "" : "opacity-0"} ${item.tone === "danger" ? "text-status-danger-bg" : ""}`}>
        <Icon name={item.icon ?? (item.tone === "danger" ? "error" : "check-circle")} size={20} />
      </span>
      <span className={`type-label transition-opacity duration-(--dur-fast) ${front ? "" : "opacity-0"}`}>{item.message}</span>
    </div>
  );
}
