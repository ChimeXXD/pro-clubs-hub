import { cpSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { ContentError, loadContent } from "@/lib/content/load";

// The good tree in fixtures/content/good is a whole content/ folder: published, draft and withdrawn
// builds and faces, two published changelog entries and a draft. Each folder in fixtures/content/bad
// holds only the files that replace good ones, so each bad case breaks exactly one link.
const FIXTURES = join(import.meta.dirname, "..", "fixtures", "content");
const GOOD = join(FIXTURES, "good");

const temp: string[] = [];
afterEach(() => temp.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true })));

/** The good tree with one bad case copied over it, in a temporary folder. */
function goodWith(bad: string): string {
  const dir = mkdtempSync(join(tmpdir(), "load-"));
  temp.push(dir);
  cpSync(GOOD, dir, { recursive: true });
  cpSync(join(FIXTURES, "bad", bad), dir, { recursive: true });
  return dir;
}

/** The "file path: message" lines a failing load reports. */
function failures(root: string): string[] {
  try {
    loadContent(root);
  } catch (error) {
    if (error instanceof ContentError) return error.problems.map((p) => `${p.file} ${p.path}: ${p.message}`);
    throw error;
  }
  throw new Error("expected loadContent to fail");
}

describe("loadContent on the good fixtures", () => {
  const content = loadContent(GOOD);

  it("keeps only published builds, faces and changelog entries", () => {
    expect(content.builds.map((b) => b.id)).toEqual(["test-spark-build"]);
    expect(content.faces.map((f) => f.id)).toEqual(["test-footballer-2010"]);
    expect(content.changelog.map((e) => e.id)).toEqual(["2026-12-03-test-season", "2026-10-22-test-update"]);
  });

  it("resolves a build's archetype to its entry in archetypes/fc27.json", () => {
    expect(content.builds[0]?.archetype).toMatchObject({ id: "spark", name: "Spark", positionGroup: "attacker" });
  });

  it("resolves a face's pairedBuild to the loaded build", () => {
    expect(content.faces[0]?.pairedBuild).toBe(content.builds[0]);
  });

  it("resolves credits and embeds to creators.json, and leaves null creatorIds as null", () => {
    const face = content.faces[0];
    expect(face?.credits.map((c) => c.creator?.name ?? null)).toEqual([null, "Test Channel"]);
    expect(face?.embeds[0]?.creator).toMatchObject({ id: "test-creator", name: "Test Channel" });
  });

  it("resolves changelog affects to the loaded builds and faces, newest entry first", () => {
    const [season] = content.changelog;
    expect(season?.affects.builds).toEqual([content.builds[0]]);
    expect(season?.affects.faces).toEqual([content.faces[0]]);
  });

  it("keeps the archetype file and the creators", () => {
    expect(content.archetypeFile.archetypes.map((a) => a.id)).toEqual(["spark", "finisher"]);
    expect(content.creators.map((c) => c.id)).toEqual(["test-creator"]);
  });
});

describe("loadContent fails the build on a broken link, naming the file and field", () => {
  it("a published face pairing a withdrawn build, and a changelog entry listing it (D-10)", () => {
    expect(failures(goodWith("withdrawn-paired-build"))).toEqual([
      'changelog/2026-12-03-test-season.json affects.builds[0]: build "test-spark-build" is withdrawn, so nothing may link to it (D-10)',
      'faces/test-footballer-2010.json pairedBuild: build "test-spark-build" is withdrawn, so nothing may link to it (D-10)',
    ]);
  });

  it("a published face pairing a draft build", () => {
    expect(failures(goodWith("draft-paired-build"))).toEqual([
      'changelog/2026-12-03-test-season.json affects.builds[0]: build "test-spark-build" is a draft, so it has no page',
      'faces/test-footballer-2010.json pairedBuild: build "test-spark-build" is a draft, so it has no page',
    ]);
  });

  it("a changelog entry listing a withdrawn face", () => {
    expect(failures(goodWith("withdrawn-face-in-changelog"))).toEqual([
      'changelog/2026-12-03-test-season.json affects.faces[0]: face "test-footballer-2010" is withdrawn, so nothing may link to it (D-10)',
    ]);
  });

  it("a pairedBuild with no build", () => {
    expect(failures(goodWith("missing-paired-build"))).toEqual([
      'faces/test-footballer-2010.json pairedBuild: unknown build "no-such-build"',
    ]);
  });

  it("an unknown archetype", () => {
    expect(failures(goodWith("unknown-archetype"))).toEqual(['builds/test-spark-build.json archetype: unknown archetype "engine"']);
  });

  it("an unknown creatorId", () => {
    expect(failures(goodWith("unknown-creator"))).toEqual([
      'faces/test-footballer-2010.json credits[1].creatorId: unknown creator "nobody"',
      'faces/test-footballer-2010.json embeds[0].creatorId: unknown creator "nobody"',
    ]);
  });

  it("a file that isn't valid JSON, and the link to it that no longer resolves", () => {
    const lines = failures(goodWith("broken-json"));
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatch(/^faces\/test-footballer-2010\.json : not valid JSON/);
    expect(lines[1]).toBe('changelog/2026-12-03-test-season.json affects.faces[0]: unknown face "test-footballer-2010"');
  });

  it("puts every problem in the error message, one per line", () => {
    expect(() => loadContent(goodWith("unknown-archetype"))).toThrow(
      'content: 1 problem(s)\nbuilds/test-spark-build.json archetype: unknown archetype "engine"',
    );
  });
});

describe("loadContent on the real content/ folder", () => {
  it("loads today's files without a problem, and builds only what is published", () => {
    const content = loadContent(join(import.meta.dirname, "..", "..", "..", "content"));
    expect(content.archetypeFile.archetypes).toHaveLength(13);
    for (const item of [...content.builds, ...content.faces, ...content.changelog]) expect(item.status).toBe("published");
  });
});
