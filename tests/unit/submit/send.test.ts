import { describe, expect, it, vi } from "vitest";
import { SupabaseError } from "@/lib/supabase/client";
import { makeShareLink, sendForListing, standInFrom } from "@/lib/submit/send";

// "Send for listing" stores the build in Supabase (D-99 (1)); "Share card" and "Copy link" make its short /b/ link
// (D-99 (2)). With no Supabase settings the preview uses a stand-in so every state can be shown; the live site has
// no stand-in, so it can never say a send worked when it didn't.
const config = { url: "https://abc.supabase.co", anonKey: "anon" };
const doc = { id: "my-finisher", status: "draft" } as Record<string, unknown>;

const answer = (status: number, body: unknown) =>
  vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }));

describe("sendForListing", () => {
  it("calls submit_build with the build document", async () => {
    const fetch = answer(200, "3f1c8a52-9d0e-4b2a-8f51-6a1d2c3b4e5f");
    await sendForListing(doc, { config, standIn: null, fetch });
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://abc.supabase.co/rest/v1/rpc/submit_build");
    expect(init.method).toBe("POST");
    expect(JSON.parse(String(init.body))).toEqual({ build: doc });
  });

  it("fails when the database refuses it (a rate limit, or a bad build)", async () => {
    const fetch = answer(429, { message: "too many submissions", code: "P0001" });
    await expect(sendForListing(doc, { config, standIn: null, fetch })).rejects.toBeInstanceOf(SupabaseError);
  });

  it("fails on the live site with no database: it never pretends", async () => {
    await expect(sendForListing(doc, { config: null, standIn: null })).rejects.toBeInstanceOf(SupabaseError);
  });

  it("uses the preview's stand-in: works, or fails when asked to", async () => {
    await expect(sendForListing(doc, { config: null, standIn: { fail: false, delayMs: 0 } })).resolves.toBeUndefined();
    await expect(sendForListing(doc, { config: null, standIn: { fail: true, delayMs: 0 } })).rejects.toBeInstanceOf(SupabaseError);
  });
});

describe("makeShareLink", () => {
  it("calls create_shared_build and returns the new id", async () => {
    const fetch = answer(200, "q4m8zt");
    await expect(makeShareLink(doc, { config, standIn: null, fetch })).resolves.toBe("q4m8zt");
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://abc.supabase.co/rest/v1/rpc/create_shared_build");
    expect(JSON.parse(String(init.body))).toEqual({ build: doc });
  });

  it("refuses an answer that isn't a share id", async () => {
    await expect(makeShareLink(doc, { config, standIn: null, fetch: answer(200, "<html>") })).rejects.toBeInstanceOf(SupabaseError);
  });

  it("gives the preview Figma's sample link, which /b/ opens", async () => {
    await expect(makeShareLink(doc, { config: null, standIn: { fail: false, delayMs: 0 } })).resolves.toBe("k7x2m9");
    await expect(makeShareLink(doc, { config: null, standIn: null })).rejects.toBeInstanceOf(SupabaseError);
  });
});

describe("standInFrom", () => {
  it("is on only on the preview with no database, and each call fails only when the address asks for it", () => {
    expect(standInFrom({ drafts: true, config: null, search: "" }, "send")).toEqual({ fail: false, delayMs: 600 });
    expect(standInFrom({ drafts: true, config: null, search: "?state=name&send=fail" }, "send")).toEqual({ fail: true, delayMs: 600 });
    expect(standInFrom({ drafts: true, config: null, search: "?state=name&send=fail" }, "share")).toEqual({ fail: false, delayMs: 600 });
    expect(standInFrom({ drafts: true, config: null, search: "?share=fail" }, "share")).toEqual({ fail: true, delayMs: 600 });
    expect(standInFrom({ drafts: false, config: null, search: "?send=fail" }, "send")).toBeNull();
    expect(standInFrom({ drafts: true, config, search: "" }, "send")).toBeNull();
  });
});
