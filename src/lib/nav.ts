// The site's sections, in the order the Figma bottom nav (282:521) and footer (205:434) show them.
// The tablet and desktop top bar shows the same sections without Home (the logo is the way home).

export type IconName = "home" | "faces" | "builds" | "changelog" | "submit" | "search";

export interface Section {
  href: string;
  label: string;
  icon: IconName;
}

export const SECTIONS: readonly Section[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/faces", label: "Faces", icon: "faces" },
  { href: "/builds", label: "Builds", icon: "builds" },
  { href: "/changelog", label: "Changelog", icon: "changelog" },
  { href: "/submit", label: "Submit", icon: "submit" },
];

export const FOOTER_LINKS: readonly { href: string; label: string }[] = [
  { href: "/about", label: "About" },
  { href: "/changelog", label: "Changelog" },
  { href: "/submit", label: "Submit" },
  { href: "/takedown", label: "Takedown" },
];

/** True when `pathname` is the section at `href` or a page under it. Home matches the home page only. */
export function isCurrent(href: string, pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}
