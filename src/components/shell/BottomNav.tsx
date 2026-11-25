"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isCurrent, SECTIONS } from "@/lib/nav";
import { Icon } from "./Icon";

// Figma Bottom nav (282:521), phone only: a floating pill 344 px wide, 24 px above the bottom (and the home
// indicator). The current section is the lime pill with its label (DESIGN.md, D-94); the others are 48 px icons.
// On a page outside the five sections (Page=None) Home's icon is cream. In light mode the lime pill gets a thin
// dark ring, since lime on cream is 1.03:1 (D-37). Figma's background blur is left out: the nav is opaque, so
// it would show nothing and still cost a repaint on every scroll frame.
export function BottomNav() {
  const pathname = usePathname();
  const none = !SECTIONS.some((s) => isCurrent(s.href, pathname));
  return (
    <nav
      aria-label="Sections"
      data-testid="bottom-nav"
      className="fixed inset-x-0 bottom-[calc(24px+env(safe-area-inset-bottom))] z-10 mx-auto flex w-[344px] max-w-[calc(100%-16px)] items-center justify-between rounded-full border border-border-strong bg-bg-page p-[5px] shadow-bottom-nav tablet:hidden"
    >
      {SECTIONS.map((s) => {
        const current = isCurrent(s.href, pathname);
        const idle = none && s.href === "/" ? "text-text-primary" : "text-text-secondary";
        return (
          <Link
            key={s.href}
            href={s.href}
            aria-label={s.label}
            aria-current={current ? "page" : undefined}
            className={
              current
                ? "flex h-12 items-center gap-1.5 rounded-full bg-accent-fill pr-[18px] pl-3.5 text-accent-on-fill light:ring-1 light:ring-accent-on-fill light:ring-inset"
                : `flex size-12 items-center justify-center rounded-full ${idle}`
            }
          >
            <Icon name={s.icon} size={24} />
            {current && <span className="type-button-sm">{s.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
