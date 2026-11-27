"use client";

import { forwardRef, useEffect, useState } from "react";
import { attributeError, nextAttribute, signed } from "@/lib/submit/editor";
import { RoundButton, Slider } from "./controls";

// Figma "Attribute row" (component 431:1050: default, typing, error; D-85 (2)): the name, − / the value / +, and a
// slider at value ÷ 99. Any of the three sets the value. Typing: the box rings lime and the line under the name
// says what comes next ("Typing · next: Shot Power"); after two digits focus jumps to the next attribute, as the tip
// says. Over 99 the box and number turn red with "Attributes go up to 99." (428:5513). An attribute height and
// weight change says so under its name: "−2 from height and weight · 86 in a match" (D-90 (2)).
export const AttributeRow = forwardRef<
  HTMLInputElement,
  {
    name: string;
    value: number;
    body: number | undefined;
    onChange: (value: number) => void;
    onFocus: () => void;
    onAdvance: () => void;
  }
>(function AttributeRow({ name, value, body, onChange, onFocus, onAdvance }, ref) {
  const [text, setText] = useState(String(value));
  const [typing, setTyping] = useState(false);
  // The box follows − / + and the slider while it isn't being typed in.
  useEffect(() => {
    if (!typing) setText(String(value));
  }, [value, typing]);
  const error = attributeError(value);
  const next = nextAttribute(name);
  const note = error
    ? { text: error, tone: "text-status-danger" }
    : typing
      ? { text: next ? `Typing · next: ${next}` : "Typing", tone: "text-accent-text" }
      : body !== undefined
        ? { text: `${signed(body)} from height and weight · ${value + body} in a match`, tone: body < 0 ? "text-status-danger" : "text-accent-text" }
        : null;
  const set = (v: number) => onChange(Math.min(Math.max(v, 0), 99));
  const box = error ? "border-2 border-status-danger text-status-danger" : typing ? "border-2 border-input-border-focused text-text-primary" : "border border-input-border text-text-primary";
  const id = `attr-${name.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div data-testid="attribute-row" className="flex flex-col gap-1.5 border-b border-system-divider pt-2 pb-3">
      <div className="flex items-center gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <label htmlFor={id} className="type-label text-text-primary">
            {name}
          </label>
          {note && (
            <p id={`${id}-note`} className={`type-caption ${note.tone}`}>
              {note.text}
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          <RoundButton sign="minus" label={`${name} down`} size={44} surface="surface" disabled={value <= 0} onPress={() => set(value - 1)} />
          <input
            ref={ref}
            id={id}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={3}
            value={text}
            aria-invalid={error ? true : undefined}
            aria-describedby={note ? `${id}-note` : undefined}
            onFocus={(e) => {
              setTyping(true);
              onFocus();
              e.currentTarget.select();
            }}
            onBlur={() => {
              setTyping(false);
              setText(String(value));
            }}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
              setText(digits);
              if (digits === "") return;
              const v = Number(digits);
              onChange(v);
              // Two digits are a whole value, except "10", which may be the start of 100 (shown as an error).
              if (digits.length === 2 && v !== 10 && !attributeError(v)) onAdvance();
            }}
            className={`type-number-md h-11 w-15 rounded-[10px] bg-input-bg text-center outline-none ${box}`}
          />
          <RoundButton sign="plus" label={`${name} up`} size={44} surface="surface" disabled={value >= 99} onPress={() => set(value + 1)} />
        </div>
      </div>
      <Slider label={name} min={0} max={99} value={value} onChange={set} />
    </div>
  );
});
