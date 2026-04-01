import SectionTitle from "@/components/common/section-title";
import Image from "next/image";
import { Building2, Lightbulb, ArrowRight } from "lucide-react";

const facilitySpaces = [
  "パウダールーム",
  "キッズスペース",
  "エスカレーター横スペース",
  "荷物預けスペース",
  "休憩スペース",
  "その他共用部",
];

const experienceServices = [
  { name: "ヘアアイロン レンタル", desc: "外出先でのヘアリセット需要に対応" },
  { name: "スタイリングサービス", desc: "プロのスタイリストによるミニ施術" },
  { name: "マッサージチェア", desc: "買い物の合間にリラクゼーション" },
  { name: "スマホ充電サービス", desc: "滞在時間を自然に延長" },
  { name: "体験型イベント", desc: "新商品PRやタレントイベントの企画運営" },
];

export default function FacilityServicesSection() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <SectionTitle title="設置場所と体験サービス" subtitle="施設の空きスペースを付加価値に変える" />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Facility Spaces */}
          <div className="rounded-xl border border-border bg-white p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <Building2 className="h-5 w-5 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold">商業施設側 ― 設置可能スペース</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {facilitySpaces.map((space) => (
                <div key={space} className="rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  {space}
                </div>
              ))}
            </div>
            <div className="mt-6 overflow-hidden rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80"
                alt="商業施設の共用スペース"
                width={600}
                height={300}
                className="h-48 w-full object-cover"
              />
            </div>
          </div>

          {/* Right: Experience Services */}
          <div className="rounded-xl border border-border bg-white p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-50">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">体験サービス ― 活用方法</h3>
            </div>
            <div className="space-y-3">
              {experienceServices.map((svc) => (
                <div key={svc.name} className="flex items-start gap-3 rounded-lg border border-border/50 p-4 transition-colors hover:bg-pink-50/50">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">{svc.name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{svc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
