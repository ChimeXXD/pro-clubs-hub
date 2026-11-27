import type { CSSProperties } from "react";

// One of EA's white PlayStyle badges (public/art/playstyles), decorative: its name is the text beside it. Drawn as is
// in dark mode and tinted text/primary in light mode (the playstyle-art utility, D-114 (4)). The gold PlayStyle+
// badges stay pictures: they read on both modes.
export function PlayStyleArt({ src, className }: { src: string; className: string }) {
  const style = { "--art": `url(${JSON.stringify(src)})` } as CSSProperties;
  return <span aria-hidden="true" data-testid="playstyle-art" className={`playstyle-art ${className}`} style={style} />;
}
