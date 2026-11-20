// Validators for the archetype file, creators and changelog entries (docs/FORMAT.md).
import { at, Check, isObj, STATUSES, type Problem } from "./check.ts";
import { POSITIONS } from "./types.ts";

export function validateArchetypeFile(file: string, data: unknown): Problem[] {
  const c = new Check(file, isObj(data) ? data : {});
  if (!c.obj("", data)) return c.problems;
  const d = data;
  c.oneOf("schemaVersion", d.schemaVersion, [1]);
  c.oneOf("game", d.game, ["fc27"]);
  c.date("updated", d.updated);
  c.str("note", d.note);

  const sourceIds = new Set<string>();
  if (c.arr("sources", d.sources)) {
    d.sources.forEach((source, i) => {
      const p = at("sources", i);
      if (!c.obj(p, source)) return;
      c.str(`${p}.id`, source.id);
      c.str(`${p}.title`, source.title);
      c.url(`${p}.url`, source.url);
      c.date(`${p}.accessed`, source.accessed);
      if (typeof source.id === "string") sourceIds.add(source.id);
    });
  }
  const checkSourceIds = (path: string, v: unknown) => {
    if (!c.arr(path, v, { min: 1 })) return;
    v.forEach((id, i) => {
      if (typeof id !== "string" || !sourceIds.has(id)) c.add(at(path, i), `unknown source ${JSON.stringify(id)}`);
    });
  };

  if (c.arr("archetypes", d.archetypes, { min: 1 })) {
    const seen = new Set<unknown>();
    d.archetypes.forEach((a, i) => {
      const p = at("archetypes", i);
      if (!c.obj(p, a)) return;
      c.str(`${p}.id`, a.id);
      if (seen.has(a.id)) c.add(`${p}.id`, "is used twice");
      seen.add(a.id);
      c.str(`${p}.name`, a.name);
      c.oneOf(`${p}.positionGroup`, a.positionGroup, ["goalkeeper", "defender", "midfielder", "attacker"]);
      if (c.arr(`${p}.signaturePlayStyles`, a.signaturePlayStyles)) {
        a.signaturePlayStyles.forEach((ps, j) => {
          const s = at(`${p}.signaturePlayStyles`, j);
          if (!c.obj(s, ps)) return;
          c.str(`${s}.name`, ps.name);
          if (typeof ps.since !== "string" || !/^(launch|season-\d+)$/.test(ps.since)) c.add(`${s}.since`, 'must be "launch" or "season-<n>"');
          checkSourceIds(`${s}.sourceIds`, ps.sourceIds);
        });
      }
      if (c.obj(`${p}.masteryAttributes`, a.masteryAttributes, { nullable: true })) {
        const m = a.masteryAttributes;
        if (c.arr(`${p}.masteryAttributes.attributes`, m.attributes, { min: 1 })) {
          m.attributes.forEach((name, j) => c.str(at(`${p}.masteryAttributes.attributes`, j), name));
        }
        checkSourceIds(`${p}.masteryAttributes.sourceIds`, m.sourceIds);
      }
      if (c.obj(`${p}.apCostChange20261022`, a.apCostChange20261022, { nullable: true })) {
        const ap = a.apCostChange20261022;
        c.int(`${p}.apCostChange20261022.up`, ap.up, { min: 0 });
        c.int(`${p}.apCostChange20261022.down`, ap.down, { min: 0 });
        checkSourceIds(`${p}.apCostChange20261022.sourceIds`, ap.sourceIds);
      }
      if (a.specializations !== null) {
        if (Array.isArray(a.specializations)) a.specializations.forEach((name, j) => c.str(at(`${p}.specializations`, j), name));
        else c.add(`${p}.specializations`, "must be a list or null");
      }
      if (a.typicalPositions !== null) {
        if (!Array.isArray(a.typicalPositions)) c.add(`${p}.typicalPositions`, "must be a list or null");
        else a.typicalPositions.forEach((pos, j) => {
          if (!POSITIONS.includes(pos as never)) c.add(at(`${p}.typicalPositions`, j), `${JSON.stringify(pos)} is not a position`);
        });
      }
      c.bool(`${p}.verifiedInGame`, a.verifiedInGame);
      c.str(`${p}.notes`, a.notes, { nullable: true });
    });
  }
  return c.problems;
}

export function validateCreators(file: string, data: unknown): Problem[] {
  const c = new Check(file, isObj(data) ? data : {});
  if (!c.obj("", data)) return c.problems;
  c.oneOf("schemaVersion", data.schemaVersion, [1]);
  if (c.arr("creators", data.creators)) {
    const seen = new Set<unknown>();
    data.creators.forEach((cr, i) => {
      const p = at("creators", i);
      if (!c.obj(p, cr)) return;
      c.str(`${p}.id`, cr.id);
      if (seen.has(cr.id)) c.add(`${p}.id`, "is used twice");
      seen.add(cr.id);
      c.str(`${p}.name`, cr.name);
      c.url(`${p}.url`, cr.url);
      c.str(`${p}.platform`, cr.platform);
      c.oneOf(`${p}.permission`, cr.permission, ["not-asked", "asked", "yes", "no"]);
      c.bool(`${p}.featured`, cr.featured);
      c.str(`${p}.notes`, cr.notes);
    });
  }
  return c.problems;
}

/** `ids` are the build and face ids in content/, which `affects` must point into. */
export function validateChangelog(file: string, data: unknown, ids: { buildIds: Set<string>; faceIds: Set<string> }): Problem[] {
  const c = new Check(file, isObj(data) ? data : {});
  if (!c.obj("", data)) return c.problems;
  const d = data;
  c.publishedRules();
  c.oneOf("schemaVersion", d.schemaVersion, [1]);
  c.str("id", d.id);
  c.oneOf("status", d.status, STATUSES);
  c.date("date", d.date);
  if (typeof d.id === "string" && typeof d.date === "string" && !d.id.startsWith(d.date)) c.add("id", "must start with the date");
  c.oneOf("kind", d.kind, ["season", "title-update", "archetype-update", "site"]);
  c.oneOf("game", d.game, ["fc27"]);
  c.int("season", d.season, { min: 1 });
  c.str("title", d.title);
  if (c.arr("changes", d.changes, { min: 1 })) d.changes.forEach((line, i) => c.str(at("changes", i), line));
  if (c.obj("source", d.source)) {
    c.str("source.title", d.source.title);
    c.url("source.url", d.source.url);
    c.date("source.accessed", d.source.accessed);
  }
  if (c.obj("affects", d.affects)) {
    for (const kind of ["builds", "faces"] as const) {
      const list = d.affects[kind];
      const known = kind === "builds" ? ids.buildIds : ids.faceIds;
      if (c.arr(`affects.${kind}`, list)) {
        list.forEach((id, i) => {
          if (typeof id !== "string" || !known.has(id)) c.add(at(`affects.${kind}`, i), `unknown ${kind.slice(0, -1)} ${JSON.stringify(id)}`);
        });
      }
    }
  }
  c.str("siteNote", d.siteNote, { nullable: true });
  return c.problems;
}
