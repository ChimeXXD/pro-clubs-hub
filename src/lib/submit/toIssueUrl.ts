// The prefilled GitHub issue that "Submit for review" opens (A-04, D-09): the face or build as JSON in
// the issue body, for Chime to review, credit and merge. No server. The page validates the submission
// first (CLAUDE.md rule 6); this only builds the link.
//
// GitHub rules this follows (docs.github.com, "Creating an issue", read 23 Nov 2026):
// - A `labels` parameter needs permission to label issues, else GitHub answers 404, so a public
//   submitter's link carries none. Labels for submissions belong in an issue template (open question).
// - A URL over the server's limit answers 414. GitHub gives no number. Measured 23 Nov 2026 with curl,
//   signed out (GitHub sends the visitor to log in first): up to 6,986 characters redirected to login,
//   7,026 and up failed with 500, 8,166 and up with 414. Signed in wasn't measured.
//   Over the limit, the link is refused, never cut, and the page offers "Copy JSON" (P1-8).
import type { Build, Face, Placeholder } from "../content/types.ts";
import { REPO } from "../site.ts";

/** Below the 7,000-character failure measured signed out, with room to spare. */
export const MAX_ISSUE_URL_LENGTH = 6500;

export type Submission = { kind: "face"; data: Face<Placeholder> } | { kind: "build"; data: Build<Placeholder> };

export type IssueLink = { ok: true; url: string } | { ok: false; reason: "too-long"; length: number };

// TODO(Chime): the docs don't give the issue title's wording; "Face: …" and "Build: …" stand in.
const KIND_NAME = { face: "Face", build: "Build" } as const;

const FENCE = "```";

export function toIssueUrl(submission: Submission): IssueLink {
  const { kind, data } = submission;
  const name = data.title === "PLACEHOLDER" ? data.id : data.title;
  // Compact JSON in a code block: the block stops GitHub turning @names into mentions and #12 into
  // links, and JSON.stringify escapes newlines, so no line inside can close the block early.
  const body = `${FENCE}json\n${JSON.stringify(data)}\n${FENCE}`;
  const query = new URLSearchParams({ title: `${KIND_NAME[kind]}: ${name}`, body });
  const url = `https://github.com/${REPO}/issues/new?${query}`;
  return url.length <= MAX_ISSUE_URL_LENGTH ? { ok: true, url } : { ok: false, reason: "too-long", length: url.length };
}

/** The JSON inside an issue body that toIssueUrl wrote, for checking a submission when it arrives. */
export function readIssueBody(body: string): unknown {
  const match = /```json\r?\n([\s\S]*?)\r?\n```/.exec(body);
  if (!match?.[1]) throw new Error(`no ${FENCE}json code block in the issue body`);
  return JSON.parse(match[1]);
}
