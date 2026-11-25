// Marks an item that is still a draft. Shown only on the preview site, where drafts are listed (src/lib/drafts.ts).
export function DraftTag() {
  return <span className="type-caption rounded-full bg-status-warning-bg px-2.5 py-0.5 text-status-warning">Draft</span>;
}
