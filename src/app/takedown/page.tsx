import type { Metadata } from "next";
import { CopyEmailButton } from "@/components/takedown/CopyEmailButton";
import { ButtonLabel, buttonClass } from "@/components/ui/Button";
import { PageContent } from "@/components/ui/PageContent";
import { SITE_NAME, TAKEDOWN_EMAIL } from "@/lib/site";

export const metadata: Metadata = { title: `Takedown · ${SITE_NAME}` };

// Figma Takedown, option C (D-91): the 72-hour promise (D-10), what happens, and the address. Copy is the design's.
const STEPS = [
  { title: "You email us", body: `${TAKEDOWN_EMAIL}: the page, who you are, what should go.` },
  { title: "We reply", body: "A person reads it and answers" },
  { title: "It's gone", body: "Off its page, every list and every link, within 72 hours" },
];

export default function TakedownPage() {
  return (
    <PageContent className="flex flex-col desktop:grid desktop:grid-cols-[1fr_440px] desktop:gap-x-24">
      <div>
        <h1 className="type-label text-text-secondary">Takedown</h1>
        <p data-testid="takedown-promise" className="mt-1 flex items-baseline gap-2.5">
          <span className="type-number-xl text-text-primary">72</span>{" "}
          <span className="type-h3 text-text-secondary">hours</span>
        </p>
        <p className="type-body-lg text-text-secondary">From your email to it being gone from ProBuilds</p>
        {/* role="list": Safari stops announcing a list once its markers are styled away. */}
        <ol role="list" aria-label="What happens" className="mt-6">
          {STEPS.map((s, i) => {
            const last = i === STEPS.length - 1;
            return (
              <li key={s.title} className="flex gap-3.5">
                {/* Figma's rail: 14 px dots (a ring, the last one filled) joined by a 2 px line. */}
                <span aria-hidden="true" className="flex w-4 shrink-0 flex-col items-center self-stretch">
                  <span className={`size-3.5 shrink-0 rounded-full border-2 border-accent-text ${last ? "bg-accent-text" : "bg-bg-page"}`} />
                  {!last && <span className="w-0.5 flex-1 bg-border-strong" />}
                </span>
                <span className="flex flex-1 flex-col gap-1 pb-6">
                  <span className="type-label text-text-primary">{s.title}</span>
                  <span className="type-body text-text-secondary">{s.body}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="mt-2 flex flex-col gap-5 desktop:mt-0 desktop:gap-4">
        <div data-testid="takedown-card" className="flex flex-col gap-3 rounded-lg bg-bg-surface px-4 py-[18px]">
          <p className="type-caption text-text-muted">Write to</p>
          <p className="type-h4 text-text-primary">{TAKEDOWN_EMAIL}</p>
          <div className="flex gap-2.5">
            <a data-testid="takedown-email" href={`mailto:${TAKEDOWN_EMAIL}`} className={buttonClass("primary", "flex-1")}>
              <ButtonLabel icon="external">Email</ButtonLabel>
            </a>
            <CopyEmailButton email={TAKEDOWN_EMAIL} />
          </div>
        </div>
        <p className="type-caption text-text-muted">Withdrawn means gone: it isn&apos;t built, listed or linked again.</p>
      </div>
    </PageContent>
  );
}
