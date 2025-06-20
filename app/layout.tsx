import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gemini Computer",
  description:
    "Generate dynamic, responsive UI components and screens powered by AI",
  generator: "Dynamic UI Generator",
  keywords: [
    "ui",
    "generator",
    "ai",
    "dynamic",
    "components",
    "nextjs",
    "react",
  ],
  authors: [{ name: "Your Name" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  );
}
