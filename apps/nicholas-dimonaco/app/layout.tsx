import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Libre_Franklin } from "next/font/google";
import "./globals.css";
import { ThemeProvider, configureComponents } from "@research-homepage/components";
import { Analytics } from "@vercel/analytics/next";
import { urlForImage } from "@/sanity/lib/image";
import HeaderWrapper from "./components/HeaderWrapper";
import { PostHogProvider } from "./components/PostHogProvider";

// Configure the components package with our app's urlForImage function
configureComponents({
  urlForImage,
});

const libre_franklin = Libre_Franklin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre_franklin",
});
const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nicholas.dimonaco.co.uk";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dr. Nicholas Dimonaco | Computational Biologist",
    template: "%s | Dr. Nicholas Dimonaco",
  },
  description:
    "Dr. Nicholas Dimonaco is a computational biologist specialising in genomics, RNA biology, and bioinformatics. Browse his publications, research projects, datasets, and software tools.",
  keywords: [
    "computational biology",
    "bioinformatics",
    "genomics",
    "RNA biology",
    "research",
    "publications",
    "Nicholas Dimonaco",
  ],
  authors: [{ name: "Dr. Nicholas Dimonaco", url: siteUrl }],
  creator: "Dr. Nicholas Dimonaco",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "Dr. Nicholas Dimonaco",
    title: "Dr. Nicholas Dimonaco | Computational Biologist",
    description:
      "Computational biologist specialising in genomics, RNA biology, and bioinformatics. Explore research, publications, and software tools.",
  },
  twitter: {
    card: "summary",
    title: "Dr. Nicholas Dimonaco | Computational Biologist",
    description:
      "Computational biologist specialising in genomics, RNA biology, and bioinformatics. Explore research, publications, and software tools.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${libre_franklin.variable} overflow-x-hidden`}>
        <PostHogProvider>
          <Analytics />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <HeaderWrapper />
            <main className="min-h-screen overflow-x-hidden">{children}</main>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
