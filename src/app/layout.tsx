import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const gotham = localFont({
  src: [
    {
      path: "./fonts/gotham-light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/gotham-book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/gotham-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/gotham-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-gotham",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Kala. | Architecture & Curated Interiors",
  description: "Kala is a boutique architecture and interior design studio crafting timeless, minimalist residential and commercial spaces.",
  keywords: "architecture, interior design, minimalism, luxury design, modern houses, boutique design studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${gotham.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
