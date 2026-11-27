"use client";

import { useRef } from "react";
import { buttonClass } from "@/components/ui/Button";
import { type ShareCardsView, shareCardsAtLevel } from "@/lib/share-cards";
import { useChosenLevel } from "./ChosenLevel";
import { ShareSheet, type ShareSheetHandle } from "./ShareSheet";

// The Build page's lime "Share build" button (Figma 298:3653) and its sheet (ShareSheet.tsx). The story cards show
// the level picked with the level switch (D-114 (3)), so the saved images do too.
export function ShareBuild({ title, share }: { title: string; share: ShareCardsView }) {
  const sheet = useRef<ShareSheetHandle>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const { level } = useChosenLevel();
  return (
    <>
      <button ref={trigger} type="button" aria-haspopup="dialog" className={buttonClass("primary", "w-full")} onClick={() => sheet.current?.open(trigger.current)}>
        Share build
      </button>
      <ShareSheet ref={sheet} title={title} share={shareCardsAtLevel(share, level)} />
    </>
  );
}
