"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FilterBarProps {
  periodType: string;
  year: number;
  month: number;
  onPeriodChange: (period: string) => void;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
}

export default function FilterBar({ periodType, year, month, onPeriodChange, onYearChange, onMonthChange }: FilterBarProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Tabs value={periodType} onValueChange={onPeriodChange}>
        <TabsList>
          <TabsTrigger value="monthly">月次</TabsTrigger>
          <TabsTrigger value="yearly">年次</TabsTrigger>
          <TabsTrigger value="cumulative">累計</TabsTrigger>
        </TabsList>
      </Tabs>

      {periodType !== "cumulative" && (
        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="rounded-md border border-input bg-card px-3 py-1.5 text-sm"
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}年</option>
          ))}
        </select>
      )}

      {periodType === "monthly" && (
        <select
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          className="rounded-md border border-input bg-card px-3 py-1.5 text-sm"
        >
          {months.map((m) => (
            <option key={m} value={m}>{m}月</option>
          ))}
        </select>
      )}
    </div>
  );
}
