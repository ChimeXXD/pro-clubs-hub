import { join } from "node:path";
import { SHOW_DRAFTS } from "../drafts.ts";
import { type Content, loadContent } from "./load.ts";

let cached: Content | undefined;

const load = () => loadContent(join(process.cwd(), "content"), { includeDrafts: SHOW_DRAFTS });

/** The site's content: published only, plus drafts on the preview site. Read once per build; `npm run dev` re-reads it so content edits show. */
export function siteContent(): Content {
  if (process.env.NODE_ENV !== "production") return load();
  cached ??= load();
  return cached;
}
