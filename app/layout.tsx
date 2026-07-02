import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LocaleProvider } from "@/app/components/LocaleProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "3D Prints Shop",
  description: "Quality 3D prints for every occasion.",
  openGraph: {
    title: "3D Prints Shop",
    description: "Quality 3D prints for every occasion.",
    url: process.env.SITE_URL,
    siteName: "3D Prints Shop",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
