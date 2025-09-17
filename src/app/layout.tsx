import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TawkToScript from "@/components/TawkToScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luster & Co. - Luxury Jewelry | Shaping Brilliance, Defining Elegance",
  description: "Discover exceptional jewelry at Luster & Co. We create timeless pieces that embody fine craftsmanship, elegance, and trust. Explore our collections of engagement rings, necklaces, bracelets, and custom pieces.",
  keywords: "luxury jewelry, engagement rings, necklaces, bracelets, custom jewelry, fine craftsmanship, elegant jewelry, Luster and Co",
  authors: [{ name: "Luster & Co." }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" }
    ],
  },
  openGraph: {
    title: "Luster & Co. - Luxury Jewelry",
    description: "Shaping brilliance, defining elegance. Discover our exceptional jewelry collections.",
    type: "website",
    locale: "en_US",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <TawkToScript />
      </body>
    </html>
  );
}
