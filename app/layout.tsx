import type { Metadata } from "next";
// @ts-expect-error CSS import
import "./globals.css";

export const metadata: Metadata = {
  title: "TRYOUT japan agency | 商業施設の体験価値向上とデータ活用",
  description:
    "商業施設の付加価値を体験型サービスとデータ分析で向上。ヘアアイロン・キッズスペース・イベント企画から月次レポートまで。TRYOUT japan agency（株）",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
