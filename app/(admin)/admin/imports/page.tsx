"use client";

import { useState, useEffect } from "react";
import { Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/data-table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Facility { id: string; name: string; }
interface ImportResult {
  batchId: string;
  status: string;
  summary: { totalRows: number; successRows: number; failedRows: number; duplicateRows: number };
  errors: { rowNumber: number; field: string; message: string }[];
}

export default function ImportsPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [facilityId, setFacilityId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/facilities").then((r) => r.json()).then((d) => {
      setFacilities(d.facilities || []);
      setLoading(false);
    });
  }, []);

  const handleUpload = async () => {
    if (!facilityId || !file) return;
    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("facilityId", facilityId);
    formData.append("file", file);

    const res = await fetch("/api/admin/imports/form-responses", { method: "POST", body: formData });
    const data = await res.json();
    setResult(data);
    setUploading(false);
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">CSV取込</h1>

      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">フォーム回答CSVアップロード</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">施設</label>
            <select
              value={facilityId}
              onChange={(e) => setFacilityId(e.target.value)}
              className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm"
            >
              <option value="">施設を選択</option>
              {facilities.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">CSVファイル</label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleUpload} disabled={!facilityId || !file || uploading}>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "取込中..." : "取込実行"}
            </Button>
            <a
              href="/samples/form-response-sample.csv"
              download
              className="inline-flex items-center justify-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              サンプルCSV
            </a>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              取込結果
              <Badge variant={result.status === "completed" ? "default" : result.status === "failed" ? "destructive" : "secondary"}>
                {result.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-4 gap-4 text-center">
              <div><p className="text-2xl font-bold">{result.summary.totalRows}</p><p className="text-xs text-muted-foreground">合計行</p></div>
              <div><p className="text-2xl font-bold text-green-600">{result.summary.successRows}</p><p className="text-xs text-muted-foreground">成功</p></div>
              <div><p className="text-2xl font-bold text-red-600">{result.summary.failedRows}</p><p className="text-xs text-muted-foreground">失敗</p></div>
              <div><p className="text-2xl font-bold text-yellow-600">{result.summary.duplicateRows}</p><p className="text-xs text-muted-foreground">重複</p></div>
            </div>

            {result.errors.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium">エラー一覧</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>行番号</TableHead>
                      <TableHead>項目</TableHead>
                      <TableHead>エラー</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.errors.map((e, i) => (
                      <TableRow key={i}>
                        <TableCell>{e.rowNumber}</TableCell>
                        <TableCell>{e.field}</TableCell>
                        <TableCell className="text-sm text-destructive">{e.message}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
