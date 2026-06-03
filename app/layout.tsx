import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI News Radar",
  description: "AI related RSS feeds collected into a compact Next.js news dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
