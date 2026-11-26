import { describe, expect, it } from "vitest";
import { validateFace, type Context } from "@/lib/content/validate";
import faceGood from "../fixtures/face-good.json";

// Figma's sample faces (D-107, D-108): a draft with `"sample": { "place": n }` (its place in Figma's library) may show
// Figma's stand-in picture, kept under sample/faces/. Never a published face, and never a face that isn't a sample
// (FORMAT §Face recipe).
const ctx: Context = {
  archetypeIds: new Set(["spark"]),
  creatorIds: new Set(["test-creator"]),
  buildIds: new Set(["test-spark-build"]),
  faceIds: new Set(),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function changed<T>(fixture: T, change: (copy: any) => void): T {
  const copy = structuredClone(fixture);
  change(copy);
  return copy;
}
const problems = (data: unknown) => validateFace("faces/x.json", data, ctx).map((p) => [p.path, p.message]);
const STAND_IN = { file: "sample/faces/test-footballer-2010.webp", alt: "Stand-in picture", by: "Test Channel" };

/** The good fixture as a draft sample face showing a stand-in picture. */
const sampled = (change: (copy: any) => void = () => {}) => // eslint-disable-line @typescript-eslint/no-explicit-any
  changed(faceGood, (f) => {
    f.status = "draft";
    f.sample = { place: 1 };
    f.screenshots = [{ ...STAND_IN }];
    change(f);
  });

describe("validateFace sample faces (D-107, D-108)", () => {
  it("passes a draft sample face whose picture is a stand-in under sample/faces/", () => {
    expect(problems(sampled())).toEqual([]);
  });

  it("still passes a sample face's own captures under faces/", () => {
    expect(problems(sampled((f) => (f.screenshots = faceGood.screenshots)))).toEqual([]);
  });

  it("fails a published face marked as a sample", () => {
    expect(problems(sampled((f) => (f.status = "published")))).toContainEqual(["sample", "published but is still a sample (D-107)"]);
  });

  it("fails a sample that isn't an object with a place from 1", () => {
    for (const value of [true, "yes", 1, null]) {
      expect(problems(sampled((f) => (f.sample = value)))).toContainEqual(["sample", "must be an object"]);
    }
    for (const place of [0, 1.5, "1", null]) {
      expect(problems(sampled((f) => (f.sample.place = place))).map(([path]) => path)).toEqual(["sample.place"]);
    }
  });

  it("fails a stand-in picture on a face that isn't a sample", () => {
    const bad = changed(faceGood, (f) => {
      f.status = "draft";
      f.screenshots = [{ ...STAND_IN }];
    });
    expect(problems(bad)).toEqual([["screenshots[0].file", 'must be a file under "faces/"']]);
  });

  it("keeps the folder rule for a sample: no other folder, no climbing out", () => {
    for (const file of ["builds/x.webp", "sample/faces/../../x.webp", "sample/x.webp"]) {
      expect(problems(sampled((f) => (f.screenshots[0].file = file)))).toEqual([
        ["screenshots[0].file", 'must be a file under "faces/" or "sample/faces/"'],
      ]);
    }
  });
});
