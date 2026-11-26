import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { validateArchetypeFile } from "@/lib/content/validate-other";
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
      f.title = "Michael Jackson";
    });
    expect(validateFace("faces/x.json", mj, ctx)).toEqual([]);
  });

  it("allows only the exact name D-26 names", () => {
    const near = changed(faceGood, (f) => {
      f.subject = { name: "michael jackson", kind: "musician", living: false };
      f.title = "Michael Jackson";
    });
    expect(messages(validateFace("faces/x.json", near, ctx))).toContain(
      "a deceased subject needs a decision allowing them by name (D-10, D-26)",
    );
  });

  it("fails a subject whose living is missing, even an allowed name", () => {
    const bad = changed(faceGood, (f) => {
      f.subject = { name: "Michael Jackson", kind: "musician" };
      f.title = "Michael Jackson";
    });
    expect(validateFace("faces/x.json", bad, ctx).map((p) => p.path)).toContain("subject.living");
  });

  it("fails a face without a made-by credit (D-08)", () => {
    const bad = changed(faceGood, (f) => (f.credits = f.credits.filter((c: { role: string }) => c.role !== "made-by")));
    expect(messages(validateFace("faces/x.json", bad, ctx))).toContain('needs at least one "made-by" credit (D-08)');
  });

  it("passes plain titles, with the look or era in them (D-69)", () => {
    for (const title of ["2010 Test Footballer", "Test Footballer (Mohawk)", "Test Footballer"]) {
      expect(validateFace("faces/x.json", changed(faceGood, (f) => (f.title = title)), ctx)).toEqual([]);
    }
  });

  it("fails a face with no title", () => {
    for (const title of ["", "  ", null]) {
      expect(validateFace("faces/x.json", changed(faceGood, (f) => (f.title = title)), ctx).map((p) => p.path)).toEqual(["title"]);
    }
  });

  it("passes each kind the library filters by, and fails any other (D-68)", () => {
    for (const kind of ["footballer", "athlete", "musician"]) {
      expect(validateFace("faces/x.json", changed(faceGood, (f) => (f.subject.kind = kind)), ctx)).toEqual([]);
    }
    const bad = changed(faceGood, (f) => (f.subject.kind = "actor"));
    expect(messages(validateFace("faces/x.json", bad, ctx))).toEqual(['must be one of footballer, athlete, musician, got "actor"']);
  });

  it("holds an athlete to the same living rule as everyone else (D-10)", () => {
    const bad = changed(faceGood, (f) => (f.subject = { ...f.subject, kind: "athlete", living: false }));
    expect(validateFace("faces/x.json", bad, ctx).map((p) => p.path)).toEqual(["subject.living"]);
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

  it("fails a title that says official, anywhere in it and in any case", () => {
    for (const title of ["Test Footballer, the official 2010 look", "Official Test Footballer"]) {
      const bad = changed(faceGood, (f) => (f.title = title));
      expect(messages(validateFace("faces/x.json", bad, ctx))).toEqual(['must never say "official" (CLAUDE.md rule 3, D-69)']);
    }
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

  it("fails an attribute the game doesn't have, so a typo can't ship", () => {
    const bad = changed(buildGood, (b) => (b.attributes[0].name = "Acceleraton"));
    expect(messages(validateBuild("builds/x.json", bad, ctx))).toEqual(['"Acceleraton" is not an attribute']);
  });

  it("fails an attribute listed twice, and a value over 99", () => {
    const bad = changed(buildGood, (b) => b.attributes.push({ name: "Acceleration", value: 100 }));
    expect(validateBuild("builds/x.json", bad, ctx).map((p) => [p.path, p.message])).toEqual([
      ["attributes[1].name", "is listed twice"],
      ["attributes[1].value", "must be a whole number from 0 to 99"],
    ]);
  });

  it("passes each badge, and fails one that isn't in the list (D-34, D-62)", () => {
    for (const badge of ["meta", "recommended", null]) {
      expect(validateBuild("builds/x.json", changed(buildGood, (b) => (b.badge = badge)), ctx)).toEqual([]);
    }
    const bad = changed(buildGood, (b) => (b.badge = "most-copied"));
    expect(validateBuild("builds/x.json", bad, ctx).map((p) => p.path)).toEqual(["badge"]);
  });

  it("fails a published Meta pick nobody has checked in game (D-30)", () => {
    const bad = changed(buildGood, (b) => {
      b.badge = "meta";
      b.versionTag.verifiedOn = null;
    });
    expect(messages(validateBuild("builds/x.json", bad, ctx))).toEqual(["a Meta pick must be checked in game (D-30)"]);
  });

  it("passes a picture under builds/ with its maker, and fails one from anywhere else (D-41)", () => {
    const picture = { file: "builds/test-spark-build.webp", alt: "Chime's Pro in FC 27", by: "Chime" };
    expect(validateBuild("builds/x.json", changed(buildGood, (b) => (b.picture = picture)), ctx)).toEqual([]);
    const bad = changed(buildGood, (b) => (b.picture = { ...picture, file: "https://example.com/a.png" }));
    expect(messages(validateBuild("builds/x.json", bad, ctx))).toEqual(['must be a file under "builds/"']);
  });

  it("fails a build missing one of the new fields, which are null when empty", () => {
    const bad = changed(buildGood, (b) => {
      delete b.badge;
      delete b.picture;
      delete b.spend;
    });
    expect(validateBuild("builds/x.json", bad, ctx).map((p) => p.path)).toEqual(["badge", "picture", "spend"]);
  });

  // The fixture's one attribute, Acceleration 90, as a spend order: 70 at the start, then 85, then 90 (D-43).
  const spend = {
    start: [{ name: "Acceleration", value: 70 }],
    startStars: { skillMoves: 4, weakFoot: 4 },
    steps: [
      { raise: "Acceleration", to: 85 },
      { raise: "Skill Moves", to: 5 },
      { raise: "Acceleration", to: 90 },
    ],
  };

  it("passes a spend order that ends on the build's own values", () => {
    expect(validateBuild("builds/x.json", changed(buildGood, (b) => (b.spend = spend)), ctx)).toEqual([]);
  });

  it("fails a spend order that ends somewhere else", () => {
    const bad = changed(buildGood, (b) => (b.spend = { ...spend, steps: spend.steps.slice(0, 2) }));
    expect(messages(validateBuild("builds/x.json", bad, ctx))).toEqual(["Acceleration ends at 85, but the build says 90"]);
  });

  it("fails a step that doesn't raise its value, or raises something with no starting value", () => {
    const bad = changed(buildGood, (b) => {
      b.spend = { ...spend, steps: [...spend.steps, { raise: "Acceleration", to: 90 }, { raise: "Agility", to: 80 }] };
    });
    expect(validateBuild("builds/x.json", bad, ctx).map((p) => [p.path, p.message])).toEqual([
      ["spend.steps[3].to", "must raise Acceleration above 90"],
      ["spend.steps[4].raise", '"Agility" has no starting value'],
    ]);
  });

  it("lets a draft hold PLACEHOLDER in a spend order without checking where it ends", () => {
    const draft = changed(buildGood, (b) => {
      b.status = "draft";
      b.spend = { ...spend, steps: [{ raise: "Acceleration", to: "PLACEHOLDER" }] };
    });
    expect(validateBuild("builds/x.json", draft, ctx)).toEqual([]);
  });

  it("fails a specialization the archetype doesn't have, once its list is recorded", () => {
    const known: Context = { ...ctx, specializations: new Map([["spark", new Set(["Joker"])]]) };
    const named = (name: string) => changed(buildGood, (b) => (b.specialization = name));
    expect(validateBuild("builds/x.json", named("Joker"), known)).toEqual([]);
    expect(messages(validateBuild("builds/x.json", named("Hunter"), known))).toEqual(['"Hunter" is not one of spark\'s specializations']);
    expect(validateBuild("builds/x.json", named("Hunter"), ctx)).toEqual([]);
  });
});

describe("validateFace turn frames (D-35)", () => {
  it("passes a turn, and null for a face with no clip yet", () => {
    for (const turn of [null, { folder: "faces/test-footballer-2010/turn", frames: 36, by: "Chime" }]) {
      expect(validateFace("faces/x.json", changed(faceGood, (f) => (f.turn = turn)), ctx)).toEqual([]);
    }
  });

  it("fails a turn outside faces/ or with too few frames to turn", () => {
    const bad = changed(faceGood, (f) => (f.turn = { folder: "../other", frames: 1, by: "Chime" }));
    expect(validateFace("faces/x.json", bad, ctx).map((p) => p.path)).toEqual(["turn.folder", "turn.frames"]);
  });
});

describe("validateArchetypeFile specializations (RESEARCH 10.4)", () => {
  const good = read("tests/unit/fixtures/content/good/archetypes/fc27.json");
  const withSpec = (spec: unknown) => changed(good, (f) => (f.archetypes[0].specializations = [spec]));
  const problems = (data: unknown) => validateArchetypeFile("archetypes/fc27.json", data);
  const joker = {
    name: "Joker",
    playStyle: "Whipped Pass",
    targets: [{ attribute: "Curve", value: 90 }],
    sourceIds: ["test-source"],
  };

  it("passes targets, and null targets when nobody has read them", () => {
    expect(problems(withSpec(joker))).toEqual([]);
    expect(problems(withSpec({ ...joker, targets: null }))).toEqual([]);
  });

  it("passes a target whose value isn't known yet", () => {
    expect(problems(withSpec({ ...joker, targets: [{ attribute: "Curve", value: null }] }))).toEqual([]);
  });

  it("fails a target that isn't an attribute, and a specialization with no source", () => {
    const bad = withSpec({ ...joker, targets: [{ attribute: "Curv", value: 90 }], sourceIds: [] });
    expect(problems(bad).map((p) => p.message)).toEqual(['"Curv" is not an attribute', "must have at least 1"]);
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
