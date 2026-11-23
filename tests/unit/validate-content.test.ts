import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { validateDir } from "../../scripts/validate-content.mjs";

// The rules themselves are tested in tests/unit/content/validate.test.ts and load.test.ts; this covers
// the build-time wrapper: reading content/, catching broken JSON, and the "file path: message" lines it prints.
describe("scripts/validate-content.mjs", () => {
  it("passes every file in content/ today", () => {
    expect(validateDir(join(import.meta.dirname, "..", "..", "content"))).toEqual([]);
  });

  it("reports a file that isn't valid JSON, and a problem in a valid one, with file and field", () => {
    const dir = mkdtempSync(join(tmpdir(), "content-"));
    mkdirSync(join(dir, "changelog"));
    writeFileSync(join(dir, "changelog", "broken.json"), "{ not json");
    writeFileSync(join(dir, "notes.json"), "{}");
    const lines = validateDir(dir);
    rmSync(dir, { recursive: true, force: true });
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatch(/^changelog\/broken\.json: not valid JSON/);
    expect(lines[1]).toBe("notes.json: not a known content file (FORMAT.md)");
  });

  it("fails a published face that pairs a withdrawn build (D-10), not only bad fields", () => {
    const fixtures = join(import.meta.dirname, "fixtures", "content");
    const dir = mkdtempSync(join(tmpdir(), "content-"));
    cpSync(join(fixtures, "good"), dir, { recursive: true });
    cpSync(join(fixtures, "bad", "withdrawn-paired-build"), dir, { recursive: true });
    const lines = validateDir(dir);
    rmSync(dir, { recursive: true, force: true });
    expect(lines).toContain('faces/test-footballer-2010.json pairedBuild: build "test-spark-build" is withdrawn, so nothing may link to it (D-10)');
  });
});
