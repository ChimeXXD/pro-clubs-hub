import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { NOTICE, SITE_NAME } from "@/lib/site";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: SITE_NAME,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer>
          <p data-testid="site-notice">{NOTICE}</p>
        </footer>
      </body>
    </html>
  );
}
