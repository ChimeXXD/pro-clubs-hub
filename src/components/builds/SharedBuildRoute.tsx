"use client";

import { useEffect, useState } from "react";
import type { BuildPageView as View } from "@/lib/build-page";
import type { ArchetypeFile } from "@/lib/content/types";
import { fetchSharedBuild, shareIdFromPath, sharedBuildPageView } from "@/lib/shared-build";
import { SUPABASE } from "@/lib/supabase/client";
import { BuildPageView } from "./BuildPageView";
import { SharedBuildMissing } from "./SharedBuildMissing";

// The page behind probuilds.club/b/<id> (D-99 (2)): one static page; the id is read from the address in the browser
// and the build loaded from Supabase (src/lib/shared-build.ts). The preview also has Figma's sample under its
// example id. Anything that doesn't load is "This build link doesn't work" (D-100 (2)).
type State = { kind: "loading" } | { kind: "found"; view: View } | { kind: "missing" };

export function SharedBuildRoute({ archetypeFile, sample }: { archetypeFile: ArchetypeFile; sample: { id: string; view: View } | null }) {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let live = true;
    const settle = (next: State) => live && setState(next);
    const id = shareIdFromPath(window.location.pathname);
    if (!id) settle({ kind: "missing" });
    else if (sample && id === sample.id) settle({ kind: "found", view: sample.view });
    else
      void fetchSharedBuild(id, { config: SUPABASE, archetypeFile }).then((build) =>
        settle(build ? { kind: "found", view: sharedBuildPageView(build, archetypeFile.sources, id) } : { kind: "missing" }),
      );
    return () => {
      live = false;
    };
  }, [archetypeFile, sample]);

  // TODO(Chime): Figma draws no loading state; the page stays empty (under a second on a phone) until the build comes.
  if (state.kind === "loading") return <main aria-busy="true" className="min-h-[60vh]" />;
  if (state.kind === "missing") return <SharedBuildMissing />;
  return <BuildPageView view={state.view} />;
}
