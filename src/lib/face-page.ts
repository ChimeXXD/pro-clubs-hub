// The face page's steps (`/faces/[slug]`, Figma "Phase 2 · Faces"; D-71 to D-74). One step is one game screen, in the
// game's order: the preset, each part tab, each Sculpt region, Visual Age (D-72). The progress bar weighs each section
// by its values (D-73). A recorded face's screens come from its parts, sculpt and Visual Age; Figma's sample faces use
// the sample recipe the frames draw (D-107), which leaves out the screens no frame shows, so the walk goes from one drawn
// screen to the next. Ticks live in the browser under face:<id>:v<version> (A-07): a new version starts fresh.
import type { LoadedFace } from "./content/load.ts";
import type { PartValue, RecipeSectionName, SculptStep, SliderValue } from "./content/types.ts";

export interface RecipeValue {
  label: string;
  /** What the game shows, or null for a control with no number (drawn as a track at `position`). */
  value: string | null;
  /** Where the knob sits, 0 to 100, on a control with no number (Skin Tone, Visual Age); else null. */
  position: number | null;
}

export interface RecipeScreen {
  step: number;
  section: RecipeSectionName;
  /** "In the game": the menu path, "Customize › Skin". */
  where: string;
  title: string;
  values: RecipeValue[];
  hint: string;
  /** The "Next: …" line under the card (without "Next: "). */
  next: string | null;
}

export interface Recipe {
  /** Every step, drawn or not. Done is total + 1. */
  total: number;
  sections: { name: RecipeSectionName; values: number; screens: number; first: number }[];
  /** The screens to walk, by step. A recorded face has every step; Figma's sample only the drawn ones. */
  screens: RecipeScreen[];
}

export const PRESET_HINT = "Count photo presets only: left to right, top to bottom. Skip your own saved heads.";
export const TAB_HINT = "Set them top to bottom, as the game lists them";
// TODO(Chime): only "Symmetry on" is drawn (353:1648); "Symmetry off" follows it for a recipe made with Symmetry off.
const sculptHint = (symmetry: boolean) => `Symmetry ${symmetry ? "on" : "off"}. Each slider runs 0 to 100.`;
// FORMAT §Face recipe: "Save when the game asks". TODO(Chime): no frame draws a Visual Age step.
const VISUAL_AGE_HINT = "Save when the game asks";
/** The last step's "Next:" line: the finished state leads to the matching build (D-79, Figma 372:1984). */
const LAST_NEXT = "Set up the matching build";

const TAB_NAME = { skin: "Skin", head: "Head", face: "Face", hair: "Hair" } as const;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const plural = (n: number, one: string) => `${n} ${one}${n === 1 ? "" : "s"}`;

// A draft's "PLACEHOLDER" (typed away by LoadedFace, present at runtime) stays text, never a knob at "PLACEHOLDER%".
const PLACEHOLDER = "PLACEHOLDER";
const knob = (label: string, position: unknown): RecipeValue =>
  typeof position === "number" && Number.isFinite(position) ? { label, value: null, position } : { label, value: PLACEHOLDER, position: null };

function partValue(label: string, v: PartValue): RecipeValue {
  if (v.kind === "position") return knob(label, v.percent);
  return { label, value: v.kind === "item" ? String(v.number) : v.name, position: null };
}
const sliderValue = (s: SliderValue): RecipeValue => ({ label: `${s.low} ← → ${s.high}`, value: String(s.value), position: null });

/** A recorded face's screens, in the game's order of work (FORMAT §Face recipe). */
function recordedScreens(face: LoadedFace): Omit<RecipeScreen, "step" | "next">[] {
  const screens: Omit<RecipeScreen, "step" | "next">[] = [
    {
      section: "Preset",
      where: "Head › Presets",
      title: "Pick the preset",
      values: [{ label: "Preset", value: String(face.preset.number), position: null }],
      hint: PRESET_HINT,
    },
  ];
  for (const part of face.parts) {
    if (part.steps.length === 0) continue;
    const name = TAB_NAME[part.tab];
    screens.push({
      section: name,
      where: `Customize › ${name}`,
      title: name,
      values: part.steps.map((s) => partValue(s.label, s.value)),
      // One hint per screen (D-72): the tab's own tips, in order, or the frames' line when it has none.
      hint: [...new Set(part.steps.flatMap((s) => (s.tip ? [s.tip] : [])))].join(" ") || TAB_HINT,
    });
  }
  for (const step of face.sculpt?.steps ?? []) screens.push(sculptScreen(step, face.sculpt?.symmetry ?? true));
  if (face.visualAge) {
    const { toward, percent } = face.visualAge;
    // TODO(Chime): no frame draws Visual Age. The pad has no number (RESEARCH §9), so the knob is drawn on a track
    // from Younger to Older: the centre is the preset's age, the ends are "LIMIT REACHED".
    const known = (toward === "older" || toward === "younger") && typeof percent === "number";
    const position = known ? 50 + (toward === "older" ? percent : -percent) / 2 : null;
    screens.push({
      section: "Visual Age",
      where: "Customize › Visual Age",
      title: "Visual Age",
      values: [knob("Younger ← → Older", position)],
      hint: VISUAL_AGE_HINT,
    });
  }
  return screens;
}

function sculptScreen(step: SculptStep, symmetry: boolean): Omit<RecipeScreen, "step" | "next"> {
  return {
    section: "Sculpt",
    where: `Sculpt › ${cap(step.mode)} › ${cap(step.layer)}`,
    title: `${step.region} · ${step.subRegion}`,
    values: step.sliders.map(sliderValue),
    hint: step.tip ?? sculptHint(symmetry),
  };
}

/** "Customize › Skin · 4 values", "Sculpt › Chin · Chin · 1 slider": the next screen, as the frames word it. */
function nextWording(screen: Omit<RecipeScreen, "step" | "next">): string {
  if (screen.section === "Sculpt") return `Sculpt › ${screen.title} · ${plural(screen.values.length, "slider")}`;
  return `${screen.where} · ${plural(screen.values.length, "value")}`;
}

export function faceRecipe(face: LoadedFace): Recipe {
  const sample = face.sample?.recipe;
  if (sample) {
    let first = 1;
    const sections = sample.sections.map((s) => {
      const section = { ...s, first };
      first += s.screens;
      return section;
    });
    const sectionAt = (step: number) => sections.findLast((s) => s.first <= step)?.name ?? "Preset";
    return {
      total: first - 1,
      sections,
      screens: sample.screens.map((s) => ({
        ...s,
        section: sectionAt(s.step),
        values: s.values.map((v) => ({ ...v, position: null })),
      })),
    };
  }
  const drawn = recordedScreens(face);
  const sections: Recipe["sections"] = [];
  drawn.forEach((screen, i) => {
    const values = screen.values.length;
    const last = sections.at(-1);
    if (last?.name === screen.section) {
      last.values += values;
      last.screens += 1;
    } else sections.push({ name: screen.section, values, screens: 1, first: i + 1 });
  });
  return {
    total: drawn.length,
    sections,
    screens: drawn.map((screen, i) => {
      const following = drawn[i + 1];
      return { ...screen, step: i + 1, next: following ? nextWording(following) : LAST_NEXT };
    }),
  };
}

export const screenAt = (recipe: Recipe, step: number) => recipe.screens.find((s) => s.step === step) ?? null;
/** The step to open on: the first screen. */
export const firstStep = (recipe: Recipe) => recipe.screens[0]?.step ?? 1;
export const isDone = (recipe: Recipe, step: number) => step > recipe.total;

/** After "Done, next": the next screen, or done (total + 1). */
export function nextStep(recipe: Recipe, step: number): number {
  return recipe.screens.find((s) => s.step > step)?.step ?? recipe.total + 1;
}

/** After "Back": the screen before, or null on the first. */
export function prevStep(recipe: Recipe, step: number): number | null {
  return recipe.screens.findLast((s) => s.step < step)?.step ?? null;
}

const sectionOf = (recipe: Recipe, step: number) => recipe.sections.findLast((s) => s.first <= step);

/** "Step 9 of 18 · Sculpt", or "All 18 steps done" (Figma 353:1683, 372:2003). */
export function progressLabel(recipe: Recipe, step: number): string {
  if (isDone(recipe, step)) return `All ${recipe.total} steps done`;
  return `Step ${step} of ${recipe.total} · ${sectionOf(recipe, step)?.name ?? ""}`;
}

/** "Next: Customize › Skin · 4 values", or null when done. */
export function nextLine(recipe: Recipe, step: number): string | null {
  const next = screenAt(recipe, step)?.next;
  return next ? `Next: ${next}` : null;
}

/** All steps' section counts (Task list, motion-bookmarks #11): "3 of 4", the section's screens before the step in hand. */
export function sectionDone(recipe: Recipe, step: number): { name: RecipeSectionName; first: number; done: number; of: number }[] {
  return recipe.sections.map((s) => ({ name: s.name, first: s.first, done: Math.min(Math.max(step - s.first, 0), s.screens), of: s.screens }));
}

/**
 * The section bar (D-73): one segment per section, as wide as its values. Finished sections are full; the current one
 * fills by its screens up to and including the current one (Figma 354:1497: Sculpt's 4th of 12 is a third).
 */
export function sectionBar(recipe: Recipe, step: number): { name: RecipeSectionName; weight: number; fill: number; current: boolean }[] {
  return recipe.sections.map((s) => {
    const last = s.first + s.screens - 1;
    const current = step >= s.first && step <= last;
    const fill = step > last ? 1 : current ? (step - s.first + 1) / s.screens : 0;
    return { name: s.name, weight: s.values, fill, current };
  });
}

// Ticks in the browser (A-07): { "step": n } under face:<id>:v<version>, n the step the player is on (total + 1 when
// done). Every read and write is wrapped by the caller: storage can be missing or refuse (private mode).
export const progressKey = (id: string, version: number) => `face:${id}:v${version}`;

type Store = Pick<Storage, "getItem" | "removeItem" | "key" | "length">;

/** The step to open on, whether that continues earlier work (353:1648), and whether older ticks were dropped (372:2108). */
export function readProgress(store: Store, id: string, version: number, recipe: Recipe): { step: number; resumed: boolean; reset: boolean } {
  const start = firstStep(recipe);
  const old: string[] = [];
  for (let i = 0; i < store.length; i++) {
    const key = store.key(i);
    if (key?.startsWith(`face:${id}:v`) && key !== progressKey(id, version)) old.push(key);
  }
  old.forEach((key) => store.removeItem(key));
  let saved: unknown;
  try {
    saved = JSON.parse(store.getItem(progressKey(id, version)) ?? "null");
  } catch {
    saved = null;
  }
  const step = typeof saved === "object" && saved !== null ? (saved as { step?: unknown }).step : undefined;
  const valid = typeof step === "number" && (step === recipe.total + 1 || screenAt(recipe, step) !== null);
  if (!valid) return { step: start, resumed: false, reset: old.length > 0 };
  return { step, resumed: step > start && !isDone(recipe, step), reset: false };
}
