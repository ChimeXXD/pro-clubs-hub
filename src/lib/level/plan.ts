// The level switch (D-43, D-44), ported from Chime's prototype (mockup/builds-v2/level.js): spend a level's
// AP in the order the build was made, point by point, and stop at the first point it can't afford.
// The prototype used sample prices. Here prices come in as data, and an unknown price gives no plan at all.
import { STARS } from "../content/attributes.ts";
import type { Specialization, Spend } from "../content/types.ts";
import { apAtLevel, MAX_LEVEL, MIN_LEVEL } from "./ap.ts";

/** AP for the one point that takes an attribute (or star) up to `to`, or null when nobody has read it. */
export type PriceOf = (raise: string, to: number) => number | null;

export interface PendingStep {
  raise: string;
  from: number;
  to: number;
  /** AP this step still needs; for the first one, after what's left over. */
  apMore: number;
}

export interface LevelPlan {
  ap: number;
  spent: number;
  left: number;
  values: Map<string, number>;
  done: boolean;
  pending: PendingStep[];
}

/** Null when any price in the build's order is unknown: a plan with a guess in it is worse than none. */
export function planAtLevel(spend: Spend, level: number, priceOf: PriceOf): LevelPlan | null {
  const ap = apAtLevel(level);
  const values = new Map<string, number>(spend.start.map((a) => [a.name, a.value]));
  for (const [name, key] of Object.entries(STARS)) values.set(name, spend.startStars[key]);

  const target = new Map(values); // where the full order has got to, affordable or not
  let left = ap;
  let stopped = false;
  const pending: PendingStep[] = [];
  for (const { raise, to } of spend.steps) {
    const start = target.get(raise);
    if (start === undefined) throw new Error(`"${raise}" has no starting value`);
    let cost = 0;
    let from = start;
    for (let next = start + 1; next <= to; next++) {
      const price = priceOf(raise, next);
      if (price === null) return null;
      if (!Number.isInteger(price) || price < 1) throw new Error(`price of ${raise} ${next} must be a whole number of 1 or more, got ${price}`);
      if (!stopped && price <= left) {
        left -= price;
        from = next;
        values.set(raise, next);
      } else {
        stopped = true;
        cost += price;
      }
    }
    target.set(raise, to);
    if (from < to) pending.push({ raise, from, to, apMore: cost - (pending.length === 0 ? left : 0) });
  }
  return { ap, spent: ap - left, left, values, done: !stopped, pending };
}

/** The first level at which the build's raw values reach every target, or null when never or not known. */
export function specializationFrom(spend: Spend, targets: Specialization["targets"], priceOf: PriceOf): number | null {
  if (!targets) return null;
  for (let level = MIN_LEVEL; level <= MAX_LEVEL; level++) {
    const plan = planAtLevel(spend, level, priceOf);
    if (!plan) return null;
    if (targets.every((t) => t.value !== null && (plan.values.get(t.attribute) ?? 0) >= t.value)) return level;
  }
  return null;
}
