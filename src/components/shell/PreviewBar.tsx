import { SHOW_DRAFTS } from "@/lib/drafts";
import { SITE_DOMAIN } from "@/lib/site";

// On the preview site only: says so, so nobody takes a draft for the live site (probuilds.club never shows this).
export function PreviewBar() {
  if (!SHOW_DRAFTS) return null;
  return (
    <p data-testid="preview-bar" className="type-caption bg-status-warning-bg px-5 py-2 text-center text-status-warning">
      Preview: drafts are shown and marked Draft. The live site is {SITE_DOMAIN}.
    </p>
  );
}
