import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadContent, type LoadedFace } from "@/lib/content/load";
import {
  faceRecipe,
  nextLine,
  nextStep,
  prevStep,
  progressKey,
  progressLabel,
  readProgress,
  screenAt,
  sectionBar,
} from "@/lib/face-page";

// The face page's rules (`/faces/[slug]`, Figma "Phase 2 · Faces": 353:1410, 353:1524, 353:1648, 372:1984, 372:2108;
// D-71 to D-74, D-79). One step is one game screen, in the game's order; the section bar weighs each section by its
// values; ticks live in the browser under face:<id>:v<version> (A-07).
const content = loadContent(join(process.cwd(), "content"), { includeDrafts: true });
const fixtures = loadContent(join(import.meta.dirname, "fixtures", "content", "good"), { includeDrafts: true });
const ronaldo = content.faces.find((f) => f.id === "cristiano-ronaldo-2008") as LoadedFace;
const fixture = fixtures.faces.find((f) => f.id === "test-footballer-2010") as LoadedFace;

describe("Figma's sample recipe (D-107)", () => {
  const recipe = faceRecipe(ronaldo);

  it("has 18 steps in seven sections, weighed by their values as the bar draws them", () => {
    expect(recipe.total).toBe(18);
    expect(recipe.sections.map((s) => [s.name, s.values, s.screens])).toEqual([
      ["Preset", 1, 1],
      ["Skin", 4, 1],
      ["Head", 3, 1],
      ["Face", 2, 1],
      ["Hair", 4, 1],
      ["Sculpt", 24, 12],
      ["Visual Age", 1, 1],
    ]);
  });

  it("draws step 1 (preset), step 2 (Skin) and step 9 (Sculpt) with Figma's values", () => {
    expect(screenAt(recipe, 1)).toMatchObject({
      section: "Preset",
      where: "Head › Presets",
      title: "Pick the preset",
      values: [{ label: "Preset", value: "147" }],
      hint: "Count photo presets only: left to right, top to bottom. Skip your own saved heads.",
    });
    expect(screenAt(recipe, 2)?.values.map((v) => [v.label, v.value])).toEqual([
      ["Complexion", "8"],
      ["Skin Surface", "33"],
      ["Scarring", "None"],
      ["Lip Makeup", "54"],
    ]);
    expect(screenAt(recipe, 9)).toMatchObject({
      section: "Sculpt",
      where: "Sculpt › Shape › Skeletal",
      title: "Eyes · Eyelid Upper",
      values: [
        { label: "Down ← → Up", value: "62" },
        { label: "Narrow ← → Widen", value: "48" },
      ],
      hint: "Symmetry on. Each slider runs 0 to 100.",
    });
  });

  it("walks from one drawn screen to the next, then to done (19)", () => {
    expect(nextStep(recipe, 1)).toBe(2);
    expect(nextStep(recipe, 2)).toBe(9);
    expect(nextStep(recipe, 9)).toBe(19);
    expect(prevStep(recipe, 9)).toBe(2);
    expect(prevStep(recipe, 2)).toBe(1);
    expect(prevStep(recipe, 1)).toBeNull();
  });

  it("labels the progress as Figma does", () => {
    expect(progressLabel(recipe, 1)).toBe("Step 1 of 18 · Preset");
    expect(progressLabel(recipe, 2)).toBe("Step 2 of 18 · Skin");
    expect(progressLabel(recipe, 9)).toBe("Step 9 of 18 · Sculpt");
    expect(progressLabel(recipe, 19)).toBe("All 18 steps done");
  });

  it("says what comes next as drawn", () => {
    expect(nextLine(recipe, 1)).toBe("Next: Customize › Skin · 4 values");
    expect(nextLine(recipe, 2)).toBe("Next: Customize › Head · 3 values");
    expect(nextLine(recipe, 9)).toBe("Next: Sculpt › Chin · Chin · 1 slider");
    expect(nextLine(recipe, 19)).toBeNull();
  });

  it("fills the bar: finished sections lime, the current one up to and including its current screen (D-73)", () => {
    const fills = (step: number) => sectionBar(recipe, step).map((s) => Math.round(s.fill * 1000) / 1000);
    expect(fills(1)).toEqual([1, 0, 0, 0, 0, 0, 0]);
    expect(fills(2)).toEqual([1, 1, 0, 0, 0, 0, 0]);
    // Step 9 is Sculpt's 4th screen of 12 (Figma 354:1497: 67.49 of 202.46 px).
    expect(fills(9)).toEqual([1, 1, 1, 1, 1, 0.333, 0]);
    expect(fills(19)).toEqual([1, 1, 1, 1, 1, 1, 1]);
    expect(sectionBar(recipe, 9).map((s) => s.current)).toEqual([false, false, false, false, false, true, false]);
    expect(sectionBar(recipe, 1).map((s) => s.weight)).toEqual([1, 4, 3, 2, 4, 24, 1]);
  });
});

describe("a recorded recipe, read from the face's parts, sculpt and Visual Age", () => {
  const recipe = faceRecipe(fixture);

  it("makes one screen per game screen: preset, each part tab with values, each sculpt region, Visual Age", () => {
    // The fixture's Face tab has no steps, so it has no screen.
    expect(recipe.screens.map((s) => [s.step, s.section, s.title])).toEqual([
      [1, "Preset", "Pick the preset"],
      [2, "Skin", "Skin"],
      [3, "Head", "Head"],
      [4, "Hair", "Hair"],
      [5, "Sculpt", "Chin · Chin"],
      [6, "Visual Age", "Visual Age"],
    ]);
    expect(recipe.total).toBe(6);
    expect(recipe.sections.map((s) => [s.name, s.values, s.screens])).toEqual([
      ["Preset", 1, 1],
      ["Skin", 2, 1],
      ["Head", 1, 1],
      ["Hair", 1, 1],
      ["Sculpt", 2, 1],
      ["Visual Age", 1, 1],
    ]);
  });

  it("words each screen the way the game shows it", () => {
    expect(screenAt(recipe, 1)?.values).toEqual([{ label: "Preset", value: "7", position: null }]);
    expect(screenAt(recipe, 2)).toMatchObject({ where: "Customize › Skin", hint: "Set them top to bottom, as the game lists them." });
    // Skin Tone has no number: a drawn track at the knob's place (FORMAT §Value).
    expect(screenAt(recipe, 2)?.values[0]).toEqual({ label: "Skin Tone", value: null, position: 40 });
    expect(screenAt(recipe, 2)?.values[1]).toEqual({ label: "Complexion", value: "4", position: null });
    // A step's own tip is the screen's hint.
    expect(screenAt(recipe, 4)).toMatchObject({ where: "Customize › Hair", values: [{ label: "Hair colour", value: "Warm Black" }], hint: "Test tip." });
    expect(screenAt(recipe, 5)).toMatchObject({
      where: "Sculpt › Shape › Skeletal",
      values: [
        { label: "Narrow ← → Widen", value: "59", position: null },
        { label: "Down ← → Up", value: "25", position: null },
      ],
      hint: "Symmetry on. Each slider runs 0 to 100.",
    });
  });

  it("says what comes next from the next screen", () => {
    expect(nextLine(recipe, 1)).toBe("Next: Customize › Skin · 2 values");
    expect(nextLine(recipe, 3)).toBe("Next: Customize › Hair · 1 value");
    expect(nextLine(recipe, 4)).toBe("Next: Sculpt › Chin · Chin · 2 sliders");
    expect(nextLine(recipe, 5)).toBe("Next: Customize › Visual Age · 1 value");
    expect(nextLine(recipe, 6)).toBe("Next: Set up the matching build");
  });
});

/** A Storage stand-in. */
function memory(entries: Record<string, string> = {}) {
  const map = new Map(Object.entries(entries));
  return {
    map,
    get length() {
      return map.size;
    },
    key: (i: number) => [...map.keys()][i] ?? null,
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
  };
}

describe("ticks in the browser (A-07, SPEC flow 2)", () => {
  const recipe = faceRecipe(ronaldo);
  const key = progressKey("cristiano-ronaldo-2008", 1);

  it("keys ticks by the face's id and version", () => {
    expect(key).toBe("face:cristiano-ronaldo-2008:v1");
  });

  it("starts at step 1 with nothing stored", () => {
    expect(readProgress(memory(), "cristiano-ronaldo-2008", 1, recipe)).toEqual({ step: 1, resumed: false, reset: false });
  });

  it("continues from the stored step (Figma 353:1648)", () => {
    expect(readProgress(memory({ [key]: '{"step":9}' }), "cristiano-ronaldo-2008", 1, recipe)).toEqual({ step: 9, resumed: true, reset: false });
  });

  it("opens finished when every step was done, without the resume line", () => {
    expect(readProgress(memory({ [key]: '{"step":19}' }), "cristiano-ronaldo-2008", 1, recipe)).toEqual({ step: 19, resumed: false, reset: false });
  });

  it("ignores a stored step that isn't one of the recipe's screens, or isn't JSON", () => {
    for (const bad of ['{"step":5}', '{"step":"9"}', "nine", '{"step":40}']) {
      expect(readProgress(memory({ [key]: bad }), "cristiano-ronaldo-2008", 1, recipe).step).toBe(1);
    }
  });

  it("starts fresh and says so when the face was updated, and drops the old ticks (Figma 372:2108)", () => {
    const store = memory({ "face:cristiano-ronaldo-2008:v0": '{"step":9}', "face:other:v1": '{"step":2}' });
    expect(readProgress(store, "cristiano-ronaldo-2008", 1, recipe)).toEqual({ step: 1, resumed: false, reset: true });
    expect([...store.map.keys()]).toEqual(["face:other:v1"]);
  });
});

describe("the turntable's drag (D-35)", () => {
  it("turns one frame per 8 px either way and wraps round", async () => {
    const { turnFrame } = await import("@/lib/turn");
    expect(turnFrame(0, 7, 36)).toBe(0);
    expect(turnFrame(0, 8, 36)).toBe(1);
    expect(turnFrame(0, -8, 36)).toBe(35);
    expect(turnFrame(30, 8 * 10, 36)).toBe(4);
  });
});

describe("a draft's placeholders on a recorded recipe", () => {
  it("shows PLACEHOLDER as text, never a knob at NaN% or PLACEHOLDER%", () => {
    const p = "PLACEHOLDER" as never;
    const draft = {
      ...fixture,
      sample: undefined,
      parts: [{ tab: "skin", steps: [{ control: "skin-tone", label: "Skin Tone", value: { kind: "position", percent: p }, tip: null }] }],
      visualAge: { toward: p, percent: p },
    } as LoadedFace;
    const values = faceRecipe(draft).screens.flatMap((s) => s.values);
    expect(values.find((v) => v.label === "Skin Tone")).toEqual({ label: "Skin Tone", value: "PLACEHOLDER", position: null });
    expect(values.find((v) => v.label === "Younger ← → Older")).toEqual({ label: "Younger ← → Older", value: "PLACEHOLDER", position: null });
  });
});
