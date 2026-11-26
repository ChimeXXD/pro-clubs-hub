import type { Metadata } from "next";
import Link from "next/link";
import { ReplayCard } from "@/components/not-found/ReplayCard";
import { buttonClass } from "@/components/ui/Button";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = { title: `Over the bar · ${SITE_NAME}` };

// The 404 (Figma 420:4819 / 423:4713 / 423:4836; D-81, D-93, D-95): the replay card, the headline and line,
// then Faces and Builds. Phone: the card on top (40 / 20 / 64 px around). Tablet and desktop: copy left and the
// card right (370 / 600 px), 56 px apart, centred on each other; 72 px above and 48 below.
export default function NotFound() {
  return (
    <main className="mx-auto grid w-full gap-6 px-5 pt-10 pb-16 tablet:grid-cols-[1fr_370px] tablet:items-center tablet:gap-14 tablet:px-10 tablet:pt-18 tablet:pb-12 desktop:max-w-(--layout-content-max) desktop:grid-cols-[1fr_600px] desktop:px-0">
      <div className="tablet:order-2">
        <ReplayCard />
      </div>
      <div className="tablet:order-1">
        <h1 className="type-h1 text-text-primary">Over the bar.</h1>
        <p className="type-body-lg mt-2.5 text-text-secondary">
          That link went high. The page may have moved, or what was on it has been taken down.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/faces" className={buttonClass("primary", "flex-1")}>
            Faces
          </Link>
          <Link href="/builds" className={buttonClass("secondary", "flex-1")}>
            Builds
          </Link>
        </div>
      </div>
    </main>
  );
}
