import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { problemsIn, validateDir } from "../../scripts/validate-content.mjs";

describe("validate-content (Phase 0 checks; the full validator is src/lib/content in Phase 1)", () => {
  it("lets a draft hold PLACEHOLDER and _example", () => {
    expect(problemsIn("faces/x.json", { status: "draft", _example: "why", title: "PLACEHOLDER" })).toEqual([]);
  });

  it("fails a published file with PLACEHOLDER anywhere, however deep", () => {
    const file = { status: "published", parts: [{ steps: [{ value: { number: "PLACEHOLDER" } }] }] };
    expect(problemsIn("faces/x.json", file)).toEqual(["faces/x.json: published but contains \"PLACEHOLDER\""]);
  });

  it("fails a published file that still carries _example", () => {
    expect(problemsIn("builds/x.json", { status: "published", _example: "why" })).toEqual([
      "builds/x.json: published but still has _example",
    ]);
  });

  it("fails a status that is not draft, published or withdrawn", () => {
    expect(problemsIn("faces/x.json", { status: "Published", title: "PLACEHOLDER" })).toEqual([
      'faces/x.json: status "Published" is not one of draft, published, withdrawn',
    ]);
  });

  it("passes every file in content/ today", () => {
    expect(validateDir(join(import.meta.dirname, "..", "..", "content"))).toEqual([]);
  });
});
