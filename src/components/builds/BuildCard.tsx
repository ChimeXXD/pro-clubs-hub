import Link from "next/link";
import { ViewTransition } from "react";
import { DraftTag } from "@/components/ui/DraftTag";
import type { BuildCardView } from "@/lib/archetype-page";
import { KeyStats } from "./KeyStats";

// Figma "Build · Meta Finisher" (288:1096, D-62 option B, the "stat strip" card): the build's in-game face, or the
// ProBuilds mannequin when it has none (D-89, D-98); a Meta pick or Recommended tag; the name; position chips with
// level, height and weight; the six key stats in one ruled row; the PlayStyles+. Under them, the version tag and
// credit line every recorded build carries (D-05, D-08; not drawn on the Figma card, whose builds are samples: a
// sample card has no Draft tag, version tag or credit, and the page's note marks it, D-107, D-113). The card is a
// subgrid of three rows, or four with the footer, so headers in a row share one height and the stat rows line up (D-62).
// Expand card (motion-bookmarks.pdf #22): the picture and the name are shared with the build page's (BuildPageView), so
// opening a card carries them across in a View Transition where the browser has one; elsewhere the page just opens.
export const LIME = "bg-accent-fill text-accent-on-fill light:ring-1 light:ring-accent-on-fill light:ring-inset";
// Position chips are neutral: lime is kept for the badge, the main action and the selection (DESIGN.md "one accent", D-115).
export const POSITION = "bg-bg-raised text-text-primary ring-1 ring-border-subtle ring-inset";

/** The card's rows: three when no card on the page has a footer (every card a sample), else four. */
export const CARD_ROWS = { 3: "row-span-3", 4: "row-span-4" } as const;

export function BuildCard({ card, rows }: { card: BuildCardView; rows: keyof typeof CARD_ROWS }) {
  const draft = card.draft && !card.sample;
  return (
    <li className={`${CARD_ROWS[rows]} grid grid-rows-subgrid`}>
      <Link
        href={card.href}
        data-testid={`build-card-${card.id}`}
        className={`${CARD_ROWS[rows]} grid grid-rows-subgrid gap-y-3.5 rounded-lg border border-border-subtle bg-bg-surface p-4`}
      >
        <div className="flex items-center gap-3.5">
          <ViewTransition name={`build-${card.id}-picture`} share="build-expand" default="none">
            <div className="size-19 shrink-0 overflow-hidden rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element -- static export; an SVG or a sized WebP */}
              <img
                src={card.picture?.src ?? "/art/probuilds-face.svg"}
                alt={card.picture?.alt ?? ""}
                width={76}
                height={76}
                className="size-full object-cover"
              />
            </div>
          </ViewTransition>
          <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
            {(card.badge || draft) && (
              <div className="flex flex-wrap gap-1.5">
                {/* Figma draws this tag 24 px tall on phone (288:1100) and 26 px, like Recommended, from tablet (290:952). */}
                {card.badge === "Meta pick" && <span className={`type-caption rounded-full px-2.5 py-0.5 tablet:py-[3px] ${LIME}`}>Meta pick</span>}
                {card.badge === "Recommended" && (
                  <span className="type-caption rounded-full border border-border-strong bg-bg-raised px-2.5 py-0.5 text-text-primary">Recommended</span>
                )}
                {draft && <DraftTag />}
              </div>
            )}
            <h2 className="type-h3 max-w-full break-words text-text-primary uppercase">
              {/* The name travels as a box that hugs its words, so the two snapshots keep one shape and only scale. */}
              <ViewTransition name={`build-${card.id}-title`} share="build-expand" default="none">
                <span className="inline-block max-w-full">{card.title}</span>
              </ViewTransition>
            </h2>
            <div className="flex w-full flex-wrap items-center gap-1.5">
              {card.positions.map((p) => (
                <span key={p} className={`type-caption rounded-xs px-1.5 py-px ${POSITION}`}>
                  {p}
                </span>
              ))}
              <span className="type-caption text-text-secondary">{card.body}</span>
            </div>
          </div>
        </div>
        <KeyStats stats={card.keyStats} />
        <div className="flex flex-col gap-2">
          <h3 className="type-caption text-text-secondary">PlayStyles+</h3>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {card.playStylesPlus.map((p) => (
              <li key={p.name} className="flex items-center gap-1.5">
                {p.icon && (
                  // eslint-disable-next-line @next/next/no-img-element -- static export, files already sized (2x)
                  <img src={p.icon} alt="" width={24} height={24} className="size-6 shrink-0" />
                )}
                <span className="type-caption text-text-primary">{p.name}</span>
              </li>
            ))}
          </ul>
        </div>
        {rows === 4 &&
          (card.sample ? (
            <div />
          ) : (
            <div className="flex flex-col">
              <p className="type-caption text-text-muted">{card.versionTag}</p>
              {card.olderSeason && <p className="type-caption text-status-warning">{card.olderSeason}</p>}
              {card.credit && <p className="type-caption text-text-muted">{card.credit}</p>}
            </div>
          ))}
      </Link>
    </li>
  );
}
