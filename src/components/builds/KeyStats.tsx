import { RollingNumber } from "@/components/ui/RollingNumber";

// The six key stats in one ruled row (PAC SHO PAS DRI DEF PHY), on the build card (D-62) and the build page (D-63).
// On the build page (`roll`) each value rolls when it changes with the level (Stat card, motion-bookmarks.pdf #13),
// tabular so the row never shifts; only a value that changed moves. Cards never change, so they stay plain text.
// TODO(Chime): the sample's key stats don't change with the level yet (A-18), so none roll today.
export function KeyStats({ stats, roll = false }: { stats: { code: string; value: string | null }[]; roll?: boolean }) {
  return (
    <dl className="flex justify-between border-y border-border-subtle py-2.5">
      {stats.map((s) => (
        <div key={s.code} className="flex flex-col items-center">
          <dt className="type-caption text-text-secondary">{s.code}</dt>
          {/* TODO(Chime): no key stat values yet (A-18); a dash holds the place. */}
          <dd className="type-number-md text-text-primary tabular-nums">{roll ? <RollingNumber value={s.value ?? "–"} /> : (s.value ?? "–")}</dd>
        </div>
      ))}
    </dl>
  );
}
