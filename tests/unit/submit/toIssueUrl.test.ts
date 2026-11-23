import { describe, expect, it } from "vitest";
import type { Context } from "@/lib/content/validate";
import { validateBuild, validateFace } from "@/lib/content/validate";
import type { Build, Face, Placeholder } from "@/lib/content/types";
import { MAX_ISSUE_URL_LENGTH, readIssueBody, toIssueUrl } from "@/lib/submit/toIssueUrl";
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

/** The URL of a submission that fits, or a failed test. */
function urlOf(link: ReturnType<typeof toIssueUrl>): URL {
  if (!link.ok) throw new Error(`expected a URL, got ${link.reason} (${link.length})`);
  return new URL(link.url);
}

describe("toIssueUrl", () => {
  it("opens a new issue on the project's repo", () => {
    const url = urlOf(toIssueUrl({ kind: "face", data: face }));
    expect(`${url.origin}${url.pathname}`).toBe("https://github.com/ChimeXXD/pro-clubs-hub/issues/new");
  });

  it("puts a face in the body as JSON that parses back to the same valid face", () => {
    const body = urlOf(toIssueUrl({ kind: "face", data: face })).searchParams.get("body") ?? "";
    const parsed = readIssueBody(body);
    expect(parsed).toEqual(faceGood);
    expect(validateFace("faces/x.json", parsed, ctx)).toEqual([]);
  });

  it("puts a build in the body as JSON that parses back to the same valid build", () => {
    const body = urlOf(toIssueUrl({ kind: "build", data: build })).searchParams.get("body") ?? "";
    const parsed = readIssueBody(body);
    expect(parsed).toEqual(buildGood);
    expect(validateBuild("builds/x.json", parsed, ctx)).toEqual([]);
  });

  it("keeps the JSON in a code block, so a name like @someone or #12 pings no one and links nothing", () => {
    const body = urlOf(toIssueUrl({ kind: "face", data: face })).searchParams.get("body") ?? "";
    expect(body.startsWith("```json\n")).toBe(true);
    expect(body.endsWith("\n```")).toBe(true);
  });

  it("titles the issue with the kind and the submission's title", () => {
    expect(urlOf(toIssueUrl({ kind: "face", data: face })).searchParams.get("title")).toBe("Face: Inspired by Test Footballer, 2010");
    expect(urlOf(toIssueUrl({ kind: "build", data: build })).searchParams.get("title")).toBe("Build: Test Spark build");
  });

  it("uses the id when a draft build's title is still PLACEHOLDER", () => {
    const draft = { ...build, status: "draft" as const, title: "PLACEHOLDER" as const };
    expect(urlOf(toIssueUrl({ kind: "build", data: draft })).searchParams.get("title")).toBe("Build: test-spark-build");
  });

  it("sends only title and body: GitHub 404s a labels parameter for anyone who can't label issues", () => {
    expect([...urlOf(toIssueUrl({ kind: "face", data: face })).searchParams.keys()]).toEqual(["title", "body"]);
  });

  it("carries characters URLs treat specially, accents and emoji through unchanged", () => {
    const odd = { ...face, limits: ["a & b # c + d % e ? f = g", "Mbappé, 👍, \"quoted\", back\\slash", "@someone #12"] };
    const body = urlOf(toIssueUrl({ kind: "face", data: odd })).searchParams.get("body") ?? "";
    expect(readIssueBody(body)).toEqual(odd);
  });

  it("refuses a submission too long for GitHub's URL limit instead of cutting it, so the page offers Copy JSON", () => {
    const long = { ...build, attributes: Array.from({ length: 300 }, (_, i) => ({ name: `Test attribute ${i}`, value: i })) };
    const link = toIssueUrl({ kind: "build", data: long });
    expect(link.ok).toBe(false);
    if (!link.ok) {
      expect(link.reason).toBe("too-long");
      expect(link.length).toBeGreaterThan(MAX_ISSUE_URL_LENGTH);
    }
  });

  it("keeps every URL it returns within the limit", () => {
    const link = toIssueUrl({ kind: "face", data: face });
    expect(link.ok && link.url.length).toBeLessThanOrEqual(MAX_ISSUE_URL_LENGTH);
  });
});

describe("readIssueBody", () => {
  it("reads the JSON back after GitHub stores the body with Windows line endings", () => {
    expect(readIssueBody('```json\r\n{"id":"x"}\r\n```')).toEqual({ id: "x" });
  });

  it("fails clearly on a body with no JSON code block", () => {
    expect(() => readIssueBody('{"id":"x"}')).toThrow("no ```json code block in the issue body");
  });
});
