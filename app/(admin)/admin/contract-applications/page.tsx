"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/data-table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Application { id: string; companyName: string; contactName: string; email: string; facilityName: string; status: string; createdAt: string; }

export default function ContractApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/contract-applications").then((r) => r.json()).then((d) => { setApps(d.applications || []); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">契約申込一覧</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>日時</TableHead>
            <TableHead>会社名</TableHead>
            <TableHead>担当者</TableHead>
            <TableHead>施設名</TableHead>
            <TableHead>ステータス</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apps.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="text-sm">{new Date(a.createdAt).toLocaleDateString("ja-JP")}</TableCell>
              <TableCell>{a.companyName}</TableCell>
              <TableCell>{a.contactName}</TableCell>
              <TableCell>{a.facilityName}</TableCell>
              <TableCell><Badge variant={a.status === "submitted" ? "default" : "secondary"}>{a.status}</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
