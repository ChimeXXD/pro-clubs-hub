import type { sectionBar } from "@/lib/face-page";

// Figma "Sections bar" (354:1469, D-73): one 6 px segment per section, 4 px apart, each as wide as its values. Done
// sections are lime; the current one fills from the left by its screens done (including the one in hand); the rest are
// bg/raised. The fill eases out when a step is done; under reduced motion it jumps.
export function SectionBar({ sections }: { sections: ReturnType<typeof sectionBar> }) {
  return (
    <div data-testid="section-bar" aria-hidden="true" className="flex gap-1">
      {sections.map((s) => (
        <span
          key={s.name}
          data-fill={String(Math.round(s.fill * 1000) / 1000)}
          className="relative h-1.5 min-w-px overflow-hidden rounded-[3px] bg-bg-raised"
          style={{ flexGrow: s.weight, flexBasis: 0 }}
        >
          <span
            className="absolute inset-y-0 left-0 bg-accent-fill transition-[width] duration-200 ease-out motion-reduce:transition-none"
            style={{ width: `${s.fill * 100}%` }}
          />
        </span>
      ))}
    </div>
  );
}
