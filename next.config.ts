import type { NextConfig } from "next";
import { showDrafts } from "./src/lib/drafts";

// Static export (D-11): `next build` writes the whole site to out/. No server code.
const nextConfig: NextConfig = {
  output: "export",
  // Screens still waiting on content or art are `page.preview.tsx`: built on the preview site only (D-104, D-105).
  // Renaming one to `page.tsx` puts it on probuilds.club.
  pageExtensions: showDrafts(process.env) ? ["preview.tsx", "tsx", "ts"] : ["tsx", "ts"],
  images: { unoptimized: true },
};

export default nextConfig;
