import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Libre_Franklin } from "next/font/google";
import "./globals.css";
import { ThemeProvider, configureComponents } from "@research-homepage/components";
import { Analytics } from "@vercel/analytics/next";
import { urlForImage } from "@/sanity/lib/image";
import HeaderWrapper from "./components/HeaderWrapper";

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

export const metadata: Metadata = {
  title: "Dr. Nicholas Dimonaco",
  description: "Computational Biologist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${libre_franklin.variable} overflow-x-hidden`}>
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
      </body>
    </html>
  );
}
