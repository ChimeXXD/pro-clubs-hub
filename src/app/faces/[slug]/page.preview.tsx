import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FacePageView } from "@/components/faces/FacePageView";
import { siteContent } from "@/lib/content/site-content";
import { faceOgView, OG_SIZE } from "@/lib/face-og";
import { facePageView } from "@/lib/face-view";
import { SITE_DOMAIN, SITE_NAME } from "@/lib/site";

// The face page (Figma "Phase 2 · Faces": 353:1410 / 427:8649 / 427:8767 and its states; D-71 to D-74, D-79). Preview
// only (D-105) until faces are published: rename this file to page.tsx to put it on probuilds.club. Today the faces are
// Figma's five samples with its sample recipe and stand-in pictures (D-107, D-108).
const publicDir = join(process.cwd(), "public");
const faceBySlug = (slug: string) => siteContent().faces.find((f) => f.slug === slug);

export const dynamicParams = false;

export function generateStaticParams() {
  return siteContent().faces.map((f) => ({ slug: f.slug }));
}

// The link preview (Figma 430:7306) is made at build time beside the page (./og.png). Chats need an absolute address:
// the preview deployment's own (Cloudflare Pages names it in CF_PAGES_URL), else probuilds.club. A main build also has a
// CF_PAGES_URL (its hashed *.pages.dev address), so main always names probuilds.club.
const siteUrl = () =>
  new URL(process.env.CF_PAGES_BRANCH !== "main" && process.env.CF_PAGES_URL ? process.env.CF_PAGES_URL : `https://${SITE_DOMAIN}`);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const face = faceBySlug((await params).slug);
  if (!face) return { title: SITE_NAME };
  const og = faceOgView(face);
  const image = { url: `/faces/${face.slug}/og.png`, width: OG_SIZE.width, height: OG_SIZE.height, alt: og.alt };
  const title = `${face.title} · ${SITE_NAME}`;
  return {
    metadataBase: siteUrl(),
    title,
    openGraph: { title, description: og.facts, images: [image], type: "article" },
    twitter: { card: "summary_large_image", title, description: og.facts, images: [image] },
  };
}

export default async function FacePage({ params }: { params: Promise<{ slug: string }> }) {
  const face = faceBySlug((await params).slug);
  if (!face) notFound();
  return <FacePageView view={facePageView(face, (file) => existsSync(join(publicDir, file)))} />;
}
