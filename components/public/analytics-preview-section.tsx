import SectionTitle from "@/components/common/section-title";
import { Users, MapPin, Clock, Repeat } from "lucide-react";

const metrics = [
  { icon: Users, label: "年代分布", desc: "利用者の年代構成を可視化" },
  { icon: MapPin, label: "居住地分析", desc: "市区町村単位で来訪エリアを把握" },
  { icon: Clock, label: "時間帯・曜日", desc: "利用のピーク時間とトレンド" },
  { icon: Repeat, label: "リピート傾向", desc: "再来訪率・利用間隔・継続率" },
];

export default function AnalyticsPreviewSection() {
  return (
    <section id="service" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <SectionTitle title="利用データで、ここまで分かる" subtitle="契約施設専用ダッシュボードで、施設改善の示唆をリアルに提供" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-lg border border-border bg-background p-6 text-center">
              <m.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
              <p className="font-semibold">{m.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/20 p-8 text-center">
          <p className="text-sm text-muted-foreground">月次 / 年次 / 累計 の切り替え表示</p>
          <p className="mt-2 text-lg font-semibold text-foreground">来店目的 / 利用きっかけ / リピート頻度 / 初回→2回目日数</p>
          <p className="mt-1 text-sm text-muted-foreground">CSVエクスポートで社内共有も簡単</p>
        </div>
      </div>
    </section>
  );
}
