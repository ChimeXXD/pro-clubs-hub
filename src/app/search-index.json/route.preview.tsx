import { existsSync } from "node:fs";
import { join } from "node:path";
import { siteContent } from "@/lib/content/site-content";
import { searchIndex } from "@/lib/search";

// What the top bar's search panel searches on a computer (Command palette, motion-bookmarks #26): the Search page's
// own index (src/app/search), written once at build time as /search-index.json and fetched only when the top bar's
// search first opens, so no page carries it. Preview only, as the Search page is (D-105); a .tsx route so the
// preview's page extension picks it up.
export const dynamic = "force-static";

const publicDir = join(process.cwd(), "public");

export function GET() {
  return Response.json(searchIndex(siteContent(), (file) => existsSync(join(publicDir, file))));
}
