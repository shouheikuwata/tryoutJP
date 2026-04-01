import { InboxIcon } from "lucide-react";

export default function EmptyState({
  message = "データがありません",
  action,
}: {
  message?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <InboxIcon className="mb-4 h-12 w-12" />
      <p className="text-sm">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
