import type { ReactNode } from "react";
import { Icon } from "@/components/shell/Icon";

// Figma "Limits callout" (203:342): a neutral raised panel with an amber warning icon, Body/Default text, 16 px in,
// 12 px between icon and text; it grows with its text and fills its column. The build page uses it for the
// older-season warning and the "not yet checked in game" note (371:2719, 371:2208).
export function Callout({ children, testId }: { children: ReactNode; testId?: string }) {
  return (
    <div data-testid={testId} className="flex items-start gap-3 rounded-md border border-border-subtle bg-bg-raised p-4">
      <span className="flex h-6.5 w-5 shrink-0 items-center text-status-warning">
        <Icon name="warning" size={20} />
      </span>
      <p className="type-body min-w-0 flex-1 text-text-primary">{children}</p>
    </div>
  );
}
