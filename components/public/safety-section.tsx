import { Shield, Wrench, Headphones, FileCheck } from "lucide-react";
import SectionTitle from "@/components/common/section-title";

const items = [
  { icon: Shield, title: "安全設計", desc: "自動電源オフ、耐熱スタンド、温度制御など安全機能を備えたヘアアイロンを採用" },
  { icon: Wrench, title: "定期メンテナンス", desc: "専任スタッフによる定期的な清掃・点検を実施し、常に清潔で安全な状態を維持" },
  { icon: Headphones, title: "運用サポート", desc: "設置後も専用窓口でトラブル対応。施設担当者の負担を最小限に" },
  { icon: FileCheck, title: "保険対応", desc: "万一の事故に備えた保険を完備。施設側のリスクを低減" },
];

export default function SafetySection() {
  return (
    <section id="safety" className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <SectionTitle title="安全性とサポート体制" subtitle="施設運営者が安心して導入できる仕組み" />
        <div className="grid gap-8 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.title} className="flex gap-4 rounded-lg bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
