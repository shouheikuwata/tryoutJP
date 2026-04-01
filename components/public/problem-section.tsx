import { TrendingDown, Users, ShoppingBag } from "lucide-react";
import SectionTitle from "@/components/common/section-title";
import Image from "next/image";

const problems = [
  { icon: ShoppingBag, title: "「買い物の場」のままでは差別化が難しい", desc: "EC化が進み、商業施設に足を運ぶ理由が薄れている。来館動機の多様化が求められています。" },
  { icon: TrendingDown, title: "滞在時間が伸びず回遊が生まれない", desc: "テナント単体では滞在を促す仕掛けが限られ、フロア全体の回遊・再訪につながりにくい現状があります。" },
  { icon: Users, title: "来館者データを施策に活かせていない", desc: "年代・地域・来館目的など、施策改善に直結するデータの取得・分析が属人的になっています。" },
];

export default function ProblemSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <SectionTitle title="商業施設が抱える課題" subtitle="施設価値を高めるには「体験」と「データ」の両輪が必要です" />
        <div className="grid gap-8 md:grid-cols-3">
          {problems.map((p) => (
            <div key={p.title} className="group rounded-xl border border-border bg-background p-8 transition-shadow hover:shadow-lg">
              <p.icon className="mb-4 h-10 w-10 text-primary/70" />
              <h3 className="mb-3 text-lg font-semibold text-foreground">{p.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl">
          <Image
            src="https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1200&q=80"
            alt="商業施設の内観"
            width={1200}
            height={400}
            className="h-64 w-full object-cover md:h-80"
          />
        </div>
      </div>
    </section>
  );
}
