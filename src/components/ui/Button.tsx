import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/shell/Icon";

// Figma Button (199:651), Large: 52 px tall, 24 px sides, Button/Large label, a 20 px icon. Primary is the lime
// fill for the one main action; Secondary is outlined (1.5 px border/strong).
const VARIANT = {
  primary: "bg-accent-fill text-accent-on-fill",
  secondary: "border-[1.5px] border-border-strong text-text-primary",
} as const;

export function buttonClass(variant: keyof typeof VARIANT, extra = "") {
  return `type-button-lg inline-flex h-13 items-center justify-center gap-2 rounded-sm px-6 ${VARIANT[variant]} ${extra}`;
}

/** The label with its icon on the side the design puts it. */
export function ButtonLabel({ children, icon, iconSide = "right" }: { children: ReactNode; icon?: IconName; iconSide?: "left" | "right" }) {
  return (
    <>
      {icon && iconSide === "left" && <Icon name={icon} size={20} />}
      {children}
      {icon && iconSide === "right" && <Icon name={icon} size={20} />}
    </>
  );
}
