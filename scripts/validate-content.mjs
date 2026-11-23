// Content check run before every build and in CI (A-02, CLAUDE.md rule 6): loads content/ with
// src/lib/content/load.ts, which validates every file field by field against docs/FORMAT.md and then
// checks that published content links only to published content. One problem fails the build.
// Node runs the TypeScript modules by stripping types.
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { ContentError, loadContent, problemLine } from "../src/lib/content/load.ts";

const CONTENT = join(import.meta.dirname, "..", "content");

/** Problems with every .json file under `dir`, as "file path: message" lines. */
export function validateDir(dir) {
  try {
    loadContent(dir);
    return [];
  } catch (error) {
    if (error instanceof ContentError) return error.problems.map(problemLine);
    throw error;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problems = validateDir(CONTENT);
  if (problems.length > 0) {
    console.error(`validate-content: ${problems.length} problem(s)\n${problems.join("\n")}`);
    process.exit(1);
  }
  console.log("validate-content: every file in content/ passes docs/FORMAT.md");
}
