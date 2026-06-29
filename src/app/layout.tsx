import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
});

const SITE_URL = "https://kplcricket.lk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kinniya Premier League (KPL) — 208 Players · 8 Teams · One Champion",
    template: "%s | Kinniya Premier League",
  },
  description:
    "The Kinniya Premier League (KPL) — 208 Players ⚡ 8 Teams ⚡ One Dream ⚡ One Champion. Follow the Mega Auction countdown, franchises, players and the road to Season 1.",
  keywords: [
    "Kinniya Premier League",
    "KPL",
    "cricket league",
    "mega auction",
    "Kinniya cricket",
    "Sri Lanka cricket tournament",
  ],
  authors: [{ name: "Kinniya Premier League" }],
  icons: {
    icon: "/kpl-logo.png",
    apple: "/kpl-logo.png",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Kinniya Premier League (KPL)",
    description:
      "208 Players ⚡ 8 Teams ⚡ One Dream ⚡ One Champion. The biggest cricket auction in Kinniya is coming.",
    siteName: "Kinniya Premier League",
    images: [{ url: "/kpl-logo.png", width: 1599, height: 984, alt: "Kinniya Premier League" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinniya Premier League (KPL)",
    description:
      "208 Players ⚡ 8 Teams ⚡ One Dream ⚡ One Champion. The Mega Auction is coming soon.",
    images: ["/kpl-logo.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050816",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-screen bg-ink text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
