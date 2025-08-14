import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

import "./globals.css";
import ClientLayoutWrapper from "@/app/components/ClientLayoutwrapper";
import ReactQueryProvider from "./QueryClientProvider";
import GA4Tracker from "@/app/components/GA4Tracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic", "latin"],
  weight: ["500"],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "TarteebPro - Barber Booking",
    description: "Book your barber appointments with ease",
    keywords: ["barber", "booking", "haircut", "salon", "Tarteeb"],
    openGraph: {
      title: "TarteebPro - Barber Booking",
      description: "Book your barber appointments with ease",
      url: "https://tarteebpro.com",
      siteName: "TarteebPro",
      locale: "en_US",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const GA_MEASUREMENT_ID = "G-Y1B9EC2T85";

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

        {/* GA4 Global Site Tag */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansArabic.variable} antialiased`}>
        <ReactQueryProvider>
          <ClientLayoutWrapper>
            {/* GA4Tracker handles page view tracking on route changes */}
            <GA4Tracker />
            {children}
          </ClientLayoutWrapper>
        </ReactQueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
