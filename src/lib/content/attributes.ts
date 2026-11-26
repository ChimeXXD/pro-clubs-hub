// The game's attributes in the six groups the build page shows (D-63), plus goalkeeping. Names come from
// the approved Meta Finisher screen and RESEARCH §10.6, not yet checked against the game's own screen.
// GK Kicking was read on Chime's specialization cards (RESEARCH §10.4, 25 Nov).
// TODO(Chime): confirm each spelling in Edit Attributes, and that keeper "Positioning" is GK Positioning.
export const ATTRIBUTE_GROUPS = [
  { code: "PAC", name: "Pace", attributes: ["Acceleration", "Sprint Speed"] },
  { code: "SHO", name: "Shooting", attributes: ["Att. Position", "Finishing", "Shot Power", "Long Shots", "Volleys", "Penalties"] },
  { code: "PAS", name: "Passing", attributes: ["Vision", "Crossing", "FK Accuracy", "Short Passing", "Long Passing", "Curve"] },
  { code: "DRI", name: "Dribbling", attributes: ["Agility", "Balance", "Reactions", "Ball Control", "Dribbling", "Composure"] },
  { code: "DEF", name: "Defending", attributes: ["Interceptions", "Heading Accuracy", "Def. Awareness", "Standing Tackle", "Sliding Tackle"] },
  { code: "PHY", name: "Physical", attributes: ["Jumping", "Stamina", "Strength", "Aggression"] },
  { code: "GK", name: "Goalkeeping", attributes: ["GK Diving", "GK Handling", "GK Kicking", "GK Positioning", "GK Reflexes"] },
] as const;

/** The six key stats (D-62), in the game's order: the first six groups' codes. */
export const KEY_STATS: readonly string[] = ATTRIBUTE_GROUPS.slice(0, 6).map((g) => g.code);

export const ATTRIBUTES: ReadonlySet<unknown> = new Set(ATTRIBUTE_GROUPS.flatMap((g) => g.attributes as readonly string[]));

/** The highest an attribute can read (RESEARCH §10.2: prices run to 99). */
export const ATTRIBUTE_MAX = 99;

/** Star ratings cost AP from the same budget (RESEARCH §10.2), so a spend order can raise them too. */
export const STARS = { "Skill Moves": "skillMoves", "Weak Foot": "weakFoot" } as const;
export const STARS_MAX = 5;
export const isStar = (name: unknown): name is keyof typeof STARS => typeof name === "string" && Object.hasOwn(STARS, name);

/** The top level: the end of the level switch's track in Figma (298:3684), and mastery's last step (RESEARCH §10.6). */
export const LEVEL_MAX = 55;
