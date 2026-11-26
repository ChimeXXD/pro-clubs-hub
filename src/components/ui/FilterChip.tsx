// Figma Chip (200:337), Size=medium: a real, clickable filter, 40 px tall with a 44 px tap area; selected is lime
// (with a dark ring in light mode, where lime barely shows on the page, D-37). An optional count follows the label
// in Label/Caption: muted when off, on-fill when selected.
const CHIP = "type-label tap-target inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-4 whitespace-nowrap";
const CHIP_ON = "bg-accent-fill text-accent-on-fill light:ring-1 light:ring-accent-on-fill light:ring-inset";
const CHIP_OFF = "border border-border-strong bg-bg-surface text-text-primary";

export function FilterChip({
  testId,
  label,
  count,
  pressed,
  onPress,
}: {
  testId: string;
  label: string;
  count?: number;
  pressed: boolean;
  onPress: () => void;
}) {
  return (
    <button type="button" data-testid={testId} aria-pressed={pressed} onClick={onPress} className={`${CHIP} ${pressed ? CHIP_ON : CHIP_OFF}`}>
      {label}
      {/* The separator keeps a screen reader from reading "Footballers1" as one word; it is out of the flex flow. */}
      {count !== undefined && <span className="sr-only">, </span>}
      {count !== undefined && <span className={`type-caption ${pressed ? "" : "text-text-muted"}`}>{count}</span>}
    </button>
  );
}
