import type { Metadata } from "next";
import { Libre_Franklin, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider, configureComponents } from "@research-homepage/components";
import { urlForImage } from "@/sanity/lib/image";
import HeaderWrapper from "./components/HeaderWrapper";

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

export const metadata: Metadata = {
  // TODO: Update with your name and description
  title: "Researcher Name - Academic Homepage",
  description: "Academic homepage showcasing research, publications, and projects.",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <HeaderWrapper />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
