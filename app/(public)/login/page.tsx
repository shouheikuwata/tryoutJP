"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("メールアドレスまたはパスワードが正しくありません");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-border bg-white p-8 shadow-sm">
            <h1 className="mb-6 text-center text-xl font-bold">ログイン</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="メールアドレス" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="パスワード" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "ログイン中..." : "ログイン"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                パスワードを忘れた方
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
