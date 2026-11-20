// Shared helpers, icons and sample data for the mockup. Classic script: exposes window.M.
// Names, labels and dates come from the repo: content/, docs/RESEARCH.md §9, EA's season dates.
// Step values are layout samples (labels seen in the editor, numbers from other faces): not a recipe.
(() => {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  // A text leaf with its test ID
  const t = (id, text, cls = "", tag = "span") => `<${tag} data-testid="${id}"${cls ? ` class="${cls}"` : ""}>${text}</${tag}>`;

  const ICONS = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
    arrow: '<path d="M8 16 16 8M10 8h6v6"/>',
    chevron: '<path d="m10 7 5 5-5 5"/>',
    back: '<path d="m14 7-5 5 5 5"/>',
    face: '<circle cx="12" cy="10" r="5.5"/><path d="M8.5 15.5c-.6 1.4-.9 3-.9 4.5M15.5 15.5c.6 1.4.9 3 .9 4.5"/>',
    build: '<path d="M5 19V9M10 19V5M15 19v-7M20 19v-4"/>',
    calendar: '<rect x="4" y="5.5" width="16" height="14" rx="2.5"/><path d="M4 10h16M9 3.5v4M15 3.5v4"/>',
    star: '<path d="m12 4 2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6Z"/>',
    link: '<path d="M10 14 14 10M8.5 11.5l-2 2a3 3 0 0 0 4 4l2-2M15.5 12.5l2-2a3 3 0 0 0-4-4l-2 2"/>',
    log: '<path d="M7 5h10M7 10h10M7 15h6"/><circle cx="17.5" cy="17.5" r="3"/>',
    spin: '<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>',
    check: '<path d="m6 12.5 4 4 8-9"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    play: '<path d="M8 5.5v13l10-6.5Z"/>',
    hand: '<path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.6-2.2L4.6 15a1.5 1.5 0 0 1 2.3-1.9L9 15"/>',
    share: '<path d="M12 15V4M8 7.5 12 3.5l4 4M6 11v8.5h12V11"/>',
  };
  const icon = (name, size = 18) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

  // Days until a date (local midnight), for the season countdown. Round, not ceil: a span over a
  // daylight-saving change is 23 or 25 hours short or long of whole days.
  const daysUntil = (iso) => Math.max(0, Math.round((new Date(iso + "T00:00:00") - new Date(new Date().toDateString())) / 864e5));

  const FACES = [
    { slug: "cristiano-ronaldo-2008", name: "Cristiano Ronaldo", era: "2008", kind: "Footballer", angle: 0 },
    { slug: "cristiano-ronaldo-2007", name: "Cristiano Ronaldo", era: "2007", kind: "Footballer", angle: 18 },
    { slug: "cristiano-ronaldo-2017", name: "Cristiano Ronaldo", era: "2017", kind: "Footballer", angle: -18 },
    { slug: "kanye-west", name: "Kanye West", era: null, kind: "Musician", angle: 10 },
  ];

  // content/archetypes/fc27.json (attackers shown on the home page)
  const BUILDS = [
    { name: "Spark", group: "Attacker" },
    { name: "Magician", group: "Attacker" },
    { name: "Finisher", group: "Attacker" },
    { name: "Target", group: "Attacker" },
  ];

  // content/changelog/*.json
  const CHANGES = [
    { title: "Title Update 1.2.0", kind: "Title update", date: "10 Nov" },
    { title: "Archetype costs re-priced, every build reset", kind: "Archetypes", date: "22 Oct" },
    { title: "FC 27 launches; Clubs moves into The Grounds", kind: "Season", date: "25 Sep" },
  ];

  // Quick version of a face: preset, four part tabs, Visual Age (RESEARCH §9). Sample values.
  // zoom: where the stage camera goes on that tab, as Instagram's editor zooms in on Face
  const TABS = [
    { id: "preset", name: "Preset", zoom: "bust", steps: [
      { label: "Photo preset", kind: "preset", value: 23, help: "Count photo presets only, left to right, top to bottom. Skip your saved heads." },
    ] },
    { id: "skin", name: "Skin", zoom: "bust", steps: [
      { label: "Skin Tone", kind: "position", percent: 62 },
      { label: "Complexion", kind: "item", value: 8 },
      { label: "Skin Surface", kind: "item", value: 33 },
      { label: "Freckles", kind: "named", value: "None" },
    ] },
    { id: "head", name: "Head", zoom: "head", steps: [
      { label: "Forehead", kind: "item", value: 111 },
      { label: "Jaw", kind: "item", value: 17 },
      { label: "Ears", kind: "item", value: 149 },
      { label: "Neck", kind: "item", value: 22 },
    ] },
    { id: "face", name: "Face", zoom: "face", steps: [
      { label: "Eye Colour", kind: "named", value: "Dark Brown" },
      { label: "Eyes", kind: "item", value: 54 },
      { label: "Brow Ridge", kind: "item", value: 41 },
      { label: "Nose", kind: "item", value: 116 },
      { label: "Mouth", kind: "item", value: 1007 },
      { label: "Teeth", kind: "item", value: 3 },
    ] },
    { id: "hair", name: "Hair", zoom: "head", steps: [
      { label: "Hair Colour", kind: "named", value: "Warm Black" },
      { label: "Hair Style", kind: "item", value: 82 },
      { label: "Eyebrow & Facial Hair Colour", kind: "named", value: "Warm Black" },
      { label: "Eyebrows", kind: "item", value: 232 },
      { label: "Facial Hair", kind: "named", value: "None" },
    ] },
    { id: "age", name: "Visual Age", zoom: "head", steps: [{ label: "Visual Age", kind: "pad", note: "Pushed to the top: Older, LIMIT REACHED" }] },
  ];
  const SCULPT = [
    { kind: "slider", label: "Skeletal · Chin", low: "Narrow", high: "Widen", value: 62 },
    { kind: "slider", label: "Skeletal · Chin", low: "Back", high: "Forward", value: 57 },
    { kind: "slider", label: "Skeletal · Jaw", low: "Round", high: "Angular", value: 70 },
  ];
  const TOTAL = TABS.reduce((n, tab) => n + tab.steps.length, 0);

  // Phone: menu button. Desktop: FUT.GG's one row of section links instead, search pushed right.
  const NAV = ["Faces", "Builds", "Archetypes", "Changelog", "Submit"];
  const topbar = ({ desktop = false } = {}) => `<header class="topbar${desktop ? " wide" : ""}">
    ${desktop ? "" : `<button class="icon-btn" data-testid="menu" aria-label="Menu">${icon("menu", 22)}</button>`}
    <a href="#home" class="wordmark" data-testid="wordmark">Pro Clubs <span>Hub</span></a>
    ${desktop ? `<nav class="nav" aria-label="Sections">${NAV.map((n) => `<a href="#${n.toLowerCase()}" data-testid="nav-${n.toLowerCase()}">${n}</a>`).join("")}</nav>` : ""}
    <label class="search"><span data-testid="search-icon">${icon("search")}</span>
      <input data-testid="search-input" type="search" placeholder="Search faces and builds" aria-label="Search faces and builds"></label>
  </header>`;

  const notice = () => `<footer class="notice">
    ${t("site-notice", "Not endorsed by or affiliated with EA or its licensors. Not endorsed by the people named.", "", "p")}
    <nav aria-label="Site">${["About", "Submit", "Takedown", "GitHub"].map((n, i) => `<a href="#${n.toLowerCase()}" data-testid="footer-link-${i + 1}">${n}</a>`).join("")}</nav>
  </footer>`;

  window.M = { esc, t, icon, daysUntil, FACES, BUILDS, CHANGES, TABS, SCULPT, TOTAL, topbar, notice };
})();
