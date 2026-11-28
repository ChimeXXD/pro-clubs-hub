import { letterLimit } from "@/lib/submit/motion";

// Letter limit (motion-bookmarks.pdf #29) for a field with a maxLength: a 20 px ring at the field's right edge fills as
// the text nears the limit; in the last 10 letters it turns status/warning and the letters left show beside it. Purpose:
// state indication, before the field stops taking letters. It follows typing, a keyboard action, so nothing animates:
// the ring, its colour and the count change with each letter, at once (the frequent-action rule). Nothing shows while
// the field is empty. The ring is drawing only; screen readers hear the letters left through `describedBy`.
// TODO(Chime): not drawn in Figma; the ring's size, place and resting colour (text/muted) are a proposal, and the
// screen-reader wording "N letters left" is new copy.
const R = 8;
const C = 2 * Math.PI * R;

export function LetterLimit({ length, max, id }: { length: number; max: number; id: string }) {
  const { show, fill, warn, left } = letterLimit(length, max);
  if (!show) return null;
  return (
    <span data-testid="letter-limit" data-warn={warn || undefined} className="pointer-events-none absolute inset-y-0 right-4 flex items-center gap-1.5">
      {warn && (
        <span aria-hidden="true" className="type-caption text-status-warning tabular-nums">
          {left}
        </span>
      )}
      <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5 -rotate-90">
        <circle cx="10" cy="10" r={R} fill="none" strokeWidth="2" className="stroke-border-strong" />
        <circle
          data-part="ring"
          cx="10"
          cy="10"
          r={R}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - fill)}
          className={warn ? "stroke-status-warning" : "stroke-text-muted"}
        />
      </svg>
      {warn && (
        <span id={id} className="sr-only">
          {`${left} ${left === 1 ? "letter" : "letters"} left`}
        </span>
      )}
    </span>
  );
}
