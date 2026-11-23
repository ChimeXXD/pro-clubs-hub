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
  // Chime's in-game pro in an archetype's stance, head and shoulders, the face centred (crops of Chime's own
  // screenshots; one credit line per page says so). A player-named build shows only its archetype emblem
  // until our in-game recreation exists (D-42, D-10).
  const portrait = (stanceId, archId, cls = "", testid = "build-face", alt = "") => !stanceId
    ? `<figure class="portrait slot ${cls}" data-testid="${testid}">${emblem(archId, "ring", false)}<figcaption class="slot-note">Face coming soon</figcaption></figure>`
    : `<figure class="portrait ${cls}" data-testid="${testid}" style="--fx:${D.stanceFocus(stanceId)}"><img src="${D.icon.stance(stanceId)}" alt="${esc(alt)}"></figure>`;
  // Names the stance actually shown (a build's stance can differ from the page's archetype).
  const pictureCredit = (stanceId, many = true) => `<p class="pic-credit" data-testid="picture-credit">${many ? "Pictures" : "Picture"}: Chime's own pro in the ${esc(D.archetype(stanceId).name)} stance, from the game.</p>`;
  const slash = `<svg class="slash" viewBox="0 0 14 28" aria-hidden="true"><path d="M8 0h6L6 28H0z"/></svg>`;

  function topbar() {
    return `<header class="top">
      <a class="logo" href="#/builds">${slash}<b>Pro Clubs Hub</b></a>
      <nav class="nav" aria-label="Sections"><a href="#">Faces</a><a href="#/builds" aria-current="page">Builds</a><a href="#">Changelog</a><a href="#">Submit</a></nav>
      <span class="season">FC 27 · Season 2</span>
      <button class="menu" aria-label="Menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg></button>
    </header>`;
  }
  const footer = () => `<footer class="foot"><p>${D.notice}</p><p class="faint">Draft only: PlayStyle icons are EA's art, archetype emblems are Pro Clubs HQ's tracings and the stances are Chime's screenshots. None of them ships as is.</p></footer>`;
  const crumbs = (...parts) => `<nav class="crumbs" aria-label="Breadcrumb">${parts.map((p, i) =>
    i < parts.length - 1 ? `<a href="${p[1]}">${esc(p[0])}</a><span aria-hidden="true">/</span>` : `<span aria-current="page">${esc(p[0])}</span>`).join("")}</nav>`;

  // 1. /builds: the 13 archetypes in four groups.
  function picker() {
    const tile = (id) => {
      const a = D.archetype(id);
      return `<a class="tile" href="#/builds/${id}" data-testid="archetype-tile-${id}">
        ${emblem(id, "ring", false)}
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

  const statGrid = (f, live = false) => `<dl class="statgrid">${Object.entries(f).map(([k, v]) => `<div><dt>${k}</dt><dd${live ? ` data-sum="${k}"` : ""}>${v}</dd></div>`).join("")}</dl>`;

  // 2. /builds/<archetype>: archetype header, then its builds (sample builds exist for Finisher only).
  function archetypePage(id = "finisher") {
    const a = D.archetype(id), g = a.group, builds = id === "finisher" ? D.builds : [];
    const card = (b) => `<a class="bcard" href="#/builds/${id}/${b.id}" data-testid="build-card-${b.id}">
      ${portrait(b.stance, id, "card", `build-face-${b.id}`)}
      <div class="bcard-body">
        <div class="badges">${b.badges.map(badge).join("")}</div>
        <h3 class="bcard-name">${b.name}</h3>
        ${b.inspiredBy ? `<p class="inspired">Inspired by ${esc(b.inspiredBy)}. Not endorsed by the player.</p>` : ""}
        <p class="meta">${b.positions.map((p) => `<span class="pos">${p}</span>`).join("")}<span>Level ${b.level}</span><span>${b.height}</span></p>
        ${statGrid(b.stats ?? window.BV2Level.summary(b, window.BV2Level.compute(b, b.level).values))}
        <p class="bcard-ps"><span class="label">PlayStyles+</span>${b.psPlus.map((n) => psIcon(n, true, "sm")).join("")}</p>
      </div>
    </a>`;
    return `${topbar()}<main class="page">
      ${crumbs(["Builds", "#/builds"], [g.name, `#/builds`], [a.name, ""])}
      <section class="hero" aria-labelledby="arch-name">
        <div class="hero-mark">${emblem(id, "ring big")}</div>
        <div class="hero-text">
          <p class="kicker">${g.name} · Archetype</p>
          <h1 id="arch-name" class="display xl">${a.name}</h1>
          <p class="lede">Every ${a.name} build, the Meta pick first.</p>
          ${a.inspiration ? `<p class="inspo" data-testid="inspiration">EA's inspiration: ${esc(a.inspiration)}</p>` : ""}
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
        ${[...new Set(builds.map((b) => b.stance).filter(Boolean))].map((st) => pictureCredit(st, builds.filter((b) => b.stance === st).length > 1)).join("")}
        <div class="bcards">${builds.map(card).join("")}</div>
      </section>
    </main>${footer()}`;
  }

  // 3. /builds/finisher/meta-finisher at the reader's level (D-43). Everything level-dependent renders from
  // BV2Level, and BV2Level.apply() updates the same nodes in place when the level changes.
  let lvId = 0;
  function buildPage(level = 55) {
    const L = window.BV2Level, b = D.build, a = D.archetype("finisher"), r = L.compute(b, level), uid = `lv-${++lvId}`;
    const sum = L.summary(b, r.values);
    const groups = b.groups.map(([g, code, keys]) => `<section class="agroup"><div class="agroup-head"><h3>${g}</h3><span class="avg" data-gavg="${code}">${L.gauge(sum[code])}<b>${sum[code]}</b></span></div>
        ${keys.map((n) => { const v = r.values[n], t = r.target[n]; return `<div class="arow${t < 50 ? " low" : ""}${v < t ? " short" : ""}" data-attr="${esc(n)}"><span>${n}${a.mastery.includes(n) ? ` <em class="tag">Mastery</em>` : ""}</span><b><span data-v>${v}</span><span class="tgt" data-t>${v < t ? ` / ${t}` : ""}</span></b><i><u style="width:${t}%"></u><s style="width:${v}%"></s></i></div>`; }).join("")}
      </section>`).join("");
    const psList = (names, plus) => names.map((n) => `<li>${psIcon(n, plus, "", false)}<span>${n}${[a.launch, a.season2].includes(n) ? `<em>Signature</em>` : ""}</span></li>`).join("");
    return `${topbar()}<main class="page">
      ${crumbs(["Builds", "#/builds"], [a.name, "#/builds/finisher"], [b.name, ""])}
      <section class="bhead">
        <div class="bhead-text">
          <div class="badges">${badge("meta")}<span class="sample" data-testid="sample-label">Sample build · values and prices not checked in game</span></div>
          <h1 class="display xl">${b.name}</h1>
          <p class="vtag" data-testid="version-tag">FC 27 · Season 2 · Not yet checked in game</p>
          <p class="credit" data-testid="credit-line">Made by — (sample) · Played for one match before it's called meta</p>
        </div>
        <button class="copy" data-testid="copy-build">Copy build</button>
      </section>
      <section class="levelbar" data-level-bar data-testid="level-switch" aria-label="Your level">
        <div class="lv-top">
          <label class="lv-label" for="${uid}">Your level</label>
          <div class="lv-step">
            <button type="button" class="lv-btn" data-lv-step="-1" aria-label="Level down">−</button>
            <input id="${uid}" class="lv-num" type="number" inputmode="numeric" min="${L.MIN}" max="${L.MAX}" value="${r.level}" data-lv-num>
            <button type="button" class="lv-btn" data-lv-step="1" aria-label="Level up">+</button>
          </div>
          <p class="lv-ap" data-lv-ap aria-live="polite">${L.apLine(r)}</p>
        </div>
        <div class="lv-slider"><span class="lv-track"><span class="lv-fill" data-lv-fill style="width:${L.pct(r.level)}%"></span></span><span class="lv-thumb" data-lv-thumb style="left:${L.pct(r.level)}%"></span>
          <input class="lv-range" type="range" min="${L.MIN}" max="${L.MAX}" value="${r.level}" aria-label="Your level, ${L.MIN} to ${L.MAX}" data-lv-range></div>
      </section>
      <p class="lv-note">Raw values, as with Attribute totals off: masteries, height and weight and Amps aren't added.</p>
      <div class="bgrid">
        <aside class="panel card-panel">
          <div class="card-hero">
            ${portrait(b.stance, a.id, "hero-face", "build-face", b.stance ? `Chime's in-game pro in the ${D.archetype(b.stance).name} stance` : "")}
            <div class="card-side">
              <div class="card-top">${emblem("finisher", "ring")}<div><b class="card-arch">${a.name}</b>
                <p class="meta">${b.positions.map((p) => `<span class="pos">${p}</span>`).join("")}</p></div></div>
              ${statGrid(sum, true)}
            </div>
          </div>
          ${b.stance ? pictureCredit(b.stance, false) : ""}
          <section class="afford" aria-live="polite"><h2 class="label" data-afford-h>${L.affordHead(r)}</h2><div data-afford>${L.affordBody(r)}</div></section>
          <section class="spec" data-testid="specialization">
            <h2 class="label">Specialization</h2>
            <div class="spec-head">${psIcon(b.spec.playStyle, true, "", false)}<div><b>${b.spec.name}</b><em>${b.spec.playStyle}+</em></div></div>
            <p class="spec-why">Targets ${b.spec.targets.join(", ")}: one at 92, two at 90. Which one is 92 isn't recorded yet, so this sample counts all three at 92.</p>
            <ul class="spec-rows" data-spec-rows>${L.specRows(b, r)}</ul>
            <p class="spec-status" data-spec-status aria-live="polite">${L.specStatus(r)}</p>
            <p class="spec-from">${r.specFrom ? `Reached from level ${r.specFrom} with the sample prices.` : `Not reached by level ${L.MAX} with the sample prices.`} Counts raw values only.</p>
          </section>
          <dl class="body">
            <div><dt>Built at level</dt><dd>${b.level}</dd></div><div><dt>Height</dt><dd>${b.height}</dd></div>
            <div><dt>Weight</dt><dd>${b.weight}</dd></div><div><dt>AcceleRATE</dt><dd>${b.accelerate}</dd></div>
            ${Object.entries(L.STARS).map(([k, label]) => `<div><dt>${label}</dt><dd data-star="${k}">${L.stars(r.values[k], r.target[k])}</dd></div>`).join("")}
          </dl>
          <h2 class="label">PlayStyles+</h2><ul class="pslist">${psList(b.psPlus, true)}</ul>
          <h2 class="label">PlayStyles</h2><ul class="pslist">${psList(b.ps, false)}</ul>
        </aside>
        <section class="panel attrs" aria-label="Attributes"><h2 class="panel-title">Attributes</h2><div class="agroups">${groups}</div></section>
      </div>
    </main>${footer()}`;
  }

  // Inline each emblem's SVG so it takes the accent colour (and captures as vectors).
  const cache = {};
  async function hydrate(root) {
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
