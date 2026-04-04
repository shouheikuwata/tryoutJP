import { Sparkles, BarChart3, Handshake } from "lucide-react";
import SectionTitle from "@/components/common/section-title";

const benefits = [
  {
    icon: Sparkles,
    title: "体験型サービスで滞在時間を向上",
    desc: "ヘアアイロン・マッサージチェア・キッズスペースなど、来館者が「つい使いたくなる」体験を館内に設置。滞在時間とフロア回遊を促進します。",
    available: true,
  },
  {
    icon: BarChart3,
    title: "利用データで施設改善を定量化",
    desc: "年代・地域・利用時間帯などのデータを月次レポートとして施設に提供。感覚ではなくデータに基づいた販促・テナント施策が可能になります。",
    available: true,
  },
  {
    icon: Handshake,
    title: "会員化とパーソナライズで囲い込み",
    desc: "LINE連携による会員化と利用データのパーソナライズで、来館者のリピートを促進。施設と一緒に最適な会員サービスを設計します。",
    available: false,
  },
];

export default function BenefitsSection() {
  return (
    <section id="benefits" className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <SectionTitle title="TRYOUT japan agencyができること" subtitle="体験の導入からデータ活用まで、施設と伴走します" />

        <div className="grid gap-8 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className={`relative rounded-xl bg-white p-8 shadow-sm transition-shadow ${b.available ? "hover:shadow-md" : "opacity-50"}`}>
              {!b.available && (
                <span className="absolute right-4 top-4 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">準備中</span>
              )}
              <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${b.available ? "bg-secondary" : "bg-muted"}`}>
                <b.icon className={`h-7 w-7 ${b.available ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <h3 className="mb-3 text-lg font-semibold">{b.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
