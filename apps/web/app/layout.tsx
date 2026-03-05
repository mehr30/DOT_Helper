import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./components/AuthProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://greenlightdot.com"),
  title: {
    default: "Greenlight DOT — DOT Compliance, Plain and Simple",
    template: "%s | Greenlight DOT",
  },
  description:
    "Greenlight DOT is DOT compliance software for small business fleets. Track driver qualifications, vehicle inspections, HOS, and stay audit-ready. Start your free trial today.",
  keywords: [
    "DOT compliance software",
    "FMCSA compliance",
    "fleet compliance software",
    "DOT compliance for small business",
    "driver qualification file management",
    "HOS tracking software",
    "DVIR software",
    "DOT audit readiness",
    "trucking compliance software",
    "fleet management software",
    "ELD compliance",
    "drug and alcohol testing DOT",
    "CSA scores",
    "vehicle maintenance compliance",
    "small fleet compliance",
  ],
  authors: [{ name: "Greenlight DOT" }],
  creator: "Greenlight DOT",
  publisher: "Greenlight DOT",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Greenlight DOT",
    title: "Greenlight DOT — DOT Compliance, Plain and Simple",
    description:
      "DOT compliance software built for small fleets. Track drivers, vehicles, inspections, and documents — all in one place.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Greenlight DOT — DOT Compliance Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Greenlight DOT — DOT Compliance, Plain and Simple",
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
  name: "Greenlight DOT",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  description:
    "DOT compliance management software for small business fleets. Track driver qualifications, HOS, vehicle inspections, drug & alcohol testing, and more.",
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
