// Figma's sample recipe on a sample face (`sample.recipe`, D-107; FORMAT §Face recipe): the sections in the game's
// order with their values and screens, and the screens the face page frames draw, by step number.
import { at, type Check, isObj } from "./check.ts";
import { RECIPE_SECTIONS } from "./types.ts";

export function checkSampleRecipe(c: Check, recipe: unknown) {
  const p = "sample.recipe";
  if (!c.obj(p, recipe)) return;

  // Each section's first and last step, to place the drawn screens.
  const spans: { first: number; last: number; values: number }[] = [];
  if (c.arr(`${p}.sections`, recipe.sections, { min: 1 })) {
    const names = recipe.sections.map((s) => (isObj(s) ? s.name : undefined));
    const ordered = RECIPE_SECTIONS.filter((name) => names.includes(name));
    if (names.length !== ordered.length || names.some((name, i) => name !== ordered[i])) {
      c.add(`${p}.sections`, `must be ${RECIPE_SECTIONS.join(", ")}, each once and in that order`);
    }
    let step = 1;
    recipe.sections.forEach((section, i) => {
      const s = at(`${p}.sections`, i);
      if (!c.obj(s, section)) return;
      c.oneOf(`${s}.name`, section.name, RECIPE_SECTIONS);
      c.int(`${s}.values`, section.values, { min: 1 });
      const values = typeof section.values === "number" ? section.values : undefined;
      c.int(`${s}.screens`, section.screens, { min: 1, max: values });
      const screens = Number.isInteger(section.screens) ? (section.screens as number) : 0;
      spans.push({ first: step, last: step + screens - 1, values: values ?? 0 });
      step += screens;
    });
  }
  const total = spans.reduce((n, s) => Math.max(n, s.last), 0);

  if (!c.arr(`${p}.screens`, recipe.screens, { min: 1 })) return;
  let previous = 0;
  recipe.screens.forEach((screen, i) => {
    const s = at(`${p}.screens`, i);
    if (!c.obj(s, screen)) return;
    c.int(`${s}.step`, screen.step, { min: previous + 1, max: total });
    if (typeof screen.step === "number") previous = screen.step;
    for (const key of ["where", "title", "hint"]) c.str(`${s}.${key}`, screen[key]);
    c.str(`${s}.next`, screen.next, { nullable: true });
    const span = spans.find((sp) => typeof screen.step === "number" && screen.step >= sp.first && screen.step <= sp.last);
    if (!c.arr(`${s}.values`, screen.values, { min: 1 })) return;
    if (span && screen.values.length > span.values) c.add(`${s}.values`, `its section has ${span.values} values in all`);
    screen.values.forEach((value, j) => {
      const v = at(`${s}.values`, j);
      if (!c.obj(v, value)) return;
      c.str(`${v}.label`, value.label);
      c.str(`${v}.value`, value.value);
    });
  });
}
