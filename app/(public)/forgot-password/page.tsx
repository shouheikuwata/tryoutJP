"use client";

import { useState } from "react";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
    setLoading(false);
  };

  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-border bg-white p-8 shadow-sm">
            <h1 className="mb-6 text-center text-xl font-bold">パスワード再設定</h1>
            {sent ? (
              <div className="text-center">
                <p className="text-muted-foreground">
                  再設定用メールを送信しました。メールに記載されたリンクからパスワードを再設定してください。
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="メールアドレス" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "送信中..." : "再設定メールを送信"}
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
