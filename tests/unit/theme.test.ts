import { describe, expect, it } from "vitest";
import { THEME_KEY, THEME_SCRIPT, themeLabel } from "@/lib/theme";

// The theme switch (D-112, D-114 (1)): dark by default; light only by the user's choice, kept in this browser under
// THEME_KEY and set on <html> by THEME_SCRIPT before the page paints.
function run(stored: string | null, throws = false) {
  const root = { dataset: {} as Record<string, string> };
  const localStorage = {
    getItem: (k: string) => {
      if (throws) throw new Error("blocked");
      return k === THEME_KEY ? stored : null;
    },
  };
  new Function("document", "localStorage", THEME_SCRIPT)({ documentElement: root }, localStorage);
  return root.dataset.theme;
}

describe("theme", () => {
  it("sets light only when the user picked it", () => {
    expect(run("light")).toBe("light");
    expect(run(null)).toBeUndefined();
    expect(run("dark")).toBeUndefined();
    expect(run("purple")).toBeUndefined();
  });

  it("stays dark when storage is blocked", () => {
    expect(run("light", true)).toBeUndefined();
  });

  it("labels the button with the mode it switches to (497:976)", () => {
    expect(themeLabel("dark")).toBe("Switch to light mode");
    expect(themeLabel("light")).toBe("Switch to dark mode");
  });
});
