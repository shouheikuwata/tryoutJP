import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-[#4a1a25] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-bold">TRYOUT <span className="text-sm font-normal text-white/60">japan agency（株）</span></p>
            <p className="mt-2 text-sm text-white/50">
              商業施設の付加価値向上を、体験とデータで実現する
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium text-white/80">サービス</p>
            <nav className="flex flex-col gap-2 text-sm text-white/50">
              <Link href="/inquiry" className="hover:text-white">お問い合わせ</Link>
              <Link href="/contract-application" className="hover:text-white">契約申込</Link>
              <Link href="/login" className="hover:text-white">施設ログイン</Link>
            </nav>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium text-white/80">法的情報</p>
            <nav className="flex flex-col gap-2 text-sm text-white/50">
              <Link href="/privacy-policy" className="hover:text-white">プライバシーポリシー</Link>
              <Link href="/terms" className="hover:text-white">利用規約</Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} TRYOUT japan agency（株）. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
