import SectionTitle from "@/components/common/section-title";

const steps = [
  { num: "01", title: "お問い合わせ", desc: "フォームまたはお電話でご相談ください" },
  { num: "02", title: "ヒアリング", desc: "施設状況と導入ニーズを確認します" },
  { num: "03", title: "設置計画", desc: "最適な設置場所と台数をご提案します" },
  { num: "04", title: "施工・設置", desc: "施設の営業に配慮したスケジュールで設置" },
  { num: "05", title: "運用開始", desc: "ダッシュボードで利用データをすぐに確認" },
];

export default function InstallFlowSection() {
  return (
    <section id="flow" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <SectionTitle title="導入フロー" subtitle="お問い合わせから運用開始までシンプルなステップ" />
        <div className="relative">
          <div className="absolute left-6 top-0 hidden h-full w-px bg-border md:block" />
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.num} className="flex items-start gap-6">
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {step.num}
                </div>
                <div className="pt-2">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
