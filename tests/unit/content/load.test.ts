import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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

/** The good tree, with one bad case copied over it if named, in a temporary folder. */
function goodWith(bad?: string): string {
  const dir = mkdtempSync(join(tmpdir(), "load-"));
  temp.push(dir);
  cpSync(GOOD, dir, { recursive: true });
  if (bad) cpSync(join(FIXTURES, "bad", bad), dir, { recursive: true });
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

  it("two files with one id, which would otherwise replace each other", () => {
    const dir = goodWith();
    mkdirSync(join(dir, "builds", "old"));
    cpSync(join(GOOD, "builds", "test-spark-build.json"), join(dir, "builds", "old", "test-spark-build.json"));
    expect(failures(dir)).toEqual(['builds/test-spark-build.json id: "test-spark-build" is used by another file']);
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

// Preview builds (Chime, 26 Nov: "all now, on a draft preview") show drafts too, marked as drafts on the page.
// Production never does; withdrawn content never shows anywhere (rule 8).
describe("loadContent with drafts, for the preview site", () => {
  it("adds drafts but never withdrawn content", () => {
    const content = loadContent(GOOD, { includeDrafts: true });
    const ids = [...content.builds, ...content.faces, ...content.changelog].map((i) => i.id);
    expect(ids).toEqual(expect.arrayContaining(["test-draft-build", "test-draft-face", "2026-12-10-test-draft"]));
    expect(ids).not.toContain("test-withdrawn-build");
    for (const item of [...content.builds, ...content.faces, ...content.changelog]) expect(item.status).not.toBe("withdrawn");
  });

  it("still lists only published content by default", () => {
    const content = loadContent(GOOD);
    const ids = [...content.builds, ...content.faces].map((i) => i.id);
    expect(ids).not.toContain("test-draft-build");
    expect(ids).not.toContain("test-draft-face");
  });

  it("still fails a published item that links to a draft, so publishing stays all-or-nothing", () => {
    const lines = (() => {
      try {
        loadContent(goodWith("draft-paired-build"), { includeDrafts: true });
      } catch (error) {
        if (error instanceof ContentError) return error.problems.map((p) => p.message);
      }
      return [];
    })();
    expect(lines.some((m) => m.includes("is a draft, so it has no page"))).toBe(true);
  });

  it("loads the real drafts: the sample build, its face and the changelog entries", () => {
    const content = loadContent(join(import.meta.dirname, "..", "..", "..", "content"), { includeDrafts: true });
    expect(content.builds.map((b) => b.id)).toContain("spark-2008-winger");
    expect(content.faces.find((f) => f.id === "cristiano-ronaldo-2008")?.pairedBuild.id).toBe("spark-2008-winger");
    expect(content.changelog.map((e) => e.id)).toEqual(
      expect.arrayContaining(["2026-09-25-launch", "2026-10-22-archetype-update", "2026-11-10-title-update-1-2-0"]),
    );
  });
});

describe("loadContent with drafts: a draft linking to withdrawn content", () => {
  it("leaves out a draft face whose build is withdrawn, and drops it from the draft entry that lists it", () => {
    const dir = goodWith();
    const file = join(dir, "faces", "test-draft-face.json");
    const face = JSON.parse(readFileSync(file, "utf8"));
    writeFileSync(file, JSON.stringify({ ...face, pairedBuild: "test-withdrawn-build" }));
    const content = loadContent(dir, { includeDrafts: true });
    expect(content.faces.map((f) => f.id)).not.toContain("test-draft-face");
    const entry = content.changelog.find((e) => e.id === "2026-12-10-test-draft");
    expect(entry?.affects.builds.map((b) => b.id)).not.toContain("test-withdrawn-build");
    expect(entry?.affects.faces.map((f) => f.id)).not.toContain("test-draft-face");
  });
});
