import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: ["400"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Client Mind Translator — Booth Concept Generator",
  description:
    "Transform your booth vision into a clear design concept with AI-powered guidance. Define your style, budget, and elements to get a complete design direction.",
  keywords: [
    "booth design",
    "exhibition",
    "concept generator",
    "trade show",
    "AI design",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable} h-full antialiased bg-[var(--color-bg-primary)]`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
