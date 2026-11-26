// The six key stats in one ruled row (PAC SHO PAS DRI DEF PHY), on the build card (D-62) and the build page (D-63).
export function KeyStats({ stats }: { stats: { code: string; value: string | null }[] }) {
  return (
    <dl className="flex justify-between border-y border-border-subtle py-2.5">
      {stats.map((s) => (
        <div key={s.code} className="flex flex-col items-center">
          <dt className="type-caption text-text-secondary">{s.code}</dt>
          {/* TODO(Chime): no key stat values yet (A-18); a dash holds the place. */}
          <dd className="type-number-md text-text-primary">{s.value ?? "–"}</dd>
        </div>
      ))}
    </dl>
  );
}
