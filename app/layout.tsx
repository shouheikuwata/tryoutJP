import type { Metadata } from "next";
// @ts-expect-error CSS import
import "./globals.css";

export const metadata: Metadata = {
  title: "Beauty Spot | 施設向けヘアアイロン設置サービス",
  description:
    "百貨店・商業施設の化粧室にヘアアイロン設置サービスを導入。施設価値向上と来店分析を実現するBeauty Spot。",
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
