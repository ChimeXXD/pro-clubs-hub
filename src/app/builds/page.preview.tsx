import type { Metadata } from "next";
import { BuildsView } from "@/components/builds/BuildsView";
import { archetypeViews } from "@/lib/builds";
import { siteContent } from "@/lib/content/site-content";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = { title: `Builds · ${SITE_NAME}` };

// The archetype picker (Figma 241:556 / 279:1399 / 276:1073; D-57, D-60). Preview only for now (D-105); its emblems
// ship since D-106. Rename this file to page.tsx to put the page on probuilds.club.
export default function BuildsPage() {
  const { archetypeFile } = siteContent();
  return <BuildsView archetypes={archetypeViews(archetypeFile)} />;
}
