import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

import "./globals.css";
import ClientLayoutWrapper from "@/app/components/ClientLayoutwrapper";
import ReactQueryProvider from "./QueryClientProvider";
import GA4Tracker from "@/app/components/GA4Tracker";

// Fonts
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic", "latin"],
  weight: ["500"],
});

const getUserLang = (): "en" | "ar" => {
  if (typeof navigator !== "undefined") {
    return navigator.language.startsWith("ar") ? "ar" : "en";
  }
  return "en";
};

export async function generateMetadata(): Promise<Metadata> {
  const lang = getUserLang();
  const isArabic = lang === "ar";

  return {
    title: "TarteebPro - Barber Booking",
    description: isArabic
      ? "أدر الحلاقين والخدمات والمواعيد في صالونك مع TarteebPro، واحجز مواعيد الحلاقة بسهولة."
      : "Manage barbers, services, and appointments in your salon with TarteebPro. Easily book barber appointments.",
    keywords: ["barber", "booking", "haircut", "salon", "Tarteeb"],
    openGraph: {
      title: "TarteebPro - Barber Booking",
      description: isArabic
        ? "احجز مواعيد الحلاقة بسهولة مع TarteebPro."
        : "Easily book your barber appointments online with TarteebPro.",
      url: "https://tarteebpro.com",
      siteName: "TarteebPro",
      locale: isArabic ? "ar_AR" : "en_US",
      type: "website",
      images: [
        {
          url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          width: 1200,
          height: 630,
          alt: "TarteebPro Barber Booking",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "TarteebPro - Barber Booking",
      description: isArabic
        ? "احجز مواعيد الحلاقة بسهولة مع TarteebPro."
        : "Easily book your barber appointments online with TarteebPro.",
      images: [
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      ],
      site: "@TarteebPro",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA_MEASUREMENT_ID = "G-Y1B9EC2T85";
  const lang = getUserLang();

  return (
    <html lang={lang}>
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
            <GA4Tracker />
            {children}
          </ClientLayoutWrapper>
        </ReactQueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
