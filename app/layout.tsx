import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Libre_Franklin } from "next/font/google";
import "./globals.css";
import HeaderWrapper from "./components/HeaderWrapper";
import { ThemeProvider } from "./components/ThemeProvider";

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
