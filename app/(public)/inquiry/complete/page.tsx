import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import CTAButton from "@/components/common/cta-button";
import { CheckCircle } from "lucide-react";

export default function InquiryCompletePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-xl px-4 py-24 text-center lg:px-8">
        <CheckCircle className="mx-auto mb-6 h-16 w-16 text-primary" />
        <h1 className="text-2xl font-bold">お問い合わせありがとうございます</h1>
        <p className="mt-4 text-muted-foreground">
          確認メールをお送りしました。メール内の資料ダウンロードリンクより資料をご確認いただけます。
          担当者より改めてご連絡いたします。
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <CTAButton href="/" variant="outline">トップへ戻る</CTAButton>
          <CTAButton href="/contract-application">契約申込へ進む</CTAButton>
        </div>
      </main>
      <Footer />
    </>
  );
}
