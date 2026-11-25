import { Barlow, Barlow_Condensed } from "next/font/google";

// The design's two families (Figma Typography: font/text Barlow, font/display Barlow Condensed), self-hosted by
// next/font at build time, so the browser never asks Google. Only the weights the text styles use.
// tokens.css reads the variables: --font-text is var(--font-barlow), --font-display var(--font-barlow-condensed).
export const barlow = Barlow({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-barlow", display: "swap" });

export const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-barlow-condensed",
  display: "swap",
});
