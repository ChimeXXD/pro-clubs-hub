// Data for the first draft (D-31). Classic script: exposes window.D.
// Real, from the repo: archetype names, groups, signature PlayStyles, mastery attributes and cost
// changes (content/archetypes/fc27.json); changelog entries (content/changelog/*.json); editor
// tab and control labels (docs/RESEARCH.md §9); season dates (docs/PLAN.md); copy (docs/design/UI-BRIEF.md §5).
// Samples, for layout only: every recipe value, build stat, verified date and credit on a face or build.
(() => {
  const THEMES = [
    { id: "volt", name: "Volt", from: "Ravex", swatch: "#c7fe2d" },
    { id: "pitch", name: "Pitch", from: "NextPlay Sports", swatch: "#02c55d" },
    { id: "gold", name: "Old Gold", from: "Valdûm", swatch: "#c39327" },
    { id: "floodlight", name: "Floodlight", from: "World Cup 2026", swatch: "#418eea" },
    { id: "derby", name: "Derby", from: "Olive", swatch: "#ea2360" },
  ];

  const SEASON = { label: "FC 27 · Season 2", next: "Season 3", nextDate: "2026-12-03", nextDay: "Thu 3 Dec" };

  const TAG_OK = "FC 27 · Season 2 · verified 19 Nov 2026";
  const TAG_NEW = "FC 27 · Season 2 · not yet checked in game";

  // Samples: names from the repo; eras, makers, times and versions are layout samples.
  const FACES = [
    { slug: "cristiano-ronaldo-2008", name: "Cristiano Ronaldo", era: "2008", kind: "Footballer", tag: TAG_OK, by: "Chime", build: "spark-rw", mins: 25, version: 1 },
    { slug: "cristiano-ronaldo-2007", name: "Cristiano Ronaldo", era: "2007", kind: "Footballer", tag: TAG_OK, by: "Chime", build: "spark-rw", mins: 25, version: 2 },
    { slug: "cristiano-ronaldo-2017", name: "Cristiano Ronaldo", era: "2017", kind: "Footballer", tag: TAG_NEW, by: "Sharon", build: "finisher-st", mins: 30, version: 1 },
    { slug: "michael-jackson", name: "Michael Jackson", era: "1987", kind: "Musician", tag: TAG_OK, by: "Chime", build: "magician-cam", mins: 30, version: 1 },
    { slug: "kanye-west", name: "Kanye West", era: "2010", kind: "Musician", tag: TAG_NEW, by: "Sharon", build: "target-st", mins: 20, version: 1 },
  ];

  // Filters on Faces: kinds, then every era that has a face
  const FACE_FILTERS = [
    { name: "All", test: () => true },
    { name: "Footballers", test: (f) => f.kind === "Footballer" },
    { name: "Musicians", test: (f) => f.kind === "Musician" },
    ...[...new Set(FACES.map((f) => f.era))].sort().map((era) => ({ name: era, test: (f) => f.era === era })),
  ];

  const ANGLES = ["Front", "¾ left", "Left", "¾ right", "Right"];

  // The editor's structure (RESEARCH §9): preset, four part tabs (numbered items or names),
  // Sculpt as its own section (mode › layer › region, sliders 0–100 with the game's end labels,
  // an optional deeper pass), then Visual Age (a pad with no number). Every number here is a neutral
  // layout sample, deliberately not any creator's values (D-08).
  const TABS = [
    { id: "preset", name: "Preset", steps: [
      { label: "Photo preset", kind: "Item", value: "12", help: "Count photo presets left to right, top to bottom. Skip your saved heads." } ] },
    { id: "skin", name: "Skin", steps: [
      { label: "Skin Tone", kind: "Position on the track", value: "40%", slider: { at: 40 } },
      { label: "Complexion", kind: "Item", value: "3" },
      { label: "Skin Surface", kind: "Item", value: "12" },
      { label: "Freckles", kind: "Named", value: "None" } ] },
    { id: "head", name: "Head", steps: [
      { label: "Forehead", kind: "Item", value: "20" },
      { label: "Jaw", kind: "Item", value: "41" },
      { label: "Ears", kind: "Item", value: "9" },
      { label: "Neck", kind: "Item", value: "5" } ] },
    { id: "face", name: "Face", steps: [
      { label: "Eyes", kind: "Item", value: "7" },
      { label: "Brow Ridge", kind: "Item", value: "26" },
      { label: "Nose", kind: "Item", value: "30" },
      { label: "Mouth", kind: "Item", value: "14" },
      { label: "Teeth", kind: "Item", value: "2" } ] },
    { id: "hair", name: "Hair", steps: [
      { label: "Hair Style", kind: "Item", value: "25" },
      { label: "Eyebrows", kind: "Item", value: "18" },
      { label: "Facial Hair", kind: "Named", value: "None" } ] },
    { id: "sculpt", name: "Sculpt", steps: [
      { label: "Chin", kind: "Sculpt · Shape › Skeletal › Chin", value: "58", slider: { at: 58, low: "Narrow", high: "Widen" } },
      { label: "Chin", kind: "Sculpt · Shape › Skeletal › Chin", value: "46", slider: { at: 46, low: "Back", high: "Forward" } },
      { label: "Jaw", kind: "Sculpt · Shape › Skeletal › Jaw", value: "64", slider: { at: 64, low: "Round", high: "Angular" } } ] },
    { id: "age", name: "Visual Age", steps: [
      { label: "Visual Age", kind: "Position on the pad", value: "Older · top", slider: { at: 100, low: "Younger", high: "Older" }, help: "Push up to the top until the game says LIMIT REACHED." } ] },
  ];
  const STEP_COUNT = TABS.reduce((n, t) => n + t.steps.length, 0);

  // content/archetypes/fc27.json
  const GROUPS = [
    { id: "goalkeeper", name: "Goalkeepers", short: "GK", zone: 4 },
    { id: "defender", name: "Defenders", short: "DEF", zone: 3 },
    { id: "midfielder", name: "Midfielders", short: "MID", zone: 2 },
    { id: "attacker", name: "Attackers", short: "ATT", zone: 1 },
  ];
  const ARCH = [
    ["shot-stopper", "Shot Stopper", "goalkeeper", "Far Reach", "Deflector", "GK Positioning, GK Reflexes", 3, 1],
    ["sweeper-keeper", "Sweeper Keeper", "goalkeeper", "Footwork", "Cross Claimer", "GK Handling, GK Diving", 5, 1],
    ["progressor", "Progressor", "defender", "Long Ball Pass", "Anticipate", "Long Passing, Standing Tackle", 4, 1],
    ["boss", "Boss", "defender", "Bruiser", "Aerial Fortress", "Aggression, Strength", 3, 0],
    ["marauder", "Marauder", "defender", "Quick Step", "Whipped Pass", "Sliding Tackle, Sprint Speed", 4, 2],
    ["disruptor", "Disruptor", "midfielder", "Jockey", "Relentless", null, 3, 2],
    ["recycler", "Recycler", "midfielder", "Intercept", "Press Proven", null, 5, 3],
    ["maestro", "Maestro", "midfielder", "Pinged Pass", "Long Ball Pass", null, 5, 4],
    ["creator", "Creator", "midfielder", "Incisive Pass", "Inventive", null, 5, 3],
    ["spark", "Spark", "attacker", "Trickster", "Rapid", null, 5, 2],
    ["magician", "Magician", "attacker", "Technical", "Finesse Shot", null, 5, 3],
    ["finisher", "Finisher", "attacker", "Low Driven Shot", "First Touch", "Finishing, Composure", 6, 4],
    ["target", "Target", "attacker", "Precision Header", "Enforcer", "Balance, Jumping", 5, 3],
  ].map(([id, name, group, launch, s2, mastery, up, down]) => ({ id, name, group, launch, s2, mastery, up, down,
    masterySrc: ["finisher", "target"].includes(id) ? "ea-grounds-deep-dive" : mastery ? "dexerto-levels" : null }));

  // One build per archetype. Position, body and attributes are samples.
  const POS = { "shot-stopper": "GK", "sweeper-keeper": "GK", progressor: "CB", boss: "CB", marauder: "LB", disruptor: "CDM", recycler: "CDM", maestro: "CM", creator: "CAM", spark: "RW", magician: "CAM", finisher: "ST", target: "ST" };
  const SAMPLE_ATTRS = {
    GK: ["GK Diving", "GK Handling", "GK Kicking", "GK Positioning", "GK Reflexes", "Jumping"],
    DEF: ["Standing Tackle", "Sliding Tackle", "Interceptions", "Heading Accuracy", "Strength", "Sprint Speed"],
    MID: ["Short Passing", "Long Passing", "Vision", "Ball Control", "Stamina", "Interceptions"],
    ATT: ["Acceleration", "Sprint Speed", "Agility", "Dribbling", "Ball Control", "Finishing"],
  };
  const NUMS = [92, 88, 85, 84, 81, 78];
  // Samples. PlayStyle names are real FC 27 PlayStyles; which ones a build takes is not known yet.
  const BODY = {
    "shot-stopper": ["193 cm", "86 kg", "Lengthy"], "sweeper-keeper": ["188 cm", "80 kg", "Controlled"],
    progressor: ["186 cm", "79 kg", "Controlled"], boss: ["192 cm", "88 kg", "Lengthy"], marauder: ["178 cm", "70 kg", "Explosive"],
    disruptor: ["183 cm", "78 kg", "Controlled"], recycler: ["180 cm", "74 kg", "Controlled"], maestro: ["176 cm", "69 kg", "Controlled"],
    creator: ["174 cm", "66 kg", "Explosive"], spark: ["170 cm", "63 kg", "Explosive"], magician: ["173 cm", "65 kg", "Explosive"],
    finisher: ["181 cm", "75 kg", "Controlled"], target: ["191 cm", "85 kg", "Lengthy"],
  };
  const PS_POOL = {
    GK: ["Rush Out", "Quick Reflexes", "Far Throw", "Footwork"],
    DEF: ["Anticipate", "Block", "Intercept", "Aerial Fortress", "Bruiser"],
    MID: ["Tiki Taka", "Intercept", "Press Proven", "Long Ball Pass", "Incisive Pass"],
    ATT: ["Quick Step", "First Touch", "Finesse Shot", "Power Shot", "Technical"],
  };
  const BUILDS = ARCH.map((a, i) => {
    const pos = POS[a.id], short = GROUPS.find((g) => g.id === a.group).short;
    const [height, weight, accelerate] = BODY[a.id];
    const pool = PS_POOL[short].filter((p) => p !== a.launch && p !== a.s2);
    return {
      slug: `${a.id}-${pos.toLowerCase()}`, arch: a, pos, positions: pos === "RW" ? "RW · LW" : pos === "LB" ? "LB · LWB" : pos,
      height, weight, accelerate, skill: short === "ATT" ? "5★" : "3★", weak: short === "GK" ? "2★" : "4★",
      special: null, season: a.id === "sweeper-keeper" ? 1 : 2,
      tag: a.id === "sweeper-keeper" ? "FC 27 · Season 1 · verified 20 Oct 2026" : i % 4 === 3 ? TAG_NEW : TAG_OK, by: i % 3 === 2 ? "Sharon" : "Chime",
      attrs: SAMPLE_ATTRS[short].map((n, j) => ({ name: n, value: NUMS[(j + i) % NUMS.length] })),
      plus: [pool[0]], regular: [pool[1], pool[2]],
    };
  });

  const POSITIONS = ["All", "GK", "CB", "LB", "CDM", "CM", "CAM", "RW", "ST"];

  // content/changelog/*.json, newest first
  const CHANGES = [
    { id: "2026-11-10-title-update-1-2-0", day: "10", mon: "Nov", kind: "Title update", season: "Season 2", title: "Title Update 1.2.0",
      changes: ["Clubs Friendlies now give the same end-of-match AXP as League matches.", "Amp attribute boosts were wrong and are fixed.", "Very high defensive lines drop off sooner (live tuning).", "Fullbacks no longer drop too deep; kick-off defending changed."],
      source: "EA, FC 27 Title Update 1.2.0", url: "https://www.ea.com/en/games/ea-sports-fc/fc-27/news/fc27-title-update-v1-2-0", affects: "No faces or builds affected yet.", note: null },
    { id: "2026-10-22-archetype-update", day: "22", mon: "Oct", kind: "Archetypes", season: "Season 2", title: "Archetype costs re-priced, every build reset",
      changes: ["58 attribute costs went up and 29 went down across all 13 archetypes.", "Attacking Positioning is no longer a specialization requirement.", "Every Pro's attribute points were reset; levels and totals were kept.", "Players with a Pro got 5,000 Club Coins and a 1.75x AXP boost for 6 matches."],
      source: "EA, The Grounds developer archetypes update", url: "https://ea.com/games/ea-sports-fc/fc-27/news/fc-27-the-grounds-developer-archetypes-update", affects: "No faces or builds affected yet.", note: "Pro Clubs HQ reports the level cap rose from 40 to 55 the same day; EA's page doesn't say." },
    { id: "2026-09-25-launch", day: "25", mon: "Sep", kind: "Season", season: "Season 1", title: "FC 27 launches; Clubs moves into The Grounds",
      changes: ["Clubs is reached through the Clubhouse inside The Grounds.", "13 archetypes, all unlocked from the start; Disruptor is new and Engine is gone.", "Resets are free and single attributes can be changed.", "Masteries and Amps are new."],
      source: "EA, Pitch Notes: The Grounds deep dive", url: "https://www.ea.com/en/games/ea-sports-fc/fc-27/news/pitch-notes-fc27-the-grounds-deep-dive", affects: "No faces or builds affected yet.", note: "Engine's removal is from Pro Clubs HQ and Skycoach, not EA's page. Launch date is from the project brief, not an opened page." },
  ];

  const COPY = {
    notice: "Not endorsed by or affiliated with EA or its licensors. Not endorsed by the people named.",
    sample: "Draft: every value, stat, date, credit and note on a face or build is a layout sample, not a recipe.",
    oldSeason: (s) => `Made for Season ${s}. Values may have changed since.`,
    limits: "The game can't do this exactly: the closest Hair Style is a little shorter.",
    continue: (n) => `Continue from step ${n}`,
    reset: "This face was updated. Your ticks start fresh.",
    embed: "Sample tutorial title · Creator's channel · Tap to play",
    submitted: "Opened on GitHub. Chime reviews every submission before it goes live.",
    emptyFaces: "No faces here yet. Suggest one on Submit.",
  };

  // content/creators.json and content/archetypes/fc27.json sources
  const CREATORS = [
    { name: "F.P. Virtual Pro Lookalike", url: "https://www.youtube.com/c/FPFifa20VirtualProLookalike" },
    { name: "R-Dot-10", url: "https://www.youtube.com/@R-Dot-10" },
    { name: "JaxStash", url: "https://www.youtube.com/@JaxStash" },
  ];
  const SOURCES = {
    "dexerto-archetypes": { title: "Dexerto, all archetypes explained (FC 27)", url: "https://www.dexerto.com/wikis/ea-fc-27/all-archetypes-explained/" },
    "ea-grounds-deep-dive": { title: "EA, Pitch Notes: The Grounds deep dive", url: "https://www.ea.com/en/games/ea-sports-fc/fc-27/news/pitch-notes-fc27-the-grounds-deep-dive" },
    "dexerto-levels": { title: "Dexerto, how to level up archetypes (FC 27)", url: "https://www.dexerto.com/wikis/ea-fc-27/how-to-level-up-archetypes/" },
    "pchq-archetype-changes": { title: "Pro Clubs HQ, FC 27 archetype changes", url: "https://proclubshq.com/blog/fc27-archetype-changes/" },
    "ea-archetypes-update": { title: "EA, The Grounds developer archetypes update", url: "https://ea.com/games/ea-sports-fc/fc-27/news/fc-27-the-grounds-developer-archetypes-update" },
  };
  const REPO_ISSUES = "https://github.com/ChimeXXD/pro-clubs-hub/issues/new";

  window.D = { CREATORS, SOURCES, REPO_ISSUES, THEMES, SEASON, FACES, FACE_FILTERS, ANGLES, TABS, STEP_COUNT, GROUPS, ARCH, BUILDS, POSITIONS, CHANGES, COPY, TAG_OK, TAG_NEW };
})();
