// Three screens for the merged Builds section (D-33): archetype picker, one archetype's builds,
// one build. Same markup at 393 and 1440; the frame's container width switches the layout.
window.BV2Screens = (() => {
  const D = window.BV2;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  // labelled = false when the emblem only decorates something already named (no extra read-out inside a link).
  const emblem = (id, cls = "", labelled = true) => `<span class="emblem ${cls}" data-emblem="${id}" ${labelled
    ? `role="img" aria-label="${esc(D.archetype(id).name)} emblem"` : `aria-hidden="true"`}></span>`;
  // labelled = false when the name is already written next to the icon (no double read-out).
  const psIcon = (name, plus, size = "", labelled = true) =>
    `<img class="ps ${size}" src="${plus ? D.icon.psPlus(name) : D.icon.ps(name)}" alt="${labelled ? `${esc(name)}${plus ? " (PlayStyle+)" : ""}` : ""}">`;
  const sample = `<span class="sample" data-testid="sample-label">Sample values · not a real build</span>`;
  const badge = (b) => (b === "meta" ? `<span class="badge meta">Meta pick</span>`
    : b === "copied" ? `<span class="badge copied">Most copied <em>after launch</em></span>` : "");
  // Stand-in face (D-41): a crop of EA's Clubs screenshots, always tagged. A player-named build shows no face at
  // all, only its archetype emblem, until Chime's or Sharon's in-game recreation exists (D-10, Chime 22 Nov).
  // A build with no face file is that slot.
  const portrait = (file, archId, cls = "", testid = "build-face") => !file
    ? `<figure class="portrait slot ${cls}" data-testid="${testid}">${emblem(archId, "ring", false)}<figcaption class="slot-note">Face coming soon</figcaption></figure>`
    : `<figure class="portrait ${cls}" data-testid="${testid}">
      <img src="${D.icon.face(file)}" alt="">
      <figcaption class="standin">Stand-in face</figcaption>
    </figure>`;
  const slash = `<svg class="slash" viewBox="0 0 14 28" aria-hidden="true"><path d="M8 0h6L6 28H0z"/></svg>`;

  function topbar() {
    return `<header class="top">
      <a class="logo" href="#/builds">${slash}<b>Pro Clubs Hub</b></a>
      <nav class="nav" aria-label="Sections"><a href="#">Faces</a><a href="#/builds" aria-current="page">Builds</a><a href="#">Changelog</a><a href="#">Submit</a></nav>
      <span class="season">FC 27 · Season 2</span>
      <button class="menu" aria-label="Menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg></button>
    </header>`;
  }
  const footer = () => `<footer class="foot"><p>${D.notice}</p><p class="faint">PlayStyle icons are EA's art; archetype emblems are Pro Clubs HQ's tracings of EA's emblems. Reference only in this draft (D-39).</p><p class="faint">Stand-in faces are crops of EA's Clubs screenshots, kept out of the repo, and will be replaced by Chime's and Sharon's in-game faces (D-41).</p></footer>`;
  const crumbs = (...parts) => `<nav class="crumbs" aria-label="Breadcrumb">${parts.map((p, i) =>
    i < parts.length - 1 ? `<a href="${p[1]}">${esc(p[0])}</a><span aria-hidden="true">/</span>` : `<span aria-current="page">${esc(p[0])}</span>`).join("")}</nav>`;

  // 1. /builds: the 13 archetypes in four groups.
  function picker() {
    const tile = (id) => {
      const a = D.archetype(id);
      return `<a class="tile cut" href="#/builds/${id}" data-testid="archetype-tile-${id}">
        ${emblem(id, "ring")}
        <span class="tile-name">${a.name}</span>
        <span class="tile-sig">${psIcon(a.launch, false, "sm", false)}${psIcon(a.season2, false, "sm", false)}
          <span class="tile-sig-names">${a.launch} · ${a.season2}</span></span>
      </a>`;
    };
    return `${topbar()}<main class="page">
      <section class="intro">
        <p class="kicker">Builds · FC 27 · Season 2</p>
        <h1 class="display">Pick your archetype</h1>
        <p class="lede">13 archetypes in EA's four groups. Under each, its two Signature PlayStyles.</p>
      </section>
      ${D.groups.map((g) => `<section class="group" aria-labelledby="g-${g.id}">
        <div class="group-head"><h2 id="g-${g.id}" class="display">${g.name}</h2><span class="count">${g.ids.length} archetypes</span><span class="rule"></span></div>
        <div class="tiles n${g.ids.length}">${g.ids.map(tile).join("")}</div>
      </section>`).join("")}
    </main>${footer()}`;
  }

  const statGrid = (f) => `<dl class="statgrid">${Object.entries(f).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>`;

  // 2. /builds/<archetype>: archetype header, then its builds (sample builds exist for Finisher only).
  function archetypePage(id = "finisher") {
    const a = D.archetype(id), g = a.group, builds = id === "finisher" ? D.builds : [];
    const card = (b) => `<a class="bcard cut" href="#/builds/${id}/${b.id}" data-testid="build-card-${b.id}">
      ${portrait(b.face, id, "card", `build-face-${b.id}`)}
      <div class="bcard-body">
        <div class="badges">${b.badges.map(badge).join("")}</div>
        <h3 class="bcard-name">${b.name} <span class="faint">(sample)</span></h3>
        ${b.inspiredBy ? `<p class="inspired">Inspired by ${esc(b.inspiredBy)}. Not endorsed by the player.</p>` : ""}
        <p class="meta">${b.positions.map((p) => `<span class="pos">${p}</span>`).join("")}<span>Level ${b.level}</span><span>${b.height}</span></p>
        ${statGrid(b.stats)}
        <p class="bcard-ps"><span class="label">PlayStyles+</span>${b.psPlus.map((n) => psIcon(n, true, "sm")).join("")}</p>
      </div>
    </a>`;
    return `${topbar()}<main class="page">
      ${crumbs(["Builds", "#/builds"], [g.name, `#/builds`], [a.name, ""])}
      <section class="hero cut" aria-labelledby="arch-name">
        <div class="hero-mark">${emblem(id, "ring big")}</div>
        <div class="hero-text">
          <p class="kicker">${g.name} · Archetype</p>
          <h1 id="arch-name" class="display xl">${a.name}</h1>
          <p class="lede">Every ${a.name} build, the Meta pick first.</p>
        </div>
        <div class="facts">
          <div class="fact"><span class="label">Signature PlayStyles</span>
            <span class="sig">${psIcon(a.launch, false, "", false)}<span><b>${a.launch}</b><em>From launch</em></span></span>
            <span class="sig">${psIcon(a.season2, false, "", false)}<span><b>${a.season2}</b><em>From Season 2</em></span></span></div>
          <div class="fact"><span class="label">Mastery, level 10</span>${a.mastery ? `<span class="mastery">${a.mastery.map((m) => `<b>${m} <em>+1</em></b>`).join("")}</span>` : `<span class="faint">Not yet recorded</span>`}</div>
          <div class="fact"><span class="label">Season 2 cost changes</span><span class="costs"><b>${a.costs.up}</b> up <b>${a.costs.down}</b> down</span></div>
          <div class="fact"><span class="label">Positions</span><span class="faint">Not yet recorded</span></div>
        </div>
      </section>
      <section class="list" aria-labelledby="list-h">
        <div class="list-head"><h2 id="list-h" class="display">${builds.length} builds</h2>${sample}</div>
        <div class="bcards">${builds.map(card).join("")}</div>
      </section>
    </main>${footer()}`;
  }

  // Gauge arc for a group's average, after FUT.GG's attribute groups. The filled arc is drawn to its
  // end point (not a dash pattern) so it survives the Figma capture.
  const gauge = (v) => {
    const a = Math.PI * (1 - v / 99), x = (20 + 15 * Math.cos(a)).toFixed(2), y = (21 - 15 * Math.sin(a)).toFixed(2);
    return `<svg class="gauge" viewBox="0 0 40 24" aria-hidden="true"><path class="g-bg" d="M5 21a15 15 0 0 1 30 0"/><path class="g-on" d="M5 21A15 15 0 0 1 ${x} ${y}"/></svg>`;
  };

  // 3. /builds/finisher/meta-finisher: the build to copy.
  function buildPage() {
    const b = D.build, a = D.archetype("finisher");
    const groups = b.groups.map(([g, rows]) => {
      const avg = Math.round(rows.reduce((s, r) => s + r[1], 0) / rows.length);
      return `<section class="agroup"><div class="agroup-head"><h3>${g}</h3><span class="avg">${gauge(avg)}<b>${avg}</b></span></div>
        ${rows.map(([n, v]) => `<div class="arow${v < 50 ? " low" : ""}"><span>${n}${a.mastery.includes(n) ? ` <em class="tag">Mastery</em>` : ""}</span><b>${v}</b><i><s style="width:${v}%"></s></i></div>`).join("")}
      </section>`;
    }).join("");
    const psList = (names, plus) => names.map((n) => `<li>${psIcon(n, plus, "", false)}<span>${n}${[a.launch, a.season2].includes(n) ? `<em>Signature</em>` : ""}</span></li>`).join("");
    return `${topbar()}<main class="page">
      ${crumbs(["Builds", "#/builds"], [a.name, "#/builds/finisher"], [b.name, ""])}
      <section class="bhead">
        <div class="bhead-text">
          <div class="badges">${badge("meta")}${sample}</div>
          <h1 class="display xl">${b.name} <span class="faint">(sample)</span></h1>
          <p class="vtag" data-testid="version-tag">FC 27 · Season 2 · Not yet checked in game</p>
          <p class="credit" data-testid="credit-line">Made by — (sample) · Played for one match before it's called meta (D-30)</p>
        </div>
        <button class="copy cut" data-testid="copy-build">Copy build</button>
      </section>
      <div class="bgrid">
        <aside class="panel cut card-panel">
          <div class="card-hero">
            ${portrait(b.heroFace, a.id, "hero-face cut")}
            <div class="card-side">
              <div class="card-top">${emblem("finisher", "ring")}<div><b class="card-arch">${a.name}</b>
                <p class="meta">${b.positions.map((p) => `<span class="pos">${p}</span>`).join("")}</p></div></div>
              ${statGrid(b.stats)}
            </div>
          </div>
          <dl class="body">
            <div><dt>Level</dt><dd>${b.level}</dd></div><div><dt>Height</dt><dd>${b.height}</dd></div>
            <div><dt>Weight</dt><dd>${b.weight}</dd></div><div><dt>AcceleRATE</dt><dd>${b.accelerate}</dd></div>
            <div><dt>Skill moves</dt><dd>${"★".repeat(b.skillMoves)}</dd></div><div><dt>Weak foot</dt><dd>${"★".repeat(b.weakFoot)}</dd></div>
            <div><dt>Specialization</dt><dd class="faint">Not yet recorded</dd></div>
          </dl>
          <h2 class="label">PlayStyles+</h2><ul class="pslist">${psList(b.psPlus, true)}</ul>
          <h2 class="label">PlayStyles</h2><ul class="pslist">${psList(b.ps, false)}</ul>
        </aside>
        <section class="panel attrs" aria-label="Attributes"><h2 class="panel-title">Attributes</h2><div class="agroups">${groups}</div></section>
      </div>
    </main>${footer()}`;
  }

  // Cut corners as two page-coloured triangles (clip-path doesn't survive the Figma capture).
  const notch = (pos, d) => `<svg class="notch ${pos}" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true"><path d="${d}"/></svg>`;

  // Inline each emblem's SVG so it takes the accent colour (and captures as vectors).
  const cache = {};
  async function hydrate(root) {
    root.querySelectorAll(".cut").forEach((el) => {
      if (!el.querySelector(":scope > .notch")) el.insertAdjacentHTML("beforeend", notch("tr", "M0 0H1V1z") + notch("bl", "M0 0V1H1z"));
    });
    await Promise.all([...root.querySelectorAll("[data-emblem]")].map(async (el) => {
      const id = el.dataset.emblem;
      cache[id] ??= fetch(D.icon.emblem(id)).then((r) => { if (!r.ok) throw new Error(`${r.status} ${r.url}`); return r.text(); })
        .then((t) => t.replace(/<\?xml[^>]*>/, "").replace(/fill="#CCCCCC"/gi, 'fill="currentColor"')
          .replace(/<svg[^>]*>/, (tag) => {
            const w = tag.match(/width="([\d.]+)"/)?.[1], h = tag.match(/height="([\d.]+)"/)?.[1];
            const box = tag.includes("viewBox") ? "" : ` viewBox="0 0 ${w} ${h}"`;
            return tag.replace(/ width="[\d.]+"| height="[\d.]+"/g, "").replace(/>$/, `${box}>`);
          }));
      // A missing icon (assets are git-ignored) leaves the ring empty instead of hanging the capture.
      try { el.innerHTML = await cache[id]; } catch (e) { delete cache[id]; console.warn("emblem", id, e); }
    }));
    await Promise.all([...root.querySelectorAll("img")].map((i) => i.decode().catch(() => {})));
  }

  return { picker, archetypePage, buildPage, hydrate };
})();
