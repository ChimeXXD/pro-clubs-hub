// Level switch maths (D-43, RESEARCH §10). AP per level is real (§10.1, sources agree). Prices and starting
// values are made-up samples (§10.2–10.3 unknown) and labelled as such on the page.
window.BV2Level = (() => {
  // §10.1: 100 AP at level 1, then a grant per level; every fifth level is a milestone.
  const MILESTONE = { 5: 19, 10: 38, 15: 25, 20: 44, 25: 38, 30: 63, 35: 38, 40: 50, 45: 44, 50: 63, 55: 50 };
  const grant = (l) => (l === 1 ? 100 : MILESTONE[l] ?? (l < 5 ? 9 : l < 10 ? 10 : l < 20 ? 13 : l < 25 ? 19 : 25));
  const AP = [0];
  for (let l = 1; l <= 55; l++) AP[l] = AP[l - 1] + grant(l);
  const MIN = 1, MAX = 55;
  // Out-of-range input clamps to 1–55; only a non-number (an empty box) falls back to 55.
  const clamp = (l) => { const n = Math.round(Number(l)); return Number.isFinite(n) && String(l).trim() !== "" ? Math.min(MAX, Math.max(MIN, n)) : MAX; };
  const pct = (l) => ((l - MIN) / (MAX - MIN)) * 100;

  // SAMPLE price curve, the same for every attribute: AP for raising a value to `to`. Not the game's prices.
  const price = (to) => (to <= 70 ? 2 : to <= 80 ? 4 : to <= 85 ? 6 : to <= 90 ? 9 : to <= 95 ? 13 : 18);
  const STAR_PRICE = 60; // SAMPLE: one star of Skill moves or Weak foot
  const STARS = { skillMoves: "Skill moves", weakFoot: "Weak foot" };
  const stepPrice = (key, to) => (key in STARS ? STAR_PRICE : price(to));
  const costTo = (key, from, to) => { let c = 0; for (let v = from + 1; v <= to; v++) c += stepPrice(key, v); return c; };

  // Walk the build's spend order, point by point, until the next point costs more than what's left.
  function walk(b, level) {
    const ap = AP[level], v = { ...b.start, ...b.startStars };
    let left = ap, stop = null;
    for (let i = 0; i < b.steps.length && stop === null; i++) {
      const [key, to] = b.steps[i];
      while (v[key] < to) {
        const p = stepPrice(key, v[key] + 1);
        if (p > left) { stop = i; break; }
        left -= p; v[key]++;
      }
    }
    return { ap, spent: ap - left, left, values: v, stop };
  }

  // The level-55 targets are where the full spend order ends.
  // A step naming an attribute the build doesn't start with would be skipped silently by walk(), so fail loudly.
  const targets = (b) => b.steps.reduce((t, [k, to]) => {
    if (!(k in t)) throw new Error(`Unknown attribute in build steps: ${k}`);
    t[k] = Math.max(t[k], to); return t;
  }, { ...b.start, ...b.startStars });

  // Next steps the AP can't buy yet, each with the AP it still needs (the first one net of what's left).
  function pending(b, r, max = 3) {
    if (r.stop === null) return [];
    const v = { ...r.values }, out = [];
    for (let i = r.stop; i < b.steps.length && out.length < max; i++) {
      const [key, to] = b.steps[i];
      if (v[key] >= to) continue;
      const need = costTo(key, v[key], to) - (out.length ? 0 : r.left);
      out.push({ key, label: STARS[key] ?? key, from: v[key], to, need, star: key in STARS });
      v[key] = to;
    }
    return out;
  }

  // Specialization: raw values only (§10.4). Which target is 92 isn't recorded, so the sample counts all at 92.
  const SPEC_BAR = 92;
  const specShort = (s, values) => s.targets.filter((t) => values[t] < SPEC_BAR).map((t) => ({ name: t, value: values[t] }));
  function specFrom(b) {
    for (let l = MIN; l <= MAX; l++) if (!specShort(b.spec, walk(b, l).values).length) return l;
    return null;
  }

  // Targets and specFrom don't depend on the level: work them out once per build, not on every slider tick.
  const perBuild = new WeakMap();
  const fixed = (b) => {
    if (!perBuild.has(b)) perBuild.set(b, { target: targets(b), specFrom: specFrom(b) });
    return perBuild.get(b);
  };

  function compute(b, level) {
    const lv = clamp(level), r = walk(b, lv);
    return { level: lv, ...r, ...fixed(b), pending: pending(b, r), short: specShort(b.spec, r.values) };
  }

  // ---- Views: shared by the first render (screens.js) and every update below, so they can't drift apart.
  const fmt = (n) => n.toLocaleString("en-GB");
  const and = (xs) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);
  const avg = (keys, v) => Math.round(keys.reduce((s, k) => s + v[k], 0) / keys.length);
  const summary = (b, v) => Object.fromEntries(b.groups.map(([, code, keys]) => [code, avg(keys, v)]));
  const stars = (n, of) => "★".repeat(n) + "☆".repeat(Math.max(0, of - n));
  // Summary stats are the group averages: our simplification, not the game's formula.
  const gauge = (v) => {
    const a = Math.PI * (1 - v / 99), x = (20 + 15 * Math.cos(a)).toFixed(2), y = (21 - 15 * Math.sin(a)).toFixed(2);
    return `<svg class="gauge" viewBox="0 0 40 24" aria-hidden="true"><path class="g-bg" d="M5 21a15 15 0 0 1 30 0"/><path class="g-on" d="M5 21A15 15 0 0 1 ${x} ${y}"/></svg>`;
  };
  const apLine = (r) => `AP at level ${r.level}: <b>${fmt(r.ap)}</b> · spent <b>${fmt(r.spent)}</b> · left <b>${fmt(r.left)}</b>`;
  const affordHead = (r) => (r.pending.length ? `Not affordable yet at level ${r.level}` : `All of it at level ${r.level}`);
  const affordBody = (r) => (r.pending.length
    ? `<ul class="afford-list">${r.pending.map((p) => `<li><span>${p.label} ${p.star ? `${p.from}★ → ${p.to}★` : `${p.from} → ${p.to}`}</span><b>${fmt(p.need)} AP more</b></li>`).join("")}</ul>`
    : `<p class="afford-ok">Every step of the build fits, with ${fmt(r.left)} AP to spare.</p>`);
  const specStatus = (r) => (r.short.length
    ? `Not reached at level ${r.level}: ${and(r.short.map((s) => `${s.name} ${s.value}`))} of ${SPEC_BAR}`
    : `Reached at level ${r.level}`);
  const specRows = (b, r) => b.spec.targets.map((t) => `<li class="${r.values[t] >= SPEC_BAR ? "ok" : ""}"><span>${t}</span><b>${r.values[t]}<span class="tgt"> / ${SPEC_BAR}</span></b></li>`).join("");

  // ---- Live updates. The slider tracks the finger 1:1: no transitions while dragging (gestures skill). Only a
  // stepper press turns on a short bar ease (≤150 ms, CSS, off under reduced motion).
  const written = new WeakMap(); // element → the HTML apply() last wrote into it
  function apply(root, b, level, eased = false) {
    // Write only what changed, so the aria-live regions aren't re-announced on every slider tick.
    const r = compute(b, level), set = (sel, html) => root.querySelectorAll(sel).forEach((el) => {
      if (written.get(el) !== html) { written.set(el, html); el.innerHTML = html; }
    });
    root.classList.toggle("lv-eased", eased);
    root.querySelectorAll("[data-attr]").forEach((row) => {
      const k = row.dataset.attr, v = r.values[k], t = r.target[k];
      row.querySelector("[data-v]").textContent = v;
      row.querySelector("[data-t]").textContent = v < t ? ` / ${t}` : "";
      row.querySelector("s").style.width = `${v}%`;
      row.classList.toggle("short", v < t);
    });
    b.groups.forEach(([, code, keys]) => {
      const g = avg(keys, r.values);
      set(`[data-gavg="${code}"]`, `${gauge(g)}<b>${g}</b>`);
      set(`[data-sum="${code}"]`, String(g));
    });
    Object.keys(STARS).forEach((k) => set(`[data-star="${k}"]`, stars(r.values[k], r.target[k])));
    set("[data-lv-ap]", apLine(r)); set("[data-afford-h]", affordHead(r)); set("[data-afford]", affordBody(r));
    set("[data-spec-status]", specStatus(r)); set("[data-spec-rows]", specRows(b, r));
    root.querySelectorAll("[data-lv-num], [data-lv-range]").forEach((el) => { if (Number(el.value) !== r.level) el.value = r.level; });
    // The drawn slider follows the value 1:1: width and left written straight onto the two elements.
    root.querySelectorAll("[data-lv-fill]").forEach((el) => { el.style.width = `${pct(r.level)}%`; });
    root.querySelectorAll("[data-lv-thumb]").forEach((el) => { el.style.left = `${pct(r.level)}%`; });
    return r;
  }

  function bind(root, b) {
    const bar = root.querySelector("[data-level-bar]");
    if (!bar) return;
    let level = clamp(bar.querySelector("[data-lv-num]").value);
    const go = (l, eased) => { level = clamp(l); apply(root, b, level, eased); };
    bar.querySelector("[data-lv-range]").addEventListener("input", (e) => go(e.target.value, false));
    const num = bar.querySelector("[data-lv-num]");
    num.addEventListener("change", () => go(num.value, false));
    num.addEventListener("keydown", (e) => { if (e.key === "Enter") go(num.value, false); });
    bar.querySelectorAll("[data-lv-step]").forEach((btn) => btn.addEventListener("click", () => go(level + Number(btn.dataset.lvStep), true)));
  }

  return { AP, MIN, MAX, STARS, SPEC_BAR, clamp, pct, compute, summary, stars, gauge, fmt, apLine, affordHead, affordBody, specStatus, specRows, apply, bind };
})();
