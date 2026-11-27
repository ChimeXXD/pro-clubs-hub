"use client";

import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

// The level picked with the build page's level switch, shared with Share build so the story cards and the saved
// images show it (Figma 492:9586, 492:9695; D-112 (3), D-114 (3)). null until the switch is moved: the cards then
// show the build's own level.
const Chosen = createContext<{ level: number | null; choose: (level: number) => void }>({ level: null, choose: () => {} });

export function ChosenLevel({ children }: { children: ReactNode }) {
  const [level, choose] = useState<number | null>(null);
  const value = useMemo(() => ({ level, choose }), [level]);
  return <Chosen value={value}>{children}</Chosen>;
}

export const useChosenLevel = () => useContext(Chosen);
