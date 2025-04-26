import { Geist, Geist_Mono } from "next/font/google";
import "../../styles/globals.css";
import { Toaster } from "@components/ui/sonner";
import Header from "@components/header";
import Footer from "@components/footer";
import { LanguageProvider } from "../context/languageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "প্রাইজ বন্ড ফলাফল | Prize Bond Checker Bangladesh",
  description:
    "বাংলাদেশ প্রাইজ বন্ড ড্র ফলাফল অনলাইনে দ্রুত ও সহজে যাচাই করুন।",
  verification: {
    google: "USrTkPNcQfxDTKsPdgSpegI871zA5wLu0WXxk-Oj05k",
  },
  keywords: [
    "প্রাইজ বন্ড",
    "প্রাইজবন্ড",
    "প্রাইজ বন্ড রেজাল্ট",
    "রেজাল্ট",
    "Prize bond result",
    "Bangladesh prize bond",
    "BD prize bond",
    "prizebond checker",
    "prizebond",
    "prizebondbd",
    "prize bond bd",
    "prize bond result",
    "prize bond result bd",
    "prize bond result check",
    "prize bond result check bd",
    "prize bond result check online",
    "prize bond result check online bd",
    "prize bond result check online bangladesh",
    "prizebond checker bd",
    "prizebond checker bangladesh",
    "prizebond checker online",
    "prizebond draw",
    "prize bond draw",
  ],
  metadataBase: new URL("https://prizebondbd.vercel.app"),
  openGraph: {
    title: "প্রাইজ বন্ড ফলাফল",
    description: "বাংলাদেশ প্রাইজ বন্ড ড্র ফলাফল অনলাইনে যাচাই করুন।",
    url: "https://prizebondbd.vercel.app",
    siteName: "Prize Bond Checker",
    images: [
      {
        url: "/og-image.jpg",
        width: 800,
        height: 600,
        alt: "প্রাইজ বন্ড রেজাল্ট চেক করুন",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "প্রাইজ বন্ড রেজাল্ট | Prize Bond BD",
    description: "বাংলাদেশ প্রাইজ বন্ড ফলাফল সহজে ও অনলাইনে দেখুন।",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
