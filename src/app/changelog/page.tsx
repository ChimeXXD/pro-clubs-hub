import { join } from "node:path";
import type { Metadata } from "next";
import { ChangelogView } from "@/components/changelog/ChangelogView";
import { PageContent } from "@/components/ui/PageContent";
import type { ChangelogItem } from "@/lib/changelog";
import { loadContent } from "@/lib/content/load";
import { CURRENT_SEASON, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = { title: `Changelog · ${SITE_NAME}` };

// Published entries only, newest first (the loader drops drafts and withdrawn ones; D-06, rule 8).
export default function ChangelogPage() {
  const { changelog } = loadContent(join(process.cwd(), "content"));
  const items: ChangelogItem[] = changelog.map((e) => ({
    id: e.id,
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
