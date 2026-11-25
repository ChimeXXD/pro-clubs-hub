// Whether this build shows drafts. Only the preview site does (Chime, 26 Nov: "all now, on a draft preview"):
// Cloudflare Pages builds every branch other than main as a preview and names it in CF_PAGES_BRANCH.
// PROBUILDS_DRAFTS=1 turns it on for a local build. main (probuilds.club) never shows drafts.
export function showDrafts(env: Record<string, string | undefined>): boolean {
  const branch = env.CF_PAGES_BRANCH;
  if (branch === "main") return false;
  return Boolean(branch) || env.PROBUILDS_DRAFTS === "1";
}

export const SHOW_DRAFTS = showDrafts(process.env);
