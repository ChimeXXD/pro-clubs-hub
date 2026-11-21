// Home, Faces and Face screens. Classic script: adds to window.S.
// References: FUT.GG home (grid first, then countdowns), Ravex roster cards and countdown,
// FORMA casting profile (stage with angle arrows), Valdûm quest objectives, Gymshark ticks,
// Life Reset big value over a slider with end labels, World Cup 2026 hero card.
(() => {
  const { t, icon, ghost, shell, vtag, credit, faceCard, buildCard, chips, head, daysUntil, esc } = U;
  const S = (window.S = window.S || {});

  // Home tabs: Trending and New have no data behind them yet, so both show every face for now.
  const HOME_TABS = [["Trending", () => true], ["New", () => true], ["Footballers", (f) => f.kind === "Footballer"], ["Musicians", (f) => f.kind === "Musician"]];

  S.home = ({ tab = 0, pos = 0 } = {}) => {
    const d = daysUntil(D.SEASON.nextDate);
    const faces = D.FACES.filter(HOME_TABS[tab][1]).map((f, i) => faceCard(f, i + 1)).join("");
    const p = D.POSITIONS[pos];
    const builds = (p === "All" ? D.GROUPS.slice().reverse().map((g) => D.BUILDS.find((b) => b.arch.group === g.id)) : D.BUILDS.filter((b) => b.pos === p))
      .slice(0, 4).map((b, i) => buildCard(b, i + 1)).join("");
    return shell("home", `
      <section class="home-hero">
        <div class="hh-copy">
          ${t("season-chip", D.SEASON.label, "season-chip")}
          ${t("home-title", "Look like a legend. Play like one.", "h1 display", "h1")}
          ${t("home-sub", "Face recipes for the FC 27 editor, each paired with a build. Checked in game, dated and credited.", "sub", "p")}
        </div>
        ${chips("home-tab", HOME_TABS.map((x) => x[0]), tab, "home-tabs")}
      </section>
      <section class="grid faces-grid" data-testid="home-faces" aria-label="Faces">${faces}</section>
      <a class="more-link" href="#/faces" data-testid="home-faces-all">All faces</a>

      <div class="home-split">
        <section class="panel" aria-labelledby="h-season">
          ${t("countdown-title", "Countdowns", "panel-title", "h2", 'id="h-season"')}
          <div class="count-row">
            <div>${t("count-name-1", `${D.SEASON.next} starts`, "count-name")}${t("count-date-1", D.SEASON.nextDay, "count-date")}</div>
            ${t("count-value-1", `${d}d`, "count-value")}
          </div>
          <div class="count-row">
            <div>${t("count-name-2", "Every face and build re-checked", "count-name")}${t("count-date-2", `From ${D.SEASON.nextDay}`, "count-date")}</div>
            ${t("count-value-2", `${d}d`, "count-value")}
          </div>
        </section>
        <section class="panel" aria-labelledby="h-latest">
          ${t("latest-title", "Latest changes", "panel-title", "h2", 'id="h-latest"')}
          ${D.CHANGES.map((c, i) => `<div class="latest-row">
            ${t(`latest-date-${i + 1}`, `${c.day} ${c.mon}`, "latest-date")}
            ${t(`latest-name-${i + 1}`, c.title, "latest-name")}
          </div>`).join("")}
          <a class="more-link inline" href="#/changelog" data-testid="home-changelog-all">Full changelog</a>
        </section>
      </div>

      <section aria-labelledby="h-builds">
        <div class="section-head">${t("home-builds-title", "Builds by position", "h2", "h2", 'id="h-builds"')}
          <a class="more-link inline" href="#/builds" data-testid="home-builds-all">All 13 builds</a></div>
        ${chips("home-pos", D.POSITIONS, pos, "filters")}
        <div class="grid builds-grid" data-testid="home-builds">${builds}</div>
      </section>`);
  };

  S.faces = ({ empty = false, on = 0, list = D.FACES } = {}) => shell("faces", `
    ${head("faces", "Faces", "Recipes for the FC 27 face editor. Pick one, follow it next to the TV.")}
    ${chips("filter-chip", D.FACE_FILTERS.map((x) => x.name), on, "filters")}
    ${empty
      ? `<div class="empty" data-testid="faces-empty">${t("faces-empty-icon", icon("face", 32), "icon")}${t("faces-empty-text", D.COPY.emptyFaces, "", "p")}
          <a class="btn btn-ghost" href="#/submit" data-testid="faces-empty-submit">Suggest a face</a></div>`
      : `<section class="grid faces-grid" data-testid="faces-grid">${list.map((f, i) => faceCard(f, i + 1)).join("")}</section>`}`);

  // A step row: the value is the hero (DESIGN.md). Done rows tick and dim; the current row sits on
  // a lighter fill (Valdûm objectives, without its side bar).
  const stepRow = (s, n, state) => `<li class="step ${state}" data-testid="step-row-${n}">
    <button class="tick" data-testid="step-tick-${n}" aria-pressed="${state === "done"}" aria-label="Mark ${esc(s.label)} done">${icon("check", 20)}</button>
    <div class="step-main">
      ${t(`step-label-${n}`, esc(s.label), "step-label")}
      ${t(`step-kind-${n}`, s.kind, "step-kind")}
      ${s.help ? t(`step-help-${n}`, s.help, "step-help", "p") : ""}
      ${s.slider ? `<div class="slider" data-testid="step-slider-${n}" style="--at:${s.slider.at}%"><i></i></div>` : ""}
      ${s.slider?.low ? `<div class="slider-ends">${t(`step-low-${n}`, s.slider.low)}${t(`step-high-${n}`, s.slider.high)}</div>` : ""}
    </div>
    ${t(`value-chip-${n}`, esc(s.value), `value${s.value.length > 6 ? " value-word" : ""}`)}
  </li>`;

  S.face = ({ slug, done = 0, tab, angle = 0, playing = false, updated = false } = {}) => {
    const f = D.FACES.find((x) => x.slug === slug) || D.FACES[0];
    const b = D.BUILDS.find((x) => x.slug === f.build);
    const total = D.STEP_COUNT;
    let n = 0;
    const offsets = D.TABS.map((tb) => { const o = n; n += tb.steps.length; return o; });
    // Open on the tab that holds the next step to do
    if (tab === undefined) tab = Math.max(0, offsets.findLastIndex((o) => o <= Math.min(done, total - 1)));
    const cur = D.TABS[tab];
    const doneAll = done >= total;
    const rows = cur.steps.map((s, i) => {
      const k = offsets[tab] + i + 1;
      return stepRow(s, k, k <= done ? "done" : k === done + 1 ? "current" : "later");
    }).join("");
    const pct = Math.round((Math.min(done, total) / total) * 100);
    return shell("faces", `
      <a class="back" href="#/faces" data-testid="face-back">${icon("back", 18)}Faces</a>
      <div class="face-layout">
        <section class="stage-col" aria-label="In-game capture">
          <div class="stage" data-testid="face-stage">
            ${ghost("stage-era", f.era)}
            <div class="stage-slot">${t("stage-icon", icon("spin", 28), "icon")}${t("stage-label", "Chime's 360° capture from FC 27 plays here", "", "p")}</div>
            <div class="stage-bar">
              ${t("stage-count", `0${angle + 1} / 0${D.ANGLES.length}`, "stage-count")}
              <button class="round" data-testid="stage-prev" aria-label="Previous angle">${icon("back", 18)}</button>
              <button class="round" data-testid="stage-next" aria-label="Next angle">${icon("next", 18)}</button>
            </div>
          </div>
          <div class="angles" role="tablist" aria-label="Angles">${D.ANGLES.map((a, i) =>
            `<button class="angle${i === angle ? " on" : ""}" role="tab" aria-selected="${i === angle}" data-testid="angle-${i + 1}">${a}</button>`).join("")}</div>
        </section>

        <section class="recipe-col" aria-labelledby="face-title">
          <div class="badges">${t("face-era", f.era, "badge badge-accent")}${t("face-kind", f.kind, "badge")}${t("face-sample", "Sample values", "badge badge-warn")}</div>
          ${t("face-title", `Inspired by ${f.name}, ${f.era}`, "h1 display", "h1", 'id="face-title"')}
          <div class="meta">${vtag("version-tag", f.tag)}${credit("credit-line", f.by)}</div>
          ${updated ? `<p class="warn-bar" data-testid="ticks-reset">${icon("spin", 18)}<span>${D.COPY.reset}</span></p>` : ""}
          <p class="limits" data-testid="limits-callout">${D.COPY.limits}</p>
          ${doneAll
            ? `<div class="done-card" data-testid="face-done">${t("face-done-icon", icon("check", 28), "icon")}
                ${t("face-done-title", "Face done", "done-title", "h2")}
                ${t("face-done-text", "Now set up the build that goes with it.", "", "p")}
                <a class="btn btn-accent" href="#/builds/${b.slug}" data-testid="face-done-build">Now set up the build</a></div>`
            : `<div class="start-row">
                <a class="btn btn-accent btn-big" href="#/faces/${f.slug}" data-testid="face-start">${done ? D.COPY.continue(done + 1) : "Start"}</a>
                ${t("face-time", `${f.mins} min · ${total} steps`, "muted")}
              </div>`}
          <div class="progress" data-testid="face-progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Steps done">
            <i style="--p:${pct / 100}"></i></div>
          ${t("face-progress-text", `${Math.min(done, total)} of ${total} steps done`, "muted small")}
          <div class="tabs" role="tablist" aria-label="Editor tabs">${D.TABS.map((tb, i) =>
            `<button class="tabp${i === tab ? " on" : ""}" role="tab" aria-selected="${i === tab}" data-testid="face-tab-${i + 1}">${tb.name}</button>`).join("")}</div>
          <ol class="steps" data-testid="step-list">${rows}</ol>
        </section>

        <aside class="side-col" aria-label="Paired build">
          ${t("paired-title", "The build that goes with it", "panel-title", "h2")}
          <div data-testid="paired-build">${buildCard(b, 1, { idp: "paired-card" })}</div>
          ${playing
            ? `<p class="embed" data-testid="embed-player">The YouTube player (youtube-nocookie.com) loads here only after this tap.</p>`
            : `<button class="embed" data-testid="embed-facade">${icon("play", 22)}<span>${D.COPY.embed}</span></button>`}
        </aside>
      </div>`);
  };
})();
