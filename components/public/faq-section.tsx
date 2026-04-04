"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionTitle from "@/components/common/section-title";
import { cn } from "@/lib/utils/cn";

const faqs = [
  { q: "導入にどのくらい費用がかかりますか？", a: "施設規模やサービス内容によって異なります。お問い合わせいただければ、ご要望に応じたお見積もりをご提示いたします。初期費用を抑えたプランもご用意しています。" },
  { q: "設置工事はどのくらいかかりますか？", a: "お問い合わせから設置完了まで、通常2〜4週間程度です。施設の営業スケジュールに配慮した施工計画を立てます。" },
  { q: "どのようなデータが取得できますか？", a: "利用者の年代・居住地域・利用時間帯・曜日別利用・来館目的・リピート率などを月次レポートで施設にご提供します。すべてのデータは匿名化された集計情報です。" },
  { q: "LINE連携は必須ですか？", a: "LINE連携を推奨していますが、施設の方針に合わせた会員化方法をご提案可能です。既存の施設アプリとの連携もご相談ください。" },
  { q: "個人情報の取り扱いはどうなっていますか？", a: "電話番号・生年月日は暗号化して保管し、施設へ提供するレポートでは匿名化された集計データのみを使用します。個人を特定できる情報は一切表示されません。" },
  { q: "複数施設への導入は可能ですか？", a: "もちろん可能です。施設ごとに独立したダッシュボードを提供し、本部向けに横断的なレポートも作成できます。" },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-background py-20">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <SectionTitle title="よくある質問" />
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-border bg-white">
              <button
                className="flex w-full items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-medium">{faq.q}</span>
                <ChevronDown className={cn("h-5 w-5 shrink-0 text-muted-foreground transition-transform", openIndex === i && "rotate-180")} />
              </button>
              {openIndex === i && (
                <div className="border-t border-border px-6 py-4 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
