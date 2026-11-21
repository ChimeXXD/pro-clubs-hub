// Changelog, Submit, About, Takedown and 404. Classic script: adds to window.S.
// References: Ravex dated schedule rows, Canny date column, Pipedrive/Fresha tabbed form with live
// preview, Booking.com inline validation, Hashnode dark About, Contra 404.
(() => {
  const { t, icon, shell, head, faceCard } = U;
  const S = (window.S = window.S || {});

  S.changelog = () => shell("changelog", `
    ${head("log", "Changelog", "What changed in FC 27 Clubs, with EA's own page for each, and what we updated here.")}
    <ol class="log">${D.CHANGES.map((c, i) => { const n = i + 1; return `<li class="log-entry" data-testid="changelog-entry-${n}">
      <div class="date-tile">${t(`log-day-${n}`, c.day, "dt-day")}${t(`log-mon-${n}`, c.mon, "dt-mon")}</div>
      <div class="log-body">
        <div class="badges">${t(`log-kind-${n}`, c.kind, "badge badge-accent")}${t(`log-season-${n}`, c.season, "badge")}</div>
        ${t(`log-title-${n}`, c.title, "log-title", "h2")}
        <ul class="log-changes">${c.changes.map((x, j) => t(`log-change-${n}-${j + 1}`, x, "", "li")).join("")}</ul>
        <div class="log-foot">
          <a class="src" href="${c.url}" target="_blank" rel="noopener" data-testid="log-source-${n}">${c.source}</a>
          ${t(`log-updated-${n}`, `What we updated: ${c.affects}`, "muted small", "p")}
          ${c.note ? t(`log-note-${n}`, `Note: ${c.note}`, "muted small", "p") : ""}
        </div>
      </div></li>`; }).join("")}</ol>`);

  const field = (id, label, value, { error = "", hint = "" } = {}) => `<label class="field${error ? " bad" : ""}">
    <span data-testid="${id}-label">${label}</span>
    <input data-testid="${id}" value="${value}" aria-invalid="${!!error}"${error ? ` aria-describedby="${id}-err"` : ""}>
    ${error ? `<span class="err" id="${id}-err" data-testid="${id}-error">${icon("warn", 16)}${error}</span>` : hint ? t(`${id}-hint`, hint, "hint") : ""}
  </label>`;

  // Each kind has its own tabs; each tab its own fields (docs/FORMAT.md). Fields start empty: a
  // submitter types what the game shows.
  const FORMS = {
    face: [
      ["Basics", [["f-name", "Inspired by", "Their name, as it should appear"], ["f-era", "Era", "The year or period the face shows"], ["f-kind", "Kind", "Footballer or musician"], ["f-platform", "Recorded on", "PS5, Xbox or PC"]]],
      ["Skin", [["f-skin-tone", "Skin Tone", "Where the knob sits on the track, as a share"], ["f-complexion", "Complexion", "The number the game shows"]]],
      ["Head", [["f-forehead", "Forehead", "The number the game shows"], ["f-jaw", "Jaw", "The number the game shows"]]],
      ["Face", [["f-eyes", "Eyes", "The number the game shows"], ["f-nose", "Nose", "The number the game shows"]]],
      ["Hair", [["f-hair-style", "Hair Style", "The number the game shows"], ["f-facial-hair", "Facial Hair", "The number or name the game shows"]]],
      ["Sculpt", [["f-sculpt-where", "Where", "Mode › layer › region, as the game names them"], ["f-sculpt-value", "Value", "0 to 100, with the slider's two end labels"]]],
      ["Credits", [["f-made-by", "Made by", "Your name, as it should appear"], ["f-tutorial", "Tutorial followed", "A link to the video, if you followed one"]]],
    ],
    build: [
      ["Basics", [["f-name", "Archetype", "One of the 13"], ["f-positions", "Positions", "For example RW, LW"], ["f-platform", "Recorded on", "PS5, Xbox or PC"]]],
      ["Body", [["f-height", "Height", "In cm, as the game shows it"], ["f-weight", "Weight", "In kg, as the game shows it"], ["f-accelerate", "AcceleRATE", "As the game shows it"]]],
      ["Attributes", [["f-attr-name", "Attribute", "Its name in the game"], ["f-attr-value", "Value", "The number the game shows"]]],
      ["PlayStyles", [["f-ps-plus", "Plus", "Names as the game shows them"], ["f-ps-regular", "Regular", "Names as the game shows them"]]],
      ["Credits", [["f-made-by", "Made by", "Your name, as it should appear"], ["f-match", "Played a match with it", "Yes or no"]]],
    ],
  };

  S.submit = ({ errors = false, sent = false, kind = "face", tab = 0, values = {} } = {}) => {
    const preview = { ...D.FACES[2], tag: D.TAG_NEW };
    const tabs = FORMS[kind];
    const [, fields] = tabs[Math.min(tab, tabs.length - 1)];
    const form = sent
      ? `<div class="done-card" data-testid="submit-sent">${t("sent-icon", icon("check", 28), "icon")}
          ${t("sent-title", "Sent for review", "done-title", "h2")}
          ${t("sent-text", D.COPY.submitted, "", "p")}
          <a class="btn btn-ghost" href="#/faces" data-testid="sent-back">Back to faces</a></div>`
      : `<div class="seg" role="tablist" aria-label="What are you sending">${[["face", "A face"], ["build", "A build"]].map(([k, l], i) =>
          `<button class="seg-btn${k === kind ? " on" : ""}" role="tab" aria-selected="${k === kind}" data-testid="submit-kind-${i + 1}">${l}</button>`).join("")}</div>
        <div class="tabs" role="tablist" aria-label="Form sections">${tabs.map(([x], i) =>
          `<button class="tabp${i === tab ? " on" : ""}" role="tab" aria-selected="${i === tab}" data-testid="form-tab-${i + 1}">${x}${errors && i === 0 ? " · 1 to fix" : ""}</button>`).join("")}</div>
        <div class="form">${fields.map(([id, label, hint], i) =>
          field(id, label, U.esc(values[id] || ""), { hint, error: errors && tab === 0 && i === 0 ? `Add the ${id === "f-name" && kind === "face" ? "name" : label.toLowerCase()}.` : "" })).join("")}</div>
        <div class="form-actions">
          <button class="btn btn-accent" data-testid="submit-issue">Submit for review</button>
          <button class="btn btn-ghost" data-testid="submit-copy">${icon("copy", 18)}Copy JSON</button>
        </div>
        ${t("submit-how", "Submit for review opens a GitHub issue with your recipe filled in. You'll need a GitHub account.", "muted small", "p")}`;
    return shell("submit", `
      ${head("submit", "Submit", "Send a face or a build you made in game. Chime checks it before it goes live.")}
      <div class="submit-layout">
        <section class="submit-form">${form}</section>
        <aside class="submit-preview wide-only" aria-label="Preview">
          ${t("preview-title", "Preview", "panel-title", "h2")}
          <div class="grid one">${kind === "face" ? faceCard(preview, 1, { idp: "submit-card" }) : U.buildCard(D.BUILDS[9], 1, { idp: "submit-build" })}</div>
        </aside>
      </div>`);
  };

  const prose = (idp, blocks) => blocks.map(([h, p], i) => `<section class="prose-block">
    ${t(`${idp}-h-${i + 1}`, h, "h2", "h2")}${t(`${idp}-p-${i + 1}`, p, "", "p")}</section>`).join("");

  S.about = () => shell("about", `
    ${head("about", "About", "A free hub for FC 27 Clubs, led by faces.")}
    <div class="prose">${prose("about", [
      ["What this is", "Face recipes for the FC 27 editor, each paired with a build, plus a build for every archetype. Free, with no paywall."],
      ["How content is made", "Chime or Sharon makes every face and build in game, from reference. Each build is played for one match before it's called meta. Every page says which season it was checked on, and when."],
      ["Sourcing", "Game facts come from EA's own pages, linked on the changelog. Other sites' builds, tier lists and cost tables are never copied. Creators whose tutorials we followed are named and linked."],
      ["People named here", "No pictures of real people, ever. Faces are inspired by people and say so; they aren't official. To ask for removal, see Takedown."],
    ])}
      <section class="prose-block">
        ${t("about-credits-h", "Credits", "h2", "h2")}
        ${t("about-credits-p", "Creators whose tutorials a face follows are named on that face. Creators we follow:", "", "p")}
        <ul class="creator-list">${D.CREATORS.map((c, i) => `<li><a class="src" href="${c.url}" target="_blank" rel="noopener" data-testid="creator-${i + 1}">${c.name}</a></li>`).join("")}</ul>
      </section>
      <section class="prose-block">
        ${t("about-featured-h", "Featured creators", "h2", "h2")}
        ${t("about-featured-p", "None yet. We ask a creator before featuring them, and haven't asked anyone so far.", "", "p")}
      </section></div>`);

  S.takedown = () => shell("about", `
    ${head("takedown", "Takedown", "Named on this site and want it gone? We act within 72 hours.")}
    <div class="prose">${prose("take", [
      ["How to ask", "Tell us the page and who you are. You don't have to give a reason."],
      ["What happens", "The page is withdrawn within 72 hours: it stops being built, listed or linked."],
    ])}
      <dl class="sheet" data-testid="takedown-ways">
        <div>${t("take-email-l", "Email", "", "dt")}${t("take-email", "Address not chosen yet (open question O-13)", "", "dd")}</div>
        <div>${t("take-gh-l", "GitHub", "", "dt")}${t("take-gh", "A public issue on the site's repo", "", "dd")}</div>
      </dl>
      <a class="btn btn-accent" href="${D.REPO_ISSUES}" target="_blank" rel="noopener" data-testid="takedown-github">${icon("out", 18)}Ask on GitHub</a>
    </div>`);

  S.notFound = () => shell("", `
    <div class="empty big" data-testid="nf">
      ${t("nf-code", "404", "nf-code display")}
      ${t("nf-title", "This page isn't here", "h1", "h1")}
      ${t("nf-text", "It may have moved, or been withdrawn.", "muted", "p")}
      <div class="form-actions"><a class="btn btn-accent" href="#/faces" data-testid="nf-faces">Faces</a>
        <a class="btn btn-ghost" href="#/builds" data-testid="nf-builds">Builds</a></div>
    </div>`);
})();
