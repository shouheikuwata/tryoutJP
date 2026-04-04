import { Suspense } from "react";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import UsageEndForm from "@/components/public/usage-end-form";

export default function UsageEndPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-16 lg:px-8">
        <h1 className="mb-2 text-2xl font-bold">ヘアアイロン利用終了フォーム</h1>
        <p className="mb-8 text-muted-foreground">
          ヘアアイロンのご利用を終了します。
        </p>
        <Suspense fallback={<div className="text-center text-muted-foreground">読み込み中...</div>}>
          <UsageEndForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
