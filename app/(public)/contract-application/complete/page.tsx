import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import CTAButton from "@/components/common/cta-button";
import { CheckCircle } from "lucide-react";

export default function ContractApplicationCompletePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-xl px-4 py-24 text-center lg:px-8">
        <CheckCircle className="mx-auto mb-6 h-16 w-16 text-primary" />
        <h1 className="text-2xl font-bold">契約申込を受け付けました</h1>
        <p className="mt-4 text-muted-foreground">
          お申込みいただきありがとうございます。担当者より改めてご連絡いたします。
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          ご不明点がございましたら、お問い合わせ窓口までご連絡ください。
        </p>
        <div className="mt-10">
          <CTAButton href="/" variant="outline">トップへ戻る</CTAButton>
        </div>
      </main>
      <Footer />
    </>
  );
}
