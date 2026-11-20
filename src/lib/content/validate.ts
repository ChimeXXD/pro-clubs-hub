// Content validator (CLAUDE.md rule 6, A-02): every field of every file against docs/FORMAT.md.
// One problem fails the build. Each file is checked alone, given the ids of the other files
// (archetypes, creators, builds, faces), so links between files are checked too.
import { at, Check, isObj, STATUSES, type Obj, type Problem } from "./check.ts";
import { PART_TABS, POSITIONS } from "./types.ts";
import { validateArchetypeFile, validateChangelog, validateCreators } from "./validate-other.ts";

export type { Problem } from "./check.ts";

export interface Context {
  archetypeIds: Set<string>;
  creatorIds: Set<string>;
  buildIds: Set<string>;
  faceIds: Set<string>;
}

const ROLES = ["made-by", "tutorial", "submitted-by", "reference"] as const;

/** Fields every build and face carries: status, version tag, credits, history (D-05, D-08). */
function checkVersioned(c: Check, d: Obj, ctx: Context) {
  c.publishedRules();
  c.oneOf("schemaVersion", d.schemaVersion, [1]);
  c.str("id", d.id);
  if (d.slug !== d.id) c.add("slug", "must equal id");
  c.oneOf("status", d.status, STATUSES);
  c.int("version", d.version, { min: 1 });
  // Bump version and add a history line whenever a value changes (FORMAT §Build).
  if (Array.isArray(d.history) && !d.history.some((line) => isObj(line) && line.version === d.version)) {
    c.add("history", "needs a line for the current version");
  }
  c.date("createdAt", d.createdAt);
  c.date("updatedAt", d.updatedAt);

  if (c.obj("versionTag", d.versionTag)) {
    const v = d.versionTag;
    c.oneOf("versionTag.game", v.game, ["fc27"]);
    c.int("versionTag.season", v.season, { min: 1 });
    c.date("versionTag.verifiedOn", v.verifiedOn, { nullable: true });
    c.str("versionTag.verifiedBy", v.verifiedBy, { nullable: true });
    c.oneOf("versionTag.platform", v.platform, ["ps5", "xbox", "pc"], { nullable: true });
  }

  if (c.arr("credits", d.credits)) {
    d.credits.forEach((credit, i) => {
      const p = at("credits", i);
      if (!c.obj(p, credit)) return;
      c.oneOf(`${p}.role`, credit.role, ROLES);
      c.str(`${p}.name`, credit.name);
      c.url(`${p}.url`, credit.url, { nullable: true });
      checkCreatorId(c, `${p}.creatorId`, credit.creatorId, ctx);
    });
    if (!d.credits.some((credit) => isObj(credit) && credit.role === "made-by")) {
      c.add("credits", 'needs at least one "made-by" credit (D-08)');
    }
  }

  if (c.arr("history", d.history, { min: 1 })) {
    d.history.forEach((line, i) => {
      const p = at("history", i);
      if (!c.obj(p, line)) return;
      c.int(`${p}.version`, line.version, { min: 1 });
      c.date(`${p}.date`, line.date);
      c.str(`${p}.note`, line.note);
    });
  }
}

function checkCreatorId(c: Check, path: string, id: unknown, ctx: Context) {
  if (id === null) return;
  if (typeof id !== "string" || !ctx.creatorIds.has(id)) c.add(path, `unknown creator ${JSON.stringify(id)}`);
}

/** A part step's value: what a Skin, Head, Face or Hair section shows (A-09, A-12). */
function checkPartValue(c: Check, path: string, v: unknown, control: unknown) {
  if (!c.obj(path, v)) return;
  if (!c.oneOf(`${path}.kind`, v.kind, ["item", "named", "position"])) return;
  if (v.kind === "item") c.int(`${path}.number`, v.number, { min: 1, recorded: true });
  if (v.kind === "named") c.str(`${path}.name`, v.name, { recorded: true });
  // Only Skin Tone shows no number (FORMAT §Face recipe).
  if (v.kind === "position" && control !== "skin-tone") c.add(`${path}.kind`, 'only "skin-tone" takes a position');
  if (v.kind === "position") c.int(`${path}.percent`, v.percent, { min: 0, max: 100, recorded: true });
}

export function validateFace(file: string, data: unknown, ctx: Context): Problem[] {
  const c = new Check(file, isObj(data) ? data : {});
  if (!c.obj("", data)) return c.problems;
  const d = data;
  checkVersioned(c, d, ctx);

  if (c.obj("subject", d.subject)) {
    c.str("subject.name", d.subject.name);
    c.oneOf("subject.kind", d.subject.kind, ["footballer", "musician"]);
    if (d.subject.living !== true) c.add("subject.living", "subject must be living at launch (D-10)");
  }
  if (c.obj("era", d.era)) {
    c.str("era.label", d.era.label);
    c.str("era.note", d.era.note, { recorded: true });
  }
  if (typeof d.title !== "string" || !d.title.startsWith("Inspired by")) c.add("title", 'must start with "Inspired by"');
  else if (/official/i.test(d.title)) c.add("title", 'must never say "official" (CLAUDE.md rule 3)');
  if (c.obj("target", d.target)) c.oneOf("target.look", d.target.look, ["matchday"]);
  c.int("timeMinutes", d.timeMinutes, { min: 1, recorded: true });
  if (c.obj("preset", d.preset)) c.int("preset.number", d.preset.number, { min: 1, recorded: true });

  if (c.arr("parts", d.parts)) {
    const order = d.parts.map((tab) => (isObj(tab) ? tab.tab : undefined));
    const expected = PART_TABS.filter((name) => order.includes(name));
    if (order.length !== expected.length || order.some((name, i) => name !== expected[i])) {
      c.add("parts", "tabs must be skin, head, face, hair in that order");
    }
    d.parts.forEach((tab, i) => {
      const p = at("parts", i);
      if (!c.obj(p, tab) || !c.arr(`${p}.steps`, tab.steps)) return;
      tab.steps.forEach((step, j) => {
        const s = at(`${p}.steps`, j);
        if (!c.obj(s, step)) return;
        c.str(`${s}.control`, step.control, { recorded: true });
        c.str(`${s}.label`, step.label, { recorded: true });
        checkPartValue(c, `${s}.value`, step.value, step.control);
        c.str(`${s}.tip`, step.tip, { nullable: true });
      });
    });
  }

  if (c.obj("sculpt", d.sculpt, { nullable: true })) {
    c.bool("sculpt.symmetry", d.sculpt.symmetry);
    if (c.arr("sculpt.steps", d.sculpt.steps)) {
      d.sculpt.steps.forEach((step, i) => {
        const p = at("sculpt.steps", i);
        if (!c.obj(p, step)) return;
        c.oneOf(`${p}.mode`, step.mode, ["shape", "weight", "definition"]);
        c.oneOf(`${p}.layer`, step.layer, ["skeletal", "flesh", "fat"]);
        c.str(`${p}.region`, step.region);
        c.str(`${p}.subRegion`, step.subRegion);
        c.str(`${p}.tip`, step.tip, { nullable: true });
        if (!c.arr(`${p}.sliders`, step.sliders, { min: 1 })) return;
        step.sliders.forEach((slider, j) => {
          const s = at(`${p}.sliders`, j);
          if (!c.obj(s, slider) || !c.oneOf(`${s}.kind`, slider.kind, ["slider"])) return;
          c.str(`${s}.low`, slider.low);
          c.str(`${s}.high`, slider.high);
          c.int(`${s}.value`, slider.value, { min: 0, max: 100, recorded: true });
        });
      });
    }
  }

  if (c.obj("visualAge", d.visualAge, { nullable: true })) {
    c.oneOf("visualAge.toward", d.visualAge.toward, ["older", "younger"], { recorded: true });
    c.int("visualAge.percent", d.visualAge.percent, { min: 0, max: 100, recorded: true });
  }

  if (c.arr("limits", d.limits)) d.limits.forEach((limit, i) => c.str(at("limits", i), limit, { recorded: true }));
  if (typeof d.pairedBuild !== "string" || !ctx.buildIds.has(d.pairedBuild)) {
    c.add("pairedBuild", `unknown build ${JSON.stringify(d.pairedBuild)}`);
  }

  if (c.arr("screenshots", d.screenshots)) {
    d.screenshots.forEach((shot, i) => {
      const p = at("screenshots", i);
      if (!c.obj(p, shot)) return;
      if (typeof shot.file !== "string" || !shot.file.startsWith("faces/")) c.add(`${p}.file`, 'must be a file under "faces/"');
      c.str(`${p}.alt`, shot.alt);
      c.str(`${p}.by`, shot.by);
    });
  }

  if (c.arr("embeds", d.embeds)) {
    const tutorials = Array.isArray(d.credits) ? d.credits.filter((cr) => isObj(cr) && cr.role === "tutorial") : [];
    d.embeds.forEach((embed, i) => {
      const p = at("embeds", i);
      if (!c.obj(p, embed)) return;
      c.oneOf(`${p}.provider`, embed.provider, ["youtube"]);
      // The id goes into a youtube-nocookie.com URL, so it may hold only YouTube's id characters.
      if (typeof embed.videoId !== "string" || !/^[\w-]+$/.test(embed.videoId)) c.add(`${p}.videoId`, "must be a YouTube video id");
      c.str(`${p}.title`, embed.title);
      c.str(`${p}.channel`, embed.channel);
      checkCreatorId(c, `${p}.creatorId`, embed.creatorId, ctx);
      // Every embed has a matching "tutorial" credit (FORMAT §Face recipe, D-08).
      const who = embed.creatorId ?? embed.channel;
      const credited = tutorials.some((cr) => isObj(cr) && (embed.creatorId ? cr.creatorId === embed.creatorId : cr.name === embed.channel));
      if (!credited) c.add(p, `needs a "tutorial" credit for ${String(who)}`);
    });
  }
  return c.problems;
}

export function validateBuild(file: string, data: unknown, ctx: Context): Problem[] {
  const c = new Check(file, isObj(data) ? data : {});
  if (!c.obj("", data)) return c.problems;
  const d = data;
  checkVersioned(c, d, ctx);

  c.str("title", d.title, { recorded: true });
  if (typeof d.archetype !== "string" || !ctx.archetypeIds.has(d.archetype)) {
    c.add("archetype", `unknown archetype ${JSON.stringify(d.archetype)}`);
  }
  if (c.arr("positions", d.positions, { min: 1 })) {
    d.positions.forEach((pos, i) => {
      if (!POSITIONS.includes(pos as never)) c.add(at("positions", i), `${JSON.stringify(pos)} is not a position`);
    });
  }
  c.str("summary", d.summary, { recorded: true });
  c.int("level", d.level, { min: 1, recorded: true });
  if (c.obj("body", d.body)) {
    c.int("body.heightCm", d.body.heightCm, { min: 1, recorded: true });
    c.int("body.weightKg", d.body.weightKg, { min: 1, recorded: true });
    c.oneOf("body.accelerate", d.body.accelerate, ["explosive", "controlled", "lengthy"], { recorded: true, nullable: true });
  }
  if (c.arr("attributes", d.attributes)) {
    d.attributes.forEach((attr, i) => {
      const p = at("attributes", i);
      if (!c.obj(p, attr)) return;
      c.str(`${p}.name`, attr.name);
      c.int(`${p}.value`, attr.value, { min: 0, recorded: true });
    });
  }
  if (c.obj("playStyles", d.playStyles)) {
    for (const kind of ["signature", "plus", "regular"] as const) {
      const list = d.playStyles[kind];
      if (c.arr(`playStyles.${kind}`, list)) list.forEach((name, i) => c.str(at(`playStyles.${kind}`, i), name, { recorded: kind !== "signature" }));
    }
  }
  c.str("specialization", d.specialization, { recorded: true, nullable: true });
  c.int("skillMoves", d.skillMoves, { min: 1, max: 5, recorded: true });
  c.int("weakFoot", d.weakFoot, { min: 1, max: 5, recorded: true });
  if (c.arr("sources", d.sources)) {
    d.sources.forEach((source, i) => {
      const p = at("sources", i);
      if (!c.obj(p, source)) return;
      c.str(`${p}.title`, source.title);
      c.url(`${p}.url`, source.url);
      c.date(`${p}.accessed`, source.accessed);
    });
  }
  return c.problems;
}

/** Every file under content/, by its path there ("faces/x.json"). Builds the context from the files. */
export function validateAll(files: { path: string; data: unknown }[]): Problem[] {
  const archetypes = files.find((f) => f.path === "archetypes/fc27.json")?.data;
  const creators = files.find((f) => f.path === "creators.json")?.data;
  const ids = (list: unknown, key: string) =>
    new Set(isObj(list) && Array.isArray(list[key]) ? (list[key] as unknown[]).flatMap((x) => (isObj(x) && typeof x.id === "string" ? [x.id] : [])) : []);
  const idsIn = (folder: string) =>
    new Set(files.flatMap((f) => (f.path.startsWith(folder) && isObj(f.data) && typeof f.data.id === "string" ? [f.data.id] : [])));
  const ctx: Context = {
    archetypeIds: ids(archetypes, "archetypes"),
    creatorIds: ids(creators, "creators"),
    buildIds: idsIn("builds/"),
    faceIds: idsIn("faces/"),
  };

  return files.flatMap(({ path, data }) => {
    const base = path.split("/").pop()?.replace(/\.json$/, "");
    const named = (problems: Problem[]) =>
      isObj(data) && data.id !== base ? [...problems, { file: path, path: "id", message: `must match the file name "${base}"` }] : problems;
    if (path === "archetypes/fc27.json") return validateArchetypeFile(path, data);
    if (path === "creators.json") return validateCreators(path, data);
    if (path.startsWith("faces/")) return named(validateFace(path, data, ctx));
    if (path.startsWith("builds/")) return named(validateBuild(path, data, ctx));
    if (path.startsWith("changelog/")) return named(validateChangelog(path, data, ctx));
    return [{ file: path, path: "", message: "not a known content file (FORMAT.md)" }];
  });
}
