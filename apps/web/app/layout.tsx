import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./components/AuthProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://dothelper.com"),
  title: {
    default: "DOT Helper — DOT Compliance Software for Small Fleets | FMCSA Compliance Made Simple",
    template: "%s | DOT Helper",
  },
  description:
    "DOT Helper is the #1 DOT compliance software for small business fleets. Manage driver qualification files, HOS logs, vehicle inspections, drug & alcohol testing, and stay audit-ready. Start your free trial today.",
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
  authors: [{ name: "DOT Helper" }],
  creator: "DOT Helper",
  publisher: "DOT Helper",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "DOT Helper",
    title: "DOT Helper — DOT Compliance Software for Small Fleets",
    description:
      "The easiest way for small business owners to be and stay DOT compliant. Manage drivers, vehicles, HOS, inspections, and documents — all in one place.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DOT Helper — DOT Compliance Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DOT Helper — DOT Compliance Software for Small Fleets",
    description:
      "The easiest way for small business owners to be and stay DOT compliant. Start your free trial today.",
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
  name: "DOT Helper",
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
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
