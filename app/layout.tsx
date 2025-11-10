import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { DataMigration } from "@/components/DataMigration";
import { auth } from "@/auth";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Coaching Web App",
  description: "A coaching web application for managing coaching sessions",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="ja">
      <body className={`${notoSansJP.className} antialiased`}>
        <SessionProvider session={session}>
          <DataMigration />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
