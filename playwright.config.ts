import { defineConfig, devices } from "@playwright/test";

const PORT = 4174;

// E2E runs against the built static site (out/) at the two phone widths in CLAUDE.md.
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1, // the Mac is tight on memory and shared with Oya Ball (L-06); one browser at a time
  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    locale: "en-NG",
    timezoneId: "Africa/Lagos",
    trace: "on-first-retry",
  },
  projects: [
    { name: "phone-390", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } } },
    { name: "phone-360", use: { ...devices["Pixel 7"], viewport: { width: 360, height: 800 } } },
  ],
  webServer: {
    // CI has already built out/ and checked its budget, and says so with E2E_PREBUILT: serve that build.
    command: process.env.E2E_PREBUILT
      ? `node scripts/serve-out.mjs ${PORT}`
      : `npm run --silent build && node scripts/serve-out.mjs ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
