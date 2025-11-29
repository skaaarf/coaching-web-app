import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { DataMigration } from "@/components/DataMigration";
import AnalyticsInit from "@/components/AnalyticsInit";

export const metadata: Metadata = {
  metadataBase: new URL("https://app.career-counseller.jp"),
  title: "AI進路くん",
  description: "対話とゲームでキャリアを考えるアプリ",
  icons: {
    icon: "/mikatakun-icon.png",
    shortcut: "/mikatakun-icon.png",
    apple: "/mikatakun-icon.png",
  },
  openGraph: {
    title: "AI進路くん",
    description: "対話とゲームでキャリアを考えるアプリ",
    url: "https://app.career-counseller.jp",
    siteName: "AI進路くん",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "AI進路くんのイラスト",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI進路くん",
    description: "対話とゲームでキャリアを考えるアプリ",
    images: ["/og.png"],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased font-sans">
        <SessionProvider>
          <AnalyticsInit />
          <DataMigration />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
