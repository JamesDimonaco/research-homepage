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

export const metadata: Metadata = {
  title: "Research Homepage - Beautiful Academic Websites",
  description: "Professional homepage hosting for researchers and academics. Showcase your publications, projects, and research with a modern, customizable CMS-driven website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
