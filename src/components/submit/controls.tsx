"use client";

import { type ChangeEvent, createContext, type MouseEvent, type ReactNode, useContext } from "react";
import { Icon } from "@/components/shell/Icon";
import { buttonClass, ButtonLabel } from "@/components/ui/Button";
import { RollingNumber } from "@/components/ui/RollingNumber";

// Small pieces Submit a build's steps share, each from its Figma part: the step line ("Submit a build · 1 of 4"),
// the round − / + buttons, the slider (a 4 px track, the value in lime and a
// 20 px cream knob), the stars, and the actions bar (sticky on phone, under the content from tablet).

/** The step the editor came from, and whether the move skips its motion (a key press); null on the first step shown. */
export const StepFrom = createContext<{ step: number; still: boolean } | null>(null);

/**
 * "Submit a build" (Label/Default, text/secondary) and "1 of 4" (Label/Caption, text/muted), 20 px tall.
 * Step progress (motion-bookmarks.pdf #9): the step's number rolls from the one before, up going forward and down
 * going back (RollingNumber, 140 ms ease-out), so the move through the four steps reads in the corner the eye checks.
 * Not from the keyboard; reduced motion crossfades. Figma draws only the words, so there is no bar to fill.
 */
export function StepLine({ label, step }: { label: string; step: number }) {
  const from = useContext(StepFrom);
  return (
    <div className="flex h-5 items-center gap-2">
      <p className="type-label min-w-0 flex-1 text-text-secondary">{label}</p>
      <p data-testid="step-count" className="type-caption shrink-0 text-text-muted tabular-nums">
        <RollingNumber value={String(step)} from={from ? String(from.step) : undefined} still={from?.still ?? true} />
        {" of 4"}
      </p>
    </div>
  );
}

/** A round − or + button (bg/raised in a card, bg/surface on the page). */
export function RoundButton({
  sign,
  label,
  onPress,
  size,
  surface = "raised",
  disabled = false,
}: {
  sign: "minus" | "plus";
  label: string;
  onPress: (e: MouseEvent<HTMLButtonElement>) => void;
  size: 44 | 48;
  surface?: "raised" | "surface";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onPress}
      className={`flex shrink-0 items-center justify-center rounded-full text-text-primary transition-colors duration-150 disabled:text-action-disabled ${surface === "raised" ? "bg-bg-raised" : "bg-bg-surface"} ${size === 48 ? "size-12" : "size-11"}`}
    >
      <Icon name={sign} size={size === 48 ? 22 : 20} />
    </button>
  );
}

/**
 * The slider: a real range input, invisible, over the drawing. The knob's centre sits at the value's share of the
 * track, as Figma draws it (44 of 55 → 80 %). `mark` draws the middle tick of the height and weight sliders.
 */
export function Slider({
  label,
  min,
  max,
  value,
  onChange,
  fill = true,
  mark = false,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  fill?: boolean;
  mark?: boolean;
}) {
  const at = `${(Math.min(Math.max(value - min, 0), max - min) / (max - min)) * 100}%`;
  return (
    <div className="relative h-5">
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        value={Math.min(value, max)}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
        className="peer absolute -inset-x-2.5 -inset-y-3 z-10 cursor-pointer opacity-0"
      />
      <span aria-hidden="true" className="absolute inset-x-0 top-2 h-1 overflow-hidden rounded-[2px] bg-border-strong">
        {fill && <span className="block h-full bg-accent-fill" style={{ width: at }} />}
      </span>
      {mark && <span aria-hidden="true" className="absolute top-1 left-1/2 h-3 w-0.5 -translate-x-1/2 bg-text-muted" />}
      <span
        aria-hidden="true"
        className="absolute top-0 size-5 -translate-x-1/2 rounded-full bg-text-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring"
        style={{ left: at }}
      />
    </div>
  );
}

/** Five stars, the first `value` lit (Figma Icon/star: accent/text lit, border/strong not). Each star sets the count. */
export function Stars({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={n === value}
          aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
          onClick={() => onChange(n)}
          className={`tap-target flex size-6 ${n <= value ? "text-accent-text" : "text-border-strong"}`}
        >
          <Icon name="star" size={24} />
        </button>
      ))}
    </div>
  );
}

/**
 * The step's actions. Phone: a bar stuck to the bottom (bg/page, a divider above, 12 / 20 / 28 px in), Back 117 px
 * and the next step filling the rest. Tablet and desktop: under the content, on the right (Back 140, next 280).
 */
export function ActionsBar({
  back,
  next,
  nextWidth = "tablet:w-70",
  gap = "tablet:pt-10",
}: {
  back?: (e: MouseEvent<HTMLButtonElement>) => void;
  next: { label: string; onPress: (e: MouseEvent<HTMLButtonElement>) => void; disabled?: boolean };
  nextWidth?: string;
  gap?: string;
}) {
  return (
    <div
      data-testid="submit-actions"
      className={`sticky bottom-0 z-10 flex gap-3 border-t border-system-divider bg-bg-page px-5 pt-3 pb-[calc(28px+env(safe-area-inset-bottom))] tablet:static tablet:justify-end tablet:border-0 tablet:px-0 tablet:pb-0 ${gap}`}
    >
      {back && (
        <button type="button" onClick={back} className={buttonClass("secondary", "w-29.25 shrink-0 tablet:w-35 hover:bg-action-hovered")}>
          <ButtonLabel icon="arrow-left" iconSide="left">
            Back
          </ButtonLabel>
        </button>
      )}
      <button
        type="button"
        data-testid="submit-next"
        disabled={next.disabled}
        onClick={next.onPress}
        className={buttonClass("primary", `min-w-0 flex-1 ${nextWidth} tablet:flex-none disabled:bg-action-disabled-bg disabled:text-action-disabled`)}
      >
        <ButtonLabel icon="arrow-right">{next.label}</ButtonLabel>
      </button>
    </div>
  );
}

/** A section heading (Heading/H3) with 12 px under it, and an optional caption on the right. */
export function SectionTitle({ children, aside, id }: { children: ReactNode; aside?: string; id?: string }) {
  return (
    <div className="flex items-center gap-2 pb-3">
      <h2 id={id} className="type-h3 min-w-0 flex-1 text-text-primary">
        {children}
      </h2>
      {aside && <p className="type-caption shrink-0 text-text-muted">{aside}</p>}
    </div>
  );
}
