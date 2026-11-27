"use client";

import { Icon } from "@/components/shell/Icon";
import { Spinner } from "@/components/builds/ShareSheet";
import { buttonClass } from "@/components/ui/Button";
import { plural } from "@/lib/face-page";
import { KIND_LABEL } from "@/lib/faces";
import { type FaceRequest, NAME_MAX } from "@/lib/requests";

// Figma "New request" (402:3451) and its states: typing a name already asked for (430:6093: "Already asked for",
// Vote, and "Ask for “Kanye” as a new face"), request sent (430:6517) and request failed (441:9598: the red row and
// Try again, keeping what was typed; D-100 (3)). The placeholder wraps to two lines on phone as Figma draws it, so
// it is drawn over the field; the field's own placeholder stays for screen readers.
const PLACEHOLDER = "A name and the look, e.g. 2006 Ronaldinho";

export type FormState = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; name: string } | { kind: "failed" };

export function RequestForm({
  value,
  state,
  match,
  voted,
  onChange,
  onRequest,
  onVote,
  onAnother,
}: {
  value: string;
  state: FormState;
  match: FaceRequest | null;
  voted: boolean;
  onChange: (value: string) => void;
  onRequest: () => void;
  onVote: (request: FaceRequest) => void;
  onAnother: () => void;
}) {
  if (state.kind === "sent")
    return (
      <section aria-label="Request sent" data-testid="request-sent" className="flex flex-col gap-3 rounded-lg bg-bg-surface p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-status-success-bg text-accent-text">
            <Icon name="check" size={20} />
          </span>
          <div role="status" className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="type-label text-text-primary">{`Asked for ${state.name}`}</p>
            <p className="type-caption text-text-secondary">New requests show in the list once we&apos;ve checked them.</p>
          </div>
        </div>
        <button type="button" className={buttonClass("secondary", "w-full hover:bg-action-hovered")} onClick={onAnother}>
          Ask for another
        </button>
      </section>
    );

  const typed = value.trim();
  const showMatch = match !== null && state.kind !== "failed";
  return (
    <form
      data-testid="request-form"
      className="flex flex-col gap-3 rounded-lg bg-bg-surface p-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (typed) onRequest();
      }}
    >
      <label htmlFor="request-name" className="type-label text-text-primary">
        Who do you want?
      </label>
      <div className="relative flex h-13 items-center gap-2.5 rounded-md border border-input-border bg-input-bg px-4 focus-within:border-2 focus-within:border-input-border-focused focus-within:px-[15px]">
        <span className="flex shrink-0 text-text-muted">
          <Icon name="search" size={20} />
        </span>
        <input
          id="request-name"
          type="text"
          autoComplete="off"
          enterKeyHint="send"
          maxLength={NAME_MAX}
          placeholder={PLACEHOLDER}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="type-body peer min-w-0 flex-1 bg-transparent text-text-primary outline-none placeholder:text-transparent"
        />
        {!value && (
          <span aria-hidden="true" className="type-body pointer-events-none absolute top-1/2 right-4 left-[46px] line-clamp-2 -translate-y-1/2 text-text-muted">
            {PLACEHOLDER}
          </span>
        )}
      </div>
      {showMatch ? (
        <>
          <div data-testid="already-asked" className="flex flex-col rounded-md bg-bg-raised px-3 pt-2.5 pb-1">
            <p className="type-caption text-text-muted">Already asked for</p>
            <div className="flex items-center gap-3 py-2">
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="type-label text-text-primary">{match.name}</p>
                <p className="type-caption text-text-secondary">{`${KIND_LABEL[match.kind]} · ${plural(match.votes, "vote")}`}</p>
              </div>
              <button
                type="button"
                aria-pressed={voted}
                aria-label={`Vote for ${match.name}`}
                onClick={() => onVote(match)}
                className="type-button-md flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-accent-fill pr-3.5 pl-3 text-accent-on-fill light:ring-1 light:ring-accent-on-fill light:ring-inset"
              >
                <Icon name="chevron-up" size={18} />
                Vote
              </button>
            </div>
          </div>
          <button type="submit" className={buttonClass("secondary", "w-full hover:bg-action-hovered")}>
            {`Ask for “${typed}” as a new face`}
          </button>
        </>
      ) : (
        <>
          {state.kind === "failed" ? (
            <p role="alert" data-testid="request-failed" className="type-caption flex items-center gap-2.5 rounded-md bg-status-danger-bg py-3 pr-3.5 pl-3 text-text-primary">
              <span className="flex text-status-danger">
                <Icon name="error" size={20} />
              </span>
              <span className="min-w-0 flex-1">Couldn&apos;t send your request. Check your connection and try again.</span>
            </p>
          ) : (
            <p className="type-caption text-text-muted">If someone asked already, you&apos;ll see it here and can vote instead.</p>
          )}
          <button type="submit" aria-busy={state.kind === "sending" || undefined} disabled={state.kind === "sending"} className={buttonClass("primary", "w-full")}>
            {state.kind === "failed" ? "Try again" : "Request"}
            {state.kind === "sending" && <Spinner />}
          </button>
        </>
      )}
    </form>
  );
}
