// A small field checker for the content validator: collects problems with the path to each field,
// so a message points at exactly what to fix ("sculpt.steps[0].sliders[1].value").
import type { Placeholder } from "./types.ts";

export interface Problem {
  file: string;
  path: string;
  message: string;
}

export type Obj = Record<string, unknown>;

const PLACEHOLDER: Placeholder = "PLACEHOLDER";
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const WEB_URL = /^https?:\/\/[^\s/]+/;

export const STATUSES = ["draft", "published", "withdrawn"] as const; // FORMAT §Status

/** A real calendar day: the pattern alone lets "2026-02-30" through. */
const isIsoDate = (v: unknown): v is string => {
  if (typeof v !== "string" || !ISO_DATE.test(v)) return false;
  const day = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(day.getTime()) && day.toISOString().startsWith(v);
};

export const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
export const at = (path: string, key: string | number) =>
  typeof key === "number" ? `${path}[${key}]` : path ? `${path}.${key}` : key;

interface FieldOptions {
  /** A value Chime records in game: "PLACEHOLDER" is allowed here in a draft (FORMAT §Placeholder). */
  recorded?: boolean;
  nullable?: boolean;
}

export class Check {
  readonly problems: Problem[] = [];
  readonly file: string;
  readonly data: Obj;

  // Plain fields, not parameter properties: Node runs this file by stripping types (scripts/validate-content.mjs).
  constructor(file: string, data: Obj) {
    this.file = file;
    this.data = data;
  }

  get published() {
    return this.data.status === "published";
  }

  add(path: string, message: string) {
    this.problems.push({ file: this.file, path, message });
  }

  /** True when the value needs no further checks: null where allowed, or a placeholder in a recorded field. */
  private skip(v: unknown, { recorded, nullable }: FieldOptions) {
    return (nullable && v === null) || (recorded && v === PLACEHOLDER);
  }

  str(path: string, v: unknown, opts: FieldOptions = {}) {
    if (this.skip(v, opts)) return;
    if (typeof v !== "string" || v.trim() === "") this.add(path, "must be text");
  }

  int(path: string, v: unknown, { min, max, ...opts }: FieldOptions & { min?: number; max?: number } = {}) {
    if (this.skip(v, opts)) return;
    const ok = Number.isInteger(v) && (min === undefined || (v as number) >= min) && (max === undefined || (v as number) <= max);
    if (!ok) {
      const range = min !== undefined && max !== undefined ? ` from ${min} to ${max}` : min !== undefined ? ` of ${min} or more` : "";
      this.add(path, `must be a whole number${range}`);
    }
  }

  bool(path: string, v: unknown) {
    if (typeof v !== "boolean") this.add(path, "must be true or false");
  }

  date(path: string, v: unknown, opts: FieldOptions = {}) {
    if (this.skip(v, opts)) return;
    if (!isIsoDate(v)) this.add(path, "must be a date like 2026-11-20");
  }

  /** A web link: http(s) only, so a content file or submission can't carry a javascript: URL. */
  url(path: string, v: unknown, opts: FieldOptions = {}) {
    if (this.skip(v, opts)) return;
    if (typeof v !== "string" || !WEB_URL.test(v)) this.add(path, "must be a web link starting with https://");
  }

  /** Returns false (after reporting) when the value isn't one of the options. */
  oneOf<T extends string | number>(path: string, v: unknown, options: readonly T[], opts: FieldOptions = {}): boolean {
    if (this.skip(v, opts)) return true;
    if (options.includes(v as T)) return true;
    this.add(path, `must be one of ${options.join(", ")}, got ${JSON.stringify(v)}`);
    return false;
  }

  obj(path: string, v: unknown, opts: FieldOptions = {}): v is Obj {
    if (opts.nullable && v === null) return false;
    if (isObj(v)) return true;
    this.add(path, opts.nullable ? "must be an object or null" : "must be an object");
    return false;
  }

  arr(path: string, v: unknown, { min = 0 } = {}): v is unknown[] {
    if (!Array.isArray(v)) {
      this.add(path, "must be a list");
      return false;
    }
    if (v.length < min) this.add(path, `must have at least ${min}`);
    return true;
  }

  /** In a published file, every "PLACEHOLDER" anywhere and a leftover _example are errors (FORMAT). */
  publishedRules() {
    if (!this.published) return;
    if ("_example" in this.data) this.add("_example", "published but still has _example");
    const scan = (v: unknown, path: string) => {
      if (v === PLACEHOLDER) this.add(path, 'published but holds "PLACEHOLDER"');
      else if (Array.isArray(v)) v.forEach((item, i) => scan(item, at(path, i)));
      else if (isObj(v)) for (const [k, item] of Object.entries(v)) if (k !== "_example") scan(item, at(path, k));
    };
    scan(this.data, "");
  }
}
