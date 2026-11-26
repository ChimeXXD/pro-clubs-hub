import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { FacesView } from "@/components/faces/FacesView";
import { siteContent } from "@/lib/content/site-content";
import { faceCards } from "@/lib/faces";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = { title: `Faces · ${SITE_NAME}` };

// The Faces library (Figma 333:1139 / 345:1310 / 345:1391; D-70). Preview only (D-105) until faces are published:
// rename this file to page.tsx to put it on probuilds.club. A face's picture shows only when its file is in public/;
// today the faces are Figma's samples with its stand-in pictures (D-107, D-108).
const publicDir = join(process.cwd(), "public");

export default function FacesPage() {
  const cards = faceCards(siteContent().faces, (file) => existsSync(join(publicDir, file)));
  return <FacesView cards={cards} />;
}
