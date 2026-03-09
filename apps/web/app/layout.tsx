import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./components/AuthProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://greenlightusdot.com"),
  title: {
    default: "Greenlight USDOT — DOT Compliance, Plain and Simple",
    template: "%s | Greenlight USDOT",
  },
  description:
    "Put your USDOT compliance on autopilot. Greenlight USDOT tracks your drivers, vehicles, inspections, and deadlines so you don't have to. Built for small businesses. Start free.",
  keywords: [
    "DOT compliance software",
    "USDOT compliance for small business",
    "how to get DOT compliant",
    "DOT compliance made easy",
    "fleet compliance software",
    "DOT compliance checklist",
    "USDOT number compliance",
    "DOT audit readiness",
    "trucking compliance software",
    "fleet management software",
    "commercial vehicle compliance",
    "DOT compliance for owner operators",
    "small fleet compliance",
    "DOT compliance autopilot",
    "FMCSA compliance",
    "vehicle inspection tracking",
  ],
  authors: [{ name: "Greenlight USDOT" }],
  creator: "Greenlight USDOT",
  publisher: "Greenlight USDOT",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Greenlight USDOT",
    title: "Greenlight USDOT — DOT Compliance, Plain and Simple",
    description:
      "DOT compliance software built for small fleets. Track drivers, vehicles, inspections, and documents — all in one place.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Greenlight USDOT — DOT Compliance Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Greenlight USDOT — DOT Compliance, Plain and Simple",
    description:
      "DOT compliance software built for small fleets. Start your free trial today.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

// JSON-LD structured data for the SaaS product
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Greenlight USDOT",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  description:
    "Put your USDOT compliance on autopilot. Track drivers, vehicles, inspections, and deadlines — we tell you exactly what needs attention, in plain English.",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "39",
    highPrice: "199",
    priceCurrency: "USD",
    offerCount: "3",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "342",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&family=Nunito:wght@600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
