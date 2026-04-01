"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionTitle from "@/components/common/section-title";
import { cn } from "@/lib/utils/cn";

const faqs = [
  { q: "設置にどのくらいの費用がかかりますか？", a: "施設規模や台数によって異なります。お問い合わせいただければ、ご要望に応じたお見積もりをご提示いたします。" },
  { q: "設置にどのくらいの期間がかかりますか？", a: "お問い合わせから設置完了まで、通常2〜4週間程度です。施設のスケジュールに合わせた施工を行います。" },
  { q: "安全面は大丈夫ですか？", a: "自動電源オフ機能・耐熱スタンド・温度制御を備えたヘアアイロンを採用しています。定期メンテナンスと保険対応も含まれます。" },
  { q: "どのようなデータが見られますか？", a: "年代分布、居住地、来店目的、利用きっかけ、リピート率、時間帯・曜日別利用など、施設改善に役立つ指標を網羅的に確認できます。" },
  { q: "一般利用者のプライバシーは守られますか？", a: "電話番号と生年月日は暗号化して保管し、ダッシュボードでは匿名化された集計データのみを表示します。個人を特定できる情報は表示されません。" },
  { q: "契約後のサポート体制はどうなっていますか？", a: "専用の運用サポート窓口を設けており、機器トラブル・清掃・消耗品交換を含めた保守対応を行います。" },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-background py-20">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <SectionTitle title="よくある質問" />
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-lg border border-border bg-white">
              <button
                className="flex w-full items-center justify-between px-6 py-4 text-left"
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
