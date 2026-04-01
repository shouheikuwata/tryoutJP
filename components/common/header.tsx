"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "サービス", href: "#service" },
  { label: "導入メリット", href: "#benefits" },
  { label: "安全性", href: "#safety" },
  { label: "導入フロー", href: "#flow" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="text-xl font-semibold tracking-wide text-primary">
          Beauty Spot
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-foreground/70 transition-colors hover:text-primary">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/inquiry" className="rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white">
            お問い合わせ
          </Link>
          <Link href="/login" className="px-4 py-2 text-sm text-foreground/60 hover:text-primary">
            ログイン
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="メニュー">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/40 bg-white md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-foreground/70 hover:bg-secondary hover:text-primary">
                {l.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border/40 pt-3">
              <Link href="/inquiry" className="rounded-md border border-primary px-4 py-2.5 text-center text-sm font-medium text-primary hover:bg-primary hover:text-white">
                お問い合わせ
              </Link>
              <Link href="/login" className="px-4 py-2.5 text-center text-sm text-foreground/60 hover:text-primary">
                ログイン
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
