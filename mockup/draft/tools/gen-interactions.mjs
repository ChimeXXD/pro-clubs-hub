// Writes mockup/draft/interactions.json: one entry per interactive test ID found in the phone and
// desktop frame sheets, specced from the rule table below (numbers match base.css and themes.css).
// Fails if an interactive element matches no rule. Run from the repo root:
//   node mockup/draft/tools/gen-interactions.mjs
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const DIR = resolve("mockup/draft");
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const nav = (effect) => ({ trigger: "tap", states: ["default", "pressed", "focus"], effect, duration_ms: 300, easing: EASE, delay_ms: 0, reduced_motion: "no slide; the new page appears at once" });
const select = (effect) => ({ trigger: "tap", states: ["default", "selected", "pressed", "focus"], effect, duration_ms: 150, easing: EASE, delay_ms: 0, reduced_motion: "no fade" });

const RULES = [
  [/^(wordmark|tab-home)$/, nav("navigate:/")],
  [/^(nav|tab)-(faces|builds|archetypes|changelog|submit)$/, (id) => nav(`navigate:/${id.split("-")[1]}`)],
  [/^footer-link-\d+$/, nav("navigate:/about | /submit | /takedown | /changelog, in that order")],
  [/^search-input$/, { trigger: "type", states: ["default", "focus", "filled"], effect: "search faces and builds by name (results list: next draft)", duration_ms: 0, easing: "none", delay_ms: 0, reduced_motion: "same" }],
  [/^(home-faces-all|faces-empty-submit|sent-back|nf-faces|face-back)$/, (id) => nav(id === "faces-empty-submit" ? "navigate:/submit" : "navigate:/faces")],
  [/^(home-builds-all|build-back|nf-builds)$/, nav("navigate:/builds")],
  [/^(home-changelog-all)$/, nav("navigate:/changelog")],
  [/^(arch-back)$/, nav("navigate:/archetypes")],
  [/^(takedown-github)$/, nav("open the takedown issue form on GitHub (new tab)")],
  [/^(fc|submit-card)-link-\d+$/, nav("navigate:/faces/<slug>")],
  [/^bc-link-\d+$/, nav("phone: navigate:/builds/<slug>; computer, on /builds: show the build in the side panel (Open the build opens it)")],
  [/^(preview-card|paired-card|arch-build|submit-build)-link-\d+$|^(preview-open|face-done-build)$/, nav("navigate:/builds/<slug>")],
  [/^(pitch|tile-link)-[a-z-]+$|^arch-tab-\d+$/, nav("navigate:/archetypes/<id>")],
  [/^log-source-\d+$|^(sig|mastery|cost)-source$|^creator-\d+$/, nav("open the source or creator page (new tab)")],
  [/^home-pos-\d+$/, select("select the position; the four builds under it change")],
  [/^view-(grid|list)$/, select("show the builds as a grid or as a list")],
  [/^sig-\d+$/, select("pick a signature PlayStyle; the panel says when it came, who else has it and the source")],
  [/^home-tab-\d+$/, select("select the tab; Footballers and Musicians filter the face grid; Trending and New show every face until there is data behind them")],
  [/^filter-chip-\d+$/, select("select the chip; the grid filters at once, the empty state shows when nothing matches")],
  [/^arch-filter$/, { trigger: "change", states: ["default", "open", "focus"], effect: "filter build cards by archetype; a sheet on the phone, a menu 8 px under it on a computer", duration_ms: 150, easing: EASE, delay_ms: 0, reduced_motion: "no fade" }],
  [/^face-tab-\d+$/, select("show that editor tab's steps; the highlight moves to the tab")],
  [/^group-tab-\d+$/, select("show that group's archetypes in the row below")],
  [/^angle-\d+$|^stage-(prev|next)$/, select("show that angle of Chime's capture; the counter reads 0n / 05")],
  [/^step-tick-\d+$/, { trigger: "tap", states: ["todo", "current", "done", "pressed", "focus"], effect: "tick the step (and every step before it); the row dims, the progress bar grows; saved on this device", duration_ms: 220, easing: EASE, delay_ms: 0, reduced_motion: "no width animation" }],
  [/^face-start$/, { trigger: "tap", states: ["default", "pressed", "focus"], effect: "scroll to the first step not done; reads 'Continue from step n' once started", duration_ms: 300, easing: EASE, delay_ms: 0, reduced_motion: "jump, no smooth scroll" }],
  [/^embed-facade$/, { trigger: "tap", states: ["default", "pressed", "focus"], effect: "replace the facade with the youtube-nocookie.com player; nothing loads before the tap", duration_ms: 0, easing: "none", delay_ms: 0, reduced_motion: "same" }],
  [/^submit-kind-\d+$/, select("switch the form between a face and a build")],
  [/^form-tab-\d+$/, select("show that section of the form; a tab with problems says how many")],
  [/^f-[a-z-]+$/, { trigger: "type", states: ["default", "focus", "filled", "error"], effect: "validate on leaving the field; the problem shows under it in words", duration_ms: 0, easing: "none", delay_ms: 0, reduced_motion: "same" }],
  [/^submit-issue$/, { trigger: "tap", states: ["default", "pressed", "focus"], effect: "validate every field; if clean, open a prefilled GitHub issue and show the sent state, else mark problems inline", duration_ms: 150, easing: EASE, delay_ms: 0, reduced_motion: "no fade" }],
  [/^submit-copy$/, { trigger: "tap", states: ["default", "pressed", "copied"], effect: "copy the JSON; the label reads 'Copied' for 1.6 s", duration_ms: 1600, easing: "none", delay_ms: 0, reduced_motion: "same" }],
];

const browser = await chromium.launch();
const ids = new Set();
try {
  for (const [file, width] of [["frames.html", 393], ["desktop.html", 1440]]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(pathToFileURL(resolve(DIR, file)).href);
    const found = await page.evaluate(() => {
      const SEL = 'button, a[href], input:not([type=hidden]), select, textarea, [role=button], [role=link], [role=tab], [tabindex]:not([tabindex="-1"])';
      return [...document.querySelectorAll(`[data-screen] :is(${SEL})`)]
        .filter((e) => e.checkVisibility())
        .map((e) => e.dataset.testid || e.closest("[data-testid]")?.dataset.testid);
    });
    found.forEach((id) => ids.add(id));
    await page.close();
  }
} finally { await browser.close(); }

const entries = [], missing = [];
for (const id of [...ids].sort()) {
  const rule = RULES.find(([re]) => re.test(id));
  if (!rule) { missing.push(id); continue; }
  const spec = typeof rule[1] === "function" ? rule[1](id) : rule[1];
  entries.push({ element: id, ...spec });
}
if (missing.length) { console.error(`No rule for: ${missing.join(", ")}`); process.exit(1); }
writeFileSync(resolve(DIR, "interactions.json"), JSON.stringify({ interactions: entries }, null, 1) + "\n");
console.log(`interactions.json: ${entries.length} elements`);
