"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const COLORS = ["#7c2d3e", "#d4859b", "#e8b4b8", "#f5d5d8", "#8b4513", "#d2691e", "#a0522d", "#bc8f8f"];

interface PieChartCardProps {
  title: string;
  data: { label: string; value: number; percentage?: number | null }[];
}

export default function PieChartCard({ title, data }: PieChartCardProps) {
  if (!data.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="h-48 w-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-1">
            {data.map((d, i) => (
              <div key={d.label} className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-muted-foreground">{d.label}</span>
                <span className="ml-auto font-medium">{d.percentage != null ? `${d.percentage}%` : d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
