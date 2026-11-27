"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Toast } from "@/components/ui/Toast";
import {
  cleanName,
  type FaceRequest,
  findAsked,
  isVoterId,
  loadRequests,
  newVoterId,
  type RequestKind,
  requestFace,
  requestStandIn,
  SAMPLE_VOTED,
  voteFor,
} from "@/lib/requests";
import { SUPABASE } from "@/lib/supabase/client";
import { type FormState, RequestForm } from "./RequestForm";
import { HowItWorks, RequestList } from "./RequestList";

// Request a face (Figma 402:3451 / 418:9607 / 418:9742 and its states; D-83, D-84, D-96, D-100 (3)). Phone and
// tablet: the title, the request form, the list and how it works, one column; desktop: the title, form and how it
// works in a 440 px column, the list beside it (96 px apart). A vote counts once per browser: this browser's voter
// id and its votes are kept in localStorage. A vote shows at once and is taken back with "Your vote didn't go
// through. Try again." if it fails. On the preview ?state= opens typing, sent, request-failed and vote-failed, and
// ?requests=none, ?request=fail and ?vote=fail drive the stand-in (src/lib/requests.ts).
const VOTER_KEY = "probuilds:voter";
const VOTED_KEY = "probuilds:voted";
const VOTE_FAILED = "Your vote didn't go through. Try again.";
const TOAST_MS = 4000;

function stored(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function store(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private mode or storage off: the vote still counts in the database, once per voter id.
  }
}

/** This browser's votes, or null when it has none stored. The preview's sample list then shows Figma's two votes. */
function savedVotes(): string[] | null {
  try {
    const saved: unknown = JSON.parse(stored(VOTED_KEY) ?? "null");
    return Array.isArray(saved) ? saved.filter((v): v is string => typeof v === "string") : null;
  } catch {
    return null;
  }
}

export function RequestFace({ preview }: { preview: boolean }) {
  const [requests, setRequests] = useState<FaceRequest[] | null>(null);
  // The list didn't load: no longer busy, and no chips over an empty list.
  const [loadFailed, setLoadFailed] = useState(false);
  const [voted, setVoted] = useState<ReadonlySet<string>>(new Set());
  const [kind, setKind] = useState<RequestKind | null>(null);
  const [value, setValue] = useState("");
  const [form, setForm] = useState<FormState>({ kind: "idle" });
  const [toast, setToast] = useState<number>(0);
  const voter = useRef("");

  const where = () => ({ drafts: preview, config: SUPABASE, search: window.location.search });
  const opening = useRef((list: FaceRequest[], votes: string[], state: string | null) => {
    setRequests(list);
    setVoted(new Set(votes));
    if (state === "typing") {
      setValue("Kanye");
      requestAnimationFrame(() => document.getElementById("request-name")?.focus());
    } else if (state === "sent") setForm({ kind: "sent", name: "2006 Ronaldinho" });
    else if (state === "request-failed") {
      setValue("2006 Ronaldinho");
      setForm({ kind: "failed" });
    } else if (state === "vote-failed") setToast(Date.now());
  });

  useEffect(() => {
    const savedVoter = stored(VOTER_KEY);
    voter.current = isVoterId(savedVoter) ? savedVoter : newVoterId();
    store(VOTER_KEY, voter.current);
    const votes = savedVotes() ?? (preview && !SUPABASE ? [...SAMPLE_VOTED] : []);
    let live = true;
    const state = preview ? new URLSearchParams(window.location.search).get("state") : null;
    loadRequests({ config: SUPABASE, standIn: requestStandIn(where(), "list") })
      .then((list) => live && opening.current(list, votes, state))
      .catch((error: unknown) => {
        // TODO(Chime): Figma draws no "couldn't load the list" state; the list stays empty, without "No requests yet."
        console.warn("Face requests didn't load", error);
        if (live) setLoadFailed(true);
      });
    return () => {
      live = false;
    };
    // Read once, on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(0), TOAST_MS);
    return () => clearTimeout(t);
  }, [toast]);

  const setVotes = (next: Set<string>) => {
    setVoted(next);
    store(VOTED_KEY, JSON.stringify([...next]));
  };
  const bump = (id: string, by: number) => setRequests((list) => list?.map((r) => (r.id === id ? { ...r, votes: r.votes + by } : r)) ?? null);

  const vote = async (request: FaceRequest) => {
    // One vote each: a second tap does nothing (D-96).
    if (voted.has(request.id)) return;
    setVotes(new Set([...voted, request.id]));
    bump(request.id, 1);
    try {
      await voteFor(request.id, voter.current, { config: SUPABASE, standIn: requestStandIn(where(), "vote") });
    } catch (error) {
      console.warn("Vote didn't go through", error);
      setVoted((v) => {
        const back = new Set(v);
        back.delete(request.id);
        store(VOTED_KEY, JSON.stringify([...back]));
        return back;
      });
      bump(request.id, -1);
      setToast(Date.now());
    }
  };

  const request = async () => {
    const name = cleanName(value);
    if (!name || form.kind === "sending") return;
    setForm({ kind: "sending" });
    try {
      await requestFace(name, { config: SUPABASE, standIn: requestStandIn(where(), "request") });
      setForm({ kind: "sent", name });
      setValue("");
    } catch (error) {
      console.warn("Face request didn't go through", error);
      setForm({ kind: "failed" });
    }
  };

  const match = form.kind === "idle" ? findAsked(requests ?? [], value) : null;
  return (
    <main className="mx-auto flex w-full flex-col gap-8 px-5 pt-14 pb-16 tablet:px-10 tablet:pt-16 tablet:pb-30 desktop:max-w-(--layout-content-max) desktop:flex-row desktop:items-start desktop:gap-24 desktop:px-0">
      <div className="flex flex-col desktop:w-110 desktop:shrink-0">
        <h1 className="type-h1 text-text-primary">Request a face</h1>
        <p className="type-body-lg pt-2 text-text-secondary">Tell us who you want to look like. The most-wanted faces get made first.</p>
        <div className="pt-6">
          <RequestForm
            value={value}
            state={form}
            match={match}
            voted={match ? voted.has(match.id) : false}
            onChange={(v) => {
              setValue(v);
              if (form.kind === "failed") setForm({ kind: "idle" });
            }}
            onRequest={request}
            onVote={vote}
            onAnother={() => {
              // Render the field now and focus it inside the tap: iOS raises the keyboard only for a focus made there.
              flushSync(() => setForm({ kind: "idle" }));
              document.getElementById("request-name")?.focus();
            }}
          />
        </div>
        <HowItWorks className="hidden pt-4 desktop:flex" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <RequestList requests={requests} failed={loadFailed} voted={voted} kind={kind} onKind={setKind} onVote={vote} />
        <HowItWorks className="desktop:hidden" />
      </div>
      <Toast id={toast} message={toast ? VOTE_FAILED : null} tone="danger" />
    </main>
  );
}
