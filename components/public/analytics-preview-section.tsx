import SectionTitle from "@/components/common/section-title";
import { Users, MapPin, Clock, Repeat, TrendingUp, Calendar } from "lucide-react";
import Image from "next/image";

const metrics = [
  { icon: Users, label: "年代分布", desc: "利用者の年代構成を可視化" },
  { icon: MapPin, label: "地域分析", desc: "市区町村単位で来訪エリアを把握" },
  { icon: Clock, label: "利用時間帯", desc: "ピーク時間とトレンドを分析" },
  { icon: Repeat, label: "リピート傾向", desc: "再来訪率・利用間隔・継続率" },
  { icon: TrendingUp, label: "来館目的", desc: "買い物・食事・イベント別の傾向" },
  { icon: Calendar, label: "曜日別利用", desc: "平日と休日の利用パターン差" },
];

export default function AnalyticsPreviewSection() {
  return (
    <section id="service" className="bg-[#4a1a25] py-20 text-white">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">月次レポートで、ここまで分かる</h2>
          <div className="mx-auto mt-3 h-0.5 w-12 bg-secondary" />
          <p className="mt-4 text-white/60">施設専用ダッシュボードで、データに基づく施設改善を実現</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <m.icon className="mb-3 h-8 w-8 text-secondary" />
              <p className="font-semibold">{m.label}</p>
              <p className="mt-1 text-sm text-white/50">{m.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-xl border border-white/10">
          <Image
            src="/product_analytics.png"
            alt="Beauty Spot データ分析ダッシュボード"
            width={1200}
            height={600}
            className="w-full object-contain"
          />
          <div className="bg-white/5 p-6 text-center backdrop-blur-sm">
            <p className="text-sm text-white/70">月次 / 年次 / 累計の切り替え表示 ・ CSVエクスポートで社内共有も簡単</p>
          </div>
        </div>
      </div>
    </section>
  );
}
