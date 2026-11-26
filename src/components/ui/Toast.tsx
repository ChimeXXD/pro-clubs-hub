import { Icon } from "@/components/shell/Icon";

// Figma Toast (205:365), Tone=success: a cream pill (bg/inverse) with ink text and a check (DESIGN.md, D-94),
// Elevation/3. Centred, 44 px above the bottom nav on phone and 40 px from the bottom on tablet and desktop.
// The role="status" region stays mounted and only its content changes: a live region inserted with its text
// already inside is often not announced (VoiceOver). `id` remounts the pill so a repeat toast animates again.
// The caller clears `message` after 4 s, as the Figma description says.
export function Toast({ message, id }: { message: string | null; id?: number }) {
  return (
    // Fixed, so the empty region takes no room (and no gap) in whatever row the caller puts it in.
    <div role="status" className="fixed">
      {message && (
        <div
          key={id}
          className="fixed inset-x-0 bottom-[calc(128px+env(safe-area-inset-bottom))] z-20 mx-auto flex w-fit max-w-[340px] items-center gap-2 rounded-[22px] bg-bg-inverse py-3 pr-[18px] pl-3.5 text-text-inverse shadow-elevation-3 transition-[opacity,translate] duration-200 ease-out tablet:bottom-10 starting:translate-y-2 starting:opacity-0 motion-reduce:starting:translate-y-0"
        >
          <Icon name="check-circle" size={20} />
          <span className="type-label">{message}</span>
        </div>
      )}
    </div>
  );
}
