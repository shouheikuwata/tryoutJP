"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, BarChart3, Repeat, TrendingUp, Clock, Calendar } from "lucide-react";
import FilterBar from "@/components/dashboard/filter-bar";
import KPICard from "@/components/dashboard/kpi-card";
import PieChartCard from "@/components/dashboard/pie-chart-card";
import CsvExportButton from "@/components/dashboard/csv-export-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import EmptyState from "@/components/common/empty-state";
import { formatNumber, formatPercent, formatDays } from "@/lib/utils/format";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Summary {
  usageCount: number;
  uniqueUserCount: number;
  newRate: number;
  repeatRate: number;
  averageUsageIntervalDays: number | null;
  repeatContinuationRate: number | null;
  avgUsesPerUser: number | null;
  secondUseMedianDays: number | null;
}

export default function DashboardPage() {
  const now = new Date();
  const [periodType, setPeriodType] = useState("monthly");
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [usageTrend, setUsageTrend] = useState<{ label: string; usageCount: number }[]>([]);
  const [ageDist, setAgeDist] = useState<{ label: string; value: number; percentage: number | null }[]>([]);
  const [purposeDist, setPurposeDist] = useState<{ label: string; value: number; percentage: number | null }[]>([]);
  const [triggerDist, setTriggerDist] = useState<{ label: string; value: number; percentage: number | null }[]>([]);
  const [weekdayData, setWeekdayData] = useState<{ label: string; usageCount: number }[]>([]);
  const [hourlyData, setHourlyData] = useState<{ label: string; usageCount: number }[]>([]);
  const [cityData, setCityData] = useState<{ label: string; usageCount: number; percentage: number | null }[]>([]);
  const [loading, setLoading] = useState(true);

  const buildParams = useCallback(() => {
    const p = new URLSearchParams({ periodType, year: String(year), month: String(month) });
    return p.toString();
  }, [periodType, year, month]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const params = buildParams();

      const [summaryRes, trendRes, ageRes, purposeRes, triggerRes, weekdayRes, hourlyRes, cityRes] = await Promise.all([
        fetch(`/api/dashboard/summary?${params}`).then((r) => r.json()),
        fetch(`/api/dashboard/charts/usage-trend?${params}`).then((r) => r.json()),
        fetch(`/api/dashboard/charts/age-distribution?${params}`).then((r) => r.json()),
        fetch(`/api/dashboard/charts/visit-purpose?${params}`).then((r) => r.json()),
        fetch(`/api/dashboard/charts/usage-trigger?${params}`).then((r) => r.json()),
        fetch(`/api/dashboard/charts/weekday-usage?${params}`).then((r) => r.json()),
        fetch(`/api/dashboard/charts/hourly-usage?${params}`).then((r) => r.json()),
        fetch(`/api/dashboard/charts/location-distribution?${params}`).then((r) => r.json()),
      ]);

      setSummary(summaryRes.summary);
      setUsageTrend(trendRes.series || []);
      setAgeDist((ageRes.items || []).map((i: { label: string; usageCount: number; percentage: number | null }) => ({ label: i.label, value: i.usageCount, percentage: i.percentage })));
      setPurposeDist((purposeRes.items || []).map((i: { label: string; usageCount: number; percentage: number | null }) => ({ label: i.label, value: i.usageCount, percentage: i.percentage })));
      setTriggerDist((triggerRes.items || []).map((i: { label: string; usageCount: number; percentage: number | null }) => ({ label: i.label, value: i.usageCount, percentage: i.percentage })));
      setWeekdayData(weekdayRes.items || []);
      setHourlyData(hourlyRes.items || []);
      setCityData(cityRes.items || []);
      setLoading(false);
    };

    fetchAll();
  }, [buildParams]);

  if (loading) {
    return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  }

  if (!summary || summary.usageCount === 0) {
    return (
      <div>
        <FilterBar periodType={periodType} year={year} month={month} onPeriodChange={setPeriodType} onYearChange={setYear} onMonthChange={setMonth} />
        <EmptyState message="この期間のデータはまだありません。期間を変更してください。" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <FilterBar periodType={periodType} year={year} month={month} onPeriodChange={setPeriodType} onYearChange={setYear} onMonthChange={setMonth} />
        <CsvExportButton periodType={periodType} year={year} month={month} />
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard label="利用回数" value={formatNumber(summary.usageCount)} icon={BarChart3} />
        <KPICard label="ユニーク利用者" value={formatNumber(summary.uniqueUserCount)} icon={Users} />
        <KPICard label="新規率" value={formatPercent(summary.newRate)} icon={TrendingUp} />
        <KPICard label="リピート率" value={formatPercent(summary.repeatRate)} icon={Repeat} />
        <KPICard label="平均利用間隔" value={formatDays(summary.averageUsageIntervalDays)} icon={Clock} />
        <KPICard label="継続率" value={summary.repeatContinuationRate != null ? formatPercent(summary.repeatContinuationRate) : "-"} icon={Calendar} />
      </div>

      {/* Usage Trend */}
      {usageTrend.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">利用推移</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="usageCount" stroke="#7c2d3e" name="利用回数" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PieChartCard title="来店目的" data={purposeDist} />
        <PieChartCard title="利用きっかけ" data={triggerDist} />
        <PieChartCard title="年代分布" data={ageDist} />

        {/* Weekday Chart */}
        <Card>
          <CardHeader><CardTitle className="text-base">曜日別利用</CardTitle></CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekdayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="usageCount" fill="#7c2d3e" name="利用回数" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Hourly Chart - full width */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">時間帯別利用</CardTitle>
            <p className="text-sm text-muted-foreground">各時間帯の利用回数</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData} barCategoryGap="15%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" fontSize={12} tickLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [`${value}回`, "利用回数"]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e0dc" }}
                  />
                  <Bar dataKey="usageCount" fill="#d4859b" name="利用回数" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* City Ranking */}
        <Card>
          <CardHeader><CardTitle className="text-base">居住地上位</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cityData.map((c, i) => (
                <div key={c.label} className="flex items-center gap-3">
                  <span className="w-6 text-right text-sm text-muted-foreground">{i + 1}</span>
                  <span className="flex-1 text-sm">{c.label}</span>
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${c.percentage || 0}%` }} />
                  </div>
                  <span className="w-16 text-right text-sm">{c.usageCount}回</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
