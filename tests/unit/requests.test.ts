import { describe, expect, it, vi } from "vitest";
import {
  asRequests,
  byKind,
  cleanName,
  findAsked,
  isVoterId,
  loadRequests,
  newVoterId,
  REQUEST_KINDS,
  requestFace,
  requestLine,
  SAMPLE_REQUESTS,
  SAMPLE_VOTED,
  voteFor,
} from "@/lib/requests";
import { SupabaseError } from "@/lib/supabase/client";

// Request a face (D-83, D-84, D-96; Figma 402:3451 and its states). Requests and votes live in Supabase; with no
// project the preview shows Figma's sample list and a local stand-in for every state.
const config = { url: "https://abc.supabase.co", anonKey: "anon" };
const answer = (status: number, body: unknown) =>
  vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }));

describe("the list", () => {
  it("is Figma's sample on the preview: five requests, most votes first, two voted", () => {
    expect(SAMPLE_REQUESTS.map((r) => [r.name, r.votes])).toEqual([
      ["2017 Ronaldo", 214],
      ["Kanye West", 167],
      ["2006 Ronaldinho", 121],
      ["Burna Boy", 96],
      ["Usain Bolt", 58],
    ]);
    expect([...SAMPLE_VOTED].map((id) => SAMPLE_REQUESTS.find((r) => r.id === id)?.name)).toEqual(["2017 Ronaldo", "2006 Ronaldinho"]);
  });

  it("words each row as Figma does", () => {
    expect(requestLine(SAMPLE_REQUESTS[0]!)).toBe("Footballer · Being made");
    expect(requestLine(SAMPLE_REQUESTS[1]!)).toBe("Musician");
  });

  it("filters by kind, keeping the rank from the whole list", () => {
    expect(REQUEST_KINDS.map((k) => k.label)).toEqual(["All", "Footballers", "Athletes", "Musicians"]);
    expect(byKind(SAMPLE_REQUESTS, "musician").map((r) => [r.rank, r.name])).toEqual([
      [2, "Kanye West"],
      [4, "Burna Boy"],
    ]);
  });

  it("finds a name already asked for while typing (430:6093)", () => {
    expect(findAsked(SAMPLE_REQUESTS, "Kanye")?.name).toBe("Kanye West");
    expect(findAsked(SAMPLE_REQUESTS, "ronaldinho 2006")?.name).toBe("2006 Ronaldinho");
    expect(findAsked(SAMPLE_REQUESTS, "  ")).toBeNull();
    expect(findAsked(SAMPLE_REQUESTS, "Ka")).toBeNull();
    expect(findAsked(SAMPLE_REQUESTS, "Messi")).toBeNull();
  });

  it("never trusts what the database sends: bad rows are dropped", () => {
    const rows = [
      { id: "a1", name: "Kanye West", kind: "musician", votes: 167, status: "listed" },
      { id: "a2", name: "", kind: "musician", votes: 3, status: "listed" },
      { id: "a3", name: "X", kind: "painter", votes: 3, status: "listed" },
      { id: "a4", name: "Y", kind: "athlete", votes: -1, status: "listed" },
      { id: "a5", name: "Z", kind: "athlete", votes: 2, status: "pending" },
    ];
    expect(asRequests(rows).map((r) => r.id)).toEqual(["a1"]);
  });

  it("counts a name's length in characters, as the database does", () => {
    const emoji = "\u{1F600}".repeat(41); // 41 characters, 82 UTF-16 units
    expect(asRequests([{ id: "e", name: emoji, kind: "musician", votes: 1, status: "listed" }])).toHaveLength(1);
    expect(asRequests([{ id: "e", name: "x".repeat(81), kind: "musician", votes: 1, status: "listed" }])).toHaveLength(0);
  });
});

describe("this browser's voter id", () => {
  it("is a version 4 uuid, made without crypto.randomUUID (missing on plain http)", () => {
    const id = newVoterId((b) => b.fill(0xff));
    expect(id).toBe("ffffffff-ffff-4fff-bfff-ffffffffffff");
    expect(isVoterId(id)).toBe(true);
    expect(isVoterId(newVoterId())).toBe(true);
  });

  it("is made again when the stored one isn't a uuid", () => {
    expect(isVoterId(null)).toBe(false);
    expect(isVoterId("voter-1")).toBe(false);
  });

  it("sends names as the database stores them", () => {
    expect(cleanName("  2006   Ronaldinho ")).toBe("2006 Ronaldinho");
  });
});

describe("Supabase calls", () => {
  it("loads the listed requests with face_requests", async () => {
    const fetch = answer(200, [{ id: "a1", name: "Kanye West", kind: "musician", votes: 167, status: "listed" }]);
    await expect(loadRequests({ config, standIn: null, fetch })).resolves.toEqual([
      { id: "a1", rank: 1, name: "Kanye West", kind: "musician", votes: 167, beingMade: false },
    ]);
    expect(String((fetch.mock.calls[0] as unknown as [string])[0])).toBe("https://abc.supabase.co/rest/v1/rpc/face_requests?");
  });

  it("sends a request and a vote, with this browser's voter id", async () => {
    const fetch = answer(200, null);
    await requestFace("2006 Ronaldinho", { config, standIn: null, fetch });
    await voteFor("a1", "voter-1", { config, standIn: null, fetch });
    const bodies = fetch.mock.calls.map((c) => JSON.parse(String((c as unknown as [string, RequestInit])[1].body)));
    expect(bodies).toEqual([{ name: "2006 Ronaldinho" }, { request_id: "a1", voter: "voter-1" }]);
  });

  it("refuses an empty or over-long name before sending", async () => {
    await expect(requestFace("  ", { config, standIn: null, fetch: answer(200, null) })).rejects.toThrow();
    await expect(requestFace("x".repeat(81), { config, standIn: null, fetch: answer(200, null) })).rejects.toThrow();
  });

  it("uses the preview's stand-in, which can fail on purpose; the live site with no database fails", async () => {
    await expect(loadRequests({ config: null, standIn: { fail: false, empty: false, delayMs: 0 } })).resolves.toHaveLength(5);
    await expect(loadRequests({ config: null, standIn: { fail: false, empty: true, delayMs: 0 } })).resolves.toEqual([]);
    await expect(requestFace("Messi", { config: null, standIn: { fail: true, empty: false, delayMs: 0 } })).rejects.toBeInstanceOf(SupabaseError);
    await expect(voteFor("a1", "v", { config: null, standIn: null })).rejects.toBeInstanceOf(SupabaseError);
  });
});
