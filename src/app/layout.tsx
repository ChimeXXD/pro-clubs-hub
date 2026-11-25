import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { BottomNav } from "@/components/shell/BottomNav";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { TopBar } from "@/components/shell/TopBar";
import { SITE_NAME } from "@/lib/site";
import { barlow, barlowCondensed } from "./fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: SITE_NAME,
};

// viewport-fit=cover lets the bottom nav sit above the iPhone's home indicator (env(safe-area-inset-bottom)).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="flex min-h-dvh flex-col bg-bg-page text-text-primary">
        <TopBar />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <BottomNav />
      </body>
    </html>
  );
}
