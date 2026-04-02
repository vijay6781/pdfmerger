import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pdfwala.in"),
  title: {
    default: "PDFWala – Merge PDF, Compress PDF, JPG to PDF Free Online",
    template: "%s | PDFWala",
  },
  description:
    "Free online PDF and image tools for India: Merge PDF, Compress PDF, JPG to PDF, PDF to JPG, passport photo maker. No signup, secure in-browser processing.",
  alternates: {
    canonical: "https://pdfwala.in",
  },
  keywords: [
    "pdf merge india",
    "compress pdf online free",
    "jpg to pdf online free",
    "pdf to jpg online free",
    "pdf split free",
    "passport size photo maker online",
    "jpg to png converter",
    "aadhaar pdf merge",
    "upsc document tool",
    "ssc cgl photo size",
    "free pdf tool india",
    "pdfwala",
  ],
  authors: [{ name: "PDFWala" }],
  creator: "PDFWala",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://pdfwala.in",
    siteName: "PDFWala",
    title: "PDFWala – Free PDF & Image Tools for India",
    description:
      "Merge PDFs, make passport photos, convert images — free, no signup, in-browser.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@pdfwala",
    creator: "@pdfwala",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "PDFWala",
              url: "https://pdfwala.in",
              description:
                "Free PDF and image tools for India — merge, split, convert, passport photo",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://pdfwala.in/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "PDFWala",
              url: "https://pdfwala.in",
              logo: "https://pdfwala.in/favicon.ico",
            }),
          }}
        />
      </head>
      <body className="font-dm bg-[#0f0f0f] text-white antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
