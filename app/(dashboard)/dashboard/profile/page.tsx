"use client";

import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-xl font-bold">プロフィール</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">アカウント情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">施設名</p>
            <p className="font-medium">{session?.user?.facilityName || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">メールアドレス</p>
            <p className="font-medium">{session?.user?.email || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">権限</p>
            <p className="font-medium">{session?.user?.role === "platform_admin" ? "管理者" : "施設閲覧者"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
