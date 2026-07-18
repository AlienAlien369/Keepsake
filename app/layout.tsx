import type { Metadata } from "next";
import { Fraunces, Inter, Caveat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CursorGlow } from "@/components/cursor-glow";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  weight: ["500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://keepsake-letters.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Keepsake — A Letter For You",
    template: "%s · Keepsake",
  },
  description:
    "A handwritten farewell, kept for you. A quiet collection of letters, memories, and thank-yous from someone who wanted you to have them.",
  openGraph: {
    title: "Keepsake — A Letter For You",
    description: "A handwritten farewell, kept for you.",
    url: siteUrl,
    siteName: "Keepsake",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Keepsake — A Letter For You",
    description: "A handwritten farewell, kept for you.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${inter.variable} ${caveat.variable} font-body`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          <div className="grain-overlay bg-grain" />
          <CursorGlow />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
