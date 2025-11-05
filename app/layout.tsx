import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coaching Web App",
  description: "A coaching web application for managing coaching sessions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
