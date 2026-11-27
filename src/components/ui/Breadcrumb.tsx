import Link from "next/link";
import { Fragment } from "react";

// Figma "Navigation - Breadcrumb" (build page, 298:3641): caption links and "/" in text/secondary,
// the current page last in text/primary, 8 px apart. Each link has a 44 px tap area (D-102 (4)). `muted` draws the
// current page in text/secondary, as the shared build's "Builds / Shared build" does (439:8850).
export function Breadcrumb({ links, current, muted = false }: { links: { href: string; label: string }[]; current: string; muted?: boolean }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="type-caption flex flex-wrap gap-x-2">
        {links.map((l) => (
          <Fragment key={l.href}>
            <li>
              <Link href={l.href} className="tap-target text-text-secondary">
                {l.label}
              </Link>
            </li>
            <li aria-hidden="true" className="text-text-secondary">
              /
            </li>
          </Fragment>
        ))}
        <li aria-current="page" className={`min-w-0 break-words ${muted ? "text-text-secondary" : "text-text-primary"}`}>
          {current}
        </li>
      </ol>
    </nav>
  );
}
