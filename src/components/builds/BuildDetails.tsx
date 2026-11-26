import type { BuildPageView, SpecializationView } from "@/lib/build-page";
import { NUMBER_SM } from "./BuildAttributes";

// The build page's details (Figma 298:3739 to 298:3849, D-63): the specialization card, body and skills, PlayStyles+
// and PlayStyles. Returned as siblings so the details column's 24 px gap (tablet, desktop) falls between them. Two
// columns on phone and tablet (159 px each, as drawn), three on desktop.
// TODO(Chime): Figma's specialization values are 18 px Barlow Condensed with no text style; built as drawn, in
// status/warning, the nearest token to the drawn gold, which is not a token.
const COLUMNS = "grid grid-cols-[repeat(2,minmax(0,159px))] gap-x-3 desktop:grid-cols-3 desktop:gap-x-6";

export function BuildDetails({ view }: { view: BuildPageView }) {
  return (
    <>
      {view.specialization && <Specialization spec={view.specialization} />}
      <dl className={`${COLUMNS} gap-y-3 pt-4`}>
        {view.facts.map((f) => (
          <div key={f.term} className="flex flex-col">
            <dt className="type-label text-text-secondary">{f.term}</dt>
            <dd className="type-label pt-px text-text-primary">
              {f.label === undefined || f.label === f.value ? (
                f.value
              ) : (
                <>
                  <span aria-hidden="true">{f.value}</span>
                  <span className="sr-only">{f.label}</span>
                </>
              )}
            </dd>
          </div>
        ))}
      </dl>
      <h2 className="type-label pt-4 text-text-secondary">PlayStyles+</h2>
      <ul className={`${COLUMNS} gap-y-2 pt-2`}>
        {view.playStylesPlus.map((p) => (
          <li key={p.name} className="flex items-center gap-2">
            <Badge icon={p.icon} />
            <span className="flex min-w-0 flex-col">
              {/* Figma's name line is 17 px tall, so "Signature" sits 3 px into it (298:3811). */}
              <span className={`type-label break-words text-text-primary ${p.signature ? "-mb-0.75" : ""}`}>{p.name}</span>
              {p.signature && <span className="type-label text-accent-text">Signature</span>}
            </span>
          </li>
        ))}
      </ul>
      <h2 className="type-label pt-4 text-text-secondary">PlayStyles</h2>
      {/* TODO(Chime): no design for a build with no regular PlayStyles; the heading then stands over an empty list. */}
      <ul className={`${COLUMNS} gap-y-2 pt-2 pb-4`}>
        {view.playStyles.map((p) => (
          <li key={p.name} className="flex items-center gap-2">
            <Badge icon={p.icon} />
            <span className="type-label min-w-0 break-words text-text-primary">{p.name}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

/** The PlayStyle badge (EA's art, D-39), 36 px; a placeholder or a badge not exported yet keeps the slot empty. */
function Badge({ icon }: { icon: string | null }) {
  return icon ? (
    // eslint-disable-next-line @next/next/no-img-element -- static export, files already sized
    <img src={icon} alt="" width={36} height={36} className="size-9 shrink-0" />
  ) : (
    <span aria-hidden="true" className="size-9 shrink-0" />
  );
}

/** Figma "Section" 298:3740: the specialization, its PlayStyle+, the build's value beside each unlock target. */
function Specialization({ spec }: { spec: SpecializationView }) {
  return (
    <section aria-labelledby="specialization" className="pt-4">
      <div className="flex flex-col rounded-sm bg-bg-surface p-3">
        <h2 id="specialization" className="type-label text-text-secondary">
          Specialization
        </h2>
        <div className="flex items-center gap-2 pt-2">
          {spec.icon && (
            // eslint-disable-next-line @next/next/no-img-element -- static export, files already sized
            <img src={spec.icon} alt="" width={36} height={36} className="size-9 shrink-0" />
          )}
          <div className="flex min-w-0 flex-col">
            <p className="type-number-md break-words text-text-primary uppercase">{spec.name}</p>
            {spec.plus && <p className="type-label text-accent-text">{spec.plus}</p>}
          </div>
        </div>
        {spec.targets.length > 0 && (
          <ul aria-label="Unlock targets" className="flex flex-col gap-1 pt-2">
            {spec.targets.map((t) => (
              <li key={t.attribute} className="flex items-start justify-between gap-3">
                <span className="type-caption text-text-primary">{t.attribute}</span>
                <span className="whitespace-nowrap">
                  <span className={`${NUMBER_SM} text-status-warning`}>{t.value ?? "–"}</span>
                  <span className="type-caption text-text-muted">{` / ${t.target ?? "–"}`}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
        {/* TODO(Chime): no design says when a build's values fall short of a target; the line is left out then. */}
        {spec.reachedAt !== null && <p className="type-label pt-2 text-text-primary">{`Reached at level ${spec.reachedAt}`}</p>}
      </div>
    </section>
  );
}
