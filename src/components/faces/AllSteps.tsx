"use client";

import { useRef } from "react";
import { Icon } from "@/components/shell/Icon";
import type { Recipe } from "@/lib/face-page";

// "All steps" (D-72 (3): the full list opens from the progress label). No frame draws the list, so it is built from
// the Design System: the Sheet (205:366) on phone, a centred dialog from tablet as Share build does, holding one Step
// row (203:311) per screen: the tick (28 px, a 44 px tap area), "Step N", the screen's title and its value (one value)
// or count. Done rows dim and get the lime tick; the current row is highlighted (action/selected). Ticking a row marks
// it and every step before it done; unticking makes it the current step again.
// TODO(Chime): Figma draws no All steps list; this is the Design System's Sheet and Step row, for your OK.
const ICON_BUTTON = "flex size-11 shrink-0 items-center justify-center rounded-sm transition-colors duration-150 hover:bg-action-hovered";

export function AllSteps({ recipe, step, onPick }: { recipe: Recipe; step: number; onPick: (step: number) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = () => dialog.current?.close();
  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
        className="type-label tap-target shrink-0 text-accent-text"
      >
        All steps
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="all-steps-title"
        onClose={() => trigger.current?.focus()}
        onClick={(e) => e.target === dialog.current && close()}
        className="mt-auto mb-0 max-h-[85dvh] w-full max-w-none rounded-t-xl border-0 bg-bg-raised p-0 text-text-primary shadow-elevation-3 transition-[translate,scale,opacity] duration-250 ease-[cubic-bezier(0.32,0.72,0,1)] backdrop:bg-system-backdrop starting:open:translate-y-full tablet:m-auto tablet:w-[480px] tablet:max-w-[calc(100%-48px)] tablet:rounded-xl tablet:ease-out tablet:starting:open:translate-y-0 tablet:starting:open:scale-[0.96] tablet:starting:open:opacity-0 motion-reduce:starting:open:translate-y-0 motion-reduce:starting:open:scale-100 motion-reduce:starting:open:opacity-0"
      >
        <div className="flex flex-col gap-4 px-5 pt-5 pb-[calc(20px+env(safe-area-inset-bottom))] tablet:pb-5">
          <span aria-hidden="true" className="mx-auto h-1 w-10 rounded-[2px] bg-text-muted tablet:hidden" />
          <div className="flex items-center justify-between">
            <h2 id="all-steps-title" className="type-h3 text-text-primary">
              All steps
            </h2>
            <button type="button" aria-label="Close" className={ICON_BUTTON} onClick={close}>
              <Icon name="close" size={20} />
            </button>
          </div>
          <ol className="flex flex-col">
            {recipe.screens.map((screen) => {
              const done = screen.step < step;
              const current = screen.step === step;
              const only = screen.values.length === 1 ? screen.values[0] : undefined;
              const value = only ? (only.value ?? "") : `${screen.values.length} values`;
              return (
                <li
                  key={screen.step}
                  data-testid={`step-row-${screen.step}`}
                  aria-current={current ? "step" : undefined}
                  className={`flex items-center gap-3 rounded-md p-3 ${current ? "bg-action-selected" : "border-b border-system-divider"}`}
                >
                  <button
                    type="button"
                    data-testid={`step-tick-${screen.step}`}
                    aria-pressed={done}
                    aria-label={`Step ${screen.step} done`}
                    onClick={() => onPick(done ? screen.step : screen.step + 1)}
                    className={`tap-target flex size-7 shrink-0 items-center justify-center rounded-full transition-colors duration-150 ${done ? "bg-accent-fill text-accent-on-fill" : "border-2 border-border-strong"}`}
                  >
                    {done && <Icon name="check" size={18} />}
                  </button>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="type-caption text-text-muted">Step {screen.step}</span>
                    <span className={`type-body ${done ? "text-text-muted" : "text-text-primary"}`}>{screen.title}</span>
                  </span>
                  <span className={`type-number-md shrink-0 ${done ? "text-text-muted" : "text-text-primary"}`}>{value}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </dialog>
    </>
  );
}
