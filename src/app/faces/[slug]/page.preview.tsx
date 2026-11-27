import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FacePageView } from "@/components/faces/FacePageView";
import { siteContent } from "@/lib/content/site-content";
import { facePageView } from "@/lib/face-view";
import { SITE_NAME } from "@/lib/site";

// The face page (Figma "Phase 2 · Faces": 353:1410 / 427:8649 / 427:8767 and its states; D-71 to D-74, D-79). Preview
// only (D-105) until faces are published: rename this file to page.tsx to put it on probuilds.club. Today the faces are
// Figma's five samples with its sample recipe and stand-in pictures (D-107, D-108).
const publicDir = join(process.cwd(), "public");
const faceBySlug = (slug: string) => siteContent().faces.find((f) => f.slug === slug);

export const dynamicParams = false;

export function generateStaticParams() {
  return siteContent().faces.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const face = faceBySlug((await params).slug);
  return { title: face ? `${face.title} · ${SITE_NAME}` : SITE_NAME };
}

export default async function FacePage({ params }: { params: Promise<{ slug: string }> }) {
  const face = faceBySlug((await params).slug);
  if (!face) notFound();
  return <FacePageView view={facePageView(face, (file) => existsSync(join(publicDir, file)))} />;
}
