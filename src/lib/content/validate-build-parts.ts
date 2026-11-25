// The parts of a build that have rules of their own: attributes, the spend order (D-43), and a
// specialization's attribute targets (archetype file). Split from validate.ts to keep both short.
import { ATTRIBUTE_MAX, ATTRIBUTES, isStar, STARS, STARS_MAX } from "./attributes.ts";
import { at, isObj, type Check, type Obj } from "./check.ts";

const isAttribute = (c: Check, path: string, name: unknown) => {
  if (ATTRIBUTES.has(name)) return true;
  c.add(path, `${JSON.stringify(name)} is not an attribute`);
  return false;
};

/** A list of { name, value }, each a real attribute, once. */
export function checkAttributes(c: Check, path: string, v: unknown) {
  if (!c.arr(path, v)) return;
  const seen = new Set<unknown>();
  v.forEach((attr, i) => {
    const p = at(path, i);
    if (!c.obj(p, attr)) return;
    isAttribute(c, `${p}.name`, attr.name);
    if (seen.has(attr.name)) c.add(`${p}.name`, "is listed twice");
    seen.add(attr.name);
    c.int(`${p}.value`, attr.value, { min: 0, max: ATTRIBUTE_MAX, recorded: true });
  });
}

/** Specialization targets: null when nobody has read them; a value is null when only the name is known. */
export function checkTargets(c: Check, path: string, v: unknown) {
  if (v === null || !c.arr(path, v, { min: 1 })) return;
  v.forEach((target, i) => {
    const p = at(path, i);
    if (!c.obj(p, target)) return;
    isAttribute(c, `${p}.attribute`, target.attribute);
    c.int(`${p}.value`, target.value, { min: 0, max: ATTRIBUTE_MAX, nullable: true });
  });
}

/** The order the build was made in. Walking it from the starting values must end on the build's own values. */
export function checkSpend(c: Check, d: Obj) {
  const spend = d.spend;
  if (!c.obj("spend", spend, { nullable: true })) return;
  const before = c.problems.length;

  checkAttributes(c, "spend.start", spend.start);
  if (c.obj("spend.startStars", spend.startStars)) {
    for (const key of Object.values(STARS)) c.int(`spend.startStars.${key}`, spend.startStars[key], { min: 1, max: STARS_MAX, recorded: true });
  }
  if (!c.arr("spend.steps", spend.steps, { min: 1 })) return;

  // The value each thing has reached so far; "PLACEHOLDER" once a step isn't recorded.
  const reached = new Map<unknown, unknown>();
  if (Array.isArray(spend.start)) spend.start.forEach((a) => isObj(a) && reached.set(a.name, a.value));
  if (isObj(spend.startStars)) for (const [name, key] of Object.entries(STARS)) reached.set(name, spend.startStars[key]);

  spend.steps.forEach((step, i) => {
    const p = at("spend.steps", i);
    if (!c.obj(p, step)) return;
    if (!reached.has(step.raise)) return c.add(`${p}.raise`, `${JSON.stringify(step.raise)} has no starting value`);
    c.int(`${p}.to`, step.to, { min: 1, max: isStar(step.raise) ? STARS_MAX : ATTRIBUTE_MAX, recorded: true });
    const from = reached.get(step.raise);
    if (typeof from === "number" && typeof step.to === "number" && step.to <= from) c.add(`${p}.to`, `must raise ${String(step.raise)} above ${from}`);
    reached.set(step.raise, step.to);
  });
  // The end means nothing until every step is right and recorded.
  const unrecorded = [...reached.values()].some((v) => typeof v !== "number");
  if (c.problems.length > before || unrecorded || spend.steps.some((s) => isObj(s) && typeof s.to !== "number")) return;

  const final = new Map<unknown, unknown>(Object.entries(STARS).map(([name, key]) => [name, d[key]]));
  if (Array.isArray(d.attributes)) d.attributes.forEach((a) => isObj(a) && final.set(a.name, a.value));
  for (const [name, value] of final) {
    if (!reached.has(name)) c.add("spend.start", `${String(name)} has no starting value`);
    else if (typeof value === "number" && reached.get(name) !== value) {
      c.add("spend.steps", `${String(name)} ends at ${String(reached.get(name))}, but the build says ${value}`);
    }
  }
  for (const name of reached.keys()) if (!final.has(name)) c.add("spend.start", `${String(name)} isn't in the build's attributes`);
}
