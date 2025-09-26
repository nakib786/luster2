import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TawkToScript from "@/components/TawkToScript";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ThemeProvider } from "@/contexts/ThemeContext";
import CacheManager from "@/components/CacheManager";

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
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      { rel: "mask-icon", url: "/favicon.svg", color: "#D0B58C" }
    ]
  },
  openGraph: {
    title: "Luster & Co. - Luxury Jewelry",
    description: "Shaping brilliance, defining elegance. Discover our exceptional jewelry collections.",
    type: "website",
    locale: "en_US",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Luster & Co."
  },
  other: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#D0B58C"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased theme-transition`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider defaultTheme="system">
          <ScrollProgress className="fixed z-50 bg-gradient-to-r from-amber-500 to-yellow-600" />
          {children}
          <TawkToScript />
          <CacheManager />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
