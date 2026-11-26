import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Callout } from "@/components/ui/Callout";
import { DraftTag } from "@/components/ui/DraftTag";
import { type BuildPageView as View, PICTURE_CAPTION, RAW_VALUES_NOTE } from "@/lib/build-page";
import { BuildAttributes } from "./BuildAttributes";
import { LIME } from "./BuildCard";
import { BuildDetails } from "./BuildDetails";
import { Emblem } from "./Emblem";
import { KeyStats } from "./KeyStats";
import { ShareBuild } from "./ShareBuild";

// Figma "Build · Meta Finisher" (phone 298:3630, tablet 306:794, desktop 306:1286; D-63). Phone is one column: the
// tag, name, version tag, credit and Share build; the raw-values note; the face block, key stats and caption; then
// the specialization, body and skills, PlayStyles+, PlayStyles and attributes. Tablet splits into a 300 px summary
// column (title to stats) and the details, 40 px apart; desktop's summary is 400 px, 64 px from the details.
// TODO(Chime): the level switch ("Your level", AP, slider), "All of it at level N", "Reached from level N" and the
// "specialization not reached (level 32)" state wait on each archetype's attribute prices (O-14) and the level
// engine (Sharon's PR #7); the build is shown at its own level only (D-43). The sample frame's "Sample build ·
// values and prices not checked in game" line and the "Draft only: …" footnote belong to the sample, not a build.

export function BuildPageView({ view }: { view: View }) {
  const raw = <p className="type-caption pt-2 text-text-secondary">{RAW_VALUES_NOTE}</p>;
  return (
    <main className="flex flex-col px-5 pt-6 pb-8 tablet:gap-6 tablet:px-10 tablet:pb-16 desktop:mx-auto desktop:w-full desktop:max-w-(--layout-content-max) desktop:px-0">
      <Breadcrumb
        links={[
          { href: `/builds#${view.archetype.id}`, label: "Builds" },
          { href: `/builds/${view.archetype.id}`, label: view.archetype.name },
        ]}
        current={view.title}
      />
      {view.olderSeason && (
        <div data-testid="older-season">
          <Callout>{view.olderSeason}</Callout>
        </div>
      )}
      <div className="flex flex-col tablet:flex-row tablet:items-start tablet:gap-10 desktop:gap-16">
        <div className="flex flex-col tablet:w-75 tablet:shrink-0 tablet:gap-6 desktop:w-100">
          <BuildHeader view={view} />
          <div className="tablet:hidden">{raw}</div>
          <BuildHero view={view} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col tablet:gap-6">
          <div className="hidden tablet:block">{raw}</div>
          <BuildDetails view={view} />
          <BuildAttributes groups={view.attributeGroups} mastery={view.mastery} />
        </div>
      </div>
    </main>
  );
}

/** The tag, name, version tag (rule 4), credit (rule 5) and Share build (Figma 298:3653). */
function BuildHeader({ view }: { view: View }) {
  const tagTone = view.checked && !view.olderSeason ? "text-text-secondary" : "text-status-warning";
  return (
    <section aria-label="Build" className="flex flex-col gap-5 pt-4">
      <div className="flex flex-col">
        {(view.badge || view.draft) && (
          <div className="flex flex-wrap gap-1.5">
            {view.badge === "Meta pick" && <span className={`type-label rounded-full px-2.5 py-0.75 ${LIME}`}>Meta pick</span>}
            {view.badge === "Recommended" && (
              <span className="type-label rounded-full border border-border-strong bg-bg-raised px-2.5 py-0.5 text-text-primary">Recommended</span>
            )}
            {view.draft && <DraftTag />}
          </div>
        )}
        <h1 className="type-h1 pt-2 break-words text-text-primary uppercase">{view.title}</h1>
        {/* TODO(Chime): the design colours the tag amber when unchecked or from an older season; a checked
            current-season tag isn't drawn, so it is text/secondary here. */}
        <p data-testid="version-tag" className={`type-label pt-3 ${tagTone}`}>
          {view.versionTag}
        </p>
        {view.credit && <p className="type-caption pt-1 text-text-secondary">{view.credit}</p>}
        {view.reference && (
          // TODO(Chime): the design says "Read from a creator's video"; rule 5 and D-66 (3) name the streamer.
          <p className="type-caption pt-1 text-text-secondary">
            {`Read from ${view.reference.name}'s video`}
            {view.reference.url && (
              <>
                {" · "}
                <a href={view.reference.url} target="_blank" rel="noopener noreferrer" className="tap-target underline">
                  Watch the video
                </a>
              </>
            )}
          </p>
        )}
      </div>
      <ShareBuild title={view.title} />
      {view.uncheckedNote && <Callout testId="unchecked-note">{view.uncheckedNote}</Callout>}
    </section>
  );
}

/** The face, archetype, positions, level line, key stats and picture caption (Figma "Build hero" 304:787). */
function BuildHero({ view }: { view: View }) {
  return (
    <div className="mt-8 flex flex-col gap-4 tablet:mt-0">
      <div className="flex items-center gap-4">
        <div className="size-28 shrink-0 overflow-hidden rounded-md">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export; an SVG or a sized WebP */}
          <img
            src={view.picture?.src ?? "/art/probuilds-face.svg"}
            alt={view.picture?.alt ?? ""}
            width={112}
            height={112}
            className="size-full object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <Emblem id={view.archetype.id} className="size-8" />
            <div className="flex flex-col">
              <p className="type-h4 text-text-primary uppercase">{view.archetype.name}</p>
              <p className="type-caption text-text-secondary">{view.archetype.groupLabel}</p>
            </div>
          </div>
          <ul aria-label="Positions" className="flex flex-wrap gap-1.5">
            {view.positions.map((p) => (
              <li key={p} className={`type-caption rounded-xs px-1.5 py-px ${LIME}`}>
                {p}
              </li>
            ))}
          </ul>
          <p className="type-caption text-text-secondary">{view.body}</p>
        </div>
      </div>
      <KeyStats stats={view.keyStats} />
      {!view.picture && <p className="type-caption text-text-muted">{PICTURE_CAPTION}</p>}
    </div>
  );
}
