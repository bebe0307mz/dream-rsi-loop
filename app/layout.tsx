import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dream-RSI Loop | Watch AI Recursively Improve Itself",
  description:
    "Animated step-by-step visualization of the Dream-RSI recursive self-improvement loop. Watch an AI agent build its own training worlds to get smarter, generation by generation. Export as a GIF.",
  openGraph: {
    title: "Dream-RSI Loop | Watch AI Recursively Improve Itself",
    description:
      "Animated visualization of AI recursive self-improvement. An agent builds training worlds, trains, evaluates, and evolves -- loop by loop.",
    type: "website",
    url: "https://dream-rsi-loop.vercel.app",
    siteName: "Dream-RSI Loop",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dream-RSI Loop",
    description:
      "Watch AI recursively improve itself -- animated step-by-step visualization you can share as a GIF.",
  },
  metadataBase: new URL("https://dream-rsi-loop.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceMono.className} antialiased`}>{children}</body>
    </html>
  );
}
