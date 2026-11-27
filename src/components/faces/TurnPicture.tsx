"use client";

import { useRef, useState } from "react";
import { turnFrame } from "@/lib/turn";

// The turntable (D-35, A-16): numbered frames cut from the maker's own in-game turn clip, 01.webp … NN.webp in the
// face's turn folder. The front picture shows first; a drag sideways turns the head, one frame per few pixels, and
// keeps turning past the last frame. Frames load on the first touch only, so a visitor who never drags pays nothing.
export function TurnPicture({ turn, alt, poster }: { turn: { folder: string; frames: number }; alt: string; poster: string }) {
  const [frame, setFrame] = useState<number | null>(null);
  const start = useRef<{ x: number; frame: number } | null>(null);
  const loaded = useRef(false);
  const src = (n: number) => `/${turn.folder}/${String(n + 1).padStart(2, "0")}.webp`;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export; our own frames, swapped on drag
    <img
      src={frame === null ? poster : src(frame)}
      alt={alt}
      width={468}
      height={576}
      draggable={false}
      className="absolute inset-0 size-full cursor-grab touch-pan-y object-cover select-none active:cursor-grabbing"
      onPointerDown={(e) => {
        if (!loaded.current) {
          loaded.current = true;
          for (let n = 0; n < turn.frames; n++) new Image().src = src(n);
        }
        e.currentTarget.setPointerCapture(e.pointerId);
        start.current = { x: e.clientX, frame: frame ?? 0 };
      }}
      onPointerMove={(e) => {
        if (start.current) setFrame(turnFrame(start.current.frame, e.clientX - start.current.x, turn.frames));
      }}
      onPointerUp={() => (start.current = null)}
      onPointerCancel={() => (start.current = null)}
    />
  );
}
