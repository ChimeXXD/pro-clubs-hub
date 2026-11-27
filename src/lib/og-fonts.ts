// Fonts for link-preview images (next/og). next/og reads TrueType, OpenType or WOFF, not the WOFF2 that next/font
// serves the pages, so the build asks Google Fonts for TrueType files, as next/font/google already does for the pages
// (the build needs the network for both; no browser ever asks Google). Only the characters the image uses are fetched.
export type OgFont = { name: string; data: ArrayBuffer; weight: 500 | 600 | 800; style: "normal" };

const cache = new Map<string, Promise<ArrayBuffer>>();

async function googleFont(family: string, weight: number, text: string): Promise<ArrayBuffer> {
  const query = `family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const res = await fetch(`https://fonts.googleapis.com/css2?${query}`);
  if (!res.ok) throw new Error(`Google Fonts: ${family} ${weight} CSS answered ${res.status}`);
  const css = await res.text();
  const url = /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/.exec(css)?.[1];
  if (!url) throw new Error(`Google Fonts sent no TrueType file for ${family} ${weight}`);
  const font = await fetch(url);
  if (!font.ok) throw new Error(`Google Fonts: ${family} ${weight} answered ${font.status}`);
  return font.arrayBuffer();
}

/** Barlow and Barlow Condensed (the design's two families) at the given weights, for the characters in `text`. */
export async function ogFonts(text: string, weights: { family: "Barlow" | "Barlow Condensed"; weight: 500 | 600 | 800 }[]): Promise<OgFont[]> {
  // Every character the images could use, so one fetch per weight serves every image of the build.
  const chars = [...new Set(text)].sort().join("");
  return Promise.all(
    weights.map(async ({ family, weight }) => {
      const key = `${family}:${weight}:${chars}`;
      if (!cache.has(key)) cache.set(key, googleFont(family, weight, chars));
      return { name: family, data: await (cache.get(key) as Promise<ArrayBuffer>), weight, style: "normal" as const };
    }),
  );
}
