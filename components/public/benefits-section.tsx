import { Gem, TrendingUp, Database } from "lucide-react";
import SectionTitle from "@/components/common/section-title";

const benefits = [
  { icon: Gem, title: "施設価値の向上", desc: "化粧室の体験価値を高め、来店客の満足度に直結。施設ブランドの品格を伝える接点になります。" },
  { icon: TrendingUp, title: "来店・回遊・再訪の示唆", desc: "利用データから年代・来店目的・リピート傾向を把握。誘客施策や販促の判断材料を提供します。" },
  { icon: Database, title: "データに基づく施設改善", desc: "月次・年次で蓄積される分析レポートを活用し、施設投資や運営改善を根拠ある形で推進できます。" },
];

export default function BenefitsSection() {
  return (
    <section id="benefits" className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <SectionTitle title="Beauty Spotの導入メリット" />
        <div className="grid gap-8 md:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-lg bg-white p-8 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <b.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">{b.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
