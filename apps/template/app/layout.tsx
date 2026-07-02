import type { Metadata } from "next";
import { Libre_Franklin, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider, configureComponents } from "@research-homepage/components";
import { urlForImage } from "@/sanity/lib/image";
import HeaderWrapper from "./components/HeaderWrapper";
import { PostHogProvider } from "./components/PostHogProvider";

const libreFranklin = Libre_Franklin({
  variable: "--font-libre_franklin",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Configure shared components with app-specific dependencies
configureComponents({ urlForImage });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourname.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    // TODO: Replace "Researcher Name" and "Field" with your own
    default: "Researcher Name | Academic Homepage",
    template: "%s | Researcher Name",
  },
  // TODO: Write a description mentioning your field, research focus, and institution
  description:
    "Academic homepage showcasing research, publications, and projects.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    // TODO: Update siteName and title with your name
    siteName: "Researcher Name",
    title: "Researcher Name | Academic Homepage",
    description:
      "Academic homepage showcasing research, publications, and projects.",
  },
  twitter: {
    card: "summary",
    // TODO: Update title with your name
    title: "Researcher Name | Academic Homepage",
    description:
      "Academic homepage showcasing research, publications, and projects.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${libreFranklin.variable} ${inter.variable} font-sans antialiased`}
      >
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <HeaderWrapper />
            <main>{children}</main>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
