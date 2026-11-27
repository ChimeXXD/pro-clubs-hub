import Link from "next/link";
import { Icon } from "@/components/shell/Icon";
import { buttonClass } from "@/components/ui/Button";

// Figma "Shared build · link doesn't work" (440:8514 / 440:8634 / 440:8734, D-100 (2)): a faded mannequin card,
// "Build not found", the headline, the line, then Browse builds and Make your own. Laid out as the 404 is: phone
// stacks the card over the copy (40 / 20 / 64 px around, 24 px between); tablet and desktop put the copy left and
// the card right (370 / 520 px), 56 px apart, centred on each other, 72 px above and 48 below. The button labels
// stay on one line and may run into the buttons' padding, as on tablet (440:8634: 115 px of text in 156.5).
export function SharedBuildMissing() {
  return (
    <main
      data-testid="shared-build-missing"
      className="mx-auto grid w-full gap-6 px-5 pt-10 pb-16 tablet:grid-cols-[minmax(0,1fr)_370px] tablet:items-center tablet:gap-14 tablet:px-10 tablet:pt-18 tablet:pb-12 desktop:max-w-(--layout-content-max) desktop:grid-cols-[minmax(0,1fr)_520px] desktop:px-0"
    >
      <div className="flex flex-col items-center gap-3.5 rounded-[20px] bg-bg-surface px-5 py-7 tablet:order-2">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export; the ProBuilds face, faded (opacity 55 %) */}
        <img src="/art/probuilds-face.svg" alt="" width={150} height={150} className="size-[150px] rounded-[20px] opacity-55 desktop:size-50" />
        <p className="flex items-center gap-2">
          <span className="flex text-text-muted">
            <Icon name="info" size={18} />
          </span>
          <span className="type-label text-text-secondary">Build not found</span>
        </p>
      </div>
      <div className="tablet:order-1">
        <h1 className="type-h1 text-text-primary uppercase">This build link doesn&apos;t work.</h1>
        <p className="type-body-lg mt-2.5 text-text-secondary">
          It may have been removed, or the link was copied wrong. Ask whoever sent it for a new one.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/builds" className={buttonClass("primary", "min-w-0 flex-1 whitespace-nowrap")}>
            Browse builds
          </Link>
          <Link href="/submit" className={buttonClass("secondary", "min-w-0 flex-1 whitespace-nowrap")}>
            Make your own
          </Link>
        </div>
      </div>
    </main>
  );
}
