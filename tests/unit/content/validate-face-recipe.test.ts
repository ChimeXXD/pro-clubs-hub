import { describe, expect, it } from "vitest";
import { validateFace, type Context } from "@/lib/content/validate";
import faceGood from "../fixtures/face-good.json";

// Figma's sample recipe (D-107): what the face page frames draw (353:1410, 353:1524, 353:1648), kept on a sample face as
// `sample.recipe`: each section's values and screens, and the drawn screens by step. Drafts only (FORMAT §Face recipe).
const ctx: Context = {
  archetypeIds: new Set(["spark"]),
  creatorIds: new Set(["test-creator"]),
  buildIds: new Set(["test-spark-build"]),
  faceIds: new Set(),
};

const RECIPE = {
  sections: [
    { name: "Preset", values: 1, screens: 1 },
    { name: "Skin", values: 4, screens: 1 },
    { name: "Sculpt", values: 24, screens: 12 },
  ],
  screens: [
    { step: 1, where: "Head › Presets", title: "Pick the preset", values: [{ label: "Preset", value: "147" }], hint: "Count.", next: "Customize › Skin · 4 values" },
    {
      step: 6,
      where: "Sculpt › Shape › Skeletal",
      title: "Eyes · Eyelid Upper",
      values: [
        { label: "Down ← → Up", value: "62" },
        { label: "Narrow ← → Widen", value: "48" },
      ],
      hint: "Symmetry on.",
      next: null,
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withRecipe = (change: (recipe: any, face: any) => void = () => {}) => {
  const f = structuredClone(faceGood) as Record<string, unknown>;
  f.status = "draft";
  const recipe = structuredClone(RECIPE);
  f.sample = { place: 1, recipe };
  change(recipe, f);
  return f;
};
const problems = (data: unknown) => validateFace("faces/x.json", data, ctx).map((p) => [p.path, p.message]);
const paths = (data: unknown) => problems(data).map(([path]) => path);

describe("validateFace sample recipe (D-107)", () => {
  it("passes Figma's sample recipe on a draft sample face", () => {
    expect(problems(withRecipe())).toEqual([]);
  });

  it("is optional: a sample face without a recipe still passes", () => {
    expect(problems(withRecipe((_, f) => (f.sample = { place: 1 })))).toEqual([]);
  });

  it("fails sections out of the game's order, unknown or listed twice", () => {
    expect(paths(withRecipe((r) => r.sections.reverse()))).toContain("sample.recipe.sections");
    expect(paths(withRecipe((r) => (r.sections[1].name = "Body")))).toContain("sample.recipe.sections[1].name");
    expect(paths(withRecipe((r) => r.sections.push({ name: "Sculpt", values: 1, screens: 1 })))).toContain("sample.recipe.sections");
  });

  it("fails a section with no values, no screens, or more screens than values", () => {
    expect(paths(withRecipe((r) => (r.sections[0].values = 0)))).toContain("sample.recipe.sections[0].values");
    expect(paths(withRecipe((r) => (r.sections[0].screens = 0)))).toContain("sample.recipe.sections[0].screens");
    expect(paths(withRecipe((r) => (r.sections[1].screens = 5)))).toContain("sample.recipe.sections[1].screens");
  });

  it("fails a screen outside the recipe's steps, or out of order", () => {
    // 14 screens in all, so step 15 is past the end.
    expect(paths(withRecipe((r) => (r.screens[1].step = 15)))).toContain("sample.recipe.screens[1].step");
    expect(paths(withRecipe((r) => (r.screens[1].step = 1)))).toContain("sample.recipe.screens[1].step");
  });

  it("fails a screen with more values than its section has, or none", () => {
    expect(paths(withRecipe((r) => r.screens[0].values.push({ label: "Two", value: "2" })))).toContain("sample.recipe.screens[0].values");
    expect(paths(withRecipe((r) => (r.screens[0].values = [])))).toContain("sample.recipe.screens[0].values");
  });

  it("fails empty text on a screen", () => {
    for (const key of ["where", "title", "hint"]) {
      expect(paths(withRecipe((r) => (r.screens[0][key] = "")))).toContain(`sample.recipe.screens[0].${key}`);
    }
    expect(paths(withRecipe((r) => (r.screens[0].values[0].value = "")))).toContain("sample.recipe.screens[0].values[0].value");
    expect(paths(withRecipe((r) => (r.screens[0].next = 3)))).toContain("sample.recipe.screens[0].next");
  });
});

describe("validateFace sample face of the week (Figma Home 364:2141)", () => {
  it("passes a sample marked as Figma's face of the week, and fails anything but true or false", () => {
    expect(problems(withRecipe((_, f) => (f.sample.faceOfTheWeek = true)))).toEqual([]);
    expect(paths(withRecipe((_, f) => (f.sample.faceOfTheWeek = "yes")))).toEqual(["sample.faceOfTheWeek"]);
  });
});
