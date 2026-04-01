import { BarChart3, Eye, RefreshCw } from "lucide-react";
import SectionTitle from "@/components/common/section-title";

const problems = [
  { icon: BarChart3, title: "化粧室体験の定量化が難しい", desc: "満足度向上に寄与する施策か、データで説明しづらい" },
  { icon: Eye, title: "誘客・回遊への寄与が見えない", desc: "来店動機や回遊行動との関連が把握できない" },
  { icon: RefreshCw, title: "継続分析の仕組みがない", desc: "導入後のリピート傾向や利用者変化を追えない" },
];

export default function ProblemSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <SectionTitle title="施設運営者が抱える課題" subtitle="化粧室を施設価値に変える視点が求められています" />
        <div className="grid gap-8 md:grid-cols-3">
          {problems.map((p) => (
            <div key={p.title} className="rounded-lg border border-border bg-background p-8 text-center">
              <p.icon className="mx-auto mb-4 h-10 w-10 text-primary/70" />
              <h3 className="mb-2 font-semibold text-foreground">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
