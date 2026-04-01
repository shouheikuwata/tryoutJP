"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Mail, FileText, FileSpreadsheet, Users, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { label: "施設管理", href: "/admin/facilities", icon: Building2 },
  { label: "お問い合わせ", href: "/admin/inquiries", icon: Mail },
  { label: "契約申込", href: "/admin/contract-applications", icon: FileText },
  { label: "メール設定", href: "/admin/email-settings", icon: Mail },
  { label: "CSV取込", href: "/admin/imports", icon: FileSpreadsheet },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-white lg:block">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/" className="text-lg font-semibold text-primary">Beauty Spot</Link>
          <span className="ml-2 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Admin</span>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                pathname.startsWith(item.href) ? "bg-secondary text-primary font-medium" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <Link href="/dashboard" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
            <Users className="h-4 w-4" />
            ダッシュボード
          </Link>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
          <p className="text-sm font-medium">管理画面</p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{session?.user?.email}</span>
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-background p-6">{children}</main>
      </div>
    </div>
  );
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  );
}
