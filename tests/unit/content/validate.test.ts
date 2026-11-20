import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { validateAll, validateBuild, validateFace, type Context } from "@/lib/content/validate";
import faceGood from "../fixtures/face-good.json";
import buildGood from "../fixtures/build-good.json";

const ROOT = join(import.meta.dirname, "..", "..", "..");
const read = (path: string): unknown => JSON.parse(readFileSync(join(ROOT, path), "utf8"));
const ctx: Context = {
  archetypeIds: new Set(["spark", "finisher"]),
  creatorIds: new Set(["test-creator"]),
  buildIds: new Set(["test-spark-build"]),
  faceIds: new Set(),
};

/** A deep copy of a fixture with one change applied, so each bad case breaks exactly one rule. */
// `any` on purpose: the bad cases write values of the wrong type into the fixture.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function changed<T>(fixture: T, change: (copy: any) => void): T {
  const copy = structuredClone(fixture);
  change(copy);
  return copy;
}
const messages = (problems: { message: string }[]) => problems.map((p) => p.message);

describe("validateFace", () => {
  it("passes a complete published face", () => {
    expect(validateFace("faces/x.json", faceGood, ctx)).toEqual([]);
  });

  it("fails PLACEHOLDER in a published face, naming where", () => {
    const bad = changed(faceGood, (f) => (f.sculpt.steps[0].sliders[1].value = "PLACEHOLDER"));
    expect(validateFace("faces/x.json", bad, ctx)).toEqual([
      { file: "faces/x.json", path: "sculpt.steps[0].sliders[1].value", message: 'published but holds "PLACEHOLDER"' },
    ]);
  });

  it("lets a draft hold PLACEHOLDER where Chime records values", () => {
    const draft = changed(faceGood, (f) => {
      f.status = "draft";
      f.preset.number = "PLACEHOLDER";
      f.parts[1].steps[0].value.number = "PLACEHOLDER";
    });
    expect(validateFace("faces/x.json", draft, ctx)).toEqual([]);
  });

  it("fails _example in a published face", () => {
    const bad = changed(faceGood, (f) => (f._example = "why"));
    expect(messages(validateFace("faces/x.json", bad, ctx))).toContain("published but still has _example");
  });

  it("fails a deceased subject no decision allows (D-10)", () => {
    const bad = changed(faceGood, (f) => (f.subject.living = false));
    expect(messages(validateFace("faces/x.json", bad, ctx))).toContain(
      "a deceased subject needs a decision allowing them by name (D-10, D-26)",
    );
  });

  it("passes Michael Jackson, allowed by name (D-26)", () => {
    const mj = changed(faceGood, (f) => {
      f.subject = { name: "Michael Jackson", kind: "musician", living: false };
      f.title = "Inspired by Michael Jackson";
    });
    expect(validateFace("faces/x.json", mj, ctx)).toEqual([]);
  });

  it("allows only the exact name D-26 names", () => {
    const near = changed(faceGood, (f) => {
      f.subject = { name: "michael jackson", kind: "musician", living: false };
      f.title = "Inspired by Michael Jackson";
    });
    expect(messages(validateFace("faces/x.json", near, ctx))).toContain(
      "a deceased subject needs a decision allowing them by name (D-10, D-26)",
    );
  });

  it("fails a subject whose living is missing, even an allowed name", () => {
    const bad = changed(faceGood, (f) => {
      f.subject = { name: "Michael Jackson", kind: "musician" };
      f.title = "Inspired by Michael Jackson";
    });
    expect(validateFace("faces/x.json", bad, ctx).map((p) => p.path)).toContain("subject.living");
  });

  it("fails a face without a made-by credit (D-08)", () => {
    const bad = changed(faceGood, (f) => (f.credits = f.credits.filter((c: { role: string }) => c.role !== "made-by")));
    expect(messages(validateFace("faces/x.json", bad, ctx))).toContain('needs at least one "made-by" credit (D-08)');
  });

  it("fails a title that doesn't start with \"Inspired by\"", () => {
    const bad = changed(faceGood, (f) => (f.title = "Official Test Footballer face"));
    expect(messages(validateFace("faces/x.json", bad, ctx))).toContain('must start with "Inspired by"');
  });

  it("fails a value kind the format doesn't have", () => {
    const bad = changed(faceGood, (f) => (f.parts[1].steps[0].value = { kind: "notch", position: 3, of: 10 }));
    expect(validateFace("faces/x.json", bad, ctx)).toEqual([
      { file: "faces/x.json", path: "parts[1].steps[0].value.kind", message: 'must be one of item, named, position, got "notch"' },
    ]);
  });

  it("fails a Sculpt slider outside 0 to 100", () => {
    const bad = changed(faceGood, (f) => (f.sculpt.steps[0].sliders[0].value = 101));
    expect(messages(validateFace("faces/x.json", bad, ctx))).toContain("must be a whole number from 0 to 100");
  });

  it("fails part tabs out of the game's order", () => {
    const bad = changed(faceGood, (f) => f.parts.reverse());
    expect(messages(validateFace("faces/x.json", bad, ctx))).toContain("tabs must be skin, head, face, hair in that order");
  });

  it("fails an embed with no matching tutorial credit (D-08)", () => {
    const bad = changed(faceGood, (f) => (f.credits = f.credits.filter((c: { role: string }) => c.role !== "tutorial")));
    expect(messages(validateFace("faces/x.json", bad, ctx))).toContain('needs a "tutorial" credit for test-creator');
  });

  it("fails a pairedBuild that isn't a build in content/", () => {
    const bad = changed(faceGood, (f) => (f.pairedBuild = "no-such-build"));
    expect(messages(validateFace("faces/x.json", bad, ctx))).toEqual(['unknown build "no-such-build"']);
  });

  it("fails a date that isn't a real day", () => {
    const bad = changed(faceGood, (f) => (f.versionTag.verifiedOn = "2026-02-30"));
    expect(messages(validateFace("faces/x.json", bad, ctx))).toEqual(["must be a date like 2026-11-20"]);
  });

  it("fails a link that isn't http(s)", () => {
    const bad = changed(faceGood, (f) => (f.credits[1].url = "javascript:alert(1)"));
    expect(messages(validateFace("faces/x.json", bad, ctx))).toEqual(["must be a web link starting with https://"]);
  });

  it("fails a title that says official, even after \"Inspired by\"", () => {
    const bad = changed(faceGood, (f) => (f.title = "Inspired by Test Footballer, the official 2010 look"));
    expect(messages(validateFace("faces/x.json", bad, ctx))).toEqual(['must never say "official" (CLAUDE.md rule 3)']);
  });

  it("fails a version with no history line", () => {
    const bad = changed(faceGood, (f) => (f.version = 2));
    expect(messages(validateFace("faces/x.json", bad, ctx))).toEqual(["needs a line for the current version"]);
  });

  it("fails a position value on a part other than Skin Tone", () => {
    const bad = changed(faceGood, (f) => (f.parts[1].steps[0].value = { kind: "position", percent: 30 }));
    expect(messages(validateFace("faces/x.json", bad, ctx))).toEqual(['only "skin-tone" takes a position']);
  });

  it("fails an unknown creator id", () => {
    const bad = changed(faceGood, (f) => (f.embeds[0].creatorId = "nobody"));
    expect(messages(validateFace("faces/x.json", bad, ctx))).toContain('unknown creator "nobody"');
  });
});

describe("validateBuild", () => {
  it("passes a complete published build", () => {
    expect(validateBuild("builds/x.json", buildGood, ctx)).toEqual([]);
  });

  it("fails an archetype that isn't in archetypes/fc27.json", () => {
    const bad = changed(buildGood, (b) => (b.archetype = "engine"));
    expect(validateBuild("builds/x.json", bad, ctx)).toEqual([
      { file: "builds/x.json", path: "archetype", message: 'unknown archetype "engine"' },
    ]);
  });

  it("fails a position the game doesn't have", () => {
    const bad = changed(buildGood, (b) => (b.positions = ["RW", "WF"]));
    expect(messages(validateBuild("builds/x.json", bad, ctx))).toContain('"WF" is not a position');
  });

  it("fails a status that isn't draft, published or withdrawn", () => {
    const bad = changed(buildGood, (b) => (b.status = "Published"));
    expect(messages(validateBuild("builds/x.json", bad, ctx))).toContain('must be one of draft, published, withdrawn, got "Published"');
  });
});

describe("validateAll on the real content/ folder", () => {
  const files = [
    "content/archetypes/fc27.json",
    "content/creators.json",
    "content/builds/spark-2008-winger.json",
    "content/faces/cristiano-ronaldo-2008.json",
    "content/changelog/2026-09-25-launch.json",
    "content/changelog/2026-10-22-archetype-update.json",
    "content/changelog/2026-11-10-title-update-1-2-0.json",
  ].map((path) => ({ path: path.replace("content/", ""), data: read(path) }));

  it("passes every file as it is today (the examples are drafts)", () => {
    expect(validateAll(files)).toEqual([]);
  });

  it("fails both example files if they are marked published", () => {
    const published = files.map((f) =>
      f.path.startsWith("faces/") || f.path.startsWith("builds/") ? { ...f, data: { ...(f.data as object), status: "published" } } : f,
    );
    const failing = new Set(validateAll(published).map((p) => p.file));
    expect(failing).toEqual(new Set(["builds/spark-2008-winger.json", "faces/cristiano-ronaldo-2008.json"]));
  });
});
