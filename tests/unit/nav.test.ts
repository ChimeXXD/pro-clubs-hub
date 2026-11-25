import { describe, expect, it } from "vitest";
import { FOOTER_LINKS, isCurrent, SECTIONS } from "@/lib/nav";

// The bottom nav (phone) and the top bar nav (tablet, desktop) mark one section as current (Figma 282:521, 205:407).
describe("nav", () => {
  it("lists the five bottom-nav sections in the design's order", () => {
    expect(SECTIONS.map((s) => s.label)).toEqual(["Home", "Faces", "Builds", "Changelog", "Submit"]);
  });

  it("lists the footer links in the design's order", () => {
    expect(FOOTER_LINKS.map((l) => l.label)).toEqual(["About", "Changelog", "Submit", "Takedown"]);
  });

  it("marks Home only on the home page", () => {
    expect(isCurrent("/", "/")).toBe(true);
    expect(isCurrent("/", "/faces")).toBe(false);
  });

  it("marks a section on its own page and the pages under it, with or without a trailing slash", () => {
    expect(isCurrent("/builds", "/builds")).toBe(true);
    expect(isCurrent("/builds", "/builds/")).toBe(true);
    expect(isCurrent("/builds", "/builds/finisher/meta-finisher")).toBe(true);
  });

  it("doesn't mark a section whose name merely starts the path", () => {
    expect(isCurrent("/faces", "/faces-requests")).toBe(false);
    expect(isCurrent("/faces", "/about")).toBe(false);
  });
});
