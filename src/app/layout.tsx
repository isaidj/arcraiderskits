import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AdsProvider } from '@/contexts/AdsContext';
import { Analytics } from '@vercel/analytics/react';

const barlow = Barlow({
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-barlow",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ARC Raiders Expedition Countdown - Voluntary Wipe Timer & Project Tracker",
  description: "Track the Arc Raiders Expedition Project countdown. Voluntary progression reset system with 8-week cycles. First Expedition window: December 15-21, 2025.",
  keywords: ["ARC Raiders", "Expedition", "wipe", "countdown", "reset", "progression", "voluntary reset", "Expedition Project", "timer", "Embark Studios"],
  openGraph: {
    title: "ARC Raiders Expedition Countdown",
    description: "Track when the next voluntary progression reset (Expedition) begins. The Expedition Project runs in 8-week cycles, valuing your time spent in the game.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARC Raiders Expedition Countdown",
    description: "Voluntary progression reset system with 8-week cycles. First Expedition: December 15-21, 2025.",
  },
  other: {
    'google-adsense-account': process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${barlow.variable} antialiased`} suppressHydrationWarning>
        <AdsProvider>
          {children}
        </AdsProvider>
        <Analytics />
      </body>
    </html>
  );
}
