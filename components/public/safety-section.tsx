import { Megaphone, Database, Target, Users } from "lucide-react";
import SectionTitle from "@/components/common/section-title";
import Image from "next/image";

const useCases = [
  {
    icon: Megaphone,
    title: "新商品プロモーション",
    desc: "タレント・芸人によるイベント開催と連動し、来場者データの取得・分析を実施。商品認知度やターゲット層の反応を定量化します。",
  },
  {
    icon: Database,
    title: "イベントデータの分析",
    desc: "イベント前後の来館者の行動変化、年代・地域ごとの反応差を可視化。次回施策の改善ポイントを明確にします。",
  },
  {
    icon: Target,
    title: "パーソナライズドサービス",
    desc: "利用データに基づき、会員一人ひとりに合わせたクーポンや情報配信を設計。リピート率と顧客満足度を向上させます。",
  },
  {
    icon: Users,
    title: "会員の囲い込み",
    desc: "LINE連携を起点とした会員化と、利用実績に基づくランク制度・特典設計により、施設全体のロイヤル顧客を育成します。",
  },
];

export default function SafetySection() {
  return (
    <section id="safety" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <SectionTitle title="データ活用とイベント連携" subtitle="体験型サービスのデータを施設経営に活かす" />

        <div className="grid gap-8 sm:grid-cols-2">
          {useCases.map((item) => (
            <div key={item.title} className="flex gap-5 rounded-xl bg-background p-6 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-pink-100">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-xl">
          <Image
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80"
            alt="イベント会場"
            width={1200}
            height={400}
            className="h-64 w-full object-cover md:h-72"
          />
        </div>
      </div>
    </section>
  );
}
