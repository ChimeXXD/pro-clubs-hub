"use client";

import { type ChangeEvent, useState } from "react";
import { Callout } from "@/components/ui/Callout";
import { type LevelsView, nearestLevel, stepLevel } from "@/lib/build-level";

// Figma "Section - Your level" (298:3669) and its level-32 state (371:1697): "Your level" with − / + around the
// number, the AP line, and a slider whose knob sits at level ÷ 55 along the track. A level short of the build adds
// the warning under the section. TODO(Chime): only the levels the sample draws (55 and 32) have figures, so the
// slider and − / + move between those; every other level needs the archetype's attribute prices (O-14) and the AP
// each level gives (the level engine, Sharon's PR #7).
// TODO(Chime): "Your level", the stepper's glyphs and number and the AP line are drawn without a text style; built
// as drawn (Barlow Condensed 20, Barlow Bold 22, Barlow Condensed 24, Barlow 14 / 18.85). The AP line's two colours
// aren't tokens (Figma ab9b80 and efe6d4): text/muted and text/primary here. The knob's 3 px ring (Figma 0c0906) is
// accent/on-fill, the nearest token.
const STEP = "flex size-11 items-center justify-center font-text text-[22px] leading-[22px] font-bold text-text-primary";

export function LevelSwitch({ levels }: { levels: LevelsView }) {
  const [level, setLevel] = useState(levels.initial);
  const drawn = levels.states.map((s) => s.level);
  const state = levels.states.find((s) => s.level === level) ?? levels.states[0];
  if (!state) return null;
  const at = `${(state.level / levels.max) * 100}%`;
  // Snap to the nearest drawn level; a small move (an arrow key, Page Up/Down) that would snap straight back steps
  // to the next drawn level that way instead, so the slider works from the keyboard.
  const onSlide = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const nearest = nearestLevel(drawn, value);
    setLevel(nearest === state.level && value !== state.level ? stepLevel(drawn, state.level, value < state.level ? -1 : 1) : nearest);
  };

  return (
    <div data-testid="level-switch" className="flex flex-col">
      <section aria-labelledby="your-level" className="flex flex-col border-b border-border-subtle pt-2 pb-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h2 id="your-level" className="font-display text-[20px] leading-5 font-extrabold text-text-primary uppercase">Your level</h2>
            <div className="flex items-center rounded-sm border border-border-subtle bg-bg-page">
              <button type="button" aria-label="Level down" className={STEP} onClick={() => setLevel(stepLevel(drawn, state.level, -1))}>
                −
              </button>
              <output aria-label="Level" className="flex h-11 w-13 items-center justify-center font-display text-[24px] leading-6 font-extrabold text-text-primary">
                {state.level}
              </output>
              <button type="button" aria-label="Level up" className={STEP} onClick={() => setLevel(stepLevel(drawn, state.level, 1))}>
                +
              </button>
            </div>
          </div>
          <p aria-live="polite" className="font-text text-[14px] leading-[18.85px] font-medium text-text-muted">
            {`AP at level ${state.level}: `}
            <b className="font-bold text-text-primary">{state.ap}</b>
            {" · spent "}
            <b className="font-bold text-text-primary">{state.spent}</b>
            {" · left "}
            <b className="font-bold text-text-primary">{state.left}</b>
          </p>
        </div>
        <div className="px-3.5 pt-0.5">
          <div className="relative h-11">
            {/* The real control, invisible over the drawing; the knob shows its focus. */}
            <input
              type="range"
              aria-label="Your level"
              min={1}
              max={levels.max}
              value={state.level}
              onChange={onSlide}
              className="peer absolute inset-y-0 -left-3.5 z-10 h-full w-[calc(100%+28px)] cursor-pointer opacity-0"
            />
            <span aria-hidden="true" className="absolute top-4.75 -right-3.5 -left-3.5 h-1.5 overflow-hidden rounded-[3px] bg-bg-surface">
              <span className="block h-full bg-text-secondary" style={{ width: `calc(${at} + 14px)` }} />
            </span>
            <span
              aria-hidden="true"
              className="absolute top-2 size-7 -translate-x-1/2 rounded-full bg-accent-fill shadow-[0_0_0_3px_var(--color-accent-on-fill)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-focus-ring"
              style={{ left: at }}
            />
          </div>
        </div>
      </section>
      {state.callout && (
        <div data-testid="level-short">
          <Callout>{state.callout}</Callout>
        </div>
      )}
    </div>
  );
}
