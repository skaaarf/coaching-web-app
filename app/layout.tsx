import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { DataMigration } from "@/components/DataMigration";

export const metadata: Metadata = {
  metadataBase: new URL("https://app.career-counseller.jp"),
  title: "みかたくん",
  description: "対話とゲームでキャリアを考えるアプリ",
  icons: {
    icon: "/mikatakun-icon.png",
    shortcut: "/mikatakun-icon.png",
    apple: "/mikatakun-icon.png",
  },
  openGraph: {
    title: "みかたくん",
    description: "対話とゲームでキャリアを考えるアプリ",
    url: "https://app.career-counseller.jp",
    siteName: "みかたくん",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "みかたくんのイラスト",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "みかたくん",
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
          <DataMigration />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
