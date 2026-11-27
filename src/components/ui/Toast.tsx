import { Icon, type IconName } from "@/components/shell/Icon";

// Figma Toast (205:365): a cream pill (bg/inverse) with ink text and an icon (DESIGN.md, D-94), Elevation/3. Tones:
// success (check), info (its icon set by the caller, such as Save images' download), danger (the error icon in
// status/danger-bg, never pure red). Placement "page": centred, 44 px above the bottom nav on phone, 40 px from the
// bottom on tablet and desktop. Placement "dialog", for a toast over the share sheet or dialog, inside it so it sits
// in the top layer (493:9624 to 493:15977): 34 px from the top on phone (the sheet fills the bottom), 40 px from
// the bottom on tablet and 24 px on desktop, under the dialog.
// The role="status" region stays mounted and only its content changes: a live region inserted with its text
// already inside is often not announced (VoiceOver). `id` remounts the pill so a repeat toast animates again.
// The caller clears `message` after 4 s, as the Figma description says.
const PLACE = {
  page: "bottom-[calc(128px+env(safe-area-inset-bottom))] tablet:bottom-10",
  dialog: "top-[34px] tablet:top-auto tablet:bottom-10 desktop:bottom-6",
} as const;

export type ToastTone = "success" | "info" | "danger";

export function Toast({
  message,
  id,
  tone = "success",
  icon,
  placement = "page",
}: {
  message: string | null;
  id?: number;
  tone?: ToastTone;
  icon?: IconName;
  placement?: keyof typeof PLACE;
}) {
  return (
    // Fixed, so the empty region takes no room (and no gap) in whatever row the caller puts it in.
    <div role="status" className="fixed">
      {message && (
        <div
          key={id}
          className={`fixed inset-x-0 ${PLACE[placement]} z-20 mx-auto flex w-fit max-w-[340px] items-center gap-2 rounded-[22px] bg-bg-inverse py-3 pr-[18px] pl-3.5 text-text-inverse shadow-elevation-3 transition-[opacity,translate] duration-200 ease-out starting:translate-y-2 starting:opacity-0 motion-reduce:starting:translate-y-0`}
        >
          <span className={`flex ${tone === "danger" ? "text-status-danger-bg" : ""}`}>
            <Icon name={icon ?? (tone === "danger" ? "error" : "check-circle")} size={20} />
          </span>
          <span className="type-label">{message}</span>
        </div>
      )}
    </div>
  );
}
