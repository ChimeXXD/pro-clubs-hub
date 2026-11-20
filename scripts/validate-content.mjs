// Content check run before every build and in CI (A-02, CLAUDE.md rule 6): reads every .json file
// in content/ and validates it with src/lib/content/validate.ts, field by field against
// docs/FORMAT.md. One problem fails the build. Node runs the TypeScript module by stripping types.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { validateAll } from "../src/lib/content/validate.ts";

const CONTENT = join(import.meta.dirname, "..", "content");

/** Problems with every .json file under `dir`, as "file path: message" lines. */
export function validateDir(dir) {
  const files = [];
  const problems = [];
  for (const entry of readdirSync(dir, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
    const path = relative(dir, join(entry.parentPath, entry.name));
    try {
      files.push({ path, data: JSON.parse(readFileSync(join(dir, path), "utf8")) });
    } catch (error) {
      problems.push({ file: path, path: "", message: `not valid JSON (${error.message})` });
    }
  }
  return [...problems, ...validateAll(files)].map((p) => `${p.file}${p.path ? ` ${p.path}` : ""}: ${p.message}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problems = validateDir(CONTENT);
  if (problems.length > 0) {
    console.error(`validate-content: ${problems.length} problem(s)\n${problems.join("\n")}`);
    process.exit(1);
  }
  console.log("validate-content: every file in content/ passes docs/FORMAT.md");
}
