"use client";

import { type ReactNode, type RefObject, useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/shell/Icon";
import { reducedMotion } from "@/lib/motion";

// A button's icon that answers the action in place (motion-bookmarks.pdf #19 Loading to success, #20 Copy button):
// "idle" shows the button's own icon, "busy" its spinner, "done" a check. The icon slot keeps its 20 px, so the
// button never changes width. Purpose: feedback, the action happened, right where the finger is.
// - Copy (#20): the copy icon crossfades to the check, --dur-fast (150 ms), scaling from 90 % as it fades in.
// - Save (#19, `draw`): the spinner fades in; when it is done it gives way to a check that draws in from the left
//   (clip-path, --dur-base), and the check fades out as the button's icon comes back.
// Reduced motion: plain crossfades, no scale, no drawing.
export type ActionState = "idle" | "busy" | "done";

const LAYER = "col-start-1 row-start-1 flex transition-[opacity,scale] duration-(--dur-fast) ease-(--ease-out) motion-reduce:transition-opacity";

export function ActionIcon({ icon, state, busy, draw = false }: { icon: IconName; state: ActionState; busy?: ReactNode; draw?: boolean }) {
  return (
    <span aria-hidden="true" data-state={state} data-testid="action-icon" className="grid size-5 shrink-0 place-items-center">
      <span className={`${LAYER} ${state === "idle" ? "" : "scale-90 opacity-0 motion-reduce:scale-100"}`}>
        <Icon name={icon} size={20} />
      </span>
      {state === "busy" && busy && <span className="col-start-1 row-start-1 flex transition-opacity duration-(--dur-fast) starting:opacity-0">{busy}</span>}
      {draw ? (
        <span
          className={`col-start-1 row-start-1 flex transition-opacity duration-(--dur-fast) ease-(--ease-out) ${state === "done" ? "animate-[check-in_var(--dur-base)_var(--ease-out)_both] motion-reduce:animate-[fade-in_var(--dur-fast)_linear_both]" : "opacity-0"}`}
        >
          <Icon name="check" size={20} />
        </span>
      ) : (
        <span className={`${LAYER} ${state === "done" ? "" : "scale-90 opacity-0 motion-reduce:scale-100"}`}>
          <Icon name="check" size={20} />
        </span>
      )}
    </span>
  );
}

/** True for `ms` after each new non-zero `stamp` (a Date.now() set when the action succeeded), then false again. */
export function useFor(stamp: number, ms: number): boolean {
  const [over, setOver] = useState(0);
  useEffect(() => {
    if (!stamp) return;
    const t = setTimeout(() => setOver(stamp), ms);
    return () => clearTimeout(t);
  }, [stamp, ms]);
  return stamp !== 0 && over !== stamp;
}

/** Shakes the element 4 px twice (a failed action, #19): translate only, 320 ms; nothing with reduced motion. */
export function shake(el: RefObject<HTMLElement | null>) {
  if (!el.current || reducedMotion()) return;
  el.current.animate([{ translate: "0" }, { translate: "-4px" }, { translate: "4px" }, { translate: "-4px" }, { translate: "4px" }, { translate: "0" }], {
    duration: 320,
    easing: "linear",
  });
}
