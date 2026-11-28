"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// A page's summary column that stays in view on desktop while the long column beside it scrolls (Build and face
// pages, D-115), but only while it fits the window: a taller column would hide its own bottom until the page ends.
const GAP = 24; // px kept above and below the column (top-6)

export function StickyColumn({ className, testId, children }: { className: string; testId?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [fits, setFits] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setFits(el.offsetHeight + GAP * 2 <= window.innerHeight);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    window.addEventListener("resize", check);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", check);
    };
  }, []);
  return (
    <div ref={ref} data-testid={testId} className={`${className} ${fits ? "desktop:sticky desktop:top-6" : ""}`}>
      {children}
    </div>
  );
}
