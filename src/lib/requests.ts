// Request a face (D-83, D-84, D-96): players ask for a face, everyone votes (one vote per browser), and Chime and
// Sharon make the most-wanted ones. Requests and votes live in Supabase (docs/supabase-schema.sql): a new request
// shows only once it has been checked (moderated), so the list holds listed and being-made requests. Everything
// read back is checked here before it shows (CLAUDE.md rule 6). With no Supabase settings the preview shows Figma's
// sample list (D-107) and a local stand-in for every state; the live site has no stand-in.
import { isObj } from "./content/check.ts";
import { FACE_FILTERS, type FaceKind, KIND_LABEL } from "./faces.ts";
import { rpc, SupabaseError, type SupabaseConfig } from "./supabase/client.ts";

export type RequestKind = FaceKind;

export interface FaceRequest {
  id: string;
  /** 1 for the most votes, in the whole list. */
  rank: number;
  name: string;
  kind: RequestKind;
  votes: number;
  beingMade: boolean;
}

/** The Faces library's kind chips (All, Footballers, Athletes, Musicians), null for All. */
export const REQUEST_KINDS: readonly { kind: RequestKind | null; label: string }[] = FACE_FILTERS.map((f) => ({
  kind: f.value === "all" ? null : f.value,
  label: f.label,
}));
/** The longest name a request takes, in characters (code points, as the database's char_length counts them). */
export const NAME_MAX = 80;
const nameLength = (name: string) => [...name].length;

/** A name as the database stores it: trimmed, each run of spaces made one. */
export const cleanName = (name: string) => name.trim().replace(/\s+/g, " ");

const VOTER_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Whether a stored voter id is one the database takes (a uuid). */
export const isVoterId = (id: string | null): id is string => id !== null && VOTER_ID.test(id);

/**
 * A new random voter id (a version 4 uuid). Built from crypto.getRandomValues, which works on plain http too;
 * crypto.randomUUID needs a secure context, so it is missing on a phone opening the preview over the local network.
 */
export function newVoterId(random: (bytes: Uint8Array) => Uint8Array = (b) => crypto.getRandomValues(b)): string {
  const b = random(new Uint8Array(16));
  b[6] = (b[6]! & 0x0f) | 0x40;
  b[8] = (b[8]! & 0x3f) | 0x80;
  const hex = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// Figma's sample list (402:3451 "Requests (sample names and counts)"), preview only.
export const SAMPLE_REQUESTS: FaceRequest[] = [
  { id: "sample-1", rank: 1, name: "2017 Ronaldo", kind: "footballer", votes: 214, beingMade: true },
  { id: "sample-2", rank: 2, name: "Kanye West", kind: "musician", votes: 167, beingMade: false },
  { id: "sample-3", rank: 3, name: "2006 Ronaldinho", kind: "footballer", votes: 121, beingMade: false },
  { id: "sample-4", rank: 4, name: "Burna Boy", kind: "musician", votes: 96, beingMade: false },
  { id: "sample-5", rank: 5, name: "Usain Bolt", kind: "athlete", votes: 58, beingMade: false },
];
/** The sample's own votes: Figma draws 2017 Ronaldo and 2006 Ronaldinho voted. */
export const SAMPLE_VOTED: ReadonlySet<string> = new Set(["sample-1", "sample-3"]);

/** "Footballer · Being made", "Musician". */
export const requestLine = (r: FaceRequest) => (r.beingMade ? `${KIND_LABEL[r.kind]} · Being made` : KIND_LABEL[r.kind]);

/** The requests of one kind (null: all), each keeping its rank in the whole list. */
export const byKind = (list: FaceRequest[], kind: RequestKind | null) => (kind ? list.filter((r) => r.kind === kind) : list);

const words = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

/**
 * The request the typed name is already asked as (Figma 430:6093: "Kanye" finds Kanye West), or null. Every typed
 * word must start a word of the request's name, and at least three letters must be typed.
 */
export function findAsked(list: FaceRequest[], typed: string): FaceRequest | null {
  const typedWords = words(typed);
  if (typedWords.join("").length < 3) return null;
  return list.find((r) => typedWords.every((t) => words(r.name).some((w) => w.startsWith(t)))) ?? null;
}

/** The database's rows as requests, dropping any that aren't one; ranked by votes. */
export function asRequests(rows: unknown): FaceRequest[] {
  if (!Array.isArray(rows)) return [];
  const kinds = Object.keys(KIND_LABEL);
  return rows
    .filter(
      (r): r is { id: string; name: string; kind: RequestKind; votes: number; status: string } =>
        isObj(r) &&
        typeof r.id === "string" &&
        typeof r.name === "string" &&
        r.name.trim().length > 0 &&
        nameLength(r.name) <= NAME_MAX &&
        typeof r.kind === "string" &&
        kinds.includes(r.kind) &&
        Number.isInteger(r.votes) &&
        (r.votes as number) >= 0 &&
        (r.status === "listed" || r.status === "being-made"),
    )
    .sort((a, b) => b.votes - a.votes)
    .map((r, i) => ({ id: r.id, rank: i + 1, name: r.name.trim(), kind: r.kind, votes: r.votes, beingMade: r.status === "being-made" }));
}

export interface StandIn {
  fail: boolean;
  /** The "No requests yet" state (430:6931). */
  empty: boolean;
  delayMs: number;
}

interface Options {
  config: SupabaseConfig | null;
  standIn: StandIn | null;
  fetch?: typeof fetch;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function viaStandIn<T>(standIn: StandIn | null, value: T): Promise<T> {
  if (!standIn) throw new SupabaseError("network", "No database is set up for this site");
  await wait(standIn.delayMs);
  if (standIn.fail) throw new SupabaseError("network", "The preview's stand-in was asked to fail");
  return value;
}

/** The listed requests, most votes first. */
export async function loadRequests({ config, standIn, fetch: fetchImpl = fetch }: Options): Promise<FaceRequest[]> {
  if (!config) return viaStandIn(standIn, standIn?.empty ? [] : SAMPLE_REQUESTS);
  return asRequests(await rpc(config, "face_requests", {}, { method: "GET" }, fetchImpl));
}

/** Sends a new request for review (it shows once checked, D-96). */
export async function requestFace(name: string, { config, standIn, fetch: fetchImpl = fetch }: Options): Promise<void> {
  const clean = cleanName(name);
  if (!clean || nameLength(clean) > NAME_MAX) throw new Error("A request needs a name of 1 to 80 characters");
  if (!config) return viaStandIn(standIn, undefined);
  await rpc(config, "request_face", { name: clean }, { method: "POST" }, fetchImpl);
}

/** One vote for a request from this browser (its voter id); a second vote from the same browser counts once. */
export async function voteFor(requestId: string, voter: string, { config, standIn, fetch: fetchImpl = fetch }: Options): Promise<void> {
  if (!config) return viaStandIn(standIn, undefined);
  await rpc(config, "vote_face_request", { request_id: requestId, voter }, { method: "POST" }, fetchImpl);
}

/** The preview's stand-in for one call: ?request=fail, ?vote=fail and ?requests=none (the empty list). */
export function requestStandIn({ drafts, config, search }: { drafts: boolean; config: SupabaseConfig | null; search: string }, call: "list" | "request" | "vote"): StandIn | null {
  if (!drafts || config) return null;
  const params = new URLSearchParams(search);
  return { fail: call !== "list" && params.get(call) === "fail", empty: params.get("requests") === "none", delayMs: call === "list" ? 0 : 600 };
}
