"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CsvExportButton({
  periodType,
  year,
  month,
}: {
  periodType: string;
  year: number;
  month: number;
}) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ periodType, year: String(year), month: String(month) });
      const res = await fetch(`/api/dashboard/export?${params}`);
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `beautyspot_${periodType}_${year}${periodType === "monthly" ? `_${month}` : ""}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={loading}>
      <Download className="mr-2 h-4 w-4" />
      {loading ? "エクスポート中..." : "CSV出力"}
    </Button>
  );
}
