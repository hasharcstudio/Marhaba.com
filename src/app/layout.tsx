import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  subsets: ["latin", "bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#c90076",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming on mobile for app-like feel
};

export const metadata: Metadata = {
  title: "Marhaba | Context-Aware Dating",
  description: "Find meaningful relationships with privacy and cultural resonance in Bangladesh.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Marhaba",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${hindSiliguri.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-100 dark:bg-neutral-950`}
        style={{
          // Prevent user selection to feel more like a native app
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
      >
        <div className="relative min-h-[100dvh] md:min-h-[min(100dvh-4rem,900px)] w-full mx-auto max-w-md overflow-hidden bg-background shadow-2xl border-x border-black/5 dark:border-white/5 md:my-8 md:rounded-[40px] md:border-y">
          {children}
        </div>
      </body>
    </html>
  );
}
