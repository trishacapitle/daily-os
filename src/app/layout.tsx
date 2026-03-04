import type { Metadata } from "next";
import { DM_Sans, Lora, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const DMSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const loraSerif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
});

const alpinoSans = localFont({
  variable: "--font-alpino",
  src: "../../public/Alpino-Variable.ttf",
});

export const metadata: Metadata = {
  title: "DailyOS",
  description: "Your daily operating system. Build better days.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${DMSans.variable} ${loraSerif.variable} ${fontMono.variable} ${alpinoSans.className} antialiased`}
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
