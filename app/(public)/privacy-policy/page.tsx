import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { PRIVACY_POLICY_SECTIONS, PRIVACY_POLICY_LAST_UPDATED } from "@/lib/legal/privacy-policy";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
        <h1 className="mb-2 text-2xl font-bold">プライバシーポリシー</h1>
        <p className="mb-8 text-sm text-muted-foreground">最終更新日: {PRIVACY_POLICY_LAST_UPDATED}</p>
        <p className="mb-8 text-sm leading-relaxed text-foreground">
          Beauty Spot運営会社（以下「当社」といいます。）は、Beauty Spotに関するウェブサイト、問い合わせ受付、契約申込受付、契約施設向け分析ダッシュボードその他これらに付随するサービス（以下「本サービス」といいます。）における利用者および導入施設関係者の個人情報の取扱いについて、以下のとおり定めます。
        </p>
        <div className="space-y-8">
          {PRIVACY_POLICY_SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="mb-3 text-lg font-semibold">{section.title}</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{section.content}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
