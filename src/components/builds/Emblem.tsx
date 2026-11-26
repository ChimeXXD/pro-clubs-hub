import type { CSSProperties } from "react";

// An archetype's emblem (D-106), the Figma emblem art in public/art/archetypes. It is one colour, so it's drawn as a
// mask in the current text colour, like <Icon>: cream on the dark page, ink in light mode.
export function Emblem({ id, className = "", style }: { id: string; className?: string; style?: CSSProperties }) {
  return (
    <span
      aria-hidden="true"
      className={`icon-mask text-text-primary ${className}`}
      style={{ "--icon": `url(/art/archetypes/${id}.svg)`, ...style } as CSSProperties}
    />
  );
}
