// Runs after every build (postbuild). Next copies all of public/ into out/, so Figma's stand-in face pictures
// (public/sample/, D-108) would be served by probuilds.club even though their draft faces are not. A build without
// drafts removes them: they show on the preview only.
// Node runs the TypeScript modules by stripping types.
import { rmSync } from "node:fs";
import { join } from "node:path";
import { showDrafts } from "../src/lib/drafts.ts";

if (!showDrafts(process.env)) rmSync(join(import.meta.dirname, "..", "out", "sample"), { recursive: true, force: true });
