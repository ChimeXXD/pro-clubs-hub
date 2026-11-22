// Clickable prototype: hash router, colour switcher and the interactions in interactions.json.
(() => {
  const root = document.getElementById("app");
  const store = {
    get: (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Colour switcher (draft tool, outside the product)
  const setTheme = (id) => {
    document.documentElement.dataset.theme = id;
    store.set("draft-theme", id);
    document.querySelectorAll("[data-theme-btn]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.themeBtn === id)));
  };
  // Mode: a ?mode= link or a saved Dark/Light choice wins; with neither, follow the device setting and its changes.
  // New key: the old "draft-mode" was written on every load (always "dark" by default), so it is not a real choice.
  const isMode = (v) => v === "light" || v === "dark";
  const systemLight = matchMedia("(prefers-color-scheme: light)");
  const setMode = (m, { save = false } = {}) => {
    document.documentElement.dataset.mode = m;
    if (save) store.set("draft-mode-choice", m);
    document.querySelectorAll("[data-mode-btn]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.modeBtn === m)));
  };
  document.getElementById("themes").innerHTML = `<span class="tools-label">Colour</span>${D.THEMES.map((th) =>
    `<button data-theme-btn="${th.id}" aria-pressed="false" title="From ${th.from}"><i style="background:${th.swatch}"></i>${th.name}</button>`).join("")}
    <span class="tools-label tools-gap">Mode</span>${["dark", "light"].map((m) =>
    `<button data-mode-btn="${m}" aria-pressed="false">${m === "dark" ? "Dark" : "Light"}</button>`).join("")}`;
  document.getElementById("themes").addEventListener("click", (e) => {
    const b = e.target.closest("[data-theme-btn]"); if (b) setTheme(b.dataset.themeBtn);
    const m = e.target.closest("[data-mode-btn]"); if (m) setMode(m.dataset.modeBtn, { save: true });
  });
  const qs = new URLSearchParams(location.search);
  // Only known values: an unknown theme would leave light mode with the dark palette (no light block matches it)
  const pick = (ok, ...vals) => vals.find(ok);
  setTheme(pick((v) => D.THEMES.some((t) => t.id === v), qs.get("theme"), store.get("draft-theme", "volt"), "volt"));
  const chosenMode = () => pick(isMode, qs.get("mode"), store.get("draft-mode-choice", null));
  setMode(chosenMode() || (systemLight.matches ? "light" : "dark"));
  systemLight.addEventListener("change", (e) => { if (!chosenMode()) setMode(e.matches ? "light" : "dark"); });

  // Ticks are saved per face with the face's version; a new version starts fresh and says so (SPEC flow 2).
  const ticks = (f) => {
    const saved = store.get(`ticks:${f.slug}`, null);
    if (saved && saved.v !== f.version) { store.set(`ticks:${f.slug}`, { v: f.version, done: 0 }); view.updated[f.slug] = true; return 0; }
    return saved ? saved.done : 0;
  };

  // Per-page view state that survives re-renders. Form values are kept per kind: f-name is
  // "Inspired by" on a face and "Archetype" on a build.
  const freshSubmit = () => ({ errors: false, sent: false, kind: "face", tab: 0, values: { face: {}, build: {} } });
  const view = {
    homeTab: 0, homePos: 0, faceFilter: 0, buildFilter: 0, buildArch: "", buildSel: null, buildList: false,
    tab: {}, angle: {}, playing: {}, updated: {}, ps: {},
    submit: freshSubmit(),
  };
  let last = "";

  const route = () => {
    const [, a = "", b, c] = location.hash.replace(/^#/, "").split("/");
    if (a === "") return S.home({ tab: view.homeTab, pos: view.homePos });
    if (a === "faces" && !b) {
      const list = D.FACES.filter(D.FACE_FILTERS[view.faceFilter].test);
      return S.faces({ on: view.faceFilter, list, empty: !list.length });
    }
    const face = a === "faces" && D.FACES.find((x) => x.slug === b);
    if (face && c === "updated") { // draft-only link that shows flow 2: ticks saved on an older version
      store.set(`ticks:${b}`, { v: face.version - 1, done: 5 }); location.replace(`#/faces/${b}`); return "";
    }
    if (face) return S.face({ slug: b, done: ticks(face), tab: view.tab[b], angle: view.angle[b] || 0, playing: !!view.playing[b], updated: !!view.updated[b] });
    if (a === "builds" && !b) {
      const p = D.POSITIONS[view.buildFilter];
      const list = D.BUILDS.filter((x) => (p === "All" || x.pos === p) && (!view.buildArch || x.arch.id === view.buildArch));
      return S.builds({ on: view.buildFilter, list, sel: view.buildSel, arch: view.buildArch, asList: view.buildList });
    }
    if (a === "builds" && D.BUILDS.some((x) => x.slug === b)) return S.build({ slug: b });
    if (a === "archetypes" && !b) return S.archetypes();
    if (a === "archetypes" && D.ARCH.some((x) => x.id === b)) return S.archetype({ id: b, ps: view.ps[b] || 0 });
    if (a === "changelog") return S.changelog();
    if (a === "submit") return S.submit({ ...view.submit, values: view.submit.values[view.submit.kind] });
    if (a === "about") return S.about();
    if (a === "takedown") return S.takedown();
    return S.notFound();
  };

  // One highlight shape per tab row and chip row that springs from the old choice to the new one
  // (DESIGN.md). It remembers where it was by the row's label, so it moves across re-renders too.
  const hlPos = {};
  const placeHighlights = ({ animate = true } = {}) => {
    root.querySelectorAll(".tabs, .chips, .seg").forEach((row, i) => {
      row.querySelector(":scope > .hl")?.remove();
      const on = row.querySelector(".on");
      if (!on) return;
      const key = `${location.hash.split("/")[1]}:${row.getAttribute("aria-label") || row.firstElementChild?.dataset.testid || i}`;
      const hl = document.createElement("span");
      hl.className = "hl"; hl.setAttribute("aria-hidden", "true");
      row.classList.add("has-hl"); row.prepend(hl);
      const to = { x: on.offsetLeft, y: on.offsetTop, w: on.offsetWidth, h: on.offsetHeight };
      const from = (animate && hlPos[key]) || to;
      const set = (p) => { hl.style.transform = `translate(${p.x}px, ${p.y}px)`; hl.style.width = `${p.w}px`; hl.style.height = `${p.h}px`; };
      set(from);
      if (from !== to && !reduced()) { hl.getBoundingClientRect(); hl.classList.add("moving"); }
      set(to);
      hlPos[key] = to;
    });
  };

  // Page change: the new page slides 40 px in over --dur-page from the side it came from (DESIGN.md):
  // deeper pages and later sections come from the right, going up or to an earlier section from the left.
  // Same page: no motion.
  const SECTIONS = ["", "faces", "builds", "archetypes", "changelog", "submit", "about", "takedown"];
  const backwards = (from, to) => {
    const parts = (p) => p.replace(/^#\/?/, "").split("/").filter(Boolean);
    const [f, t] = [parts(from), parts(to)];
    if (f[0] === t[0]) return t.length < f.length;
    return SECTIONS.indexOf(t[0] || "") < SECTIONS.indexOf(f[0] || "");
  };
  const render = ({ keepScroll = false } = {}) => {
    const y = window.scrollY;
    const html = route();
    if (!html) return; // a redirect is on its way
    root.innerHTML = html;
    const page = location.hash.split("/").slice(0, 3).join("/");
    if (page !== last && !keepScroll) {
      root.querySelector(".main")?.classList.add("enter", ...(last && backwards(last, page) ? ["from-left"] : []));
      window.scrollTo(0, 0);
    }
    else window.scrollTo(0, y);
    last = page;
    placeHighlights();
  };
  // Chips and tabs change width when Barlow arrives and when the layout switches at 900 px: re-measure, no motion.
  document.fonts?.ready.then(() => placeHighlights({ animate: false }));
  let resizing = 0;
  window.addEventListener("resize", () => { cancelAnimationFrame(resizing); resizing = requestAnimationFrame(() => placeHighlights({ animate: false })); });

  window.addEventListener("hashchange", () => {
    if (!location.hash.startsWith("#/submit")) view.submit = freshSubmit();
    render();
  });

  // Ticking changes the rows in place, so the tick, the dimming and the progress bar animate.
  const tick = (slug, k) => {
    const f = D.FACES.find((x) => x.slug === slug);
    const was = ticks(f);
    const done = k <= was ? k - 1 : k;
    store.set(`ticks:${slug}`, { v: f.version, done });
    if (done >= D.STEP_COUNT || was >= D.STEP_COUNT) return render({ keepScroll: true });
    root.querySelectorAll(".step").forEach((row) => {
      const n = Number(row.dataset.testid.split("-").pop());
      row.className = `step ${n <= done ? "done" : n === done + 1 ? "current" : "later"}`;
      row.querySelector(".tick").setAttribute("aria-pressed", String(n <= done));
    });
    const pct = Math.round((done / D.STEP_COUNT) * 100);
    root.querySelector(".progress i").style.setProperty("--p", pct / 100);
    root.querySelector(".progress").setAttribute("aria-valuenow", pct);
    root.querySelector("[data-testid=face-progress-text]").textContent = `${done} of ${D.STEP_COUNT} steps done`;
    root.querySelector("[data-testid=face-start]").textContent = done ? D.COPY.continue(done + 1) : "Start";
    // Finishing a tab's last step moves on to the tab that holds the next step
    if (done > was && !root.querySelector(".step.current")) { delete view.tab[slug]; render({ keepScroll: true }); }
  };

  const num = (id) => Number(id.split("-").pop()) - 1;
  root.addEventListener("input", (e) => { const id = e.target.dataset.testid; if (/^f-/.test(id)) view.submit.values[view.submit.kind][id] = e.target.value; });
  root.addEventListener("change", (e) => {
    if (e.target.dataset.testid === "arch-filter") { view.buildArch = e.target.value; view.buildSel = null; render({ keepScroll: true }); }
  });

  root.addEventListener("click", (e) => {
    const el = e.target.closest("[data-testid]");
    if (!el) return;
    const id = el.dataset.testid;
    const slug = location.hash.split("/")[2];
    const again = () => render({ keepScroll: true });

    if (/^filter-chip-\d+$/.test(id)) {
      if (location.hash.startsWith("#/faces")) view.faceFilter = num(id); else { view.buildFilter = num(id); view.buildSel = null; }
      return again();
    }
    if (/^home-tab-\d+$/.test(id)) { view.homeTab = num(id); return again(); }
    if (/^home-pos-\d+$/.test(id)) { view.homePos = num(id); return again(); }
    if (id === "view-grid" || id === "view-list") { view.buildList = id === "view-list"; return again(); }
    // Wide screens: a build card previews in the side panel instead of opening (Valdûm bazaar)
    if (/^bc-link-\d+$/.test(id) && location.hash === "#/builds" && root.clientWidth >= 900) {
      e.preventDefault(); view.buildSel = el.closest(".build-card").dataset.slug; return again();
    }
    if (/^sig-\d+$/.test(id)) { view.ps[slug] = num(id); return again(); }
    if (/^submit-kind-\d+$/.test(id)) { view.submit = { ...view.submit, kind: num(id) ? "build" : "face", tab: 0, errors: false }; return again(); }
    if (/^form-tab-\d+$/.test(id)) { view.submit.tab = num(id); return again(); }
    if (/^angle-\d+$/.test(id)) { view.angle[slug] = num(id); return again(); }
    if (id === "stage-prev" || id === "stage-next") {
      const n = D.ANGLES.length;
      view.angle[slug] = ((view.angle[slug] || 0) + (id === "stage-next" ? 1 : n - 1)) % n;
      return again();
    }
    if (/^face-tab-\d+$/.test(id)) { view.tab[slug] = num(id); return again(); }
    if (/^step-tick-\d+$/.test(id)) return tick(slug, num(id) + 1);
    if (id === "face-start") {
      e.preventDefault();
      delete view.tab[slug]; // open the tab that holds the next step, then go to that step
      again();
      (root.querySelector(".step.current") || root.querySelector("[data-testid=step-list]"))?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
      return;
    }
    if (id === "embed-facade") { view.playing[slug] = true; return again(); }
    if (id === "submit-issue") {
      const first = (view.submit.values[view.submit.kind]["f-name"] || "").trim();
      view.submit = first ? { ...view.submit, errors: false, sent: true } : { ...view.submit, errors: true, sent: false, tab: 0 };
      return again();
    }
    if (id === "submit-copy") { el.lastChild.textContent = "Copied"; setTimeout(() => { el.lastChild.textContent = "Copy JSON"; }, 1600); }
  });

  render();
})();
