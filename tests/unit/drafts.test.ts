import { describe, expect, it } from "vitest";
import { showDrafts } from "@/lib/drafts";

// Drafts show only on the preview site (Chime, 26 Nov). Cloudflare Pages names the branch it builds in
// CF_PAGES_BRANCH; main is probuilds.club, so it never shows drafts.
describe("showDrafts", () => {
  it("is off for the live site and for a plain local build", () => {
    expect(showDrafts({ CF_PAGES_BRANCH: "main" })).toBe(false);
    expect(showDrafts({})).toBe(false);
  });

  it("is on for a Cloudflare preview branch", () => {
    expect(showDrafts({ CF_PAGES_BRANCH: "preview" })).toBe(true);
  });

  it("is on locally when asked, but never on main even if asked", () => {
    expect(showDrafts({ PROBUILDS_DRAFTS: "1" })).toBe(true);
    expect(showDrafts({ PROBUILDS_DRAFTS: "1", CF_PAGES_BRANCH: "main" })).toBe(false);
  });
});
