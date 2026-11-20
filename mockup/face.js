// Face page, avatar-editor layout (Chime's pick, 20 Nov; Mobbin: Meta Quest, Instagram, WhatsApp avatar editors).
// The head fills the top edge to edge; the recipe is a sheet below with the game's own tabs. Exposes window.renderFace.
(() => {
  const { t, esc, icon, TABS, SCULPT, TOTAL, notice } = window.M;
  const ALL = [...TABS, { id: "sculpt", name: "Sculpt", zoom: "face", steps: SCULPT }];

  const stage = (s, tab) => `<section class="stage-full" data-testid="face-viewer" data-start="${s.angle}" data-mode="${s.mode}" data-dragging="${s.dragging}" data-size="${s.done ? "compact" : "tall"}" data-zoom="${tab.zoom}">
    <div class="stage-bar">
      <a href="#faces" class="round-btn" data-testid="face-back" aria-label="Back to faces">${icon("back", 20)}</a>
      ${t("face-standin", "Stand-in head", "badge warn")}
      <button class="round-btn" data-testid="face-share" aria-label="Share">${icon("share", 18)}</button>
    </div>
    <div class="spin" data-spin-stage data-head-id="face-spin" tabindex="0" role="slider" aria-valuemin="-180" aria-valuemax="180" aria-label="Turn the face" data-testid="face-spin-stage"></div>
    ${s.loading
      ? `${t("face-spin-loading", "Loading the turn · 12 of 36", "hint")}<div class="loadbar" data-testid="face-spin-loadbar"><i></i></div>`
      : `<span class="hint" data-testid="face-spin-hint">${icon("hand", 15)}Drag to turn</span>`}
    <div class="match-shot" data-testid="face-match">${t("face-match-title", "In a match", "", "strong")}${t("face-match-note", "Chime's cutscene screenshot goes here")}</div>
    <div class="angle-pill" role="group" aria-label="Angle">
      ${[["front", "Front"], ["three-quarter", "¾"], ["side", "Side"], ["match", "In a match"]]
        .map(([key, label]) => `<button data-angle="${key}" data-testid="face-angle-${key}" aria-pressed="${s.pressed === key}">${label}</button>`).join("")}
    </div>
  </section>`;

  const header = (s) => `<div class="sheet-head">
    <div class="title-badges">${t("face-era", "2008", "badge accent")}${t("face-kind", "Footballer", "badge")}${t("face-sample", "Sample values", "badge warn")}</div>
    ${t("face-title", "Inspired by Cristiano Ronaldo, 2008", "sheet-title", "h1")}
    <div class="trust">
      ${t("version-tag", "FC 27 · Season 2 · not yet checked in game", "version-tag unchecked")}
      ${t("credit-line", "Made by Chime in game · Tutorial by JaxStash", "credit-line")}
    </div>
    ${s.older ? t("face-older", "Made for Season 2. Values may have changed since.", "callout warn", "p") : ""}
    ${s.updated ? t("face-updated", "This face was updated. Your ticks start fresh.", "callout", "p") : ""}
  </div>`;

  const tick = (label, n, state) =>
    `<button class="tick" role="checkbox" aria-checked="${state === "done"}" aria-label="Done: ${esc(label)}" data-testid="step-tick-${n}"><span>${state === "done" ? icon("check", 16) : ""}</span></button>`;

  const value = (step, n) => {
    if (step.kind === "position")
      return `${t(`value-chip-${n}`, `${step.percent}%`, "step-value")}<div class="step-track" data-testid="step-track-${n}"><b style="left:${step.percent}%"></b></div>`;
    if (step.kind === "pad") return t(`value-chip-${n}`, "Older, to the limit", "step-value named");
    if (step.kind === "slider")
      return `${t(`value-chip-${n}`, step.value, "step-value")}<div class="slider-track" data-testid="step-track-${n}"><i></i><b style="left:${step.value}%"></b></div>
        <div class="slider-ends">${t(`step-low-${n}`, step.low)}${t(`step-high-${n}`, step.high)}</div>`;
    return t(`value-chip-${n}`, step.value, `step-value${step.kind === "named" ? " named" : ""}`);
  };

  const row = (step, n, state) => `<li class="step${state ? ` ${state}` : ""}${step.kind === "preset" ? " preset" : ""}" data-testid="step-row-${n}">
    ${step.kind === "preset"
      ? `<div class="preset-tile" data-testid="preset-tile">${window.Head.headSvg(-12, { testid: "preset-picture", label: "Preset tile (stand-in)" })}</div>`
      : t(`step-index-${n}`, n, "step-index")}
    <div class="step-main">${value(step, n)}${t(`step-label-${n}`, step.label, "step-label")}${step.help ? t(`step-help-${n}`, step.help, "step-help") : ""}</div>
    ${tick(step.label, n, state)}
  </li>`;

  const recipe = (s, active) => {
    let first = 1;
    const starts = ALL.map((x) => ((first += x.steps.length), first - x.steps.length));
    const tab = ALL[active];
    const nowN = s.done + 1;
    const stateOf = (n) => (n <= s.done ? "done" : n === nowN && s.done > 0 ? "now" : "");
    const next = ALL[active + 1];
    return `<div class="tabs" role="tablist" aria-label="Editor tabs">
        ${ALL.map((x, i) => `<button role="tab" aria-selected="${i === active}" data-testid="face-tab-${x.id}">${x.name}${starts[i] + x.steps.length - 1 <= s.done ? `<span class="tab-done" aria-label="done">${icon("check", 12)}</span>` : ""}</button>`).join("")}
      </div>
      <div class="segments" data-testid="face-progress-bar">${Array.from({ length: TOTAL }, (_, i) => `<i class="${i < s.done ? "done" : i === s.done ? "now" : ""}"></i>`).join("")}</div>
      <div class="progress-label" data-testid="face-progress">${t("face-progress-text", `${Math.min(s.done, TOTAL)} of ${TOTAL} done`, "tnum")}${t("face-progress-tip", "Keep this page open next to the TV", "faint")}</div>
      ${tab.steps.length > 1 ? `<div class="chips" role="group" aria-label="Jump to a step">${tab.steps
        .map((st, i) => `<button class="chip" data-testid="step-chip-${starts[active] + i}" aria-pressed="${starts[active] + i === nowN}">${esc(st.label.replace("Skeletal · ", ""))}</button>`).join("")}</div>` : ""}
      <ol class="steps">${tab.steps.map((st, i) => row(st, starts[active] + i, stateOf(starts[active] + i))).join("")}</ol>
      ${next ? `<button class="next-tab" data-testid="face-next-tab"><span>Next: ${next.name} · ${next.steps.length} ${next.steps.length === 1 ? "step" : "steps"}</span><span class="faint">${icon("chevron")}</span></button>` : ""}`;
  };

  const buildCard = (k) => `<div class="paired" data-testid="paired-build${k}">
    <div class="paired-top"><span class="paired-name" data-testid="paired-name${k}">Spark</span><a href="#build" class="card-hit" data-testid="paired-link${k}" aria-label="Spark build"></a>${t(`paired-positions${k}`, "RW · LW", "badge")}</div>
    ${t(`version-tag-paired${k}`, "FC 27 · Season 2 · not yet checked in game", "version-tag unchecked")}
    ${t(`credit-line-paired${k}`, "Made by Chime in game", "credit-line")}
  </div>`;

  const finished = () => `<section class="done-panel" data-testid="face-done">
    <div class="done-head"><span class="done-mark" data-testid="face-done-mark">${icon("check", 20)}</span>
      <div>${t("face-done-title", "Face done", "done-title")}${t("face-done-sub", "Now set up the build", "muted")}</div></div>${buildCard("-done")}
  </section>`;

  const more = (s) => `<div class="sheet-more">
    ${t("limits-callout", "The game can't do this exactly: the hairline", "callout", "p")}
    ${s.done >= TOTAL ? "" : `<section class="section">${t("paired-heading", "Paired build", "section-title", "h2")}${buildCard("")}</section>`}
    <section class="section">${t("embed-heading", "Tutorial", "section-title", "h2")}
      <button class="embed" data-testid="embed-facade"><span class="embed-play">${icon("play", 22)}</span>
        <span class="embed-text">FC 27 lookalike tutorial · JaxStash · Tap to play</span></button></section>
  </div>`;

  window.renderFace = (root, s) => {
    const active = ALL.findIndex((x) => x.id === s.tab);
    root.innerHTML = `<div class="face-page">${stage(s, ALL[active])}
      <main class="sheet">
        <span class="grabber" aria-hidden="true"></span>
        ${header(s)}
        ${s.done >= TOTAL ? finished() : ""}
        ${s.resume ? `<div class="resume" data-testid="face-resume">${t("face-resume-text", `Continue from step ${s.done + 1}`, "resume-text")}${t("face-resume-tab", ALL[active].name, "badge soft")}</div>` : ""}
        ${s.done ? "" : `<button class="btn primary start" data-testid="face-start">Start · ${TOTAL} steps</button>`}
        ${recipe(s, active)}
        ${more(s)}
      </main>${notice()}</div>`;
    window.Head.mountSpin(root.querySelector(".stage-full"));
    for (const sel of ['[role="tablist"]', ".chips"]) {
      const row = root.querySelector(sel);
      const on = row && row.querySelector('[aria-selected="true"], [aria-pressed="true"]');
      if (on) row.scrollLeft = on.offsetLeft - row.offsetLeft - 16;
    }
  };
})();
