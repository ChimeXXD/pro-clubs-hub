// Content check run before every build and in CI (A-02, CLAUDE.md rule 6).
// Phase 0 checks only what FORMAT says of every file: it parses as JSON, and a "published" file holds
// no "PLACEHOLDER" and no _example. The full field-by-field validator (src/lib/content/validate.ts,
// test-first) replaces this in Phase 1.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const CONTENT = join(import.meta.dirname, "..", "content");

function holdsPlaceholder(value) {
  if (value === "PLACEHOLDER") return true;
  if (Array.isArray(value)) return value.some(holdsPlaceholder);
  if (value && typeof value === "object") return Object.values(value).some(holdsPlaceholder);
  return false;
}

const STATUSES = ["draft", "published", "withdrawn"]; // FORMAT §Status

/** Problems with one parsed content file; `name` is its path under content/. */
export function problemsIn(name, data) {
  // A mistyped status ("Published") would otherwise skip every check below.
  if (data && typeof data === "object" && "status" in data && !STATUSES.includes(data.status)) {
    return [`${name}: status ${JSON.stringify(data.status)} is not one of ${STATUSES.join(", ")}`];
  }
  if (data?.status !== "published") return [];
  const problems = [];
  if (holdsPlaceholder(data)) problems.push(`${name}: published but contains "PLACEHOLDER"`);
  if ("_example" in data) problems.push(`${name}: published but still has _example`);
  return problems;
}

/** Problems with every .json file under `dir`. */
export function validateDir(dir) {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => join(entry.parentPath, entry.name))
    .flatMap((path) => {
      const name = relative(dir, path);
      try {
        return problemsIn(name, JSON.parse(readFileSync(path, "utf8")));
      } catch (error) {
        return [`${name}: not valid JSON (${error.message})`];
      }
    });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problems = validateDir(CONTENT);
  if (problems.length > 0) {
    console.error("validate-content: " + problems.length + " problem(s)\n" + problems.join("\n"));
    process.exit(1);
  }
  console.log("validate-content: every file in content/ passes the Phase 0 checks");
}
