import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { BuildPageView } from "@/components/builds/BuildPageView";
import { loadContent, type LoadedBuild } from "@/lib/content/load";
import {
  asSharedBuild,
  fetchSharedBuild,
  isShareId,
  SAMPLE_SHARE_ID,
  sampleSharedBuild,
  sharedBuildPageView,
  shareIdFromPath,
  toBuildDocument,
} from "@/lib/shared-build";

// A player's shared build (D-99 (2), D-100 (1)): saved in Supabase under a short id, opened at /b/<id> by a static
// page that loads it in the browser. Figma 439:8847 / 439:9404 / 439:9925 draw it with Figma's sample, "My Finisher".
const content = loadContent(join(process.cwd(), "content"), { includeDrafts: true });
const sources = content.archetypeFile.sources;
const meta = content.builds.find((b) => b.id === "meta-finisher") as LoadedBuild;
const sample = sampleSharedBuild(meta);

describe("share ids and paths", () => {
  it("reads the id from /b/<id>, with or without a trailing slash", () => {
    expect(shareIdFromPath("/b/k7x2m9")).toBe("k7x2m9");
    expect(shareIdFromPath("/b/k7x2m9/")).toBe("k7x2m9");
    expect(shareIdFromPath("/b")).toBeNull();
    expect(shareIdFromPath("/b/")).toBeNull();
    expect(shareIdFromPath("/b/K7X2M9")).toBeNull();
    expect(shareIdFromPath("/b/k7x2m9/extra")).toBeNull();
    expect(shareIdFromPath("/builds/finisher")).toBeNull();
  });

  it("takes six lower-case letters and digits, as probuilds.club/b/k7x2m9", () => {
    expect(SAMPLE_SHARE_ID).toBe("k7x2m9");
    expect(isShareId("k7x2m9")).toBe(true);
    for (const bad of ["k7x2m", "k7x2m90", "k7x2m!", "", "K7X2M9"]) expect(isShareId(bad)).toBe(false);
  });
});

describe("Figma's sample shared build (439:8847)", () => {
  it("is the Meta Finisher sample renamed My Finisher, with no badge, as drawn", () => {
    expect(sample.title).toBe("My Finisher");
    expect(sample.badge).toBeNull();
    expect(sample.attributes).toEqual(meta.attributes);
    expect(sample.credits.map((c) => [c.role, c.name])).toEqual([["made-by", "— (sample)"]]);
  });

  it("words the page as the frame draws it", () => {
    const view = sharedBuildPageView(sample, sources, SAMPLE_SHARE_ID);
    expect(view.shared).toEqual({
      tag: "Shared build",
      line: "Shared by a player · not on ProBuilds' lists yet",
      makeYourOwn: { label: "Make your own build", href: "/submit" },
    });
    expect(view.badge).toBeNull();
    expect(view.sampleLabel).toBeNull();
    expect(view.credit).toBe("Shared from Submit a build");
    expect(view.uncheckedNote).toBe("A player shared this build. It goes on ProBuilds' lists only after Chime plays it in game.");
    expect(view.versionTag).toBe("FC 27 · Season 2 · Not yet checked in game");
    expect(view.share.overview.link).toBe("probuilds.club/b/k7x2m9");
    // The sample's figures and footnote stay, as the frame draws them.
    expect(view.levels?.initial).toBe(55);
    expect(view.footnote).toMatch(/^Draft only:/);
  });

  it("renders Builds / Shared build, the tag and line, the note above Share build and Make your own build", () => {
    const html = renderToStaticMarkup(createElement(BuildPageView, { view: sharedBuildPageView(sample, sources, SAMPLE_SHARE_ID) }));
    expect(html).toMatch(/<a[^>]*href="\/builds"[^>]*>Builds<\/a>/);
    expect(html).toMatch(/aria-current="page"[^>]*>Shared build</);
    expect(html).toContain(">Shared build</span>");
    expect(html).toContain("Shared by a player · not on ProBuilds&#x27; lists yet");
    expect(html).toMatch(/<h1[^>]*><span[^>]*>My Finisher<\/span><\/h1>/);
    expect(html.indexOf("A player shared this build.")).toBeLessThan(html.indexOf(">Share build</button>"));
    expect(html).toMatch(/<a[^>]*href="\/submit"[^>]*>Make your own build<\/a>/);
    expect(html).not.toContain("Meta pick");
    expect(html).not.toContain("Sample build · values");
  });
});

describe("a shared build from Supabase is never trusted (CLAUDE.md rule 6)", () => {
  // The sample's summary is "PLACEHOLDER" (Figma draws none); a player's build carries its own words.
  const doc = toBuildDocument({ ...meta, id: "my-build", slug: "my-build", title: "My Build", summary: "Pace and finishing.", badge: null, sample: undefined });

  it("turns a valid build document back into a build", () => {
    const build = asSharedBuild(doc, content.archetypeFile);
    expect(build?.title).toBe("My Build");
    expect(build?.archetype.id).toBe("finisher");
    expect(build?.credits[0]).toMatchObject({ role: "made-by", name: "— (sample)", creator: null });
  });

  it("refuses anything the validator refuses, a published or sample document, or an unknown archetype", () => {
    expect(asSharedBuild(null, content.archetypeFile)).toBeNull();
    expect(asSharedBuild({ ...doc, title: "" }, content.archetypeFile)).toBeNull();
    expect(asSharedBuild({ ...doc, status: "published" }, content.archetypeFile)).toBeNull();
    expect(asSharedBuild({ ...doc, archetype: "striker" }, content.archetypeFile)).toBeNull();
    expect(asSharedBuild(toBuildDocument(meta), content.archetypeFile)).toBeNull(); // carries sample figures
    // A draft lets "PLACEHOLDER" through the validator; a shared page would print it with no draft tag.
    expect(asSharedBuild({ ...doc, level: "PLACEHOLDER" }, content.archetypeFile)).toBeNull();
    expect(asSharedBuild({ ...doc, body: { ...(doc.body as object), heightCm: "PLACEHOLDER" } }, content.archetypeFile)).toBeNull();
  });

  it("drops a badge or an in-game check the player wrote: only Chime sets those (D-30)", () => {
    const claimed = { ...doc, badge: "meta", versionTag: { ...(doc.versionTag as object), verifiedOn: "2026-11-19", verifiedBy: "Chime" } };
    const build = asSharedBuild(claimed, content.archetypeFile);
    expect(build?.badge).toBeNull();
    expect(build?.versionTag).toMatchObject({ verifiedOn: null, verifiedBy: null });
    const view = sharedBuildPageView(build as LoadedBuild, sources, "abc234");
    expect(view.credit).not.toContain("Played for one match");
    expect(view.versionTag).toMatch(/Not yet checked in game$/);
  });

  it("shows the mannequin, whatever picture the document names (D-100 (1))", () => {
    const withPicture = { ...doc, picture: { file: "builds/x.webp", alt: "x", by: "someone" } };
    const build = asSharedBuild(withPicture, content.archetypeFile);
    expect(build).not.toBeNull();
    expect(build?.picture).toBeNull();
  });

  it("loads by id through the shared_build function, and anything else is a link that doesn't work", async () => {
    const config = { url: "https://abc.supabase.co", anonKey: "k" };
    const answer = (body: unknown, status = 200) =>
      vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } })) as unknown as typeof fetch;
    const found = await fetchSharedBuild("abc234", { config, archetypeFile: content.archetypeFile, fetch: answer(doc) });
    expect(found?.title).toBe("My Build");
    expect(await fetchSharedBuild("abc234", { config, archetypeFile: content.archetypeFile, fetch: answer(null) })).toBeNull();
    expect(await fetchSharedBuild("abc234", { config, archetypeFile: content.archetypeFile, fetch: answer({ message: "x" }, 500) })).toBeNull();
    expect(await fetchSharedBuild("abc234", { config: null, archetypeFile: content.archetypeFile, fetch: answer(doc) })).toBeNull();
    expect(await fetchSharedBuild("BAD", { config, archetypeFile: content.archetypeFile, fetch: answer(doc) })).toBeNull();
  });
});
