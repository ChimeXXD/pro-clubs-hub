import { existsSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { ImageResponse } from "next/og";
import { siteContent } from "@/lib/content/site-content";
import { faceOgView, OG_SIZE, tokenColour } from "@/lib/face-og";
import { ogFonts } from "@/lib/og-fonts";

// The face's link preview (Figma 430:7306, drawn at 600 × 315, made at 1200 × 630, so every size below is twice the
// frame's): the in-game face as a 630 px square on the left; on the right, 48 px in (44 top, 40 bottom), the logo,
// the lime "Face" tag, the name (Barlow Condensed ExtraBold 88/84, capitals), the facts (Barlow Medium 32/44), and at
// the foot the domain (Barlow SemiBold 28/40, lime) over the version tag (Barlow Medium 24/32, muted). Built once per
// face at build time (static export); preview only, like the face pages (D-105).
export const dynamic = "force-static";
export const dynamicParams = false;

const PUBLIC = join(process.cwd(), "public");
// No WebP: next/og can't draw it (face-og.ts picks a .jpg or .png).
const MIME: Record<string, string> = { ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };
const dataUrl = (file: string) => `data:${MIME[extname(file)] ?? "application/octet-stream"};base64,${readFileSync(join(PUBLIC, file)).toString("base64")}`;

export function generateStaticParams() {
  return siteContent().faces.map((f) => ({ slug: f.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const faces = siteContent().faces;
  const face = faces.find((f) => f.slug === slug);
  if (!face) return new Response("Not found", { status: 404 });
  const view = faceOgView(face, (file) => existsSync(join(PUBLIC, file)));
  // One font fetch per weight serves every face's image: the characters of all of them, names in capitals included,
  // so the text (and the font cache key) is the same for every face.
  const text = faces.map((f) => Object.values(faceOgView(f)).join("") + f.title.toUpperCase()).join("");
  const fonts = await ogFonts(text, [
    { family: "Barlow", weight: 500 },
    { family: "Barlow", weight: 600 },
    { family: "Barlow Condensed", weight: 800 },
  ]);
  const c = (name: string) => tokenColour(name);
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: c("bg/page") }}>
        {view.picture ? (
          // eslint-disable-next-line @next/next/no-img-element -- next/og draws plain <img>
          <img src={dataUrl(view.picture)} alt="" width={630} height={630} style={{ objectFit: "cover" }} />
        ) : (
          <div style={{ display: "flex", width: 630, height: 630, backgroundColor: c("bg/surface") }} />
        )}
        <div style={{ display: "flex", flexDirection: "column", width: 570, padding: "44px 48px 40px 48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- next/og draws plain <img> */}
            <img src={dataUrl("brand/logo-mark-on-dark.svg")} alt="" width={33.33} height={32} />
            {/* eslint-disable-next-line @next/next/no-img-element -- next/og draws plain <img> */}
            <img src={dataUrl("brand/logo-wordmark-on-dark.svg")} alt="" width={146.48} height={20.6} />
          </div>
          <div style={{ display: "flex", flexGrow: 1 }} />
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              height: 48,
              padding: "0 18px",
              borderRadius: 999,
              backgroundColor: c("accent/fill"),
              color: c("accent/on-fill"),
              fontFamily: "Barlow",
              fontWeight: 600,
              fontSize: 28,
              lineHeight: "48px",
            }}
          >
            {view.tag}
          </div>
          <div style={{ display: "flex", marginTop: 16, width: 474, color: c("text/primary"), fontFamily: "Barlow Condensed", fontWeight: 800, fontSize: 88, lineHeight: "84px" }}>
            {view.title.toUpperCase()}
          </div>
          <div style={{ display: "flex", marginTop: 16, width: 474, color: c("text/secondary"), fontFamily: "Barlow", fontWeight: 500, fontSize: 32, lineHeight: "44px" }}>
            {view.facts}
          </div>
          <div style={{ display: "flex", flexGrow: 1 }} />
          <div style={{ display: "flex", color: c("accent/text"), fontFamily: "Barlow", fontWeight: 600, fontSize: 28, lineHeight: "40px" }}>{view.domain}</div>
          <div style={{ display: "flex", color: c("text/muted"), fontFamily: "Barlow", fontWeight: 500, fontSize: 24, lineHeight: "32px" }}>{view.versionTag}</div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
