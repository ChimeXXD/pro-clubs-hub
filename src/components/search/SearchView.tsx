"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { FaceCard } from "@/components/faces/FaceCard";
import { FaceSearch } from "@/components/faces/FaceSearch";
import { BuildPreviewCard } from "@/components/ui/BuildPreviewCard";
import { resultsLine, type SearchIndex, searchResults } from "@/lib/search";

// Figma "Search results (Should)" (phone 376:2282, tablet 376:2393, desktop 376:2491; D-80 (3)): "Search" (H1), the
// search field (filled: the query and Clear; 560 px from tablet), "N results for “query”" (caption, muted), then the
// Faces and Builds groups, each "Faces" (H3) with its count (Label/Default, muted) and its cards: faces in the
// library's columns (two, three, six) and builds in Home's (one, two, three), 24 px apart. Content 16 px from the top
// bar, 24 px between blocks. The query lives in the address (?q=), so results survive a reload and can be shared.
// TODO(Chime): no frame draws Search empty or with nothing found; empty shows the field only, nothing found only the
// count ("0 results for …").
export function SearchView({ index }: { index: SearchIndex }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    // The static page can't know the address's query; read it once in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(new URLSearchParams(window.location.search).get("q") ?? "");
  }, []);

  const change = (value: string) => {
    setQuery(value);
    const url = new URL(window.location.href);
    if (value.trim()) url.searchParams.set("q", value);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  };

  const results = searchResults(index, query);
  const searched = query.trim() !== "";
  return (
    <main className="flex flex-col gap-6 px-5 pt-4 pb-12 tablet:px-10 desktop:mx-auto desktop:w-full desktop:max-w-(--layout-content-max) desktop:px-0">
      <h1 className="type-h1 text-text-primary uppercase">Search</h1>
      <FaceSearch value={query} onChange={change} placeholder="Search faces and builds" width="tablet:w-[560px]" />
      {searched && (
        <p data-testid="search-count" role="status" className="type-caption text-text-muted">
          {resultsLine(results, query)}
        </p>
      )}
      {results.faces.length > 0 && (
        <Group id="search-faces" title="Faces" count={results.faces.length}>
          <ul className="grid grid-cols-2 gap-6 tablet:grid-cols-3 desktop:grid-cols-6">
            {results.faces.map((face, i) => (
              <FaceCard key={face.id} card={face} place={i + 1} />
            ))}
          </ul>
        </Group>
      )}
      {results.builds.length > 0 && (
        <Group id="search-builds" title="Builds" count={results.builds.length}>
          <ul className="grid grid-cols-1 items-start gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
            {results.builds.map((build, i) => (
              <li key={build.href}>
                <BuildPreviewCard build={build} testId={`build-preview-${i + 1}`} />
              </li>
            ))}
          </ul>
        </Group>
      )}
    </main>
  );
}

function Group({ id, title, count, children }: { id: string; title: string; count: number; children: ReactNode }) {
  return (
    <section data-testid={id} aria-labelledby={`${id}-title`} className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2">
        <h2 id={`${id}-title`} className="type-h3 text-text-primary">
          {title}
        </h2>
        <span className="type-label text-text-muted">{count}</span>
      </div>
      {children}
    </section>
  );
}
