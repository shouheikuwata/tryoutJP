import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import Link from "next/link";

export default function UsageStartCompletePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-16 text-center lg:px-8">
        <div className="rounded-lg border border-border bg-card p-8">
          <h1 className="mb-4 text-2xl font-bold text-primary">
            利用を開始しました
          </h1>
          <p className="mb-2 text-foreground">
            ヘアアイロンの電源が入りました。
          </p>
          <p className="text-sm text-muted-foreground">
            ご利用が終わりましたら、利用終了フォームから終了手続きをお願いします。
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="text-sm text-primary hover:underline"
            >
              トップページに戻る
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
