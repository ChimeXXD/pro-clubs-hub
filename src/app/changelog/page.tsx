import type { Metadata } from "next";
import { ChangelogView } from "@/components/changelog/ChangelogView";
import { PageContent } from "@/components/ui/PageContent";
import type { ChangelogItem } from "@/lib/changelog";
import { siteContent } from "@/lib/content/site-content";
import { CURRENT_SEASON, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = { title: `Changelog · ${SITE_NAME}` };

// Published entries, newest first; the preview site adds drafts, marked. Withdrawn never shows (D-06, rule 8).
export default function ChangelogPage() {
  const { changelog } = siteContent();
  const items: ChangelogItem[] = changelog.map((e) => ({
    id: e.id,
    draft: e.status === "draft",
    date: e.date,
    kind: e.kind,
    season: e.season,
    title: e.title,
    changes: e.changes,
    source: { title: e.source.title, url: e.source.url },
    updated: [...e.affects.builds.map((b) => b.title), ...e.affects.faces.map((f) => f.title)],
  }));
  return (
    <PageContent>
      <ChangelogView items={items} currentSeason={CURRENT_SEASON} />
    </PageContent>
  );
}
