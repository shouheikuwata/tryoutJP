"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/data-table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Inquiry { id: string; companyName: string; contactName: string; email: string; facilityName: string; status: string; createdAt: string; }

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/inquiries").then((r) => r.json()).then((d) => { setInquiries(d.inquiries || []); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">お問い合わせ一覧</h1>
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
          {inquiries.map((i) => (
            <TableRow key={i.id}>
              <TableCell className="text-sm">{new Date(i.createdAt).toLocaleDateString("ja-JP")}</TableCell>
              <TableCell>{i.companyName}</TableCell>
              <TableCell>{i.contactName}</TableCell>
              <TableCell>{i.facilityName}</TableCell>
              <TableCell><Badge variant={i.status === "new" ? "default" : "secondary"}>{i.status}</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
