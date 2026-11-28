"use client";

import { PillRow } from "@/components/ui/PillRow";
import { SmallChip, SmallChipGhost } from "@/components/ui/SmallChip";
import { GROUPS } from "@/lib/builds";
import type { PositionGroup } from "@/lib/content/types";

// The Keeper · Defender · Midfielder · Forward chips over the archetype tiles (Figma Chip 200:337, Size=small), with the
// Segmented control's sliding pill (motion-bookmarks.pdf #7): the shared PillRow (usePill), the same lime pill the
// Faces, Changelog and Request a face chips use, on --spring-fade, so the site has one pill. `still` tells the caller
// a pick came from the keyboard (Enter or Space: a click with detail 0), so the tiles below don't rise in.
export function GroupChips({ group, onGroup }: { group: PositionGroup; onGroup: (group: PositionGroup, still: boolean) => void }) {
  return (
    <PillRow
      selected={GROUPS.findIndex((g) => g.group === group)}
      className="flex flex-wrap gap-1.5"
      chips={(pill) =>
        GROUPS.map((g) => (
          <SmallChip
            key={g.group}
            testId="submit-group"
            label={g.label}
            pressed={g.group === group}
            pill={pill}
            onPress={(e) => g.group !== group && onGroup(g.group, e.detail === 0)}
          />
        ))
      }
      ghosts={GROUPS.map((g) => (
        <SmallChipGhost key={g.group} label={g.label} />
      ))}
    />
  );
}
