"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { seasonLabel } from "@/lib/content/version";
import { isCurrent, SECTIONS } from "@/lib/nav";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

// Figma Top bar (205:407). Phone: logo, season, search, 60 px tall. Tablet and desktop: the four sections join,
// 72 px tall, border included as in Figma; the content is 1200 px wide on desktop. The season chip links to the changelog.
export function TopBar() {
  const pathname = usePathname();
  return (
    <header data-testid="top-bar" className="h-[60px] border-b border-system-divider bg-bg-page tablet:h-[72px]">
      <div className="mx-auto flex h-full items-center gap-4 px-5 tablet:px-10 desktop:max-w-(--layout-content-max) desktop:px-0">
        <Link href="/" aria-label="ProBuilds home" className="flex min-h-11 shrink-0 items-center">
          <Logo size="header" />
        </Link>
        {/* No spacer elements: each would add two 16 px gaps, which 360 px phones and the 744 px iPad mini lack.
            The nav centres itself (mx-auto) and the chip pushes right on phone (ml-auto). */}
        <nav aria-label="Sections" className="hidden gap-8 tablet:mx-auto tablet:flex">
          {SECTIONS.filter((s) => s.href !== "/").map((s) => {
            const current = isCurrent(s.href, pathname);
            return (
              <Link
                key={s.href}
                href={s.href}
                aria-current={current ? "page" : undefined}
                className={`type-label tap-target py-3 ${current ? "text-text-primary" : "text-text-secondary"}`}
              >
                {s.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/changelog"
          data-testid="season-chip"
          className="type-caption tap-target ml-auto shrink-0 rounded-full border border-border-strong px-3 py-1.5 text-text-secondary tablet:ml-0"
        >
          {seasonLabel()}
        </Link>
        <Link href="/search" aria-label="Search" className="flex size-11 shrink-0 items-center justify-center rounded-sm text-text-primary">
          <Icon name="search" size={20} />
        </Link>
      </div>
    </header>
  );
}
