// Renders every screen and state as a fixed-width frame, for the design check and for review.
// window.FRAME_MODE: "phone" (393 wide), "desktop" (1440 wide) or "compare" (three screens in
// all five colours, side by side).
(() => {
  const DONE_SOME = 8;
  const PHONE = [
    ["home", () => S.home()],
    ["faces", () => S.faces()],
    ["faces--empty", () => S.faces({ on: 2, list: [], empty: true })],
    ["face", () => S.face()],
    ["face--progress", () => S.face({ done: DONE_SOME })],
    ["face--done", () => S.face({ done: D.STEP_COUNT, tab: D.TABS.length - 1 })],
    ["face--updated", () => S.face({ slug: "cristiano-ronaldo-2007", updated: true })],
    ["builds", () => S.builds()],
    ["builds--list", () => S.builds({ asList: true })],
    ["build", () => S.build()],
    ["build--old-season", () => S.build({ old: true })],
    ["build--unverified", () => S.build({ unverified: true })],
    ["archetypes", () => S.archetypes()],
    ["archetype", () => S.archetype()],
    ["changelog", () => S.changelog()],
    ["submit", () => S.submit()],
    ["submit--errors", () => S.submit({ errors: true })],
    ["submit--build", () => S.submit({ kind: "build", tab: 1 })],
    ["submit--sent", () => S.submit({ sent: true })],
    ["about", () => S.about()],
    ["takedown", () => S.takedown()],
    ["not-found", () => S.notFound()],
  ];
  const DESKTOP = ["home", "faces", "face--progress", "builds", "builds--list", "build", "archetypes", "archetype", "changelog", "submit", "about"]
    .map((id) => PHONE.find((p) => p[0] === id));

  const mode = window.FRAME_MODE || "phone";
  // ?theme=pitch renders every frame in that colour, ?mode=light in light mode (used for the Figma pages)
  const qs = new URLSearchParams(location.search);
  const theme = qs.get("theme");
  if (theme && D.THEMES.some((x) => x.id === theme)) document.documentElement.dataset.theme = theme;
  const light = qs.get("mode") === "light";
  if (light) document.documentElement.dataset.mode = "light";
  // Name the colour and mode in the heading; compare shows all five colours, so it names only the mode
  const th = mode === "compare" ? null : D.THEMES.find((x) => x.id === document.documentElement.dataset.theme);
  const h1 = document.querySelector(".sheet-page > h1");
  const tag = [th && (theme || light) ? th.name : "", light ? "Light" : ""].filter(Boolean).join(" · ");
  if (tag && h1) h1.textContent = h1.textContent.replace("first draft", `· ${tag}`);
  const wrap = document.getElementById("frames");
  const frame = (id, html, w, label, theme) => `<figure class="frame-wrap"${theme ? ` data-theme="${theme}"` : ""}>
    <figcaption>${label}</figcaption>
    <div class="app frame" data-screen="${id}" style="width:${w}px">${html}</div></figure>`;

  if (mode === "compare") {
    const picks = ["home", "face--progress", "build"].map((id) => PHONE.find((p) => p[0] === id));
    wrap.innerHTML = picks.map(([id, fn]) => `<section class="compare-row"><h2>${id.replace("--", " · ")}</h2><div class="row">${
      D.THEMES.map((th) => frame(`${id}-${th.id}`, fn(), 393, `${th.name} · from ${th.from}`, th.id)).join("")}</div></section>`).join("");
  } else {
    const list = mode === "desktop" ? DESKTOP : PHONE.filter(([id]) => id !== "builds--list");
    const w = mode === "desktop" ? 1440 : 393;
    wrap.innerHTML = list.map(([id, fn]) => frame(id, fn(), w, id)).join("");
  }
})();
