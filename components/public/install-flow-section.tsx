import SectionTitle from "@/components/common/section-title";
import { Smartphone, QrCode, ClipboardCheck, BarChart3 } from "lucide-react";

const steps = [
  {
    num: "STEP 1",
    icon: Smartphone,
    title: "LINE登録",
    desc: "商業施設のLINE公式アカウントから簡単に会員登録。来館者の手間を最小限に抑えます。",
    color: "from-green-400 to-green-600",
  },
  {
    num: "STEP 2",
    icon: QrCode,
    title: "QRコードでレンタル開始",
    desc: "設置機器のQRコードを読み取り、年齢・住所・電話番号を登録してレンタルを開始。初回のみ情報入力が必要です。",
    color: "from-primary to-pink-500",
  },
  {
    num: "STEP 3",
    icon: ClipboardCheck,
    title: "QRコードでレンタル終了",
    desc: "終了用QRコードをスキャンしてレンタル完了。利用時間が自動的に記録されます。",
    color: "from-blue-400 to-blue-600",
  },
  {
    num: "REPORT",
    icon: BarChart3,
    title: "月次レポートで施設に提供",
    desc: "年代別・地域別・利用時間帯の分析レポートを毎月施設へ提供。販促施策やテナント戦略の判断材料にご活用いただけます。",
    color: "from-amber-400 to-orange-500",
  },
];

export default function InstallFlowSection() {
  return (
    <section id="flow" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <SectionTitle title="ご利用の流れ" subtitle="LINE登録からデータ活用まで、シンプルな3ステップ" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.num} className="relative rounded-xl border border-border bg-background p-6 text-center">
              {i < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-2xl text-muted-foreground/40 lg:block">
                  →
                </div>
              )}
              <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color}`}>
                <step.icon className="h-8 w-8 text-white" />
              </div>
              <p className="mb-1 text-xs font-bold tracking-widest text-primary">{step.num}</p>
              <h3 className="mb-3 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
