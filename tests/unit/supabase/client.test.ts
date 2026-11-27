import { describe, expect, it, vi } from "vitest";
import { insert, rpc, select, supabaseConfig, SupabaseError } from "@/lib/supabase/client";

// The small Supabase client (D-96, D-99): plain fetch against PostgREST, no supabase-js. Configured from
// NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY; with neither, there is no client.
const config = { url: "https://abc.supabase.co", anonKey: "anon-key" };

/** A fetch that records its call and answers with `body` and `status`. */
function fakeFetch(body: unknown, status = 200) {
  const calls: { url: string; init: RequestInit }[] = [];
  const fn = vi.fn(async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return new Response(body === undefined ? null : JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
  });
  return { fn: fn as unknown as typeof fetch, calls };
}

describe("supabaseConfig", () => {
  it("needs both the URL and the anon key, and drops a trailing slash", () => {
    expect(supabaseConfig({ url: "https://abc.supabase.co/", anonKey: "k" })).toEqual({ url: "https://abc.supabase.co", anonKey: "k" });
    expect(supabaseConfig({ url: undefined, anonKey: "k" })).toBeNull();
    expect(supabaseConfig({ url: "https://abc.supabase.co", anonKey: "" })).toBeNull();
    expect(supabaseConfig({ url: "not a url", anonKey: "k" })).toBeNull();
  });
});

describe("select", () => {
  it("reads rows with PostgREST filters, sending the anon key", async () => {
    const { fn, calls } = fakeFetch([{ id: "a" }]);
    const rows = await select(config, "face_requests", { filters: { status: "eq.listed" }, columns: "id,name", limit: 20 }, fn);
    expect(rows).toEqual([{ id: "a" }]);
    expect(calls[0]?.url).toBe("https://abc.supabase.co/rest/v1/face_requests?select=id%2Cname&status=eq.listed&limit=20");
    expect(calls[0]?.init.method).toBe("GET");
    expect(calls[0]?.init.headers).toMatchObject({ apikey: "anon-key", Authorization: "Bearer anon-key", Accept: "application/json" });
  });
});

describe("rpc", () => {
  it("calls a function with GET and its arguments in the query (read only)", async () => {
    const { fn, calls } = fakeFetch({ id: "k7x2m9" });
    expect(await rpc(config, "shared_build", { share_id: "k7x2m9" }, { method: "GET" }, fn)).toEqual({ id: "k7x2m9" });
    expect(calls[0]?.url).toBe("https://abc.supabase.co/rest/v1/rpc/shared_build?share_id=k7x2m9");
    expect(calls[0]?.init.method).toBe("GET");
  });

  it("calls a function with POST and a JSON body by default", async () => {
    const { fn, calls } = fakeFetch("k7x2m9");
    expect(await rpc(config, "create_shared_build", { build: { id: "x" } }, {}, fn)).toBe("k7x2m9");
    expect(calls[0]?.url).toBe("https://abc.supabase.co/rest/v1/rpc/create_shared_build");
    expect(calls[0]?.init.method).toBe("POST");
    expect(calls[0]?.init.body).toBe(JSON.stringify({ build: { id: "x" } }));
    expect(calls[0]?.init.headers).toMatchObject({ "Content-Type": "application/json" });
  });
});

describe("insert", () => {
  it("posts one row and asks for nothing back unless told", async () => {
    const { fn, calls } = fakeFetch(undefined, 201);
    expect(await insert(config, "face_votes", { request_id: 4 }, {}, fn)).toBeNull();
    expect(calls[0]?.init.method).toBe("POST");
    expect(calls[0]?.init.headers).toMatchObject({ Prefer: "return=minimal" });
    const back = fakeFetch([{ id: 9 }], 201);
    expect(await insert(config, "face_requests", { name: "x" }, { returning: true }, back.fn)).toEqual({ id: 9 });
    expect(back.calls[0]?.init.headers).toMatchObject({ Prefer: "return=representation" });
  });
});

describe("errors", () => {
  it("turns PostgREST's error body into a SupabaseError with the status and code", async () => {
    const { fn } = fakeFetch({ code: "42501", message: "new row violates row-level security policy", details: null, hint: null }, 401);
    const error = await select(config, "shared_builds", {}, fn).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(SupabaseError);
    expect(error).toMatchObject({ kind: "http", status: 401, code: "42501", message: "new row violates row-level security policy" });
  });

  it("names a failed connection 'network' and a slow one 'timeout'", async () => {
    const offline = (async () => {
      throw new TypeError("Failed to fetch");
    }) as unknown as typeof fetch;
    await expect(select(config, "x", {}, offline)).rejects.toMatchObject({ kind: "network" });
    const slow = (async () => {
      throw new DOMException("The operation timed out.", "TimeoutError");
    }) as unknown as typeof fetch;
    await expect(select(config, "x", {}, slow)).rejects.toMatchObject({ kind: "timeout" });
  });

  it("refuses a table or function name that isn't a plain identifier", async () => {
    const { fn } = fakeFetch([]);
    await expect(select(config, "x?select=*", {}, fn)).rejects.toThrow("not a table name");
    await expect(rpc(config, "../admin", {}, {}, fn)).rejects.toThrow("not a function name");
  });
});
