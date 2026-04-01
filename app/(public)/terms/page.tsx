import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { TERMS_SECTIONS, TERMS_LAST_UPDATED } from "@/lib/legal/terms";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
        <h1 className="mb-2 text-2xl font-bold">利用規約</h1>
        <p className="mb-8 text-sm text-muted-foreground">最終更新日: {TERMS_LAST_UPDATED}</p>
        <p className="mb-8 text-sm leading-relaxed text-foreground">
          この利用規約（以下「本規約」といいます。）は、Beauty Spot運営会社（以下「当社」といいます。）が提供するBeauty Spotに関するウェブサイト、問い合わせ機能、契約申込機能、契約施設向けダッシュボード、ならびにこれらに付随するサービス（以下「本サービス」といいます。）の利用条件を定めるものです。
        </p>
        <div className="space-y-8">
          {TERMS_SECTIONS.map((section) => (
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
