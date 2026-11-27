/* eslint-disable @next/next/no-img-element -- next/og draws plain <img> elements into the picture */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteContent } from "@/lib/content/site-content";
import { buildPreview, buildPreviewPath, type LinkPreview, PREVIEW_SIZE, SHARED_PREVIEW, sharedPreviewPath } from "@/lib/link-preview";
import { tokenColour } from "@/lib/og/tokens";

// The link preview images (Figma 319:885, D-64 (3), D-99 (2)), drawn with Next's built-in next/og at build time and
// written into the static export as /og/<name>.png: one per build page, and one generic image for shared builds.
// Preview only, like the pages that use them (D-105). Figma draws it at 600 × 315; every size here is doubled.
// Fonts: Barlow and Barlow Condensed as TTF (next/og can't read woff2), SIL OFL, in src/lib/og/fonts.
export const dynamic = "force-static";
export const dynamicParams = false;

const fileName = (path: string) => path.slice(path.lastIndexOf("/") + 1);

export function generateStaticParams() {
  return [...siteContent().builds.map((b) => ({ image: fileName(buildPreviewPath(b)) })), { image: fileName(sharedPreviewPath) }];
}

const read = (...path: string[]) => readFile(join(process.cwd(), ...path));
const svg = async (...path: string[]) => `data:image/svg+xml;base64,${(await read(...path)).toString("base64")}`;

// The fonts and pictures are the same for every image: read them once per build, not once per image.
let assets: ReturnType<typeof readAssets> | undefined;
const readAssets = () =>
  Promise.all([
    read("src", "lib", "og", "fonts", "Barlow-Medium.ttf"),
    read("src", "lib", "og", "fonts", "Barlow-SemiBold.ttf"),
    read("src", "lib", "og", "fonts", "BarlowCondensed-ExtraBold.ttf"),
    // TODO(Chime): a build's own in-game picture once builds have them (D-41); every build shows the mannequin today.
    svg("public", "art", "probuilds-face.svg"),
    svg("public", "brand", "logo-mark-on-dark.svg"),
    svg("public", "brand", "logo-wordmark-on-dark.svg"),
  ]);

export async function GET(_request: Request, { params }: { params: Promise<{ image: string }> }) {
  const { image } = await params;
  const build = siteContent().builds.find((b) => fileName(buildPreviewPath(b)) === image);
  const preview: LinkPreview = build ? buildPreview(build) : SHARED_PREVIEW;
  assets ??= readAssets();
  const [medium, semiBold, condensed, face, mark, wordmark] = await assets;
  return new ImageResponse(<Preview preview={preview} face={face} mark={mark} wordmark={wordmark} />, {
    ...PREVIEW_SIZE,
    fonts: [
      { name: "Barlow", data: medium, weight: 500, style: "normal" },
      { name: "Barlow", data: semiBold, weight: 600, style: "normal" },
      { name: "Barlow Condensed", data: condensed, weight: 800, style: "normal" },
    ],
  });
}

/** Figma 319:885 at 2×: the face filling the left square, then the logo, tag, name, two lines, domain and tag. */
function Preview({ preview, face, mark, wordmark }: { preview: LinkPreview; face: string; mark: string; wordmark: string }) {
  const text = (size: number, line: number, weight: 500 | 600, colour: string) =>
    ({ fontFamily: "Barlow", fontSize: size, lineHeight: `${line}px`, fontWeight: weight, color: tokenColour(colour) }) as const;
  const meta = preview.badge === "Meta pick";
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: tokenColour("bg-page") }}>
      <img src={face} alt="" width={630} height={630} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: 570, height: 630, padding: "44px 48px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={mark} alt="" width={33.33} height={32} />
          <img src={wordmark} alt="" width={146.48} height={20.6} />
        </div>
        <div style={{ display: "flex", flexGrow: 1 }} />
        {preview.badge && (
          <div
            style={{
              ...text(28, meta ? 48 : 44, 600, meta ? "accent-on-fill" : "text-primary"),
              display: "flex",
              padding: "0 18px",
              borderRadius: 999,
              backgroundColor: tokenColour(meta ? "accent-fill" : "bg-raised"),
              border: meta ? "none" : `2px solid ${tokenColour("border-strong")}`,
              marginBottom: 16,
            }}
          >
            {preview.badge}
          </div>
        )}
        <div
          style={{
            display: "flex",
            fontFamily: "Barlow Condensed",
            fontWeight: 800,
            fontSize: 88,
            lineHeight: "84px",
            color: tokenColour("text-primary"),
            textTransform: "uppercase",
          }}
        >
          {preview.title}
        </div>
        <div style={{ ...text(32, 44, 500, "text-secondary"), display: "flex", flexDirection: "column", marginTop: 16 }}>
          {preview.lines.map((line) => (
            <div key={line} style={{ display: "flex" }}>
              {line}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexGrow: 1 }} />
        <div style={{ ...text(28, 40, 600, "accent-text"), display: "flex" }}>{preview.domain}</div>
        {preview.versionTag && <div style={{ ...text(24, 32, 500, "text-muted"), display: "flex" }}>{preview.versionTag}</div>}
      </div>
    </div>
  );
}
