import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadContent, type LoadedFace } from "@/lib/content/load";
import { faceOgView, OG_SIZE, tokenColour } from "@/lib/face-og";

// The face's link preview (Figma 430:7306, "Link preview · face · 1200×630", drawn at 600×315; D-97 (1)): the in-game
// face on the left; the Face tag, the name, "<kind> · <steps> steps · matching build", the domain and the version tag.
const content = loadContent(join(process.cwd(), "content"), { includeDrafts: true });
const ronaldo = content.faces.find((f) => f.id === "cristiano-ronaldo-2008") as LoadedFace;

describe("faceOgView", () => {
  it("words 2008 Ronaldo's preview as Figma draws it", () => {
    expect(faceOgView(ronaldo, (file) => existsSync(join(process.cwd(), "public", file)))).toEqual({
      title: "2008 Ronaldo",
      tag: "Face",
      facts: "Footballer · 18 steps · matching build",
      domain: "probuilds.club",
      versionTag: "FC 27 · Season 2 · Not yet checked in game",
      picture: "sample/faces/cristiano-ronaldo-2008.jpg",
      alt: "2008 Ronaldo: Footballer · 18 steps · matching build",
    });
  });

  it("draws no picture when there is no JPEG or PNG beside the WebP (next/og can't draw WebP)", () => {
    expect(faceOgView(ronaldo, () => false).picture).toBeNull();
    expect(faceOgView(ronaldo, (f) => f.endsWith(".webp")).picture).toBeNull();
  });

  it("is 1200 × 630, twice the frame", () => {
    expect(OG_SIZE).toEqual({ width: 1200, height: 630 });
  });

  it("reads colours from the Figma variables snapshot, dark mode", () => {
    expect(tokenColour("bg/page")).toBe("#01261b");
    expect(tokenColour("accent/fill")).toBe("#d8ff4f");
    expect(() => tokenColour("nope/none")).toThrow();
  });
});
