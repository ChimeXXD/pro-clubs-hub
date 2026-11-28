// Figma Chip (200:337), Size=small: 32 px tall, 12 px sides, Label/Default, with a 44 px tap area. Selected is lime
// (a dark ring in light mode, D-37). Used by Submit a build's group and position chips and Request a face's kinds.
// In a PillRow the row's sliding pill draws the selected look (`pill`) and SmallChipGhost is the chip as the pill
// shows it. Picked and unpicked chips are the same size (a transparent border on the picked one), as in Figma.
const SHAPE = "type-label inline-flex h-8 shrink-0 items-center rounded-full border px-3 whitespace-nowrap";

export function SmallChip({
  label,
  pressed,
  pill = false,
  onPress,
  testId,
}: {
  label: string;
  pressed: boolean;
  /** The row's pill draws the selected look. */
  pill?: boolean;
  onPress: () => void;
  testId?: string;
}) {
  const tone =
    pressed && !pill
      ? "border-transparent bg-accent-fill text-accent-on-fill light:ring-1 light:ring-accent-on-fill light:ring-inset"
      : "border-border-strong bg-bg-surface text-text-primary";
  return (
    <button
      type="button"
      data-testid={testId}
      aria-pressed={pressed}
      onClick={onPress}
      className={`${SHAPE} tap-target touch-manipulation transition-colors duration-150 select-none [-webkit-tap-highlight-color:transparent] ${tone}`}
    >
      {label}
    </button>
  );
}

/** The chip as the sliding pill shows it: ink on the pill's lime, the same size as the real chip. */
export function SmallChipGhost({ label }: { label: string }) {
  return <span className={`${SHAPE} border-transparent`}>{label}</span>;
}
