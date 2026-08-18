import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/Navbar";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script";
import AdConsentBanner from "@/components/AdConsentBanner";
import AnchorAd from "@/components/ads/AnchorAd";
import { AD_UNITS } from "@/lib/ads/config";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "GamePix",
  description: "Play 10k+ games without installation",
  openGraph: {
    title: 'GamePix',
    description: 'Play 10k+ games without installation',
    type: 'website',
    images: [{
      url: '/og.png',  // Next.js automatically prepends your domain
      width: 1200,
      height: 630,
      alt: 'Site preview'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GamePix',
    description: 'Play 10k+ games without installation',
    images: ['/og.png'],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GamePix",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable} suppressHydrationWarning>
      <head>
        <meta name="5aee9cfd3e789bf778bf646a89168a1434b6d6fd" content="5aee9cfd3e789bf778bf646a89168a1434b6d6fd" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        <link rel="dns-prefetch" href="//img.gamepix.com" />
        <link rel="preconnect" href="https://img.gamepix.com" crossOrigin="" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />

        <Script
          id="ahrefs-analytics"
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="Pc38PjKXrLJUUuMnLmtJ7Q"
          strategy="afterInteractive"
        />



        {/* google adsense */}
        <meta name="google-adsense-account" content="ca-pub-8288956475423358" />
        <meta name="ahrefs-site-verification" content="f6f05b0ed23e12419f656b28c59553f855937ded7c7d26d7db499467e18d4689" />


      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* adsterra Popunder ads  */}
        {AD_UNITS.popunder.src && (
          <Script id="adsterra-popunder" src={AD_UNITS.popunder.src} strategy="afterInteractive" />
        )}

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main id="main-content">
            {children}
          </main>
          <BackToTop />
          <Footer />
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />

        <AdConsentBanner />

        {/* adsterra Social Bar */}
        {AD_UNITS.social_bar.src && (
          <Script id="adsterra-social-bar" src={AD_UNITS.social_bar.src} strategy="afterInteractive" />
        )}

        {/* adsterra Anchor / direct-link ad */}
        <AnchorAd />
      </body>
    </html>
  );
}
