import type { CSSProperties } from "react";
import type { IconName } from "@/lib/icons";

export type { IconName };

/** A Figma icon from public/icons, drawn in the current text colour. Decorative: the control carries the label. */
export function Icon({ name, size }: { name: IconName; size: 14 | 20 | 22 | 24 }) {
  const style = { "--icon": `url(/icons/${name}.svg)`, width: size, height: size } as CSSProperties;
  return <span aria-hidden="true" className="icon-mask" style={style} />;
}
