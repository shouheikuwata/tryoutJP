import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import InquiryForm from "@/components/public/inquiry-form";

export default function InquiryPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-16 lg:px-8">
        <h1 className="mb-2 text-2xl font-bold">お問い合わせ</h1>
        <p className="mb-8 text-muted-foreground">Beauty Spotの導入に関するご質問・ご相談を承ります。</p>
        <InquiryForm />
      </main>
      <Footer />
    </>
  );
}
