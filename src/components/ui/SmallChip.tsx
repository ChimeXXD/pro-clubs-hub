// Figma Chip (200:337), Size=small: 32 px tall, 12 px sides, Label/Default, with a 44 px tap area. Selected is lime
// (a dark ring in light mode, D-37). Used by Submit a build's group and position chips and Request a face's kinds.
export function SmallChip({ label, pressed, onPress, testId }: { label: string; pressed: boolean; onPress: () => void; testId?: string }) {
  const tone = pressed
    ? "bg-accent-fill text-accent-on-fill light:ring-1 light:ring-accent-on-fill light:ring-inset"
    : "border border-border-strong bg-bg-surface text-text-primary";
  return (
    <button
      type="button"
      data-testid={testId}
      aria-pressed={pressed}
      onClick={onPress}
      className={`type-label tap-target inline-flex h-8 shrink-0 items-center rounded-full px-3 whitespace-nowrap transition-colors duration-150 ${tone}`}
    >
      {label}
    </button>
  );
}

