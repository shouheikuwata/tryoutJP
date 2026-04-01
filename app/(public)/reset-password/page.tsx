"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><LoadingSpinner /></div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 12) {
      setError("パスワードは12文字以上で入力してください");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword, confirmPassword }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error?.message || "パスワード再設定に失敗しました");
    } else {
      setDone(true);
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-border bg-white p-8 shadow-sm">
            <h1 className="mb-6 text-center text-xl font-bold">パスワード再設定</h1>
            {done ? (
              <div className="text-center">
                <p className="mb-4 text-muted-foreground">パスワードを更新しました。</p>
                <Link href="/login" className="text-primary hover:underline">ログインへ</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="新しいパスワード" id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                <Input label="新しいパスワード（確認）" id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "更新中..." : "パスワードを更新"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
