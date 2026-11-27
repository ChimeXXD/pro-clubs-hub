"use client";

import { Emblem } from "@/components/builds/Emblem";
import { GROUPS } from "@/lib/builds";
import type { Archetype, ArchetypeFile, Position, PositionGroup } from "@/lib/content/types";
import { apAtLevel, archetypesIn, LEVEL_MAX, levelLine, POSITIONS_BY_GROUP, type SubmitDraft, withArchetype } from "@/lib/submit/editor";
import { BodyCard } from "./BodyCard";
import { RoundButton, SectionTitle, SmallChip, Slider, StepLine } from "./controls";

// Step 1 of 4, "Your build" (Figma 400:3219 / 418:3972 / 418:4161): archetype (group chips over the group's
// archetype tiles), positions, level and height and weight. Phone stacks them; tablet too, with the four tiles in a
// row; desktop puts archetype and positions in the left column and level and body in the right (568 px each, 64
// apart). The level fills in its AP from RESEARCH §10.1 (D-85 (1)).
export function StepStart({
  file,
  draft,
  group,
  onGroup,
  onChange,
}: {
  file: ArchetypeFile;
  draft: SubmitDraft;
  group: PositionGroup;
  onGroup: (group: PositionGroup) => void;
  onChange: (next: Partial<SubmitDraft> | ((d: SubmitDraft) => SubmitDraft)) => void;
}) {
  const archetype = file.archetypes.find((a) => a.id === draft.archetype);
  const line = levelLine(draft.level);
  const setLevel = (level: number) => onChange({ level: Math.min(Math.max(level, 1), LEVEL_MAX) });
  const togglePosition = (p: Position) =>
    onChange((d) => {
      const on = d.positions.includes(p);
      // At least one position stays picked: a build needs one (FORMAT §Build).
      if (on && d.positions.length === 1) return d;
      return { ...d, positions: on ? d.positions.filter((x) => x !== p) : [...d.positions, p] };
    });
  const positions = archetype ? POSITIONS_BY_GROUP[archetype.positionGroup] : [];
  return (
    <div className="flex flex-col">
      <StepLine label="Submit a build" step={1} />
      <h1 tabIndex={-1} className="type-h1 pt-3 text-text-primary outline-none">Your build</h1>
      <p className="type-body-lg pt-2 text-text-secondary">Archetype, positions, level, height and weight. The level fills in your AP.</p>
      <div className="flex flex-col pt-7 desktop:flex-row desktop:gap-16 desktop:pt-8">
        <div className="flex flex-col desktop:w-142 desktop:shrink-0">
          <section aria-labelledby="submit-archetype" className="flex flex-col">
            <SectionTitle id="submit-archetype">Archetype</SectionTitle>
            <div className="flex flex-col gap-3.5">
              <div className="flex flex-wrap gap-1.5">
                {GROUPS.map((g) => (
                  <SmallChip key={g.group} testId="submit-group" label={g.label} pressed={g.group === group} onPress={() => onGroup(g.group)} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 tablet:grid-cols-4 desktop:grid-cols-2">
                {archetypesIn(file, group).map((a) => (
                  <ArchetypeTile key={a.id} archetype={a} selected={a.id === draft.archetype} onPick={() => onChange((d) => (d.archetype === a.id ? d : withArchetype(d, a)))} />
                ))}
              </div>
            </div>
          </section>
          <section aria-labelledby="submit-positions" className="flex flex-col pt-7">
            <SectionTitle id="submit-positions" aside="Tap all you play">
              Positions
            </SectionTitle>
            <div className="flex flex-wrap gap-x-1.5 gap-y-2">
              {positions.map((p) => (
                <SmallChip key={p} testId="submit-position" label={p} pressed={draft.positions.includes(p)} onPress={() => togglePosition(p)} />
              ))}
            </div>
          </section>
        </div>
        <div className="flex min-w-0 flex-1 flex-col pt-7 desktop:pt-0">
          <section aria-labelledby="submit-level" className="flex flex-col">
            <SectionTitle id="submit-level">Level</SectionTitle>
            <div className="flex flex-col gap-3.5 rounded-lg bg-bg-surface p-4">
              <div className="flex items-center gap-2.5">
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="type-number-xl text-text-primary" aria-live="polite">
                    {draft.level}
                  </p>
                  <p className="type-caption text-text-muted">{`of ${LEVEL_MAX}`}</p>
                </div>
                <div className="flex gap-1.5">
                  <RoundButton sign="minus" label="Level down" size={48} disabled={draft.level <= 1} onPress={() => setLevel(draft.level - 1)} />
                  <RoundButton sign="plus" label="Level up" size={48} disabled={draft.level >= LEVEL_MAX} onPress={() => setLevel(draft.level + 1)} />
                </div>
              </div>
              <Slider label="Level" min={0} max={LEVEL_MAX} value={draft.level} onChange={(v) => setLevel(v)} />
              <div data-testid="submit-ap" className="flex flex-col gap-0.5 rounded-md bg-bg-raised px-3.5 py-3" data-ap={apAtLevel(draft.level)}>
                <p className="type-label text-accent-text">{line.spend}</p>
                {line.next && <p className="type-caption text-text-secondary">{line.next}</p>}
              </div>
            </div>
          </section>
          <section aria-labelledby="submit-body" className="flex flex-col pt-7">
            <SectionTitle id="submit-body">Height and weight</SectionTitle>
            <BodyCard draft={draft} archetypeName={archetype?.name ?? ""} onChange={(next) => onChange(next)} />
          </section>
        </div>
      </div>
    </div>
  );
}

/** Figma "Archetype tile" (component 205:330): the emblem in a 40 px page-coloured circle, the name, its two signature PlayStyles. */
function ArchetypeTile({ archetype, selected, onPick }: { archetype: Archetype; selected: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      data-testid="archetype-tile"
      aria-pressed={selected}
      onClick={onPick}
      className={`flex flex-col items-start gap-2 rounded-lg p-4 text-left transition-colors duration-150 ${selected ? "bg-action-selected ring-2 ring-accent-fill ring-inset" : "bg-bg-surface ring-1 ring-border-subtle ring-inset"}`}
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-bg-page">
        <Emblem id={archetype.id} className="size-6.5" />
      </span>
      <span className="type-h4 text-text-primary">{archetype.name}</span>
      <span className="type-caption flex flex-col text-text-muted">
        {archetype.signaturePlayStyles.map((s) => (
          <span key={s.name}>{s.name}</span>
        ))}
      </span>
    </button>
  );
}
