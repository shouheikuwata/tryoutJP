import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-semibold text-primary">Beauty Spot</p>
            <p className="mt-2 text-sm text-muted-foreground">
              施設向けヘアアイロン設置サービス
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium">サービス</p>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/inquiry" className="hover:text-primary">お問い合わせ</Link>
              <Link href="/contract-application" className="hover:text-primary">契約申込</Link>
              <Link href="/login" className="hover:text-primary">ログイン</Link>
            </nav>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium">法的情報</p>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/privacy-policy" className="hover:text-primary">プライバシーポリシー</Link>
              <Link href="/terms" className="hover:text-primary">利用規約</Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Beauty Spot. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
