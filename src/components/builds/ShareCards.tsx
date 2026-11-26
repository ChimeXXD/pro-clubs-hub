import type { CSSProperties, ReactNode } from "react";
import { Logo } from "@/components/shell/Logo";
import type { ShareCardsView } from "@/lib/share-cards";
import { CARD } from "@/lib/share-images";
import { Emblem } from "./Emblem";

// The two story cards (Figma 316:888 "Overview" and 316:973 "Attributes", D-64), drawn at their own 360 × 640 and
// scaled to fit the share sheet (0.625 on phone, 225 × 400) and the dialog (0.75 from tablet, 270 × 480).
// TODO(Chime): the cards' type isn't on text styles in Figma; built as drawn (sizes below). Label tracking is 6 %.
const CONDENSED = "font-display font-extrabold uppercase";
const LABEL = "font-text text-[12px] leading-4 font-semibold tracking-[0.06em] text-text-muted uppercase";

type Overview = ShareCardsView["overview"];
type Attributes = ShareCardsView["attributes"];

/** A card at 360 × 640, shown at `scale` inside a box of the scaled size. */
export function ScaledCard({ scale, label, children }: { scale: number; label: string; children: ReactNode }) {
  const box = { width: CARD.width * scale, height: CARD.height * scale } as CSSProperties;
  return (
    <figure aria-label={label} className="relative shrink-0 overflow-hidden rounded-md shadow-[0_8px_24px_0_var(--color-system-backdrop)]" style={box}>
      <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </figure>
  );
}

function Card({ page, children }: { page: string; children: ReactNode }) {
  return (
    // data-share-card: the node "Save images" turns into a PNG (saveShareImages.ts), at its own 360 × 640.
    <div data-share-card className="flex h-160 w-90 flex-col bg-bg-page px-6 pt-5.5 pb-5 text-left">
      <div className="flex h-4.5 items-center justify-between">
        <Logo size="card" />
        <span className="font-text text-[13px] leading-4.5 font-semibold text-text-muted">{page}</span>
      </div>
      {children}
    </div>
  );
}

function Footer({ link, footer }: { link: string; footer: string }) {
  return (
    <div className="flex flex-col gap-1 border-t border-border-subtle pt-3">
      <p className="font-text text-[13px] leading-4.5 font-semibold text-accent-text">{link}</p>
      <p className="font-text text-[11px] leading-[15px] font-medium text-text-muted">{footer}</p>
    </div>
  );
}

function Heading({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center justify-between border-b border-border-subtle pb-1.5">
      <p className={`${CONDENSED} text-[16px] leading-5 text-text-primary`}>{title}</p>
      <p className="font-display text-[16px] leading-5 font-extrabold text-accent-text">{count}</p>
    </div>
  );
}

function Badges({ items, plus }: { items: Overview["plus"]; plus: boolean }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
      {items.map((p) => (
        <li key={p.name} className="flex h-6 items-center gap-2">
          {p.icon ? (
            // eslint-disable-next-line @next/next/no-img-element -- static export, files already sized
            <img src={p.icon} alt="" width={22} height={22} className="size-5.5 shrink-0" />
          ) : (
            <span aria-hidden="true" className="size-5.5 shrink-0" />
          )}
          <span className={`font-text text-[14px] leading-5 ${plus ? "font-semibold text-text-primary" : "font-medium text-text-secondary"}`}>{p.name}</span>
        </li>
      ))}
    </ul>
  );
}

/** Card 1 of 2: the face, name, archetype, positions, level, height and weight, version tag and PlayStyles. */
export function OverviewCard({ card }: { card: Overview }) {
  const fact = (label: string, value: string) => (
    <div className="flex min-w-0 flex-1 basis-0 flex-col gap-1 border-l border-border-subtle pl-3.5">
      <p className={LABEL}>{label}</p>
      <p className="font-display text-[22px] leading-6 font-extrabold text-text-primary">{value}</p>
    </div>
  );
  return (
    <Card page="1 / 2">
      <div className="flex items-center gap-4 pt-5.5">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export; the ProBuilds face until a picture exists */}
        <img src="/art/probuilds-face.svg" alt="" width={104} height={104} className="size-26 shrink-0 rounded-lg" />
        <div className="flex min-w-0 flex-col items-start gap-1.5">
          {card.badge === "Meta pick" && (
            <span className="rounded-full bg-accent-fill px-2.25 font-text text-[13px] leading-5.5 font-semibold text-accent-on-fill">Meta pick</span>
          )}
          <p className={`${CONDENSED} text-[34px] leading-8 text-text-primary`}>{card.title}</p>
          <div className="flex items-center gap-1.5">
            <Emblem id={card.archetype.id} className="size-4.5" />
            <span className="font-text text-[14px] leading-5 font-medium text-text-secondary">{card.archetypeLine}</span>
          </div>
        </div>
      </div>
      <div className="mt-5.5 flex border-y border-border-subtle py-3">
        <div className="flex min-w-0 flex-1 basis-0 flex-col gap-1">
          <p className={LABEL}>Positions</p>
          <div className="flex gap-1">
            {card.positions.map((p) => (
              <span key={p} className="rounded-xs bg-accent-fill px-1.5 py-px font-text text-[14px] leading-5 font-semibold text-accent-on-fill">
                {p}
              </span>
            ))}
          </div>
        </div>
        {fact("Level", card.level)}
        {fact("Height", card.height)}
        {fact("Weight", card.weight)}
      </div>
      <p className="pt-2.5 font-text text-[13px] leading-4.5 font-semibold text-accent-text">{card.versionTag}</p>
      <div className="flex flex-col gap-2.5 pt-6.5">
        <Heading title="PlayStyles+" count={card.plus.length} />
        <Badges items={card.plus} plus />
      </div>
      <div className="flex flex-col gap-2.5 pt-5.5">
        <Heading title="PlayStyles" count={card.regular.length} />
        <Badges items={card.regular} plus={false} />
      </div>
      <div className="flex-1" />
      <Footer link={card.link} footer={card.footer} />
    </Card>
  );
}

/** Card 2 of 2: every attribute by group, each group with its key stat; Mastery +2 attributes marked. */
export function AttributesCard({ card, link, footer }: { card: Attributes; link: string; footer: string }) {
  return (
    <Card page="2 / 2">
      <div className="flex flex-col gap-0.5 pt-5">
        <p className={`${CONDENSED} text-[30px] leading-7.5 text-text-primary`}>Attributes</p>
        <p className="font-text text-[14px] leading-5 font-medium text-text-secondary">{card.subtitle}</p>
      </div>
      {card.masteryNote && <p className="pt-2 font-text text-[12px] leading-4 font-medium text-text-muted">{card.masteryNote}</p>}
      <div className="flex gap-5 pt-4">
        {card.columns.map((column, i) => (
          <div key={i} className="flex min-w-0 flex-1 flex-col gap-3">
            {column.map((g) => (
              <div key={g.code} className="flex flex-col">
                <div className="flex items-center justify-between border-b border-border-subtle pb-1">
                  <p className={`${CONDENSED} text-[15px] leading-5 text-text-primary`}>{g.name}</p>
                  {g.value !== null && (
                    <span className="rounded-xs bg-bg-surface px-1.5 font-display text-[15px] leading-5 font-extrabold text-accent-text">{g.value}</span>
                  )}
                </div>
                <ul className="flex flex-col pt-1">
                  {g.attributes.map((a) => (
                    <li key={a.name} className="flex h-4.5 items-center justify-between gap-1">
                      <span className="font-text text-[13px] leading-4.5 font-medium text-text-secondary">
                        {a.name}
                        {a.mastery && <span className="text-accent-text"> +2</span>}
                      </span>
                      <span className="font-display text-[15px] leading-4.5 font-extrabold text-text-primary">{a.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex-1" />
      <Footer link={link} footer={footer} />
    </Card>
  );
}
