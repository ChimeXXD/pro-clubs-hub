"use client";

import { useEffect, useRef } from "react";
import { reducedMotion } from "@/lib/motion";
import { flingAt, flingTarget, releaseVelocity, turnFrame } from "@/lib/turn";

// The turntable (D-35, A-16): numbered frames cut from the maker's own in-game turn clip, 01.webp … NN.webp in the
// face's turn folder. The front picture shows first; a drag sideways turns the head, one frame per few pixels, and
// keeps turning past the last frame. Frames load on the first touch only, so a visitor who never drags pays nothing.
//
// Scrubber (motion-bookmarks #18; the gestures and apple-design skills): while the finger is down the frame follows it
// 1:1, from where it was grabbed. Let go moving and the head keeps turning at the finger's speed, slowing to a stop on
// a whole frame (src/lib/turn.ts); let go still and it stays put. Touching it again catches a turn mid-flight. The
// frame is written to the image directly, never through React state, so a fast drag re-renders nothing. Reduced
// motion keeps the drag (the player makes that motion) and drops the flick.
export function TurnPicture({ turn, alt, poster }: { turn: { folder: string; frames: number }; alt: string; poster: string }) {
  const img = useRef<HTMLImageElement>(null);
  const frame = useRef<number | null>(null);
  const drag = useRef<{ id: number; x: number; frame: number; samples: { x: number; t: number }[] } | null>(null);
  const flight = useRef(0);
  const loaded = useRef(false);
  const src = (n: number) => `/${turn.folder}/${String(n + 1).padStart(2, "0")}.webp`;
  const show = (n: number) => {
    if (n === frame.current || !img.current) return;
    frame.current = n;
    img.current.src = src(n);
  };
  const stop = () => cancelAnimationFrame(flight.current);
  useEffect(() => stop, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export; our own frames, swapped on drag
    <img
      ref={img}
      src={poster}
      alt={alt}
      width={468}
      height={576}
      draggable={false}
      className="absolute inset-0 size-full cursor-grab touch-pan-y object-cover select-none active:cursor-grabbing"
      onPointerDown={(e) => {
        // One finger turns it; a second touch while it is held changes nothing.
        if (drag.current) return;
        stop();
        if (!loaded.current) {
          loaded.current = true;
          for (let n = 0; n < turn.frames; n++) new Image().src = src(n);
        }
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = { id: e.pointerId, x: e.clientX, frame: frame.current ?? 0, samples: [{ x: e.clientX, t: e.timeStamp }] };
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (d?.id !== e.pointerId) return;
        d.samples = [...d.samples.slice(-2), { x: e.clientX, t: e.timeStamp }];
        show(turnFrame(d.frame, e.clientX - d.x, turn.frames));
      }}
      onPointerUp={(e) => {
        const d = drag.current;
        if (d?.id !== e.pointerId) return;
        drag.current = null;
        if (reducedMotion()) return;
        const from = e.clientX - d.x;
        const to = flingTarget(from, releaseVelocity(d.samples, e.timeStamp));
        if (to === from) return;
        const start = performance.now();
        const step = (now: number) => {
          const dx = flingAt(from, to, now - start);
          show(turnFrame(d.frame, dx, turn.frames));
          if (dx !== to) flight.current = requestAnimationFrame(step);
        };
        flight.current = requestAnimationFrame(step);
      }}
      onPointerCancel={(e) => {
        if (drag.current?.id === e.pointerId) drag.current = null;
      }}
    />
  );
}
