// Submit a build's two calls to Supabase (D-96, D-99), through the small client (src/lib/supabase/client.ts):
// "Send for listing" stores the build for Chime's review with submit_build (D-99 (1)); "Share card" and "Copy link"
// store it under a short id with create_shared_build (D-99 (2)). Both are database functions
// (docs/supabase-schema.sql): the tables stay closed to the browser's anon key.
// With no Supabase settings, the preview site (drafts on, D-104) uses a local stand-in so every state Figma draws
// can be shown: it works after a short wait, or fails when the address says ?send=fail (sending) or ?share=fail (the
// link). The live site never has a stand-in: with no database, sending fails and says so (Figma 441:8928).
import { SAMPLE_SHARE_ID, isShareId } from "../shared-build.ts";
import { rpc, SupabaseError, type SupabaseConfig } from "../supabase/client.ts";

export interface StandIn {
  fail: boolean;
  delayMs: number;
}

interface Options {
  config: SupabaseConfig | null;
  standIn: StandIn | null;
  fetch?: typeof fetch;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The stand-in for one call, on the preview with no database only: `?send=fail` makes Send for listing fail,
 * `?share=fail` makes the short link fail, each alone.
 */
export function standInFrom(
  { drafts, config, search }: { drafts: boolean; config: SupabaseConfig | null; search: string },
  call: "send" | "share",
): StandIn | null {
  if (!drafts || config) return null;
  return { fail: new URLSearchParams(search).get(call) === "fail", delayMs: 600 };
}

async function viaStandIn<T>(standIn: StandIn | null, value: T): Promise<T> {
  if (!standIn) throw new SupabaseError("network", "No database is set up for this site");
  await wait(standIn.delayMs);
  if (standIn.fail) throw new SupabaseError("network", "The preview's stand-in was asked to fail");
  return value;
}

/** Stores the build for review (D-86: listed only after Chime plays it). Throws a SupabaseError when it doesn't go through. */
export async function sendForListing(build: Record<string, unknown>, { config, standIn, fetch: fetchImpl = fetch }: Options): Promise<void> {
  if (!config) return viaStandIn(standIn, undefined);
  await rpc(config, "submit_build", { build }, { method: "POST" }, fetchImpl);
}

/** Stores the build under a short id and returns it: probuilds.club/b/<id>. */
export async function makeShareLink(build: Record<string, unknown>, { config, standIn, fetch: fetchImpl = fetch }: Options): Promise<string> {
  if (!config) return viaStandIn(standIn, SAMPLE_SHARE_ID);
  const id = await rpc<unknown>(config, "create_shared_build", { build }, { method: "POST" }, fetchImpl);
  if (typeof id !== "string" || !isShareId(id)) throw new SupabaseError("http", "Supabase didn't answer with a share id");
  return id;
}
