import type { Metadata } from "next";
import { Libre_Franklin, Newsreader } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@research-homepage/components";

const libre_franklin = Libre_Franklin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre_franklin",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: "Research Homepage — your research site, set up for you",
  description:
    "A concierge website service for researchers and labs. Send your ORCID iD; get a complete site — publications, projects, talks, datasets — live on your own domain within 48 hours. No code required.",
  openGraph: {
    title: "Research Homepage — your research site, set up for you",
    description:
      "Send your ORCID iD; get a complete research site on your own domain within 48 hours. Built by hand, edited by you.",
    type: "website",
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
        className={`${libre_franklin.variable} ${newsreader.variable} overflow-x-hidden`}
      >
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
