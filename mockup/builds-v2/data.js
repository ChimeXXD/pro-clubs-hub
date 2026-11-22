// Builds · new style (D-33, D-39). Archetype facts are copied from content/archetypes/fc27.json
// (sourced there); every build number below is a layout sample, labelled as such on screen.
// Icons load from reference/assets/ (git-ignored, never committed: EA art and Pro Clubs HQ tracings).
window.BV2 = (() => {
  const ASSETS = "../../reference/assets/";
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const groups = [
    { id: "goalkeeper", name: "Keeper", ids: ["shot-stopper", "sweeper-keeper"] },
    { id: "defender", name: "Defence", ids: ["progressor", "boss", "marauder"] },
    { id: "midfielder", name: "Midfield", ids: ["disruptor", "recycler", "maestro", "creator"] },
    { id: "attacker", name: "Attack", ids: ["spark", "magician", "finisher", "target"] },
  ];

  // From fc27.json: launch signature, Season 2 signature, mastery attributes (null = not recorded),
  // Season 2 cost change counts (apCostChange20261022).
  const archetypes = {
    "shot-stopper": ["Shot Stopper", "Far Reach", "Deflector", ["GK Positioning", "GK Reflexes"], { up: 3, down: 1 }],
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
  const archetype = (id) => {
    const [name, launch, season2, mastery, costs] = archetypes[id];
    return { id, name, launch, season2, mastery, costs, group: groups.find((g) => g.ids.includes(id)) };
  };

  const icon = {
    emblem: (id) => `${ASSETS}archetypes/${id}.svg`,
    ps: (name) => `${ASSETS}playstyles/${slug(name)}.png`,
    psPlus: (name) => `${ASSETS}playstyles-plus/${slug(name)}.png`,
  };

  // Sample build. Names are real FC 27 attribute and PlayStyle names; the numbers are not a real build.
  const build = {
    id: "meta-finisher",
    name: "Meta Finisher",
    positions: ["ST", "CF"],
    level: 55, height: "6'1\" · 185 cm", weight: "176 lb · 80 kg", accelerate: "Controlled Explosive",
    skillMoves: 4, weakFoot: 4,
    face: { PAC: 88, SHO: 91, PAS: 72, DRI: 85, DEF: 38, PHY: 79 },
    groups: [
      ["Pace", [["Acceleration", 87], ["Sprint Speed", 89]]],
      ["Shooting", [["Att. Position", 92], ["Finishing", 94], ["Shot Power", 88], ["Long Shots", 84], ["Volleys", 86], ["Penalties", 80]]],
      ["Passing", [["Vision", 70], ["Crossing", 62], ["FK Accuracy", 58], ["Short Passing", 78], ["Long Passing", 64], ["Curve", 72]]],
      ["Dribbling", [["Agility", 84], ["Balance", 80], ["Reactions", 90], ["Ball Control", 88], ["Dribbling", 85], ["Composure", 91]]],
      ["Defending", [["Interceptions", 34], ["Heading Accuracy", 78], ["Def. Awareness", 30], ["Standing Tackle", 40], ["Sliding Tackle", 36]]],
      ["Physical", [["Jumping", 76], ["Stamina", 78], ["Strength", 82], ["Aggression", 70]]],
    ],
    psPlus: ["Low Driven Shot", "First Touch"],
    ps: ["Finesse Shot", "Power Shot", "Rapid", "Quick Step", "Precision Header", "Acrobatic"],
  };

  const builds = [
    { ...build, badges: ["meta"] },
    { id: "target-style-finisher", name: "Tall Finisher", positions: ["ST"], level: 55, height: "6'4\" · 193 cm",
      face: { PAC: 80, SHO: 90, PAS: 66, DRI: 78, DEF: 42, PHY: 88 }, psPlus: ["Low Driven Shot", "Power Shot"], badges: ["copied"] },
    { id: "quick-finisher", name: "Quick Finisher", positions: ["ST", "CF"], level: 55, height: "5'8\" · 173 cm",
      face: { PAC: 94, SHO: 88, PAS: 74, DRI: 89, DEF: 34, PHY: 66 }, psPlus: ["First Touch", "Rapid"], badges: [] },
  ];

  const notice = "Not endorsed by or affiliated with EA or its licensors. Not endorsed by the people named.";
  return { groups, has, archetype, icon, build, builds, notice, slug };
})();
