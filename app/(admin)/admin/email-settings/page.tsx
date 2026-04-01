"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface EmailSetting { id: string; key: string; subject: string; bodyText: string; materialDownloadUrl?: string; }

export default function EmailSettingsPage() {
  const [settings, setSettings] = useState<EmailSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/email-settings").then((r) => r.json()).then((d) => { setSettings(d.settings || []); setLoading(false); });
  }, []);

  const handleSave = async (s: EmailSetting) => {
    setSaving(true);
    await fetch("/api/admin/email-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: s.key, subject: s.subject, bodyText: s.bodyText, materialDownloadUrl: s.materialDownloadUrl }),
    });
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">メール設定</h1>
      <div className="space-y-6">
        {settings.map((s) => (
          <Card key={s.id}>
            <CardHeader><CardTitle className="text-base">{s.key}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input label="件名" value={s.subject} onChange={(e) => setSettings(settings.map((x) => x.id === s.id ? { ...x, subject: e.target.value } : x))} />
              <Textarea label="本文" rows={4} value={s.bodyText} onChange={(e) => setSettings(settings.map((x) => x.id === s.id ? { ...x, bodyText: e.target.value } : x))} />
              <Input label="資料DLリンク" value={s.materialDownloadUrl || ""} onChange={(e) => setSettings(settings.map((x) => x.id === s.id ? { ...x, materialDownloadUrl: e.target.value } : x))} />
              <Button onClick={() => handleSave(s)} disabled={saving}>{saving ? "保存中..." : "保存"}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
