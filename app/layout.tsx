import type { Metadata, Viewport } from "next";
import { DM_Sans, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://brainos.brainerslabs.com"),
  title: {
    default: "BrainersOS — Your Company's Intelligence. Finally Connected.",
    template: "%s — BrainersOS",
  },
  description:
    "BrainersOS by Brainers Labs turns every document, policy, and conversation in your company into one intelligent brain your teams can search, reason with, and trust.",
  keywords: [
    "BrainersOS",
    "Brainers Labs",
    "enterprise AI",
    "knowledge graph",
    "enterprise search",
    "AI operating system",
  ],
  authors: [{ name: "Brainers Labs" }],
  openGraph: {
    type: "website",
    siteName: "BrainersOS",
    title: "BrainersOS — Your Company's Intelligence. Finally Connected.",
    description:
      "The AI operating system that turns everything your company knows into answers your teams can trust.",
    url: "https://brainos.brainerslabs.com",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "BrainersOS — the enterprise AI operating system",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BrainersOS — Your Company's Intelligence. Finally Connected.",
    description:
      "The AI operating system that turns everything your company knows into answers your teams can trust.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05070A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} bg-space text-text-primary antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
