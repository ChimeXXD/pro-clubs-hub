// Shared parts of the first draft. Classic script: exposes window.U.
// Every element with text, an icon or an action gets a data-testid (UI-BRIEF §6 names first).
(() => {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const t = (id, text, cls = "", tag = "span", attrs = "") =>
    `<${tag} data-testid="${id}"${cls ? ` class="${cls}"` : ""}${attrs ? ` ${attrs}` : ""}>${text}</${tag}>`;

  const PATHS = {
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
    home: '<path d="M4 11 12 4l8 7v8.5a.5.5 0 0 1-.5.5H15v-6H9v6H4.5a.5.5 0 0 1-.5-.5Z"/>',
    face: '<circle cx="12" cy="10" r="5.5"/><path d="M8.5 15.5c-.6 1.4-.9 3-.9 4.5M15.5 15.5c.6 1.4.9 3 .9 4.5"/>',
    build: '<path d="M5 19V9M10 19V5M15 19v-7M20 19v-4"/>',
    pitch: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 12h16"/><circle cx="12" cy="12" r="2.5"/>',
    log: '<path d="M7 5h10M7 10h10M7 15h6"/><circle cx="17.5" cy="17.5" r="3"/>',
    back: '<path d="m14 6-6 6 6 6"/>',
    next: '<path d="m10 6 6 6-6 6"/>',
    check: '<path d="m5.5 12.5 4 4 9-9"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    play: '<path d="M8 5.5v13l10-6.5Z"/>',
    out: '<path d="M14 5h5v5M19 5l-8 8M17 14v5H5V7h5"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    spin: '<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>',
    clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
    warn: '<path d="M12 4 21 19H3Z"/><path d="M12 10v4M12 16.5v.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  };
  const icon = (name, size = 20) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[name]}</svg>`;

  const daysUntil = (iso, now = new Date()) =>
    Math.max(0, Math.round((new Date(iso + "T00:00:00") - new Date(now.toDateString())) / 864e5));

  const NAV = [
    { id: "home", name: "Home", href: "#/", icon: "home" },
    { id: "faces", name: "Faces", href: "#/faces", icon: "face" },
    { id: "builds", name: "Builds", href: "#/builds", icon: "build" },
    { id: "archetypes", name: "Archetypes", href: "#/archetypes", icon: "pitch" },
    { id: "changelog", name: "Changelog", href: "#/changelog", icon: "log" },
  ];

  // Desktop: Ravex's live ticker over a one-row top bar. Phone: wordmark and search only;
  // sections live in the floating tab bar (World Cup 2026).
  const ticker = () => {
    const d = daysUntil(D.SEASON.nextDate);
    return `<div class="ticker wide-only">
      ${t("ticker-season", D.SEASON.label, "ticker-strong")}
      ${t("ticker-next", `${D.SEASON.next} starts ${D.SEASON.nextDay} · in ${d} day${d === 1 ? "" : "s"}`)}
      ${t("ticker-latest", `Latest: ${D.CHANGES[0].title}`)}
    </div>`;
  };

  const topbar = (active) => `<header class="topbar">
    <a href="#/" class="wordmark" data-testid="wordmark">ProBuilds</a>
    <nav class="topnav wide-only" aria-label="Sections">${NAV.slice(1).map((n) =>
      `<a href="${n.href}" data-testid="nav-${n.id}"${active === n.id ? ' aria-current="page"' : ""}>${n.name}</a>`).join("")}</nav>
    <label class="search"><span data-testid="search-icon" class="search-icon">${icon("search", 18)}</span>
      <input data-testid="search-input" type="search" placeholder="Search" aria-label="Search faces and builds"></label>
    <a href="#/submit" class="btn btn-accent wide-only" data-testid="nav-submit">Submit</a>
  </header>`;

  const tabbar = (active) => `<nav class="tabbar phone-only" aria-label="Sections">${NAV.map((n) =>
    `<a href="${n.href}" data-testid="tab-${n.id}" class="tab${active === n.id ? " on" : ""}"${active === n.id ? ' aria-current="page"' : ""} aria-label="${n.name}">${icon(n.icon, 21)}${active === n.id ? `<b>${n.name}</b>` : ""}</a>`).join("")}</nav>`;

  const footer = () => `<footer class="footer">
    <div class="footer-row">
      ${t("footer-wordmark", "ProBuilds", "footer-mark")}
      <nav aria-label="Site">${[["About", "#/about"], ["Submit", "#/submit"], ["Takedown", "#/takedown"], ["Changelog", "#/changelog"]]
        .map(([n, h], i) => `<a href="${h}" data-testid="footer-link-${i + 1}">${n}</a>`).join("")}</nav>
    </div>
    ${t("site-notice", D.COPY.notice, "notice", "p")}
  </footer>`;

  const sampleBar = () => `<p class="sample-bar" data-testid="sample-note">${D.COPY.sample}</p>`;

  const shell = (active, body, { bare = false } = {}) => `<div class="page">
    ${ticker()}${topbar(active)}${sampleBar()}
    <main class="main${bare ? " bare" : ""}">${body}</main>
    ${footer()}${tabbar(active)}
  </div>`;

  // Version tag and credit line: always visible, never in a tooltip (DESIGN.md).
  const vtag = (id, tag) => `<span data-testid="${id}" class="vtag${tag.includes("not yet") ? " vtag-new" : ""}">${tag}</span>`;
  const credit = (id, by, extra = "") => t(id, `Made by ${by} in game${extra ? ` · ${extra}` : ""}`, "credit");

  // Child IDs don't share the card's prefix, so [data-testid^="face-card-"] matches cards only
  // (UI-BRIEF §6). A card's tag and credit say which card: version-tag-face-1, credit-line-build-2,
  // and version-tag-paired / credit-line-paired for the build paired with a face.
  const kid = (idp) => ({ "face-card": "fc", "build-card": "bc" })[idp] || idp;
  const tagId = (what, idp, n, base) => (idp === base ? `${what}-${base.split("-")[0]}-${n}` : idp === "paired-card" ? `${what}-paired` : `${what}-${idp}-${n}`);

  // Face card: no picture of the person (D-10). The era is the image, set huge behind the name.
  const faceCard = (f, n, { idp = "face-card" } = {}) => { const k = kid(idp); return `<article class="face-card" data-testid="${idp}-${n}">
    ${ghost("fc-era", f.era)}
    ${t(`${k}-kind-${n}`, f.kind, "fc-kind")}
    <div class="fc-foot">
      ${t(`${k}-inspired-${n}`, "Inspired by", "fc-inspired")}
      ${t(`${k}-name-${n}`, esc(f.name), "fc-name", "h3")}
      ${vtag(tagId("version-tag", idp, n, "face-card"), f.tag)}
      ${credit(tagId("credit-line", idp, n, "face-card"), f.by)}
    </div>
    <a class="stretch" href="#/faces/${f.slug}" data-testid="${k}-link-${n}" aria-label="${esc(f.name)}, ${f.era}"></a>
  </article>`; };

  // Build card: World Cup 2026's bright card with a huge faded number (ours: the position code),
  // over Olive's quiet facts block.
  const buildCard = (b, n, { idp = "build-card", href = `#/builds/${b.slug}` } = {}) => { const k = kid(idp); return `<article class="build-card" data-testid="${idp}-${n}" data-slug="${b.slug}">
    <div class="bc-hero">
      ${ghost("bc-code", b.pos)}
      ${t(`${k}-pos-${n}`, b.positions, "bc-pos")}
      ${t(`${k}-name-${n}`, b.arch.name, "bc-name", "h3")}
    </div>
    <dl class="facts">
      <div>${t(`${k}-hl-${n}`, "Height", "", "dt")}${t(`${k}-h-${n}`, b.height, "", "dd")}</div>
      <div>${t(`${k}-wl-${n}`, "Weight", "", "dt")}${t(`${k}-w-${n}`, b.weight, "", "dd")}</div>
      <div>${t(`${k}-al-${n}`, "AcceleRATE", "", "dt")}${t(`${k}-a-${n}`, b.accelerate, "", "dd")}</div>
    </dl>
    <div class="bc-tag">${vtag(tagId("version-tag", idp, n, "build-card"), b.tag)}${credit(tagId("credit-line", idp, n, "build-card"), b.by)}</div>
    <a class="stretch" href="${href}" data-testid="${k}-link-${n}" aria-label="${b.arch.name} build, ${b.positions}"></a>
  </article>`; };

  // Decorative numbers drawn by CSS from data-num: not text, so not read out or contrast-checked.
  const ghost = (cls, txt) => `<span class="ghost ${cls}" data-num="${esc(txt)}" aria-hidden="true"></span>`;

  const chips = (idp, items, on = 0, cls = "") => `<div class="chips ${cls}" role="tablist">${items.map((c, i) =>
    `<button class="chip${i === on ? " on" : ""}" role="tab" aria-selected="${i === on}" data-testid="${idp}-${i + 1}">${c}</button>`).join("")}</div>`;

  const head = (idp, title, sub = "") => `<div class="page-head">
    ${t(`${idp}-title`, title, "h1", "h1")}${sub ? t(`${idp}-sub`, sub, "sub", "p") : ""}</div>`;

  window.U = { esc, t, icon, ghost, daysUntil, shell, vtag, credit, faceCard, buildCard, chips, head, NAV };
})();
