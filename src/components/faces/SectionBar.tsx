import type { sectionBar } from "@/lib/face-page";

// Figma "Sections bar" (354:1469, D-73): one 6 px segment per section, 4 px apart, each as wide as its values. Done
// sections are lime; the current one fills from the left by its screens done (including the one in hand); the rest are
// bg/raised. Light mode fills with accent/text: lime on cream is 1.03:1 (O-23, D-115). The fill grows by transform,
// not width, eased out when a step is done; under reduced motion it jumps.
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
            className="absolute inset-0 origin-left bg-accent-fill transition-transform duration-200 ease-out motion-reduce:transition-none light:bg-accent-text"
            style={{ transform: `scaleX(${s.fill})` }}
          />
        </span>
      ))}
    </div>
  );
}
