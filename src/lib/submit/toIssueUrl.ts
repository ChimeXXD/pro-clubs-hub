// The GitHub issue that "Submit for review" opens (A-04, D-09, D-45): the issue form for the kind, with the
// face or build as JSON in its one JSON field, for Chime to review, credit and merge. No server. The page
// validates the submission first (CLAUDE.md rule 6); this only builds the link.
//
// GitHub rules this follows (docs.github.com, "Creating an issue" and "Syntax for issue forms", read 23 Nov 2026):
// - A query parameter named like a form field's id prefills that field; the form's own `labels` are added
//   for anyone. A `labels` parameter would need permission to label issues, else GitHub answers 404.
// - A URL over the server's limit answers 414. GitHub gives no number. Measured 23 Nov 2026 with curl,
//   signed out (GitHub sends the visitor to log in first): up to 6,986 characters redirected to login,
//   7,026 and up failed with 500, 8,166 and up with 414. Signed in wasn't measured.
//   Over the limit, the JSON is never cut: the link opens the empty form and the page offers "Copy JSON"
//   to paste into it (P1-8).
import type { Build, Face, Placeholder } from "../content/types.ts";
import { REPO } from "../site.ts";

/** Below the 7,000-character failure measured signed out, with room to spare. */
export const MAX_ISSUE_URL_LENGTH = 6500;

/** The issue forms in .github/ISSUE_TEMPLATE/, and the id of the JSON field each declares. */
export const TEMPLATES = { face: "submit-face.yml", build: "submit-build.yml" } as const;
export const FIELD_ID = "json";

export type Submission = { kind: "face"; data: Face<Placeholder> } | { kind: "build"; data: Build<Placeholder> };

/** `prefilled: false` is the empty form, for a submission too long to carry: the page offers Copy JSON. */
export type IssueLink = { prefilled: true; url: string } | { prefilled: false; url: string; length: number };

// TODO(Chime): the docs don't give the issue title's wording; "Face: …" and "Build: …" stand in.
const KIND_NAME = { face: "Face", build: "Build" } as const;

const FENCE = "```";

export function toIssueUrl(submission: Submission): IssueLink {
  const { kind, data } = submission;
  const name = data.title === "PLACEHOLDER" ? data.id : data.title;
  const form = new URLSearchParams({ template: TEMPLATES[kind], title: `${KIND_NAME[kind]}: ${name}` });
  // Compact JSON: the form's `render: json` puts it in a code block in the issue, so @names ping no one
  // and #12 links nothing, and JSON.stringify escapes newlines, so no line inside can close the block.
  const filled = new URLSearchParams(form);
  filled.set(FIELD_ID, JSON.stringify(data));
  const base = `https://github.com/${REPO}/issues/new?`;
  const url = base + filled;
  if (url.length <= MAX_ISSUE_URL_LENGTH) return { prefilled: true, url };
  // The empty form keeps the title when it fits; a title too long for a link falls back to the form's own.
  const empty = base + form;
  const fallback = empty.length <= MAX_ISSUE_URL_LENGTH ? empty : base + new URLSearchParams({ template: TEMPLATES[kind] });
  return { prefilled: false, url: fallback, length: url.length };
}

/** The JSON inside an issue body the form wrote, for checking a submission when it arrives. */
export function readIssueBody(body: string): unknown {
  const match = /```json\r?\n([\s\S]*?)\r?\n```/.exec(body);
  if (!match?.[1]) throw new Error(`no ${FENCE}json code block in the issue body`);
  // Someone who pasted already-fenced JSON into the empty form leaves a fence inside the form's own.
  return JSON.parse(match[1].replace(/^```(?:json)?\r?\n/, ""));
}
