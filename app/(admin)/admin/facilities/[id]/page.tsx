"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function FacilityDetailPage() {
  const { id } = useParams();
  const [facility, setFacility] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch(`/api/admin/facilities/${id}`).then((r) => r.json()).then((d) => setFacility(d.facility));
  }, [id]);

  if (!facility) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-bold">施設詳細</h1>
      <Card>
        <CardHeader><CardTitle>{facility.name as string}</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>コード: {facility.code as string}</p>
          <p>ステータス: {facility.status as string}</p>
          <p>都道府県: {(facility.prefecture as string) || "-"}</p>
          <p>市区町村: {(facility.city as string) || "-"}</p>
          <p>業種: {(facility.industry as string) || "-"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
