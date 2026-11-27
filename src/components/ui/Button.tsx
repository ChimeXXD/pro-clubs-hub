import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/shell/Icon";

// Figma Button (199:651). Large: 52 px tall, 24 px sides, Button/Large label; Medium: 44 px tall, 20 px sides,
// Button/Medium label; both with a 20 px icon. Primary is the lime fill for the one main action; Secondary is
// outlined (1.5 px border/strong).
const VARIANT = {
  primary: "bg-accent-fill text-accent-on-fill",
  secondary: "border-[1.5px] border-border-strong text-text-primary",
} as const;

// Small (Figma 199:651, Size=small): 36 px tall, 16 px sides, Button/Small, a 16 px icon; it gets the 44 px tap area.
const SIZE = { large: "type-button-lg h-13 px-6", medium: "type-button-md h-11 px-5", small: "type-button-sm tap-target h-9 px-4" } as const;

export function buttonClass(variant: keyof typeof VARIANT, extra = "", size: keyof typeof SIZE = "large") {
  return `${SIZE[size]} inline-flex items-center justify-center gap-2 rounded-sm ${VARIANT[variant]} ${extra}`;
}

/** The label with its icon on the side the design puts it. */
export function ButtonLabel({
  children,
  icon,
  iconSide = "right",
  iconSize = 20,
}: {
  children: ReactNode;
  icon?: IconName;
  iconSide?: "left" | "right";
  iconSize?: 16 | 20;
}) {
  return (
    <>
      {icon && iconSide === "left" && <Icon name={icon} size={iconSize} />}
      {children}
      {icon && iconSide === "right" && <Icon name={icon} size={iconSize} />}
    </>
  );
}
