import type { ReactNode } from "react";

// The content area under the top bar on the text pages (Figma About and Takedown "Content"): 56 / 20 / 64 px
// on phone, 72 / 40 / 120 on tablet, and a centred 1200 px column with 72 / 120 above and below on desktop.
export function PageContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <main className={`mx-auto w-full px-5 pt-14 pb-16 tablet:px-10 tablet:pt-18 tablet:pb-30 desktop:max-w-(--layout-content-max) desktop:px-0 ${className}`}>
      {children}
    </main>
  );
}
