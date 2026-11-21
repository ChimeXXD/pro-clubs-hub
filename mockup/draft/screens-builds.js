// Builds, Build, Archetypes and Archetype screens. Classic script: adds to window.S.
// Chime's picks: World Cup 2026 hero card and card grid, Valdûm character sheet, bazaar side panel
// and skill-tree tabs, Olive roster facts, World Cup pitch line-up.
(() => {
  const { t, icon, ghost, shell, vtag, credit, buildCard, chips, head } = U;
  const S = (window.S = window.S || {});
  const groupName = (id) => D.GROUPS.find((g) => g.id === id).name.replace(/s$/, "");

  // Wide screens: clicking a card previews it in the side panel (Valdûm bazaar); the panel's button opens it.
  S.builds = ({ on = 0, list = D.BUILDS, sel: selSlug, arch = "", asList = false } = {}) => {
    const sel = list.find((x) => x.slug === selSlug) || list[0]; // nothing to preview when the filters match no build
    return shell("builds", `
      ${head("builds", "Builds", "One build per archetype, recorded in game and played for a match before it's called meta.")}
      <div class="filter-bar">
        ${chips("filter-chip", D.POSITIONS, on, "filters")}
        <label class="select"><span data-testid="arch-filter-label">Archetype</span>
          <select data-testid="arch-filter" aria-label="Archetype"><option value="">All archetypes</option>${D.ARCH.map((a) => `<option value="${a.id}"${a.id === arch ? " selected" : ""}>${a.name}</option>`).join("")}</select></label>
        <div class="seg view-seg wide-only" role="tablist" aria-label="Show as">
          <button class="seg-btn${asList ? "" : " on"}" role="tab" aria-selected="${!asList}" data-testid="view-grid">Grid</button>
          <button class="seg-btn${asList ? " on" : ""}" role="tab" aria-selected="${asList}" data-testid="view-list">List</button></div>
      </div>
      <div class="builds-layout">
        ${list.length ? `<section class="grid builds-grid${asList ? " as-list" : ""}" data-testid="builds-grid">${list.map((b, i) => buildCard(b, i + 1)).join("")}</section>`
          : `<div class="empty" data-testid="builds-empty">${t("builds-empty-text", "No build for that position and archetype yet.", "", "p")}</div>`}
        ${sel ? `<aside class="preview wide-only" data-testid="build-preview" aria-label="Selected build">
          ${t("preview-kicker", "Selected", "muted small")}
          ${buildCard(sel, 1, { idp: "preview-card" })}
          <dl class="rows">${sel.attrs.slice(0, 4).map((a, i) => `<div>${t(`preview-attr-${i + 1}`, a.name, "", "dt")}${t(`preview-val-${i + 1}`, a.value, "num", "dd")}</div>`).join("")}</dl>
          <a class="btn btn-accent" href="#/builds/${sel.slug}" data-testid="preview-open">Open the build</a>
        </aside>` : ""}
      </div>`);
  };

  S.build = ({ slug, old = false, unverified = false } = {}) => {
    const b = D.BUILDS.find((x) => x.slug === slug) || D.BUILDS[9];
    const season = old ? 1 : b.season;
    const tag = unverified ? D.TAG_NEW : old ? "FC 27 · Season 1 · verified 20 Oct 2026" : b.tag;
    const max = 99;
    return shell("builds", `
      <a class="back" href="#/builds" data-testid="build-back">${icon("back", 18)}Builds</a>
      ${season < 2 ? `<p class="warn-bar" data-testid="old-season">${icon("warn", 18)}<span>${D.COPY.oldSeason(season)}</span></p>` : ""}
      <div class="build-layout">
        <section class="build-hero-col">
          <div class="hero-card" data-testid="build-hero">
            ${ghost("hero-code", b.pos)}
            ${t("hero-group", groupName(b.arch.group), "hero-group")}
            ${t("hero-pos", b.positions, "hero-pos")}
            ${t("hero-name", b.arch.name, "hero-name", "h1")}
          </div>
          <div class="meta">${vtag("version-tag", tag)}${credit("credit-line", b.by)}</div>
          <dl class="sheet" data-testid="build-body">${[
            ["Archetype", b.arch.name], ["Positions", b.positions], ["Height", b.height], ["Weight", b.weight],
            ["AcceleRATE", b.accelerate], ["Skill moves", b.skill], ["Weak foot", b.weak], ["Specialization", "Not recorded yet"],
          ].map(([k, v], i) => `<div>${t(`body-label-${i + 1}`, k, "", "dt")}${t(`body-value-${i + 1}`, v, "", "dd")}</div>`).join("")}</dl>
        </section>

        <section class="panel attrs" aria-labelledby="attrs-title">
          ${t("attrs-title", "Attributes", "panel-title", "h2", 'id="attrs-title"')}
          <ul class="attr-list">${b.attrs.map((a, i) => `<li data-testid="attr-row-${i + 1}">
            ${t(`attr-name-${i + 1}`, a.name, "attr-name")}
            <span class="bar" aria-hidden="true"><i style="width:${(a.value / max) * 100}%"></i></span>
            ${t(`attr-value-${i + 1}`, a.value, "attr-value")}</li>`).join("")}</ul>
        </section>

        <section class="build-side">
          <div class="tiles">
            ${[["Archetype", b.arch.name], ["Specialization", "Not recorded"], ["Season", `Season ${season}`], ["Version", "1"]].map(([k, v], i) =>
              `<div class="tile">${t(`tile-label-${i + 1}`, k, "muted small")}${t(`tile-value-${i + 1}`, v, "tile-value")}</div>`).join("")}
          </div>
          <div class="panel" aria-labelledby="ps-title">
            ${t("ps-title", "PlayStyles", "panel-title", "h2", 'id="ps-title"')}
            ${[["Signature", [b.arch.launch, b.arch.s2]], ["Plus", b.plus], ["Regular", b.regular]].map(([k, list], g) => `
              ${t(`ps-group-${g + 1}`, k, "ps-group", "h3")}
              <ul class="ps-list">${list.map((p, i) => `<li data-testid="ps-${g + 1}-${i + 1}"><span class="ps-mark" aria-hidden="true"></span>${p}</li>`).join("")}</ul>`).join("")}
          </div>
          <div class="panel" aria-labelledby="hist-title">
            ${t("hist-title", "History", "panel-title", "h2", 'id="hist-title"')}
            ${t("hist-1", `Version 1 · recorded on Season ${season}`, "small", "p")}
          </div>
        </section>
      </div>`);
  };

  // A plain pitch drawing of our own (DESIGN.md: our own diagrams), attack at the top.
  S.archetypes = () => {
    const rows = ["attacker", "midfielder", "defender", "goalkeeper"];
    return shell("archetypes", `
      ${head("archetypes", "Archetypes", "The 13 archetypes in FC 27, placed where they usually play.")}
      <div class="arch-layout">
        <section class="pitch" data-testid="pitch" aria-label="Archetypes on a pitch">
          <i class="pitch-line half"></i><i class="pitch-line circle"></i><i class="pitch-line box top"></i><i class="pitch-line box bottom"></i>
          ${rows.map((g) => `<div class="pitch-row">${D.ARCH.filter((a) => a.group === g).map((a) =>
            `<a class="pitch-chip" href="#/archetypes/${a.id}" data-testid="pitch-${a.id}">${a.name}</a>`).join("")}</div>`).join("")}
        </section>
        <section class="arch-groups">${D.GROUPS.slice().reverse().map((g) => `
          <div class="arch-group">
            ${t(`group-${g.id}`, g.name, "panel-title", "h2")}
            <div class="arch-tiles">${D.ARCH.filter((a) => a.group === g.id).map((a) => `
              <article class="arch-tile" data-testid="archetype-tile-${a.id}">
                ${t(`tile-name-${a.id}`, a.name, "at-name", "h3")}
                ${t(`tile-ps-${a.id}`, `${a.launch} · ${a.s2}`, "muted small")}
                <a class="stretch" href="#/archetypes/${a.id}" data-testid="tile-link-${a.id}" aria-label="${a.name}"></a>
              </article>`).join("")}</div>
          </div>`).join("")}
        </section>
      </div>`);
  };

  // Valdûm skill tree, without the tree: pick a signature PlayStyle and the panel says when it came
  // and where that fact comes from. No descriptions: we only show what a source states.
  const src = (id, key) => { const x = D.SOURCES[key]; return x ? `<a class="src" href="${x.url}" target="_blank" rel="noopener" data-testid="${id}">${x.title}</a>` : ""; };
  S.archetype = ({ id = "spark", ps = 0 } = {}) => {
    const a = D.ARCH.find((x) => x.id === id) || D.ARCH.find((x) => x.id === "spark");
    const same = D.ARCH.filter((x) => x.group === a.group);
    const b = D.BUILDS.find((x) => x.arch.id === a.id);
    return shell("archetypes", `
      <a class="back" href="#/archetypes" data-testid="arch-back">${icon("back", 18)}Archetypes</a>
      <div class="tabs" role="tablist" aria-label="Groups">${D.GROUPS.slice().reverse().map((g, i) =>
        `<a class="tabp${g.id === a.group ? " on" : ""}" role="tab" aria-selected="${g.id === a.group}" href="#/archetypes/${D.ARCH.find((x) => x.group === g.id).id}" data-testid="group-tab-${i + 1}">${g.name}</a>`).join("")}</div>
      <div class="tabs sub" role="tablist" aria-label="Archetypes">${same.map((x, i) =>
        `<a class="tabp${x.id === a.id ? " on" : ""}" role="tab" aria-selected="${x.id === a.id}" href="#/archetypes/${x.id}" data-testid="arch-tab-${i + 1}">${x.name}</a>`).join("")}</div>
      <div class="archd-layout">
        <section class="panel archd-main">
          ${t("archd-group", groupName(a.group), "muted small")}
          ${t("archd-name", a.name, "h1 display", "h1")}
          ${t("ps-sig-title", "Signature PlayStyles", "panel-title", "h2")}
          <div class="sig-list" role="tablist" aria-label="Signature PlayStyles">${[[a.launch, "Since launch"], [a.s2, "Added in Season 2"]].map(([name, when], i) =>
            `<button class="sig${i === ps ? " on" : ""}" role="tab" aria-selected="${i === ps}" data-testid="sig-${i + 1}"><b>${name}</b><span>${when}</span></button>`).join("")}</div>
          <div class="sig-detail" data-testid="sig-detail">
            ${t("sig-detail-name", ps ? a.s2 : a.launch, "sig-name")}
            ${t("sig-detail-when", ps ? "Signature PlayStyle for this archetype from Season 2" : "Signature PlayStyle for this archetype since launch", "small", "p")}
            ${t("sig-detail-shared", (() => { const n = ps ? a.s2 : a.launch; const o = D.ARCH.filter((x) => x.id !== a.id && (x.launch === n || x.s2 === n)).map((x) => x.name); return o.length ? `Also signature for ${o.join(", ")}` : "Signature for this archetype only"; })(), "muted small", "p")}
            ${src("sig-source", ps ? "pchq-archetype-changes" : "dexerto-archetypes")}
          </div>
          ${t("mastery-title", "Mastery attributes", "panel-title", "h2")}
          ${t("mastery", a.mastery || "Not found in a source we opened yet.", "", "p")}
          ${a.masterySrc ? src("mastery-source", a.masterySrc) : ""}
        </section>
        <aside class="panel archd-side">
          ${t("cost-title", "Season 2 cost change", "panel-title", "h2")}
          <div class="cost">
            <div>${t("cost-up", `${a.up}`, "cost-num")}${t("cost-up-l", "attribute costs went up", "muted small")}</div>
            <div>${t("cost-down", `${a.down}`, "cost-num")}${t("cost-down-l", "went down", "muted small")}</div>
          </div>
          ${src("cost-source", "ea-archetypes-update")}
          ${t("arch-builds-title", "Builds on this archetype", "panel-title", "h2")}
          ${buildCard(b, 1, { idp: "arch-build" })}
        </aside>
      </div>`);
  };
})();
