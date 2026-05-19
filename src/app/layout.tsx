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
        className={`${hindSiliguri.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          // Prevent user selection to feel more like a native app
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
      >
        <div className="relative min-h-[100dvh] w-full mx-auto max-w-md overflow-hidden bg-black/5">
          {children}
        </div>
      </body>
    </html>
  );
}
