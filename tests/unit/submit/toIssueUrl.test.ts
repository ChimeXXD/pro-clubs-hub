import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Context } from "@/lib/content/validate";
import { validateBuild, validateFace } from "@/lib/content/validate";
import type { Build, Face, Placeholder } from "@/lib/content/types";
import { FIELD_ID, MAX_ISSUE_URL_LENGTH, TEMPLATES, readIssueBody, toIssueUrl } from "@/lib/submit/toIssueUrl";
import faceGood from "../fixtures/face-good.json";
import buildGood from "../fixtures/build-good.json";

// SPEC §Acceptance: "/submit builds an issue URL whose body parses as valid JSON for the chosen kind".
const face = faceGood as unknown as Face<Placeholder>;
const build = buildGood as unknown as Build<Placeholder>;
const ctx: Context = {
  archetypeIds: new Set(["spark"]),
  creatorIds: new Set(["test-creator"]),
  buildIds: new Set(["test-spark-build"]),
  faceIds: new Set(),
};

/** The URL of a submission that fits, prefilled, or a failed test. */
function urlOf(link: ReturnType<typeof toIssueUrl>): URL {
  if (!link.prefilled) throw new Error(`expected a prefilled URL, got one ${link.length} characters long`);
  return new URL(link.url);
}

/** The issue body GitHub writes from the form: each field under its label, `render: json` fenced. */
const asGitHubRendersIt = (json: string) => `### Submission (JSON)\n\n\`\`\`json\n${json}\n\`\`\`\n\n### Anything else\n\n_No response_`;

describe("toIssueUrl", () => {
  it("opens a new issue on the project's repo, in the issue form for the kind", () => {
    const url = urlOf(toIssueUrl({ kind: "face", data: face }));
    expect(`${url.origin}${url.pathname}`).toBe("https://github.com/ChimeXXD/probuilds/issues/new");
    expect(url.searchParams.get("template")).toBe("submit-face.yml");
    expect(urlOf(toIssueUrl({ kind: "build", data: build })).searchParams.get("template")).toBe("submit-build.yml");
  });

  it("prefills a face as JSON that, as GitHub writes it into the issue, parses back to the same valid face", () => {
    const json = urlOf(toIssueUrl({ kind: "face", data: face })).searchParams.get(FIELD_ID) ?? "";
    const parsed = readIssueBody(asGitHubRendersIt(json));
    expect(parsed).toEqual(faceGood);
    expect(validateFace("faces/x.json", parsed, ctx)).toEqual([]);
  });

  it("prefills a build as JSON that, as GitHub writes it into the issue, parses back to the same valid build", () => {
    const json = urlOf(toIssueUrl({ kind: "build", data: build })).searchParams.get(FIELD_ID) ?? "";
    const parsed = readIssueBody(asGitHubRendersIt(json));
    expect(parsed).toEqual(buildGood);
    expect(validateBuild("builds/x.json", parsed, ctx)).toEqual([]);
  });

  it("titles the issue with the kind and the submission's title", () => {
    expect(urlOf(toIssueUrl({ kind: "face", data: face })).searchParams.get("title")).toBe("Face: Inspired by Test Footballer, 2010");
    expect(urlOf(toIssueUrl({ kind: "build", data: build })).searchParams.get("title")).toBe("Build: Test Spark build");
  });

  it("uses the id when a draft build's title is still PLACEHOLDER", () => {
    const draft = { ...build, status: "draft" as const, title: "PLACEHOLDER" as const };
    expect(urlOf(toIssueUrl({ kind: "build", data: draft })).searchParams.get("title")).toBe("Build: test-spark-build");
  });

  it("sends no labels parameter (GitHub 404s it for anyone who can't label issues); the form adds the labels", () => {
    expect([...urlOf(toIssueUrl({ kind: "face", data: face })).searchParams.keys()]).toEqual(["template", "title", FIELD_ID]);
  });

  it("carries characters URLs treat specially, accents and emoji through unchanged", () => {
    const odd = { ...face, limits: ["a & b # c + d % e ? f = g", "Mbappé, 👍, \"quoted\", back\\slash", "@someone #12"] };
    const json = urlOf(toIssueUrl({ kind: "face", data: odd })).searchParams.get(FIELD_ID) ?? "";
    expect(readIssueBody(asGitHubRendersIt(json))).toEqual(odd);
  });

  it("opens the empty form for a submission too long for GitHub's URL limit, never a cut one, so the page offers Copy JSON", () => {
    const long = { ...build, attributes: Array.from({ length: 300 }, (_, i) => ({ name: `Test attribute ${i}`, value: i })) };
    const link = toIssueUrl({ kind: "build", data: long });
    expect(link.prefilled).toBe(false);
    if (!link.prefilled) {
      expect(link.length).toBeGreaterThan(MAX_ISSUE_URL_LENGTH);
      const url = new URL(link.url);
      expect([...url.searchParams.keys()]).toEqual(["template", "title"]);
      expect(url.searchParams.get("template")).toBe("submit-build.yml");
    }
  });

  it("keeps every URL it returns within the limit", () => {
    const long = { ...build, attributes: Array.from({ length: 300 }, (_, i) => ({ name: `Test attribute ${i}`, value: i })) };
    for (const link of [toIssueUrl({ kind: "face", data: face }), toIssueUrl({ kind: "build", data: long })]) {
      expect(link.url.length).toBeLessThanOrEqual(MAX_ISSUE_URL_LENGTH);
    }
  });

  it("drops the title from the empty form when the title alone is too long for a link", () => {
    const link = toIssueUrl({ kind: "build", data: { ...build, title: "x".repeat(MAX_ISSUE_URL_LENGTH) } });
    expect(link.prefilled).toBe(false);
    expect(link.url.length).toBeLessThanOrEqual(MAX_ISSUE_URL_LENGTH);
    expect([...new URL(link.url).searchParams.keys()]).toEqual(["template"]);
  });
});

describe("issue form templates", () => {
  // The URL only prefills a field whose id the form declares; labels come from the form itself.
  for (const [kind, file] of Object.entries(TEMPLATES)) {
    it(`${file} exists, has the ${FIELD_ID} field rendered as JSON, and labels the ${kind} submission`, () => {
      const yml = readFileSync(new URL(`../../../.github/ISSUE_TEMPLATE/${file}`, import.meta.url), "utf8");
      expect(yml).toMatch(new RegExp(`^\\s*id: ${FIELD_ID}$`, "m"));
      expect(yml).toMatch(/^\s*render: json$/m);
      expect(yml).toMatch(new RegExp(`^labels: \\[submission, ${kind}\\]$`, "m"));
    });
  }
});

describe("readIssueBody", () => {
  it("reads the JSON out of the body GitHub writes from the form", () => {
    expect(readIssueBody(asGitHubRendersIt('{"id":"x"}'))).toEqual({ id: "x" });
  });

  it("reads JSON the submitter pasted with its own code fence into the empty form", () => {
    expect(readIssueBody(asGitHubRendersIt('```json\n{"id":"x"}\n```'))).toEqual({ id: "x" });
  });

  it("reads the JSON back after GitHub stores the body with Windows line endings", () => {
    expect(readIssueBody('```json\r\n{"id":"x"}\r\n```')).toEqual({ id: "x" });
  });

  it("fails clearly on a body with no JSON code block", () => {
    expect(() => readIssueBody('{"id":"x"}')).toThrow("no ```json code block in the issue body");
  });
});
