import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadContent, type LoadedBuild } from "@/lib/content/load";
import { buildPreview, previewImages, SHARED_PREVIEW, sharedPreviewPath, siteOrigin, buildPreviewPath } from "@/lib/link-preview";
import { tokenColour } from "@/lib/og/tokens";

// The link preview (Figma 319:885 "Link preview · 1200×630 (drawn at 600×315)", D-64 (3), D-99 (2)): what a chat
// shows when a build page is pasted. Shared builds get one generic image (no server to draw one per link).
const content = loadContent(join(process.cwd(), "content"), { includeDrafts: true });
const meta = content.builds.find((b) => b.id === "meta-finisher") as LoadedBuild;

describe("link preview", () => {
  it("words a build as Figma draws Meta Finisher's", () => {
    expect(buildPreview(meta)).toEqual({
      badge: "Meta pick",
      title: "Meta Finisher",
      lines: ["Finisher · ST · CF", "Level 55 · 185 cm · 80 kg"],
      domain: "probuilds.club",
      versionTag: "FC 27 · Season 2 · Not yet checked in game",
    });
  });

  it("has one generic image for shared builds, worded from the shared page (439:8847)", () => {
    expect(SHARED_PREVIEW).toEqual({
      badge: null,
      title: "Shared build",
      lines: ["Shared by a player · not on ProBuilds' lists yet"],
      domain: "probuilds.club",
      versionTag: null,
    });
  });

  it("names the image files, one per build page, and the pages' metadata", () => {
    expect(buildPreviewPath(meta)).toBe("/og/build-finisher-meta-finisher.png");
    expect(sharedPreviewPath).toBe("/og/shared-build.png");
    expect(previewImages("/og/shared-build.png", "Shared build", {})).toEqual({
      metadataBase: new URL("https://probuilds.club"),
      openGraph: { images: [{ url: "/og/shared-build.png", width: 1200, height: 630, alt: "Shared build" }] },
      twitter: { card: "summary_large_image", images: ["/og/shared-build.png"] },
    });
  });

  it("points at the deployment it is built for: the preview's own address, else probuilds.club", () => {
    expect(siteOrigin({})).toBe("https://probuilds.club");
    expect(siteOrigin({ CF_PAGES_URL: "https://abc123.probuilds.pages.dev" })).toBe("https://abc123.probuilds.pages.dev");
    expect(siteOrigin({ CF_PAGES_URL: "https://x.pages.dev", CF_PAGES_BRANCH: "main" })).toBe("https://probuilds.club");
  });

  it("takes its colours from the tokens, dark mode (the image is drawn dark, as Figma draws it)", () => {
    expect(tokenColour("bg-page")).toBe("#01261b");
    expect(tokenColour("accent-fill")).toBe("#d8ff4f");
    expect(tokenColour("text-muted")).toBe("#b7b4a9");
    expect(() => tokenColour("no-such-token")).toThrow();
  });
});
