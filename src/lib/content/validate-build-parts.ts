// The parts of a build that have rules of their own: attributes, the spend order (D-43), a specialization's
// attribute targets (archetype file) and a draft's sample figures (D-107). Split from validate.ts to keep both short.
import { ATTRIBUTE_MAX, ATTRIBUTES, isStar, KEY_STATS, LEVEL_MAX, STARS, STARS_MAX } from "./attributes.ts";
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

/** Figma's sample figures (D-107): a draft only, all six key stats, the drawn levels including the build's own. */
export function checkSample(c: Check, d: Obj) {
  if (!("sample" in d)) return;
  if (c.published) c.add("sample", "published but still has sample figures (D-107)");
  const sample = d.sample;
  if (!c.obj("sample", sample)) return;

  if (c.obj("sample.keyStats", sample.keyStats)) {
    for (const code of KEY_STATS) c.int(`sample.keyStats.${code}`, sample.keyStats[code], { min: 0, max: ATTRIBUTE_MAX });
    for (const key of Object.keys(sample.keyStats)) if (!KEY_STATS.includes(key)) c.add(`sample.keyStats.${key}`, "is not a key stat");
  }
  if (c.arr("sample.levels", sample.levels, { min: 1 })) {
    const seen = new Set<unknown>();
    sample.levels.forEach((entry, i) => {
      const p = at("sample.levels", i);
      if (!c.obj(p, entry)) return;
      c.int(`${p}.level`, entry.level, { min: 1, max: LEVEL_MAX });
      if (seen.has(entry.level)) c.add(`${p}.level`, "is listed twice");
      seen.add(entry.level);
      c.int(`${p}.ap`, entry.ap, { min: 0 });
      c.int(`${p}.spent`, entry.spent, { min: 0, max: typeof entry.ap === "number" ? entry.ap : undefined });
      c.int(`${p}.apShort`, entry.apShort, { min: 1, nullable: true });
    });
    if (typeof d.level === "number" && !seen.has(d.level)) c.add("sample.levels", `needs the build's own level, ${d.level}`);
  }
  const spec = sample.specialization;
  if (c.obj("sample.specialization", spec, { nullable: true })) {
    c.str("sample.specialization.note", spec.note);
    c.int("sample.specialization.target", spec.target, { min: 0, max: ATTRIBUTE_MAX });
    c.int("sample.specialization.reachedFrom", spec.reachedFrom, { min: 1, max: LEVEL_MAX });
  }
}
