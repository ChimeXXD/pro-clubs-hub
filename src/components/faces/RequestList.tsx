"use client";

import { Icon } from "@/components/shell/Icon";
import { SmallChip } from "@/components/ui/SmallChip";
import { plural } from "@/lib/face-page";
import { byKind, type FaceRequest, REQUEST_KINDS, type RequestKind, requestLine } from "@/lib/requests";

// "Most requested" (Figma 402:3451): the heading with "One vote each", the kind chips, and the requests ranked by
// votes (component "Request row" 431:1092: default, voted, being made). A vote box is lime once this browser has
// voted; a request being made says so in lime. With no requests the chips give way to "No requests yet." (430:6931).
export function RequestList({
  requests,
  failed = false,
  voted,
  kind,
  onKind,
  onVote,
}: {
  requests: FaceRequest[] | null;
  /** The list didn't load (not drawn in Figma): just the heading. */
  failed?: boolean;
  voted: ReadonlySet<string>;
  kind: RequestKind | null;
  onKind: (kind: RequestKind | null) => void;
  onVote: (request: FaceRequest) => void;
}) {
  const empty = requests !== null && requests.length === 0;
  return (
    <section aria-labelledby="most-requested" aria-busy={(requests === null && !failed) || undefined} className="flex flex-col">
      <div className="flex items-center gap-2">
        <h2 id="most-requested" className="type-h3 min-w-0 flex-1 text-text-primary">
          Most requested
        </h2>
        <p className="type-caption text-text-muted">One vote each</p>
      </div>
      {empty ? (
        <div data-testid="requests-empty" className="mt-5 flex flex-col items-center gap-1.5 rounded-lg bg-bg-surface px-5 py-8 text-center">
          <span className="flex text-text-muted">
            <Icon name="faces" size={28} />
          </span>
          <p className="type-h4 text-text-primary">No requests yet.</p>
          <p className="type-body text-text-secondary">Be the first: ask for a face above.</p>
        </div>
      ) : failed ? null : (
        <>
          <div className="flex flex-wrap gap-1.5 pt-3">
            {REQUEST_KINDS.map((k) => (
              <SmallChip key={k.label} testId="request-kind" label={k.label} pressed={k.kind === kind} onPress={() => onKind(k.kind)} />
            ))}
          </div>
          <ol className="flex flex-col pt-2">
            {byKind(requests ?? [], kind).map((r) => {
              const on = voted.has(r.id);
              return (
                <li key={r.id} data-testid="face-request" className="flex h-[85px] items-center gap-3.5 border-b border-system-divider">
                  <span className={`type-number-md w-5.5 shrink-0 ${r.beingMade ? "text-accent-text" : "text-text-secondary"}`}>{r.rank}</span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="type-label text-text-primary">{r.name}</p>
                    <p className={`type-caption ${r.beingMade ? "text-accent-text" : "text-text-muted"}`}>{requestLine(r)}</p>
                  </div>
                  <button
                    type="button"
                    aria-pressed={on}
                    aria-label={`Vote for ${r.name}, ${plural(r.votes, "vote")}`}
                    onClick={() => onVote(r)}
                    className={`type-label flex size-14 shrink-0 flex-col items-center justify-center rounded-[14px] transition-colors duration-150 ${on ? "bg-accent-fill text-accent-on-fill light:ring-1 light:ring-accent-on-fill light:ring-inset" : "bg-bg-surface text-text-primary hover:bg-bg-raised"}`}
                  >
                    <Icon name="chevron-up" size={20} />
                    {r.votes}
                  </button>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </section>
  );
}

/** "Chime and Sharon make the top requests in game, …" with the info icon (Figma "How it works"). */
export function HowItWorks({ className = "" }: { className?: string }) {
  return (
    <p className={`type-caption flex gap-2.5 text-text-muted ${className}`}>
      <span className="flex h-5 shrink-0 items-center">
        <Icon name="info" size={18} />
      </span>
      Chime and Sharon make the top requests in game, then they appear in Faces with their build.
    </p>
  );
}
