import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Libre_Franklin } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { ThemeProvider } from "./components/ThemeProvider";

const libre_franklin = Libre_Franklin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre_franklin",
});
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dr. Nicholas Dimonaco",
  description: "Researcher, Developer, and Educator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={libre_franklin.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
