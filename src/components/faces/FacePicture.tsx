import { Icon } from "@/components/shell/Icon";
import type { FacePageView } from "@/lib/face-view";
import { TurnPicture } from "./TurnPicture";

// Figma "Face picture (demo)" (353:1421 phone, 427:8658 tablet, 427:8776 desktop): the face's in-game picture, cover-
// cropped. Phone ("hero"): full width, 480 px tall, the sheet's rounded top (28 px, bg/page, a 40 × 4 handle) over its
// foot. Tablet and desktop ("card"): a 4:5 card with 16 px corners. The "360°" badge (D-71) sits 16 px from the top,
// 20 px (phone) or 16 px (card) from the right. With the face's turn frames (D-35) the picture turns by drag.
export function FacePicture({ view, variant }: { view: FacePageView; variant: "hero" | "card" }) {
  const hero = variant === "hero";
  return (
    <div
      className={`relative overflow-hidden bg-bg-surface ${hero ? "h-[480px]" : "aspect-[4/5] rounded-lg"}`}
      data-testid={hero ? "face-picture-hero" : "face-picture"}
    >
      {view.turn && view.picture ? (
        <TurnPicture turn={view.turn} alt={view.picture.alt} poster={view.picture.src} />
      ) : (
        view.picture && (
          // eslint-disable-next-line @next/next/no-img-element -- static export; our own sized capture
          <img src={view.picture.src} alt={view.picture.alt} width={468} height={576} className="absolute inset-0 size-full object-cover" />
        )
      )}
      {view.rotate && (
        <span className={`absolute top-4 flex items-center gap-1.5 rounded-full bg-bg-page py-1.5 pr-3 pl-2.5 text-text-primary ${hero ? "right-5" : "right-4"}`}>
          <Icon name="rotate-360" size={20} />
          <span className="type-label">360°</span>
        </span>
      )}
      {hero && (
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 flex h-7 justify-center rounded-t-xl bg-bg-page pt-3">
          <span className="h-1 w-10 rounded-[2px] bg-bg-raised" />
        </span>
      )}
    </div>
  );
}
