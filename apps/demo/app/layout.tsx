import type { Metadata } from "next";
import { Libre_Franklin, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@research-homepage/components";

const libre_franklin = Libre_Franklin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre_franklin",
});

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://researchhomepage.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Research Homepage - Professional Websites for Researchers & Labs",
    template: "%s | Research Homepage",
  },
  description:
    "Create stunning websites for research labs, individual researchers, and academic groups. Beautiful, SEO-optimized sites featuring publications, projects, team members, datasets, and more. No coding required.",
  keywords: [
    // Lab-focused
    "research lab website",
    "lab website builder",
    "laboratory website",
    "research group website",
    "academic lab site",
    "lab homepage",
    "research team website",
    "lab page builder",
    // Individual-focused
    "academic website",
    "researcher website",
    "professor website",
    "academic portfolio",
    "research homepage",
    "publication portfolio",
    "academic profile",
    "researcher profile",
    "PhD website",
    "postdoc website",
    "faculty website",
    "scientist website",
    "scholar website",
    // General
    "academic web presence",
    "research publications website",
    "academic homepage builder",
    "research site builder",
  ],
  authors: [{ name: "Research Homepage", url: siteUrl }],
  creator: "Research Homepage",
  publisher: "Research Homepage",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Research Homepage",
    title: "Research Homepage - Websites for Researchers & Research Labs",
    description:
      "Create stunning websites for research labs and individual researchers. Beautiful, SEO-optimized sites featuring publications, projects, team members, and datasets.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Research Homepage - Professional Academic Websites",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research Homepage - Websites for Researchers & Labs",
    description:
      "Create stunning websites for research labs and researchers. No coding required.",
    images: ["/og-image.png"],
    creator: "@researchhomepage",
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
    canonical: siteUrl,
  },
  category: "technology",
  classification: "Academic Website Builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className={`${libre_franklin.variable} overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
