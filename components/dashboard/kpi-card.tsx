import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export default function KPICard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
