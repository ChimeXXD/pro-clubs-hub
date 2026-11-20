// Home: FUT.GG's start screen structure in our own skin (D-19). Exposes window.renderHome.
(() => {
  const { esc, t, icon, daysUntil, FACES, BUILDS, CHANGES, topbar, notice } = window.M;

  const faceCard = (f, i) => `<div class="face-card" data-testid="face-card-${i}">
    <div class="face-tile">
      ${f.era ? t(`face-era-${i}`, f.era, "badge era era") : ""}${t(`face-kind-${i}`, f.kind, "badge era kind")}
      ${window.Head.headSvg(f.angle, { testid: `face-picture-${i}`, label: `In-game face, front (stand-in)` })}
    </div>
    ${t(`face-inspired-${i}`, "Inspired by", "face-inspired")}<span class="face-name" data-testid="face-name-${i}">${f.name}</span><a href="#face" class="card-hit" data-testid="face-card-${i}-link" aria-label="${esc(`Inspired by ${f.name}${f.era ? `, ${f.era}` : ""}`)}"></a>
    <div class="face-strip">${t(`version-tag-face-${i}`, `<i class="dot warn"></i>S2 · not checked`)}${t(`credit-line-face-${i}`, "By Chime")}</div>
  </div>`;

  const faces = (desktop) => `<section class="section" aria-labelledby="home-faces-title">
    <div class="pills" role="toolbar" aria-label="Show faces">
      ${["New", "Footballers", "Musicians", "2000s", "2010s"].map((p, i) => `<button class="pill" data-testid="filter-chip-${i + 1}" aria-pressed="${i === 0}">${p}</button>`).join("")}
    </div>
    <div class="panel" data-testid="home-faces">
      <h2 class="sr-only" id="home-faces-title" data-testid="home-faces-title">Faces</h2>
      ${t("home-standin", "Heads are stand-ins until Chime's captures land", "badge warn standin-note")}
      <div class="face-grid${desktop ? " wide" : ""}" data-testid="home-faces-grid">
        ${FACES.map((f, i) => faceCard(f, i + 1)).join("")}
        <a href="#submit" class="face-card" data-testid="face-card-submit">
          <div class="face-tile submit-tile">${icon("plus", 22)}<span>Suggest a face</span></div>
        </a>
      </div>
      <div class="panel-foot">
        <a href="#faces" data-testid="faces-all">All faces ${icon("arrow", 14)}</a>
        <a href="#submit" data-testid="faces-submit">Submit a face ${icon("arrow", 14)}</a>
      </div>
    </div>
  </section>`;

  const season = () => `<section class="section">
    <div class="section-head">
      <h2 class="section-title"><span class="section-icon" data-testid="season-icon">${icon("calendar", 16)}</span>${t("season-title", "Seasons")}</h2>
      <a href="#changelog" class="link-accent" data-testid="season-changelog">Changelog ${icon("arrow", 14)}</a>
    </div>
    <div class="rows">
      ${[["Season 3 starts", "Thu 3 Dec", "2026-12-03", "Every build is recorded on it"], ["Season 4 starts", "Thu 14 Jan 2027", "2027-01-14", "Faces and builds re-checked"]]
        .map(([title, date, iso, sub], i) => `<div class="row" data-testid="countdown-${i + 1}">
          <div class="row-main">${t(`countdown-title-${i + 1}`, title, "row-title")}
            <span class="row-sub">${t(`countdown-date-${i + 1}`, date, "badge soft")}${t(`countdown-sub-${i + 1}`, sub)}</span></div>
          <div>${t(`countdown-days-${i + 1}`, daysUntil(iso), "count-big")}${t(`countdown-unit-${i + 1}`, "days", "count-unit")}</div>
        </div>`).join("")}
    </div>
  </section>`;

  const list = (key, title, iconName, rows) => `<section class="section">
    <div class="section-head"><h2 class="section-title"><span class="section-icon" data-testid="${key}-icon">${icon(iconName, 16)}</span>${t(`${key}-title`, title)}</h2>
      ${key === "changes" ? `<a href="#changelog" class="link-accent" data-testid="changes-all">View all ${icon("arrow", 14)}</a>` : ""}</div>
    <div class="rows">${rows.join("")}</div>
  </section>`;

  const featured = () =>
    list("featured", "Featured", "star", [
      ["Inspired by Cristiano Ronaldo, 2008", "Face", "face"],
      ["Spark build · RW, LW", "Build", "build"],
      ["The 13 archetypes", "Guide", "log"],
      ["Submit a face or build", "New", "plus"],
    ].map(([title, badge, ic], i) => `<div class="row" data-testid="featured-${i + 1}">
      <span class="row-icon" data-testid="featured-icon-${i + 1}">${icon(ic, 16)}</span>
      <span class="row-main"><span class="row-title" data-testid="featured-title-${i + 1}">${title}</span><a href="#" class="card-hit" data-testid="featured-title-${i + 1}-link" aria-label="${esc(title)}"></a></span>
      ${t(`featured-badge-${i + 1}`, badge, `badge ${badge === "New" ? "accent" : ""}`)}</div>`));

  const quick = () =>
    list("quick", "Quick links", "link", ["Builds by position", "Archetypes", "Changelog", "How we check content"].map(
      (title, i) => `<div class="row" data-testid="quick-${i + 1}">
        <span class="row-main"><span class="row-title" data-testid="quick-title-${i + 1}">${title}</span><a href="#" class="card-hit" data-testid="quick-title-${i + 1}-link" aria-label="${esc(title)}"></a></span>
        <span class="faint" data-testid="quick-arrow-${i + 1}">${icon("arrow", 14)}</span></div>`));

  const changes = () =>
    list("changes", "Latest changes", "log", CHANGES.map((c, i) => `<div class="row" data-testid="changelog-entry-${i + 1}">
      <span class="row-main"><span class="row-title" data-testid="changelog-title-${i + 1}">${c.title}</span><a href="#changelog" class="card-hit" data-testid="changelog-title-${i + 1}-link" aria-label="${esc(c.title)}"></a>
        <span class="row-sub">${t(`changelog-kind-${i + 1}`, c.kind, "badge")}</span></span>
      ${t(`changelog-date-${i + 1}`, c.date, "badge soft tnum")}</div>`));

  const builds = () => `<section class="section" data-testid="home-builds">
    <div class="section-head">
      <div class="segmented" role="toolbar" aria-label="Group builds">
        <button data-testid="builds-by-archetype" aria-pressed="true">By archetype</button>
        <button data-testid="builds-by-position" aria-pressed="false">By position</button>
      </div>
      <a href="#builds" class="link-accent" data-testid="builds-all">All builds ${icon("arrow", 14)}</a>
    </div>
    <div class="build-grid" data-testid="home-builds-grid">
      ${BUILDS.map((b, i) => `<div class="build-card" data-testid="build-card-${i + 1}">
        <div class="build-top">${t(`build-group-${i + 1}`, b.group, "badge")}</div>
        <div class="build-body"><span class="build-name" data-testid="build-name-${i + 1}">${b.name}</span><a href="#build" class="card-hit" data-testid="build-name-${i + 1}-link" aria-label="${esc(b.name)}"></a></div>
        <div class="build-foot">${t(`version-tag-build-${i + 1}`, "FC 27 · Season 2 · not yet checked in game")}${t(`credit-line-build-${i + 1}`, "Made by Chime in game", "faint")}</div>
      </div>`).join("")}
    </div>
  </section>`;

  window.renderHome = (root, { desktop = false } = {}) => {
    root.innerHTML = `${topbar({ desktop })}
      <main class="page${desktop ? " page-wide" : ""}">
        <div class="hero">
          ${t("home-tagline", "Look like a legend. Play like one.", "face-title", "h1")}
          <div class="season-row">${t("season-chip", `<i class="dot"></i>FC 27 · Season 2`, "season-chip")}
            ${t("home-sub", "Faces and builds for Clubs, made in game", "muted")}</div>
        </div>
        ${desktop ? `<div class="cols"><div class="col-main">${faces(true)}${builds()}</div><aside class="col-side">${season()}${featured()}${quick()}${changes()}</aside></div>`
          : `${faces(false)}${season()}${featured()}${quick()}${changes()}${builds()}`}
      </main>${notice()}`;
  };
})();
