import { Sparkles, BarChart3, Handshake } from "lucide-react";
import SectionTitle from "@/components/common/section-title";
import Image from "next/image";

const benefits = [
  {
    icon: Sparkles,
    title: "体験型サービスで滞在時間を向上",
    desc: "ヘアアイロン・マッサージチェア・キッズスペースなど、来館者が「つい使いたくなる」体験を館内に設置。滞在時間とフロア回遊を促進します。",
  },
  {
    icon: BarChart3,
    title: "利用データで施設改善を定量化",
    desc: "年代・地域・利用時間帯などのデータを月次レポートとして施設に提供。感覚ではなくデータに基づいた販促・テナント施策が可能になります。",
  },
  {
    icon: Handshake,
    title: "会員化とパーソナライズで囲い込み",
    desc: "LINE連携による会員化と利用データのパーソナライズで、来館者のリピートを促進。施設と一緒に最適な会員サービスを設計します。",
  },
];

export default function BenefitsSection() {
  return (
    <section id="benefits" className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <SectionTitle title="TRYOUT japan agencyができること" subtitle="体験の導入からデータ活用まで、施設と伴走します" />

        <div className="grid gap-8 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-pink-100">
                <b.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-3 text-lg font-semibold">{b.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-xl">
            <Image
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80"
              alt="データ分析イメージ"
              width={600}
              height={400}
              className="h-64 w-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-xl">
            <Image
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80"
              alt="商業施設の顧客体験"
              width={600}
              height={400}
              className="h-64 w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
