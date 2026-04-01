"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/data-table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Facility { id: string; code: string; name: string; status: string; prefecture?: string; city?: string; industry?: string; }

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", email: "", prefecture: "", city: "", industry: "" });

  useEffect(() => {
    fetch("/api/admin/facilities").then((r) => r.json()).then((d) => { setFacilities(d.facilities || []); setLoading(false); });
  }, []);

  const handleCreate = async () => {
    const res = await fetch("/api/admin/facilities", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) {
      setShowCreate(false);
      setForm({ code: "", name: "", email: "", prefecture: "", city: "", industry: "" });
      const data = await fetch("/api/admin/facilities").then((r) => r.json());
      setFacilities(data.facilities || []);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">施設管理</h1>
        <Button onClick={() => setShowCreate(!showCreate)}>施設を追加</Button>
      </div>

      {showCreate && (
        <div className="mb-6 rounded-lg border border-border bg-white p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="施設コード" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
            <Input label="施設名" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="メール" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="都道府県" value={form.prefecture} onChange={(e) => setForm({ ...form, prefecture: e.target.value })} />
            <Input label="市区町村" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <Input label="業種" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleCreate}>作成</Button>
            <Button variant="ghost" onClick={() => setShowCreate(false)}>キャンセル</Button>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>コード</TableHead>
            <TableHead>施設名</TableHead>
            <TableHead>都道府県</TableHead>
            <TableHead>業種</TableHead>
            <TableHead>ステータス</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facilities.map((f) => (
            <TableRow key={f.id}>
              <TableCell className="font-mono text-sm">{f.code}</TableCell>
              <TableCell>{f.name}</TableCell>
              <TableCell>{f.prefecture || "-"}</TableCell>
              <TableCell>{f.industry || "-"}</TableCell>
              <TableCell><Badge variant={f.status === "active" ? "default" : "secondary"}>{f.status}</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
