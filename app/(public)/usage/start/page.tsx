import { Suspense } from "react";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import UsageStartForm from "@/components/public/usage-start-form";

export default function UsageStartPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-16 lg:px-8">
        <h1 className="mb-2 text-2xl font-bold">ヘアアイロン利用開始フォーム</h1>
        <p className="mb-8 text-muted-foreground">
          以下の情報を入力して、ヘアアイロンの利用を開始してください。
        </p>
        <Suspense fallback={<div className="text-center text-muted-foreground">読み込み中...</div>}>
          <UsageStartForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
