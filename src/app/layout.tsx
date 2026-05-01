import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "3D Booth Design Assistant — by RG Designs",
  description:
    "A premium 7-step tool for designing world-class exhibition booths. Define booth type, style, structure, elements, brand, and budget to generate a complete 3D design concept.",
  keywords: [
    "3D booth design",
    "exhibition design",
    "booth concept generator",
    "trade show booth",
    "RG Designs",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
