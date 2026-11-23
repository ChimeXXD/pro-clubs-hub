// Builds · new style (D-33, D-39). Archetype facts are copied from content/archetypes/fc27.json
// (sourced there); every build number below is a layout sample, labelled as such on screen.
// Icons and stances load from reference/assets/ (git-ignored, never committed: EA art, Pro Clubs HQ tracings,
// and crops of Chime's own PS5 screenshots of their pro in each archetype's stance, 22 Nov).
window.BV2 = (() => {
  const ASSETS = "../../reference/assets/";
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const groups = [
    { id: "goalkeeper", name: "Keeper", ids: ["shot-stopper", "sweeper-keeper"] },
    { id: "defender", name: "Defender", ids: ["progressor", "boss", "marauder"] },
    { id: "midfielder", name: "Midfielder", ids: ["disruptor", "recycler", "maestro", "creator"] },
    { id: "attacker", name: "Forward", ids: ["spark", "magician", "finisher", "target"] },
  ];

  // From fc27.json: launch signature, Season 2 signature, mastery attributes (null = not recorded),
  // Season 2 cost change counts (apCostChange20261022).
  const archetypes = {
    // Shot Stopper's Season 2 signature is Footwork: EA swapped it from Deflector on 22 Oct (RESEARCH §10.4).
    // content/archetypes/fc27.json still says Deflector until Chime confirms in game.
    "shot-stopper": ["Shot Stopper", "Far Reach", "Footwork", ["GK Positioning", "GK Reflexes"], { up: 3, down: 1 }],
    "sweeper-keeper": ["Sweeper Keeper", "Footwork", "Cross Claimer", ["GK Handling", "GK Diving"], { up: 5, down: 1 }],
    progressor: ["Progressor", "Long Ball Pass", "Anticipate", ["Long Passing", "Standing Tackle"], { up: 4, down: 1 }],
    boss: ["Boss", "Bruiser", "Aerial Fortress", ["Aggression", "Strength"], { up: 3, down: 0 }],
    marauder: ["Marauder", "Quick Step", "Whipped Pass", ["Sliding Tackle", "Sprint Speed"], { up: 4, down: 2 }],
    disruptor: ["Disruptor", "Jockey", "Relentless", null, { up: 3, down: 2 }],
    recycler: ["Recycler", "Intercept", "Press Proven", null, { up: 5, down: 3 }],
    maestro: ["Maestro", "Pinged Pass", "Long Ball Pass", null, { up: 5, down: 4 }],
    creator: ["Creator", "Incisive Pass", "Inventive", null, { up: 5, down: 3 }],
    spark: ["Spark", "Trickster", "Rapid", null, { up: 5, down: 2 }],
    magician: ["Magician", "Technical", "Finesse Shot", null, { up: 5, down: 3 }],
    finisher: ["Finisher", "Low Driven Shot", "First Touch", ["Finishing", "Composure"], { up: 6, down: 4 }],
    target: ["Target", "Precision Header", "Enforcer", ["Balance", "Jumping"], { up: 5, down: 3 }],
  };
  const has = (id) => Object.hasOwn(archetypes, id);
  // Chime's 22 Nov screenshots have a stance for every archetype but Progressor (its screen showed the Maestro card).
  // Stances show on build cards and build pages only, never on the archetype picker (Chime, 23 Nov).
  const stances = new Set(["shot-stopper", "sweeper-keeper", "boss", "marauder", "disruptor", "recycler", "maestro", "creator", "spark", "magician", "finisher", "target"]);
  // EA's "Inspired by" line on the Archetypes screen; only the ones this draft shows. Names as plain text (D-10).
  const inspiration = { finisher: "Alex Morgan" };
  const archetype = (id) => {
    const [name, launch, season2, mastery, costs] = archetypes[id];
    return { id, name, launch, season2, mastery, costs, group: groups.find((g) => g.ids.includes(id)), stance: stances.has(id) ? id : null, inspiration: inspiration[id] ?? null };
  };

  const icon = {
    emblem: (id) => `${ASSETS}archetypes/${id}.svg`,
    ps: (name) => `${ASSETS}playstyles/${slug(name)}.png`,
    psPlus: (name) => `${ASSETS}playstyles-plus/${slug(name)}.png`,
    stance: (id) => `${ASSETS}stances/${id}.png`,
  };
  // Where the head sits across each stance crop (0 = left edge, 1 = right), measured on the crop, so the
  // head-and-shoulders portrait centres the face. Unmeasured crops centre the middle.
  const stanceFocus = { finisher: 0.61 };

  // Sample build (D-43). Attribute and PlayStyle names are real FC 27 names; starting values and the spend
  // order are layout samples. The level-55 values are where the spend order ends (see level.js).
  const build = {
    id: "meta-finisher",
    name: "Meta Finisher",
    positions: ["ST", "CF"],
    level: 55, height: "6'1\" · 185 cm", weight: "176 lb · 80 kg", accelerate: "Controlled Explosive",
    stance: "finisher",
    // SAMPLE starting values (the real ones per archetype are unknown, RESEARCH §10.3).
    start: {
      Acceleration: 70, "Sprint Speed": 70, "Att. Position": 70, Finishing: 70, "Shot Power": 70, "Long Shots": 70, Volleys: 70, Penalties: 70,
      Vision: 55, Crossing: 55, "FK Accuracy": 55, "Short Passing": 55, "Long Passing": 55, Curve: 55,
      Agility: 65, Balance: 65, Reactions: 65, "Ball Control": 65, Dribbling: 65, Composure: 65,
      Interceptions: 30, "Heading Accuracy": 30, "Def. Awareness": 30, "Standing Tackle": 30, "Sliding Tackle": 30,
      Jumping: 60, Stamina: 60, Strength: 60, Aggression: 60,
    },
    startStars: { skillMoves: 3, weakFoot: 3 },
    // The order the build was made in: [attribute or star, value to reach].
    steps: [
      ["Finishing", 85], ["Acceleration", 85], ["Sprint Speed", 85], ["Composure", 85], ["weakFoot", 4], ["Att. Position", 85],
      ["Reactions", 85], ["Ball Control", 85], ["Shot Power", 80], ["Finishing", 90], ["Composure", 90], ["Reactions", 90],
      ["Ball Control", 90], ["Agility", 80], ["Dribbling", 80], ["Strength", 75], ["Heading Accuracy", 70], ["skillMoves", 4],
      ["Finishing", 94], ["Composure", 92], ["Reactions", 92], ["Ball Control", 92], ["Att. Position", 90], ["Acceleration", 87],
      ["Sprint Speed", 89], ["Shot Power", 86], ["Dribbling", 82], ["Short Passing", 65], ["Vision", 60], ["Stamina", 70],
    ],
    groups: [
      ["Pace", "PAC", ["Acceleration", "Sprint Speed"]],
      ["Shooting", "SHO", ["Att. Position", "Finishing", "Shot Power", "Long Shots", "Volleys", "Penalties"]],
      ["Passing", "PAS", ["Vision", "Crossing", "FK Accuracy", "Short Passing", "Long Passing", "Curve"]],
      ["Dribbling", "DRI", ["Agility", "Balance", "Reactions", "Ball Control", "Dribbling", "Composure"]],
      ["Defending", "DEF", ["Interceptions", "Heading Accuracy", "Def. Awareness", "Standing Tackle", "Sliding Tackle"]],
      ["Physical", "PHY", ["Jumping", "Stamina", "Strength", "Aggression"]],
    ],
    // Finisher+ gives Chip Shot+; its targets are Ball Control, Composure and Reactions, one at 92 and two at 90
    // (RESEARCH §10.4: names seen in footage, values not said for Finisher+).
    spec: { name: "Finisher+", playStyle: "Chip Shot", targets: ["Ball Control", "Composure", "Reactions"] },
    psPlus: ["Low Driven Shot", "First Touch"],
    ps: ["Finesse Shot", "Power Shot", "Rapid", "Quick Step", "Precision Header", "Acrobatic"],
  };

  const builds = [
    { ...build, badges: ["meta"] },
    { id: "target-style-finisher", name: "Tall Finisher", positions: ["ST"], level: 55, height: "6'4\" · 193 cm", stance: "finisher",
      stats: { PAC: 80, SHO: 90, PAS: 66, DRI: 78, DEF: 42, PHY: 88 }, psPlus: ["Low Driven Shot", "Power Shot"], badges: ["copied"] },
    { id: "quick-finisher", name: "Quick Finisher", positions: ["ST", "CF"], level: 55, height: "5'8\" · 173 cm", stance: "finisher",
      stats: { PAC: 94, SHO: 88, PAS: 74, DRI: 89, DEF: 34, PHY: 66 }, psPlus: ["First Touch", "Rapid"], badges: [] },
    // Named after a player: no face until Chime's in-game recreation exists; the card shows the emblem (D-42, D-10).
    { id: "2008-ronaldo-inspired", name: "2008 Ronaldo-inspired", inspiredBy: "2008 Ronaldo", positions: ["ST", "LW"], level: 55,
      height: "6'1\" · 185 cm", stance: null,
      stats: { PAC: 92, SHO: 88, PAS: 70, DRI: 90, DEF: 36, PHY: 74 }, psPlus: ["Trickster", "Power Shot"], badges: [] },
  ];

  const notice = "Not endorsed by or affiliated with EA or its licensors. Not endorsed by the people named.";
  return { groups, has, archetype, icon, stanceFocus: (id) => stanceFocus[id] ?? 0.5, build, builds, notice, slug };
})();
